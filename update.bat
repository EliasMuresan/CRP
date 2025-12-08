@echo off
cd /d "%~dp0"

echo ==========================
echo   GIT UPDATE - CRP SITE
echo ==========================
echo.

REM 1. Arătăm statusul
git status
echo.

REM 2. Adăugăm toate modificările
git add .
echo.

REM 3. Facem commit (dacă nu e nimic de commit, continuă mai departe)
git commit -m "Update site (CSS + slider)" || echo Nici o modificare de commit...
echo.

REM 4. Tragem ce e nou de pe GitHub (branch main)
git pull origin main
echo.

REM 5. Trimitem modificările pe GitHub
git push origin main
echo.

echo --------------------------
echo   GATA - UPDATE TERMINAT
echo --------------------------
pause
