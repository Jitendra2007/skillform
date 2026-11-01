@echo off
setlocal enabledelayedexpansion
title SkillConnect - GitHub Push ^& Firebase Deploy
color 0A

echo =======================================================================
echo         SkillConnect AP: GitHub Push ^& Firebase Deployment
echo =======================================================================
echo Owner Account: swaroop2427@gmail.com
echo Target Project: skillform-22ea5 (https://skillform-22ea5.web.app)
echo Remote Repo:    https://github.com/Jitendra2007/skillform.git
echo =======================================================================
echo.

cd /d "%~dp0"

echo [Step 1/5] Ensuring crisp high-resolution hero image is in public/...
if not exist "public" mkdir "public"
set "HERO_SRC=C:\Users\swaro\.gemini\antigravity\brain\88c29544-b180-456f-988e-7e9920586ed6\.user_uploaded\media_1793345968632_48a7d094.png"
if exist "%HERO_SRC%" (
    copy /Y "%HERO_SRC%" "public\hero-banner.png" >nul
    echo       [OK] High-res hero image copied to public\hero-banner.png
) else (
    echo       [Info] Banner source already initialized.
)

echo.
echo [Step 2/5] Staging and Committing all updates to Git...
git add .
git commit -m "feat: compact mobile layout, selfie upload during registration, crisp worker hero banner, and real-time booking/verification sync"
if %ERRORLEVEL% NEQ 0 (
    echo       [Info] No new Git changes to commit or already committed.
) else (
    echo       [OK] Changes committed successfully.
)

echo.
echo [Step 3/5] Pushing to GitHub repository (origin/main)...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo       [Notice] If prompted for GitHub credentials, please complete sign-in.
) else (
    echo       [OK] Pushed to GitHub main branch.
)

echo.
echo [Step 4/5] Building production bundle (Vite build)...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Production build failed. Please inspect the logs above.
    pause
    exit /b %ERRORLEVEL%
)
echo       [OK] Production build created in dist/

echo.
echo [Step 5/5] Firebase Authentication ^& Deployment
echo -----------------------------------------------------------------------
echo A browser window will now open for Google / Firebase authentication.
echo IMPORTANT: Make sure to sign in with your owner email:
echo    swaroop2427@gmail.com
echo -----------------------------------------------------------------------
call npx -y firebase-tools login --reauth

echo.
echo Setting Firebase project to skillform-22ea5...
call npx -y firebase-tools use skillform-22ea5

echo.
echo Deploying to Firebase Hosting and Firestore rules...
call npx -y firebase-tools deploy --only hosting,firestore:rules
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Firebase deploy failed. If permissions were denied, verify swaroop2427@gmail.com has Owner/Editor permissions on skillform-22ea5.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo =======================================================================
echo   SUCCESS! Deployment complete.
echo   Your live application is now updated at:
echo   https://skillform-22ea5.web.app
echo =======================================================================
echo.
pause
