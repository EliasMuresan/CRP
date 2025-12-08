@echo off
cd /d "%~dp0"

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
pause
