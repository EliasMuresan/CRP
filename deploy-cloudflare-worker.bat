@echo off
cd /d "%~dp0"

echo.
echo === CRP Arad - Cloudflare Worker CMS ===
echo.
echo 1. Daca se deschide browserul, intra in contul tau Cloudflare.
echo 2. Pentru GITHUB_TOKEN foloseste un token GitHub cu Contents: Read and write doar pentru repo-ul CRP.
echo 3. Tokenul NU se salveaza in cod, se salveaza ca secret in Cloudflare.
echo.
pause

npx wrangler login
if errorlevel 1 (
  echo Login Cloudflare nereusit.
  pause
  exit /b 1
)

echo.
echo Acum lipeste GITHUB_TOKEN cand il cere Wrangler.
echo.
npx wrangler secret put GITHUB_TOKEN
if errorlevel 1 (
  echo Nu am putut salva secretul GITHUB_TOKEN.
  pause
  exit /b 1
)

echo.
echo Public Worker-ul...
echo.
npx wrangler deploy
if errorlevel 1 (
  echo Deploy nereusit.
  pause
  exit /b 1
)

echo.
echo Gata. Copiaza URL-ul de workers.dev afisat mai sus si da-mi-l ca sa il leg in site.
echo.
pause
