@echo off
echo Setting up Git configuration...
git config --global user.name "anmolnagpal18"
git config --global user.email "nagpala362@gmail.com"

echo Initializing Git repository...
git init

echo Removing existing remote (if any)...
git remote remove origin 2>nul

echo Adding remote repository...
git remote add origin https://github.com/anmolnagpal18/DUKE-DAWN.git

echo Adding all files...
git add .

echo Creating initial commit...
git commit -m "Initial commit: DUKE & DAWN hoodie store with complete features"

echo Creating main branch...
git branch -M main

echo Pushing to GitHub...
git push -u origin main

echo Done! Your project has been uploaded to GitHub.
pause