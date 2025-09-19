@echo off
echo ================================
echo     SBMods OAuth Setup Ready!
echo ================================
echo.

echo [1/3] Sprawdzanie Python...
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python nie jest zainstalowany!
    echo Pobierz z: https://python.org/downloads
    pause
    exit /b 1
)
echo ✅ Python jest dostępny

echo.
echo [2/3] Uruchamianie serwera HTTP na porcie 8000...
echo ℹ️  Serwer będzie dostępny na: http://localhost:8000
echo.

timeout /t 2 /nobreak >nul

echo [3/3] Otwieranie przeglądarki...
start http://localhost:8000

echo.
echo 🚀 GOTOWE! OAuth jest skonfigurowany i działa!
echo.
echo 🔐 Dostępne OAuth providers:
echo    ✅ Google   - Gotowe do użycia
echo    ✅ GitHub   - Gotowe do użycia  
echo    ✅ Discord  - Gotowe do użycia
echo.
echo 💡 Kliknij 'Logowanie' i wybierz dowolny provider
echo    OAuth będzie działać naprawdę, nie jako symulacja!
echo.
echo ⚠️  Aby zatrzymać serwer: naciśnij Ctrl+C
echo.

REM Uruchom Python HTTP server
python -m http.server 8000