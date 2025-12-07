# Deployment Guide for Political Simulator Backend

This guide walks you through deploying your backend API to Railway.app, a platform that provides easy Node.js hosting with MySQL database support.

## Why Railway.app?

- ✅ **$5/month free credits** (enough for personal projects)
- ✅ **Native MySQL support** (no database migration needed)
- ✅ **No cold starts** (better user experience than free tiers with sleep)
- ✅ **Simple deployment** from GitHub
- ✅ **Automatic HTTPS** and environment variable management

## Prerequisites

1. A GitHub account
2. Your backend code pushed to a GitHub repository
3. A Railway.app account (sign up at https://railway.app)

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your backend code is committed and pushed to GitHub:

```bash
cd backend
git add .
git commit -m "Prepare backend for Railway deployment"
git push origin main
```

### 2. Sign Up for Railway

1. Go to https://railway.app
2. Click "Login" and sign in with your GitHub account
3. Authorize Railway to access your repositories

### 3. Create a New Project

1. Click "New Project" on the Railway dashboard
2. Select "Deploy from GitHub repo"
3. Choose your repository (`jzane8.github.io`)
4. Railway will detect your Node.js application

### 4. Configure Build Settings

Railway should auto-detect your Node.js app, but verify:

1. **Root Directory**: Set to `backend` (since your API is in a subdirectory)
2. **Build Command**: `npm install` (auto-detected)
3. **Start Command**: `npm start` (auto-detected from package.json)

### 5. Add MySQL Database

1. In your Railway project, click "New" → "Database" → "Add MySQL"
2. Railway will provision a MySQL database and provide connection details
3. The database will be automatically linked to your application

### 6. Configure Environment Variables

Click on your service → "Variables" tab and add these environment variables:

```env
# Server Configuration
NODE_ENV=production
PORT=${{PORT}}  # Railway provides this automatically

# Database Configuration (Railway provides these automatically when you add MySQL)
DB_HOST=${{MYSQL_HOST}}
DB_USER=${{MYSQL_USER}}
DB_PASSWORD=${{MYSQL_PASSWORD}}
DB_NAME=${{MYSQL_DATABASE}}

# JWT Configuration
JWT_SECRET=<generate-a-strong-random-string-here>
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=https://jzane8.github.io
```

**Important Notes:**
- Railway automatically provides `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_DATABASE` when you add a MySQL service
- Generate a strong JWT_SECRET using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Update `FRONTEND_URL` to your actual GitHub Pages URL

### 7. Set Up Database Tables

Once your database is running, you need to create the required tables:

1. In Railway, click on your MySQL database service
2. Click "Connect" → "MySQL Client" to get connection details
3. Use a MySQL client (like MySQL Workbench, TablePlus, or command line) to connect
4. Run the following SQL commands:

```sql
CREATE DATABASE IF NOT EXISTS polsim_db;
USE polsim_db;

-- Users table stores authentication information
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username)
);

-- User states table stores game state for each user
CREATE TABLE user_states (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    parties_json TEXT NOT NULL,
    parliament_json TEXT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);
```

### 8. Deploy!

1. Railway will automatically deploy your application
2. Monitor the deployment logs in the Railway dashboard
3. Once deployed, Railway will provide a public URL (e.g., `https://your-app.railway.app`)

### 9. Test Your Deployment

Test your API endpoints using the Railway-provided URL:

```bash
# Health check
curl https://your-app.railway.app/api/health

# Register a user
curl -X POST https://your-app.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Login
curl -X POST https://your-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### 10. Update Your Frontend

Update your frontend code to use the Railway API URL instead of `localhost:3001`:

```javascript
// In your React app or frontend JavaScript
const API_URL = 'https://your-app.railway.app';

// Example: Login request
fetch(`${API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
```

## Monitoring and Maintenance

### View Logs
- Click on your service in Railway
- Go to "Deployments" tab to see deployment history
- Click on any deployment to view logs

### Monitor Usage
- Railway dashboard shows your monthly usage
- Free tier includes $5/month in credits
- Typical usage for a small app: $3-5/month

### Update Your App
Railway automatically redeploys when you push to your GitHub repository:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

## Alternative Hosting Options

If Railway doesn't meet your needs, consider these alternatives:

### Render.com (Free Tier Available)
- **Pros**: Free tier with 750 hours/month, easy setup
- **Cons**: Cold starts after 15 minutes of inactivity, PostgreSQL only (would need to migrate from MySQL)
- **Cost**: Free tier available, $7/month for always-on

### Fly.io
- **Pros**: No cold starts, good performance
- **Cons**: Slightly more complex setup
- **Cost**: Free tier with 3 VMs, ~$5-10/month for production

### DigitalOcean App Platform
- **Pros**: Reliable, professional-grade
- **Cons**: No free tier
- **Cost**: $5/month for app + $15/month for managed MySQL

## Troubleshooting

### Database Connection Errors
- Verify environment variables are set correctly
- Check that MySQL service is running in Railway
- Ensure database tables are created

### CORS Errors
- Verify `FRONTEND_URL` environment variable matches your GitHub Pages URL
- Check that your frontend is using the correct API URL

### Port Issues
- Railway automatically assigns a port via the `PORT` environment variable
- Your server.js already handles this with `process.env.PORT || 3001`

### JWT Token Errors
- Ensure `JWT_SECRET` is set in Railway environment variables
- Verify the secret is the same across all deployments

## Security Checklist

- ✅ `JWT_SECRET` is a strong random string
- ✅ `.env` file is in `.gitignore` (never commit secrets)
- ✅ `NODE_ENV=production` is set
- ✅ CORS is configured to only allow your frontend domain
- ✅ Database credentials are managed by Railway (not hardcoded)
- ✅ HTTPS is enabled (Railway provides this automatically)

## Cost Estimation

**Railway.app Monthly Costs:**
- Free tier: $5 in credits per month
- Typical usage for this app:
  - API service: ~$3-4/month
  - MySQL database: ~$1-2/month
  - **Total: ~$4-6/month** (within free tier for light usage)

**Scaling Costs:**
- If you exceed free tier: Pay-as-you-go pricing
- Estimated cost for moderate traffic: $10-15/month
- Can set spending limits in Railway dashboard

## Next Steps

1. Deploy your backend to Railway following this guide
2. Update your frontend to use the Railway API URL
3. Test all functionality (register, login, save/load state)
4. Monitor usage and logs for the first few days
5. Consider setting up a custom domain (optional)

## Support

- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- This project's README: See `backend/README.md` for API documentation
