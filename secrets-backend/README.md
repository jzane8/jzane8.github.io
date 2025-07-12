# Secrets Backend - Persistent Settings Server

This backend server enables persistent settings for the secrets page, allowing admin changes to persist across all users.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (version 14 or higher)
- npm

### Local Setup

1. **Install Dependencies**
   ```bash
   cd secrets-backend
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   
   The server will run on `http://localhost:3000`

3. **Test the API**
   - GET `http://localhost:3000/api/settings` - Load settings
   - POST `http://localhost:3000/api/settings` - Save settings
   - GET `http://localhost:3000/api/health` - Health check

### Frontend Integration

The `secrets.html` file is already configured to work with this backend. It will:
- Try to load settings from the API first
- Fall back to localStorage if the API is unavailable
- Show appropriate error messages to users

## 🌐 Production Deployment

### Option 1: Railway (Recommended)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Create a new GitHub repository for the backend
   - Push the `secrets-backend` folder contents to the repository
   - In Railway, click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure Environment**
   - Railway will automatically detect the Node.js app
   - No additional configuration needed

4. **Get Your URL**
   - Railway will provide a URL like `https://your-app-name.railway.app`
   - Update the `API_BASE_URL` in `secrets.html`:
     ```javascript
     const API_BASE_URL = window.location.hostname === 'localhost' 
         ? 'http://localhost:3000/api' 
         : 'https://your-app-name.railway.app/api';
     ```

### Option 2: Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Build Command: `npm install`
     - Start Command: `npm start`

### Option 3: Heroku

1. **Install Heroku CLI**
2. **Create Heroku App**
   ```bash
   heroku create your-secrets-backend
   ```
3. **Deploy**
   ```bash
   git push heroku main
   ```

## 📁 Project Structure

```
secrets-backend/
├── server.js          # Main Express server
├── package.json       # Dependencies and scripts
├── settings.json      # Auto-generated settings storage
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🔧 API Endpoints

### GET /api/settings
Returns current settings as JSON.

**Response:**
```json
{
  "message": false,
  "buttonText": "💝 for Sonia",
  "messageContent": "💕 This special message is just for you, Sonia! 💕",
  "darkTheme": false,
  "lightBgColor1": "#667eea",
  "lightBgColor2": "#764ba2",
  "darkBgColor1": "#2d3748",
  "darkBgColor2": "#1a202c"
}
```

### POST /api/settings
Updates settings with provided JSON data.

**Request Body:**
```json
{
  "message": true,
  "buttonText": "Custom Button Text",
  "messageContent": "Custom message content",
  "darkTheme": true,
  "lightBgColor1": "#ff0000",
  "lightBgColor2": "#00ff00",
  "darkBgColor1": "#000000",
  "darkBgColor2": "#333333"
}
```

**Response:**
```json
{
  "message": "Settings saved successfully",
  "settings": { /* updated settings */ }
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-07-12T14:00:00.000Z",
  "service": "secrets-backend"
}
```

## 🛡️ Security Features

- **Input Validation**: All settings are validated before saving
- **CORS Enabled**: Allows cross-origin requests from your frontend
- **Error Handling**: Comprehensive error handling and logging
- **Fallback Support**: Frontend falls back to localStorage if API fails

## 🔄 Data Persistence

Settings are stored in a `settings.json` file in the server directory. This file is:
- Auto-created with default values on first run
- Updated whenever settings are changed via the API
- Persistent across server restarts

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Make sure the backend server is running
   - Check that CORS is properly configured in `server.js`

2. **Settings Not Persisting**
   - Verify the API endpoints are working: `GET /api/health`
   - Check browser console for error messages
   - Ensure the server has write permissions for `settings.json`

3. **Frontend Not Loading Settings**
   - Check the `API_BASE_URL` in `secrets.html`
   - Verify the backend server is accessible from the frontend
   - Look for network errors in browser developer tools

### Testing the Setup

1. **Test Backend Directly**
   ```bash
   curl http://localhost:3000/api/health
   curl http://localhost:3000/api/settings
   ```

2. **Test Frontend Integration**
   - Open `secrets.html` in a browser
   - Enter password: `sonia123`
   - Try changing settings and verify they persist

## 📝 Configuration

### Changing the Password
Edit the password in `secrets.html`:
```javascript
const correctPassword = "your-new-password";
```

### Customizing Default Settings
Edit the `defaultSettings` object in `server.js`:
```javascript
const defaultSettings = {
    message: false,
    buttonText: 'Your Default Button Text',
    messageContent: 'Your default message',
    // ... other settings
};
```

## 🎯 What This Achieves

✅ **Centralized Storage**: All users see the same settings
✅ **Real-time Updates**: Changes are immediately available to all users  
✅ **Persistent**: Settings survive server restarts
✅ **Scalable**: Can handle multiple concurrent users
✅ **Backup**: Settings can be backed up regularly
✅ **Fallback**: Works offline with localStorage backup

Now when one user changes the theme, button text, or any other setting in the admin panel, all other users will see those changes immediately!
