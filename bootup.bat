@echo off
setlocal ENABLEEXTENSIONS

:: Configuración
set "MIN_NODE_VERSION=14.0.0"
set "ENTRY_FILE=server.js"

:: Función para comparar versiones
set "VERSION_OK=false"
for /f "tokens=1 delims=." %%a in ("%MIN_NODE_VERSION%") do set "MIN_MAJOR=%%a"
for /f "tokens=1 delims=." %%a in ('node -v 2^>nul') do set "NODE_MAJOR=%%~a"

:: Verificar Node.js
node -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no está instalado o no está en PATH.
    pause
    exit /b 1
)

:: Quitar la 'v' de la versión (v18.16.0 → 18.16.0)
for /f "tokens=1 delims=" %%v in ('node -v') do set "NODE_VERSION=%%v"
set "NODE_VERSION=%NODE_VERSION:~1%"

:: Comparar versiones mayores
if %NODE_MAJOR% LSS %MIN_MAJOR% (
    echo [ERROR] Node.js %MIN_NODE_VERSION% o superior requerido. Tienes %NODE_VERSION%.
    pause
    exit /b 1
)

:: Verificar existencia de server.js
if not exist "%ENTRY_FILE%" (
    echo [ERROR] No se encontró "%ENTRY_FILE%" en esta carpeta.
    pause
    exit /b 1
)

:: Verificar si node_modules existe
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install http open path fs express
    if errorlevel 1 (
        echo [ERROR] No se pudo instalar dependencias.
        pause
        exit /b 1
    )
)

:: Ejecutar servidor
echo Ejecutando servidor...
node "%ENTRY_FILE%"
start http://localhost:8000