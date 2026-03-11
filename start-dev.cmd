@echo off
setlocal

cd /d "%~dp0"

start "Dhobi Backend" cmd /k "cd /d ""%~dp0dobhi.in_backend"" && node src/server.js"
start "Dhobi Frontend" cmd /k "cd /d ""%~dp0dobhivala"" && npm run dev"

echo Started backend and frontend in separate terminals.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
