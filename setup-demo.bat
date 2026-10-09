@echo off
setlocal
cd /d "%~dp0"

echo [1/3] Preparation de l'environnement Python Ledgerly...
if not exist "backend\.venv\Scripts\python.exe" (
  py -3 -m venv "backend\.venv"
  if errorlevel 1 python -m venv "backend\.venv"
)

echo [2/3] Installation des dependances FastAPI et Jupyter...
"backend\.venv\Scripts\python.exe" -m pip install --disable-pip-version-check -r "backend\requirements-dev.txt"
if errorlevel 1 goto :error

echo [3/3] Creation du noyau Jupyter Ledgerly...
"backend\.venv\Scripts\python.exe" -m ipykernel install --user --name ledgerly-backend --display-name "Python 3.14 (Ledgerly)"
if errorlevel 1 goto :error

echo.
echo Preparation terminee.
echo Dans VS Code, choisissez le noyau : Python 3.14 (Ledgerly)
exit /b 0

:error
echo.
echo La preparation a echoue. Verifiez que Python est installe puis relancez ce script.
exit /b 1
