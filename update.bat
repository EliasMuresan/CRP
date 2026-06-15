@echo off
setlocal

cd /d "%~dp0"

set "REPO=https://github.com/EliasMuresan/CRP.git"
set "BRANCH=main"
set "GIT_MERGE_AUTOEDIT=no"

echo =====================================
echo  Urcare automata site pe GitHub
echo  Repo: %REPO%
echo =====================================
echo.

where git >nul 2>&1
if errorlevel 1 (
    echo Git nu este instalat sau nu este in PATH.
    echo Instaleaza Git for Windows, apoi ruleaza din nou.
    pause
    exit /b 1
)

if not exist ".git" (
    echo Initializez Git in folderul acesta...
    git init
    git branch -M %BRANCH%
)

git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo Adaug remote origin...
    git remote add origin %REPO%
) else (
    echo Actualizez remote origin...
    git remote set-url origin %REPO%
)

git branch -M %BRANCH%

echo.
echo Adaug fisierele modificate...
git add -A

git diff --cached --quiet
if not errorlevel 1 (
    echo.
    echo Nu exista modificari noi de urcat.
    git status --short
    pause
    exit /b 0
)

echo.
set /p "MSG=Mesaj pentru commit (Enter = Actualizare site): "
if "%MSG%"=="" set "MSG=Actualizare site"

echo.
echo Fac commit: "%MSG%"
git commit -m "%MSG%"
if errorlevel 1 (
    echo.
    echo Commit-ul a esuat. Verifica mesajul de mai sus.
    pause
    exit /b 1
)

echo.
echo Verific daca repo-ul GitHub are deja continut...
git fetch origin %BRANCH% >nul 2>&1
if not errorlevel 1 (
    echo Sincronizez cu GitHub inainte de push...
    git pull origin %BRANCH% --allow-unrelated-histories --no-rebase
    if errorlevel 1 (
        echo.
        echo Pull-ul a esuat sau exista conflicte.
        echo Rezolva conflictele afisate de Git, apoi ruleaza update.bat din nou.
        git status --short
        pause
        exit /b 1
    )
)

echo.
echo Trimit modificarile pe GitHub...
git push -u origin %BRANCH%
if errorlevel 1 (
    echo.
    echo Push-ul a esuat. Daca GitHub cere login, autentifica-te si ruleaza din nou.
    pause
    exit /b 1
)

echo.
echo Gata. Modificarile sunt pe GitHub.
echo Daca folosesti GitHub Pages/Netlify/Vercel, asteapta deploy-ul automat.
pause
