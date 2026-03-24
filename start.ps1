# start.ps1 - Launch the portfolio site locally on Windows
# Usage: .\start.ps1 [-Backend] [-Build]
#   -Backend  Also start the Express API (requires backend/.env)
#   -Build    Run a production build + preview instead of dev server

param(
    [switch]$Backend,
    [switch]$Build
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

# Check for node/npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm not found. Install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Install frontend deps if needed
if (-not (Test-Path "$root\node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    npm install --prefix $root
}

# Start backend in a separate window if requested
if ($Backend) {
    if (-not (Test-Path "$root\backend\.env")) {
        Write-Host "backend/.env not found. Copy backend/.env.example to backend/.env and fill in values." -ForegroundColor Yellow
        exit 1
    }
    if (-not (Test-Path "$root\backend\node_modules")) {
        Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
        npm install --prefix "$root\backend"
    }
    Write-Host "Starting backend on port 3001..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; npm run dev"
}

# Start frontend
if ($Build) {
    Write-Host "Building production bundle..." -ForegroundColor Cyan
    npm run build --prefix $root
    Write-Host "Starting preview server..." -ForegroundColor Green
    npm run preview --prefix $root
} else {
    Write-Host "Starting Vite dev server on http://localhost:5173 ..." -ForegroundColor Green
    npm run dev --prefix $root
}
