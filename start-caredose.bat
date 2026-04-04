@echo off
echo.
echo  ========================================================
echo    CareDose - Starting Backend + Mobile App
echo  ========================================================
echo.

:: Detect local IP for mobile device connection (take first IPv4)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
  set "RAW_IP=%%a"
  goto :found_ip
)
:found_ip
:: Remove leading space from IP using a trick
for /f "tokens=*" %%b in ("%RAW_IP%") do set "LOCAL_IP=%%b"

echo  [INFO] Your Local IP: %LOCAL_IP%
echo  [INFO] Backend will run at: http://%LOCAL_IP%:3001
echo.

:: Check for Firebase service account
if not exist "%~dp0backend\api-server\service-account.json" (
  echo  [WARNING] service-account.json not found!
  echo  Download from: Firebase Console ^> Project Settings ^> Service Accounts ^> Generate new private key
  echo  Save it as: backend\api-server\service-account.json
  echo.
)

echo  [STEP 1] Installing backend dependencies...
cd /d "%~dp0backend\api-server"
call npm install --force --silent
echo  [STEP 1] Done.

echo  [STEP 2] Installing mobile dependencies...
cd /d "%~dp0mobile\caredose"
call npm install --force --silent
echo  [STEP 2] Done.
cd /d "%~dp0"

echo.
echo  [STARTING] Launching Backend Server on port 3001...
start "CareDose - Express Backend" cmd /k "cd /d "%~dp0backend\api-server" && npm run dev"

echo  [STARTING] Launching Expo Mobile App...
timeout /t 3 /nobreak >nul

:: Use set "VAR=value" syntax to avoid trailing-space bug in Windows set command
start "CareDose - Expo Mobile App" cmd /k "cd /d "%~dp0mobile\caredose" && set "EXPO_PUBLIC_API_URL=http://%LOCAL_IP%:3001/api" && npx expo start --clear"

echo.
echo  ========================================================
echo    Both servers starting in new windows!
echo    - Scan the QR code in the Expo window with Expo Go
echo    - Backend API: http://%LOCAL_IP%:3001/api/healthz
echo  ========================================================
echo.
echo  TIP: In PowerShell, always run as: .\start-caredose.bat
echo.
pause
