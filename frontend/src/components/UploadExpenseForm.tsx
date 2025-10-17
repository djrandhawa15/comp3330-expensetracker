// frontend/src/components/UploadExpenseForm.tsx
import * as React from 'react'

type Props = { expenseId: number; onDone?: () => void }

export default function UploadExpenseForm({ expenseId, onDone }: Props) {
  const [file, setFile] = React.useState<File | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!file) return setError('Please select a file first.')
    setBusy(true)
    try {
      // 1) get presign
        const { uploadUrl, key } = await fetch('/api/upload/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            filename: file.name,
            type: file.type || 'application/octet-stream',
        }),
        }).then(r => r.json())

        // 2) PUT to S3 (only Content-Type header!)
        const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
        })
        if (!putRes.ok) throw new Error(`S3 upload failed (${putRes.status})`)

      // 3) update expense with the S3 key
      const upd = await fetch(`/api/expenses/${expenseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fileKey: key }),
      })
      if (!upd.ok) throw new Error(`Update failed (${upd.status})`)

      setFile(null)
      onDone?.()
    } catch (e: any) {
      setError(e?.message ?? 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-3">
      <input type="file" onChange={onChange} disabled={busy} />
      <button
        type="submit"
        disabled={!file || busy}
        className="rounded bg-black px-3 py-1 text-white disabled:opacity-50"
      >
        {busy ? 'Uploading…' : 'Upload Receipt'}
      </button>
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </form>
  )
}
