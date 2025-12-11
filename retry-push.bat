@echo off
echo Retrying push to GitHub...
git push -u origin main

if %errorlevel% neq 0 (
    echo Push failed. Trying alternative method...
    timeout /t 5
    git push origin main
    
    if %errorlevel% neq 0 (
        echo Still failing. Check your internet connection.
        echo You can also try:
        echo 1. Check if GitHub is accessible in browser
        echo 2. Try using mobile hotspot
        echo 3. Wait a few minutes and try again
        pause
    ) else (
        echo Push successful!
        pause
    )
) else (
    echo Push successful!
    pause
)