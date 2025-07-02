@echo off
echo --- Pushing Updates ---

echo Switching to main branch...
git checkout main
if %errorlevel% neq 0 (
    echo Error: Could not switch to main branch.
    goto :eof
)

echo Adding all changes...
git add .
if %errorlevel% neq 0 (
    echo Error: Could not add changes.
    goto :eof
)

if "%~1"=="" (
    echo Error: No commit message provided. Usage: push.bat "Your commit message"
    goto :eof
)

echo Committing changes...
git commit -m "%~1"
if %errorlevel% neq 0 (
    echo Error: Could not commit changes.
    goto :eof
)

echo Pushing main branch to origin...
git push origin main
if %errorlevel% neq 0 (
    echo Error: Could not push main branch.
    goto :eof
)

echo Switching to gh-pages branch...
git checkout gh-pages
if %errorlevel% neq 0 (
    echo Error: Could not switch to gh-pages branch.
    goto :eof
)

echo Merging main into gh-pages...
git merge main
if %errorlevel% neq 0 (
    echo Error: Could not merge main into gh-pages.
    goto :eof
)

echo Pushing gh-pages branch to origin...
git push origin gh-pages
if %errorlevel% neq 0 (
    echo Error: Could not push gh-pages branch.
    goto :eof
)

echo --- Update Pushed Successfully! ---
pause
