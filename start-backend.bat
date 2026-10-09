@echo off
setlocal
cd /d "%~dp0"

if not exist "backend\.venv\Scripts\python.exe" (
  echo Environnement Python absent : lancement de la preparation...
  call "%~dp0setup-demo.bat"
  if errorlevel 1 exit /b 1
)

echo Demarrage de Ledgerly FastAPI sur http://127.0.0.1:8000
echo Documentation API : http://127.0.0.1:8000/docs
echo.
pushd backend
".\.venv\Scripts\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
popd
