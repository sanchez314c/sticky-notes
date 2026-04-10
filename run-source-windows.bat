@echo off
setlocal enabledelayedexpansion

REM Run modular-sticky from Source on Windows
REM Ports: DEV=63599, DEVTOOLS=55060, IPC=59493

set RED=[91m
set GREEN=[92m
set BLUE=[94m
set NC=[0m

echo %BLUE%[%TIME%]%NC% Starting modular-sticky from source (Windows)...

REM Port definitions
set DEV_PORT=63599
set DEVTOOLS_PORT=55060
set IPC_PORT=59493

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %RED%[%TIME%] X%NC% Node.js is not installed. Download from https://nodejs.org
    pause
    exit /b 1
)

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %RED%[%TIME%] X%NC% npm is not installed
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo %BLUE%[%TIME%]%NC% Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo %RED%[%TIME%] X%NC% npm install failed
        pause
        exit /b 1
    )
)

REM Parse --dev flag
set DEV_MODE=0
for %%a in (%*) do (
    if "%%a"=="--dev" set DEV_MODE=1
)

echo %BLUE%[%TIME%]%NC% Ports: DEV=%DEV_PORT% DEVTOOLS=%DEVTOOLS_PORT% IPC=%IPC_PORT%

if "%DEV_MODE%"=="1" (
    echo %BLUE%[%TIME%]%NC% Launching in DEV mode...
    call npx electron . --dev --no-sandbox --remote-debugging-port=%DEVTOOLS_PORT%
) else (
    echo %BLUE%[%TIME%]%NC% Launching in production mode...
    call npx electron . --no-sandbox
)

echo.
echo %GREEN%[%TIME%] OK%NC% Application session ended
pause
