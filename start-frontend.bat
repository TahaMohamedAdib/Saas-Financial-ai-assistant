@echo off
setlocal
cd /d "%~dp0frontend"

if not exist "node_modules\next\package.json" (
  echo Dependances frontend absentes : installation en cours...
  call npm install --no-audit --no-fund
  if errorlevel 1 exit /b 1
)

echo Demarrage de Ledgerly Next.js sur http://localhost:3000
echo.
call npm run dev
