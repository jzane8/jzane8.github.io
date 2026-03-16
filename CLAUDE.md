# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website (jzane8.github.io) built as a **React SPA** with Vite, deployed to GitHub Pages via GitHub Actions. Includes a Node.js/Express backend API deployed on Railway.app.

## Development Commands

### Frontend (React SPA)

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
```

### Backend (Express API)

```bash
cd backend
npm install          # Install dependencies
npm run dev          # Start dev server with nodemon (port 3001)
npm start            # Start production server
```

## Architecture

### Frontend (`src/`)

React 18 SPA with Vite bundler and React Router (HashRouter for GitHub Pages).

- **Entry**: `index.html` → `src/main.jsx` → `src/App.jsx`
- **Routing**: HashRouter with `<Layout>` wrapper for shared header/sidebar
- **Styling**: `src/styles/index.css` — CSS variables with three themes (light, dark, sonia)
- **State**: React Context for theme; localStorage for persistence

#### Pages (`src/pages/`)

| File | Route | Description |
|------|-------|-------------|
| `About.jsx` | `/` (index) | Home page with work history timeline |
| `Projects.jsx` | `/projects` | Project showcase |
| `Music.jsx` | `/music` | OnRecord band project |
| `Esports.jsx` | `/esports` | Placeholder |
| `Contact.jsx` | `/contact` | Email and LinkedIn links |
| `ReactDemo.jsx` | `/react-demo` | Pixel art editor + Political Simulator (via secret code "cynic.exe") |
| `Wheel.jsx` | `/wheel` | Standalone Wheel of Fortune game |
| `Secrets.jsx` | `/secrets` | Password-gated platformer game |

#### Components (`src/components/`)

- `Layout.jsx` — Shared wrapper: purple header, collapsible sidebar nav, page content outlet
- `ThemeToggle.jsx` — Red "S" button: opens puzzle, activates Sonia theme on success, links to Wheel
- `PuzzleModal.jsx` — Five rotating puzzle types with difficulty scaling and cooldown
- `PixelArtDisplay.jsx` — ASCII art editor with CSS Grid rendering, zoom, sharing
- `PolSim.jsx` — Political Simulator: parties, factions, parliament, favor threshold
- `CounterAppList.jsx` — Reusable counter components for party fervor values

#### Context & Hooks (`src/context/`, `src/hooks/`)

- `ThemeContext.jsx` — Theme provider (light/dark/sonia) with localStorage persistence
- `usePuzzle.js` — Puzzle session management: cooldowns, difficulty, Konami cheat code

### Backend (`backend/`)

Express API with MySQL database for user auth and simulator state persistence.

- `src/server.js` — Entry point (Express app, port from env)
- `src/config/database.js` — MySQL connection pool (mysql2)
- `src/routes/auth.js` — Registration and login (`/api/auth/register`, `/api/auth/login`)
- `src/routes/state.js` — Protected state CRUD (`/api/state`) — requires JWT
- `src/middleware/auth.js` — JWT token verification middleware
- `src/middleware/errorHandler.js` — Global error handler
- `src/controllers/` — Business logic for auth and state operations

**Database tables**: `users` (username, password_hash) and `user_states` (parties_json, parliament_json)

### Deployment

- **Frontend**: GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`) — builds with Vite, deploys `dist/`
- **Backend**: Railway.app (NIXPACKS builder, config in `railway.json`)
- **Environment variables**: See `backend/.env.example` for required config (DB_HOST, JWT_SECRET, FRONTEND_URL, etc.)

### Static Assets

Images are in `public/images/` and are copied to `dist/images/` during build.

## Key Notes

- No test framework or linter is configured
- Backend uses bcrypt for password hashing and JWT (7d expiry) for auth tokens
- CORS is configured to allow the GitHub Pages frontend domain
- The Konami cheat code (Up Down Left Right) resets puzzle cooldowns
- HashRouter is used so all routes work on GitHub Pages without server config
- Old static HTML files (in root) are legacy and no longer served — the React SPA replaces them
