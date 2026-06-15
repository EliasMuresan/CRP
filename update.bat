@echo off
cd /d "%~dp0"

git init
git branch -M main

git remote remove origin 2>nul
git remote add origin https://github.com/EliasMuresan/CRP.git

git fetch origin main
git pull --ff-only origin main
if errorlevel 1 (
  echo Nu pot sincroniza automat. Opreste aici si cere ajutor, ca sa nu apara conflicte.
  pause
  exit /b 1
)

git add .
git commit -m "Update site"

git push -u origin main

pause
