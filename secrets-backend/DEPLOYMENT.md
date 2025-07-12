# 🚀 Railway Deployment Guide

This guide will walk you through deploying your secrets backend to Railway for free hosting.

## Step 1: Prepare Your Code

1. **Create a new GitHub repository** for your backend:
   - Go to [github.com](https://github.com) and create a new repository
   - Name it something like `secrets-backend` or `jzane-secrets-api`
   - Make it public (required for Railway free tier)

2. **Upload your backend files** to the repository:
   ```
   secrets-backend/
   ├── server.js
   ├── package.json
   ├── .gitignore
   ├── README.md
   └── DEPLOYMENT.md
   ```

## Step 2: Deploy to Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Click "Login" and sign up with your GitHub account
   - Authorize Railway to access your repositories

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your secrets-backend repository

3. **Configure Deployment**
   - Railway will automatically detect it's a Node.js project
   - It will use the `npm start` command from your package.json
   - No additional configuration needed!

4. **Wait for Deployment**
   - Railway will install dependencies and start your server
   - This usually takes 1-2 minutes
   - You'll see build logs in real-time

## Step 3: Get Your API URL

1. **Find Your App URL**
   - In your Railway dashboard, click on your deployed service
   - Look for the "Domains" section
   - Your URL will be something like: `https://secrets-backend-production-xxxx.up.railway.app`

2. **Test Your API**
   - Visit: `https://your-app-url.railway.app/api/health`
   - You should see: `{"status":"ok","timestamp":"...","service":"secrets-backend"}`

## Step 4: Update Your Frontend

1. **Edit secrets.html**
   - Find this line in your secrets.html file:
   ```javascript
   const API_BASE_URL = window.location.hostname === 'localhost' 
       ? 'http://localhost:3000/api' 
       : 'https://your-railway-app.railway.app/api'; // Replace with your Railway URL
   ```

2. **Replace with your actual Railway URL**:
   ```javascript
   const API_BASE_URL = window.location.hostname === 'localhost' 
       ? 'http://localhost:3000/api' 
       : 'https://secrets-backend-production-xxxx.up.railway.app/api';
   ```

3. **Commit and push** the updated secrets.html to your GitHub Pages repository

## Step 5: Test Everything

1. **Visit your GitHub Pages site**
   - Go to `https://yourusername.github.io/secrets.html`
   - Enter password: `sonia123`

2. **Test the admin settings**
   - Click the ⚙️ Settings button
   - Try changing the theme or button text
   - The changes should persist for all users!

## 🔧 Railway Configuration

### Environment Variables (Optional)
If you want to add environment variables:
1. Go to your Railway project dashboard
2. Click on "Variables" tab
3. Add variables like:
   - `NODE_ENV=production`
   - `PORT=3000` (Railway sets this automatically)

### Custom Domain (Optional)
To use a custom domain:
1. In Railway dashboard, go to "Domains"
2. Click "Custom Domain"
3. Enter your domain name
4. Follow DNS configuration instructions

## 🚨 Troubleshooting

### Common Issues

1. **Build Failed**
   - Check that package.json has correct dependencies
   - Ensure all files are committed to GitHub
   - Check Railway build logs for specific errors

2. **API Not Responding**
   - Verify your Railway URL is correct
   - Check that the service is running in Railway dashboard
   - Test the health endpoint: `/api/health`

3. **CORS Errors**
   - Make sure your frontend URL is allowed
   - Check browser console for specific CORS errors
   - Verify the API URL in secrets.html is correct

### Railway Limits (Free Tier)
- **Execution Time**: 500 hours/month
- **Memory**: 512MB RAM
- **Storage**: 1GB
- **Bandwidth**: 100GB/month

These limits are very generous for a simple settings API!

## 🎯 Success Checklist

- [ ] Backend repository created on GitHub
- [ ] Railway project deployed successfully
- [ ] API health check responds correctly
- [ ] Frontend updated with Railway URL
- [ ] Settings persist across browser sessions
- [ ] Multiple users see the same settings

## 🔄 Making Updates

To update your backend:
1. Make changes to your code locally
2. Commit and push to GitHub
3. Railway will automatically redeploy
4. Changes will be live in 1-2 minutes

## 💡 Pro Tips

1. **Monitor Your App**: Railway provides logs and metrics in the dashboard
2. **Database Upgrade**: If you need more persistence, Railway offers PostgreSQL add-ons
3. **Scaling**: Railway can automatically scale your app if needed
4. **Backups**: Your settings.json file persists, but consider periodic backups

That's it! Your secrets backend is now live and accessible to all users of your GitHub Pages site.
