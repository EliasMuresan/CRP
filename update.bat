@echo off
echo ============================
echo  Git quick update pentru CRP
echo ============================

REM mergem în folderul scriptului (proiectului)
cd /d "%~dp0"

REM arătăm statusul curent
echo.
git status

echo.
set /p MSG=Mesaj pentru commit (enter pentru "update"): 

if "%MSG%"=="" set MSG=update

echo.
echo --- Rulez: git add .
git add .

echo.
echo --- Rulez: git commit -m "%MSG%"
git commit -m "%MSG%"

echo.
echo --- Rulez: git push
git push

echo.
echo Gata. Apasa o tasta pentru a inchide.
pause >nul
