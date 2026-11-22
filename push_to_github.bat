@echo off
title Push Dilip Grocery Store to GitHub
cd /d "%~dp0"
echo ========================================================
echo Pushing Dilip Grocery Store project to GitHub...
echo Repository: https://github.com/poojasingh966/Project.git
echo ========================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo SUCCESS! Project successfully pushed to GitHub!
    echo ========================================================
) else (
    echo ========================================================
    echo If GitHub asks for sign in, please complete the browser prompt.
    echo ========================================================
)
pause
