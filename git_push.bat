@echo off
setlocal
title SkillConnect - Git Push
color 0E

echo =======================================================================
echo               Pushing to GitHub (origin/main)
echo               Repo: https://github.com/Jitendra2007/skillform.git
echo =======================================================================
echo.

cd /d "%~dp0"

git add .
git commit -m "feat: compact mobile layout, selfie upload during registration, crisp worker hero banner, and real-time booking/verification sync"
git push origin main

echo.
echo Git push completed.
pause
