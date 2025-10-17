// server/routes/expenses.ts
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db, schema } from '../db/client'
import { eq } from 'drizzle-orm'
import { s3 } from '../lib/s3'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { requireAuth } from '../auth/requireAuth'
import type { AppBindings } from '../types'

const { expenses } = schema

// ---------- Schemas ----------
const expenseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
  fileUrl: z.string().nullable().optional(), // returned value can be signed URL
})

const createExpenseSchema = expenseSchema.omit({ id: true, fileUrl: true })

const updateExpenseSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  amount: z.number().int().positive().optional(),
  fileUrl: z.string().min(1).nullable().optional(), // direct null/reset if needed
  fileKey: z.string().min(1).optional(),            // S3 key to store in fileUrl column
})

// ---------- Helpers ----------
type ExpenseRow = typeof expenses.$inferSelect
type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>

const buildUpdatePayload = (input: UpdateExpenseInput) => {
  const updates: Partial<Pick<ExpenseRow, 'title' | 'amount' | 'fileUrl'>> = {}
  if (input.title !== undefined) updates.title = input.title
  if (input.amount !== undefined) updates.amount = input.amount
  if (Object.prototype.hasOwnProperty.call(input, 'fileKey')) {
    updates.fileUrl = input.fileKey ?? null
  }
  if (Object.prototype.hasOwnProperty.call(input, 'fileUrl')) {
    updates.fileUrl = input.fileUrl ?? null
  }
  return updates
}

const withSignedDownloadUrl = async (row: ExpenseRow): Promise<ExpenseRow> => {
  if (!row.fileUrl) return row
  if (row.fileUrl.startsWith('http://') || row.fileUrl.startsWith('https://')) {
    return row
  }
  try {
    const signed = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: row.fileUrl,
      }),
      { expiresIn: 3600 } // 1 hour
    )
    return { ...row, fileUrl: signed }
  } catch (e) {
    console.error('Failed to sign download URL:', e)
    return row
  }
}

// ---------- Routes ----------
export const expensesRoute = new Hono<AppBindings>()

// protect everything in this router
expensesRoute.use('*', async (c, next) => {
  const err = await requireAuth(c)
  if (err) return err
  await next()
})

// GET list
expensesRoute.get('/', async (c) => {
  const rows = await db.select().from(expenses)
  const withUrls = await Promise.all(rows.map(withSignedDownloadUrl))
  return c.json({ expenses: withUrls })
})

// GET detail
expensesRoute.get('/:id{\\d+}', async (c) => {
  const id = Number(c.req.param('id'))
  const [row] = await db.select().from(expenses).where(eq(expenses.id, id)).limit(1)
  if (!row) return c.json({ error: 'Not found' }, 404)
  const withUrl = await withSignedDownloadUrl(row)
  return c.json({ expense: withUrl })
})

// POST create
expensesRoute.post('/', zValidator('json', createExpenseSchema), async (c) => {
  const data = c.req.valid('json')
  const [created] = await db.insert(expenses).values(data).returning()
  const withUrl = await withSignedDownloadUrl(created)
  return c.json({ expense: withUrl }, 201)
})

// PUT full update (uses update schema!)
expensesRoute.put('/:id{\\d+}', zValidator('json', updateExpenseSchema), async (c) => {
  const id = Number(c.req.param('id'))
  const data = buildUpdatePayload(c.req.valid('json'))
  const [updated] = await db.update(expenses).set(data).where(eq(expenses.id, id)).returning()
  if (!updated) return c.json({ error: 'Not found' }, 404)
  const withUrl = await withSignedDownloadUrl(updated)
  return c.json({ expense: withUrl })
})

// PATCH partial update
expensesRoute.patch('/:id{\\d+}', zValidator('json', updateExpenseSchema), async (c) => {
  const id = Number(c.req.param('id'))
  const patch = c.req.valid('json')
  if (Object.keys(patch).length === 0) return c.json({ error: 'Empty patch' }, 400)
  const data = buildUpdatePayload(patch)
  const [updated] = await db.update(expenses).set(data).where(eq(expenses.id, id)).returning()
  if (!updated) return c.json({ error: 'Not found' }, 404)
  const withUrl = await withSignedDownloadUrl(updated)
  return c.json({ expense: withUrl })
})

// DELETE
expensesRoute.delete('/:id{\\d+}', async (c) => {
  const id = Number(c.req.param('id'))
  const [deletedRow] = await db.delete(expenses).where(eq(expenses.id, id)).returning()
  if (!deletedRow) return c.json({ error: 'Not found' }, 404)
  return c.json({ deleted: deletedRow })
})
