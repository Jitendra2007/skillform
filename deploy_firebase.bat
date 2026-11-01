@echo off
setlocal
title SkillConnect - Firebase Deploy (swaroop2427@gmail.com)
color 0B

echo =======================================================================
echo            Firebase Deployment for swaroop2427@gmail.com
echo            Project: skillform-22ea5
echo =======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Building production dist...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Authenticating as swaroop2427@gmail.com...
echo When your browser opens, select or sign in with swaroop2427@gmail.com
call npx -y firebase-tools login --reauth

echo.
echo [3/3] Deploying to skillform-22ea5...
call npx -y firebase-tools use skillform-22ea5
call npx -y firebase-tools deploy --only hosting,firestore:rules

echo.
echo Live site: https://skillform-22ea5.web.app
pause
