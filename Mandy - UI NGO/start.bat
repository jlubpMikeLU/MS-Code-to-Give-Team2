@echo off
echo 🚀 Starting NGO K3 Dashboard...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

echo 🔧 Starting backend server on port 3001...
start "Backend Server" cmd /k "npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

echo 🌐 Starting frontend development server on port 3000...
start "Frontend Server" cmd /k "npm run dev:frontend"

echo.
echo ✅ Dashboard is starting up!
echo 📊 Backend API: http://localhost:3001
echo 🎨 Frontend: http://localhost:3000
echo.
echo Both servers are now running in separate windows.
echo Close the windows to stop the servers.
echo.
pause 