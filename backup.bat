@echo off
setlocal enabledelayedexpansion

:: Get current date and time
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set YEAR=%datetime:~0,4%
set MONTH=%datetime:~4,2%
set DAY=%datetime:~6,2%
set HOUR=%datetime:~8,2%
set MINUTE=%datetime:~10,2%

:: Create backup folder name
set BACKUP_NAME=%YEAR%-%MONTH%-%DAY%_%HOUR%-%MINUTE%
set BACKUP_DIR=C:\Users\yodes\Documents\n8n\backups\video-studio\%BACKUP_NAME%

echo.
echo ========================================
echo   VIDEO STUDIO BACKUP
echo   %BACKUP_NAME%
echo ========================================
echo.

:: Create backup directory
mkdir "%BACKUP_DIR%" 2>nul

:: Copy source files
echo Copying src folder...
xcopy /E /I /Y "src" "%BACKUP_DIR%\src" >nul

echo Copying config files...
copy "package.json" "%BACKUP_DIR%\" >nul 2>&1
copy "tsconfig.json" "%BACKUP_DIR%\" >nul 2>&1
copy "astro.config.mjs" "%BACKUP_DIR%\" >nul 2>&1
copy ".gitignore" "%BACKUP_DIR%\" >nul 2>&1
copy "tailwind.config.mjs" "%BACKUP_DIR%\" >nul 2>&1

:: Save git info
echo Saving git info...
git log -1 --format="Commit: %%H%%nDate: %%ai%%nMessage: %%s" > "%BACKUP_DIR%\GIT_INFO.txt"
git status >> "%BACKUP_DIR%\GIT_INFO.txt"

echo.
echo Backup saved to:
echo %BACKUP_DIR%
echo.

:: Clean old backups (keep last 10)
echo Cleaning old backups (keeping last 10)...
cd "C:\Users\yodes\Documents\n8n\backups\video-studio"
for /f "skip=10 delims=" %%F in ('dir /b /ad /o-d 2^>nul') do (
    echo Removing old backup: %%F
    rmdir /s /q "%%F" 2>nul
)

echo.
echo Done!
echo ========================================
