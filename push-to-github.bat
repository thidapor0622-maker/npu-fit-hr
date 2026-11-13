@echo off
chcp 65001 >nul
cls
echo ===================================================
echo   Uploading HR_SITE to GitHub (npu-fit-hr)...
echo ===================================================
echo.

cd /d "c:\Users\asth6\OneDrive - Nakhon Phanom University\เดสก์ท็อป\HR_SITE - สำเนา"
set "PATH=%PATH%;C:\Users\asth6\MinGit\cmd;C:\Users\asth6\MinGit\mingw64\bin"

git push -u origin main --force

echo.
echo ===================================================
echo   Upload complete!
echo ===================================================
pause