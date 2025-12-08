@echo off
cd /d "%~dp0"

<<<<<<< HEAD
echo =====================================
echo  Urcare automata site pe GitHub
echo =====================================

git status

echo.
echo Adaug toate fisierele modificate...
git add .

echo.
set /p MSG=Mesaj pentru commit (ex: Update site): 
if "%MSG%"=="" set MSG=Update site

echo.
echo Fac commit cu mesajul: "%MSG%"
git commit -m "%MSG%"

echo.
echo Trimit modificarile pe GitHub (branch main)...
git push origin main

echo.
echo Gata. Verifica pe eliasmuresan.github.io dupa ce termine GitHub Pages.
=======
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
>>>>>>> 1f3fc14ee17a71fae2a0cabd4bd7302ff50d1bbb
pause
