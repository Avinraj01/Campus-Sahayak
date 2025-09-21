@echo off
echo Starting frontend server on http://localhost:3000
cd /d "%~dp0\frontend"
set PORT=3000
npm run start