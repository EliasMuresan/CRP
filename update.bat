@echo off
cd /d "%~dp0"

git init
git branch -M main

git remote remove origin 2>nul
git remote add origin https://github.com/EliasMuresan/CRP.git

git add .
git commit -m "Update site"

git pull origin main --allow-unrelated-histories --no-rebase
git push -u origin main

pause
