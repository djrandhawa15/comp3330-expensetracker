# Deployment Guide for Render

This guide will help you deploy your Expense Tracker application to Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. A GitHub repository with your code
3. A Neon database (or any PostgreSQL database)
4. Kinde authentication account
5. AWS S3 bucket for file uploads

## Step 1: Prepare Your Environment Variables

You'll need the following environment variables. Get them ready before deployment:

### Database
- `DATABASE_URL` - Your Neon/PostgreSQL connection string

### Kinde Authentication
- `KINDE_ISSUER_URL` - From your Kinde application settings
- `KINDE_CLIENT_ID` - From your Kinde application settings
- `KINDE_CLIENT_SECRET` - From your Kinde application settings
- `KINDE_REDIRECT_URI` - Should be: `https://your-app-name.onrender.com/api/auth/callback`

### AWS S3
- `S3_REGION` - Your S3 bucket region (e.g., us-east-1)
- `S3_ACCESS_KEY` - Your AWS access key ID
- `S3_SECRET_KEY` - Your AWS secret access key
- `S3_BUCKET` - Your S3 bucket name

### App Configuration
- `NODE_ENV` - Set to `production`
- `PORT` - Set to `3000` (Render will provide this)
- `FRONTEND_URL` - Your app URL: `https://your-app-name.onrender.com`

## Step 2: Push Code to GitHub

Make sure all your latest changes are committed and pushed:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 3: Create New Web Service on Render

1. Go to https://render.com/dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Select your expense tracker repository

## Step 4: Configure the Service

Use these settings:

- **Name**: expense-tracker (or your preferred name)
- **Runtime**: Docker
- **Region**: Choose closest to your users
- **Branch**: main (or your default branch)
- **Build Command**: `bun install && bun run build`
- **Start Command**: `bun run start`
- **Instance Type**: Free (or higher if needed)

## Step 5: Add Environment Variables

In the Render dashboard, under "Environment Variables", add all the variables from Step 1:

1. Click "Add Environment Variable"
2. Add each variable one by one
3. Make sure sensitive values are not exposed in logs

## Step 6: Update Kinde Callback URL

Once your app is deployed, update your Kinde application settings:

1. Go to your Kinde dashboard
2. Navigate to your application settings
3. Update the callback URL to: `https://your-app-name.onrender.com/api/auth/callback`
4. Update the logout redirect URL to: `https://your-app-name.onrender.com`
5. Add `https://your-app-name.onrender.com` to allowed origins

## Step 7: Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your app
3. Wait for the build to complete (this may take 5-10 minutes)
4. Once deployed, click the URL to view your app

## Step 8: Run Database Migrations

If you need to run database migrations:

1. In Render dashboard, go to your service
2. Click on "Shell" tab
3. Run: `bun run db:push`

## Troubleshooting

### Build Fails
- Check the build logs in Render dashboard
- Ensure all dependencies are in package.json
- Verify Dockerfile syntax

### App Crashes on Start
- Check the logs in Render dashboard
- Verify all environment variables are set correctly
- Ensure DATABASE_URL is valid

### Authentication Issues
- Verify Kinde callback URLs are correct
- Check KINDE_REDIRECT_URI matches your Render URL
- Ensure all Kinde environment variables are set

### File Upload Issues
- Verify S3 credentials are correct
- Check S3 bucket permissions
- Ensure CORS is configured on your S3 bucket

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if your database allows connections from Render IPs
- For Neon, ensure the connection string includes SSL parameters

## Monitoring

- Use Render's built-in logs to monitor your application
- Set up alerts for errors
- Monitor resource usage on the Render dashboard

## Updating Your App

To deploy updates:

1. Make changes locally
2. Commit and push to GitHub
3. Render will automatically rebuild and redeploy
4. Or manually trigger a deploy from Render dashboard

## Cost Optimization

- Free tier includes 750 hours/month
- Service sleeps after 15 minutes of inactivity
- First request after sleep may be slow (cold start)
- Consider upgrading to paid plan for production use

## Security Checklist

- [ ] All sensitive environment variables are set
- [ ] S3 bucket has proper CORS configuration
- [ ] Database uses SSL connections
- [ ] Kinde callback URLs are correct
- [ ] FRONTEND_URL matches your actual domain
- [ ] No secrets are committed to git

## Next Steps

After deployment:
1. Test all functionality (auth, CRUD operations, file uploads)
2. Set up custom domain (optional)
3. Configure monitoring and alerts
4. Set up automated backups for database
5. Review and optimize performance

## Support

- Render Documentation: https://render.com/docs
- Bun Documentation: https://bun.sh/docs
- Kinde Documentation: https://kinde.com/docs
- AWS S3 Documentation: https://docs.aws.amazon.com/s3/
