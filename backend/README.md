# Political Simulator Backend API

Node.js/Express backend API for the Political Simulator application with user authentication and state persistence.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual database configuration:
```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=polsim_db
JWT_SECRET=generate_a_strong_random_string_here
```

### 3. Set Up Database

Run the following SQL commands to create the required tables:

```sql
CREATE DATABASE polsim_db;
USE polsim_db;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username)
);

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

### 4. Run the Server

Development mode (auto-restart on changes):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001` by default.

## API Endpoints

### Authentication

#### Register New User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "userId": 1,
    "username": "testuser"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "userId": 1,
    "username": "testuser"
  }
}
```

### State Management (Requires Authentication)

All state endpoints require the `Authorization` header with a valid JWT token:
```
Authorization: Bearer <your_jwt_token>
```

#### Save State
```
POST /api/state
Content-Type: application/json
Authorization: Bearer <token>

{
  "parties": [...],
  "parliament": {
    "favoredParties": [...],
    "factions": [...]
  }
}

Response:
{
  "message": "State saved successfully",
  "timestamp": "2025-11-23T18:31:00.000Z"
}
```

#### Load State
```
GET /api/state
Authorization: Bearer <token>

Response:
{
  "parties": [...],
  "parliament": {
    "favoredParties": [...],
    "factions": [...]
  },
  "lastUpdated": "2025-11-23T18:31:00.000Z"
}
```

#### Delete State
```
DELETE /api/state
Authorization: Bearer <token>

Response:
{
  "message": "State deleted successfully"
}
```

### Health Check
```
GET /api/health

Response:
{
  "status": "ok",
  "timestamp": "2025-11-23T18:31:00.000Z"
}
```

## Testing with cURL

### Register a user:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Save state (replace YOUR_TOKEN with the token from login):
```bash
curl -X POST http://localhost:3001/api/state \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"parties":[],"parliament":{"favoredParties":[],"factions":[]}}'
```

### Load state:
```bash
curl -X GET http://localhost:3001/api/state \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Deployment

This backend needs to be deployed to a Node.js hosting service. Recommended options:

- **Railway** (https://railway.app) - Free tier available
- **Render** (https://render.com) - Free tier available
- **Heroku** (https://heroku.com) - Free tier available
- **DigitalOcean App Platform**

After deployment, update the `FRONTEND_URL` in your production `.env` to your GitHub Pages URL:
```env
FRONTEND_URL=https://jzane8.github.io
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection pool
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── stateController.js   # State management logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── errorHandler.js      # Global error handler
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── state.js             # State management routes
│   └── server.js                # Main application entry point
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## Security Notes

- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 7 days (configurable in `.env`)
- Always use HTTPS in production
- Keep your `JWT_SECRET` secure and never commit it to version control
- The `.env` file is gitignored to prevent accidental exposure of credentials
