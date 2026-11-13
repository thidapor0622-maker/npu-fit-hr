@echo off
chcp 65001 >nul
echo ========================================================
echo   กำลังอัปโหลดโปรเจกต์ทั้งหมดขึ้น GitHub (npu-fit-hr)...
echo ========================================================
echo.

cd /d "%~dp0"
set "PATH=%PATH%;C:\Users\asth6\MinGit\cmd;C:\Users\asth6\MinGit\mingw64\bin"

git push -u origin main --force

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   [สำเร็จ!] อัปโหลดไฟล์ครบทั้งหมด 100%% เรียบร้อยแล้ว!
    echo.
    echo   ขั้นตอนต่อไป:
    echo   1. สลับไปที่หน้าเว็บ GitHub ในบราวเซอร์ของคุณ
    echo   2. รอระบบบิลด์เว็บประมาณ 1-2 นาที
    echo   3. รีเฟรชหน้าเว็บ https://thidapor0622-maker.github.io/npu-fit-hr/
    echo ========================================================
) else (
    echo ========================================================
    echo   หากมีหน้าต่างเด้งขึ้นมา ให้กด "Sign in with your browser"
    echo ========================================================
)
echo.
pause
