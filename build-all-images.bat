@echo off
REM E-Ticaret Marketplace - Docker Image Builder
REM Bu script tüm servisleri Docker image haline getirir

echo 🐳 E-Ticaret Marketplace - Docker Image Builder
echo ================================================

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker çalışmıyor! Önce Docker Desktop'ı başlatın.
    pause
    exit /b 1
)

echo [SUCCESS] Docker çalışıyor ✓
echo.

REM Define services and infrastructure
set "services=auth-service gateway-service catalog-service seller-service review-service search-service order-payment-service notification-service"
set "infrastructure=postgres zookeeper kafka rabbitmq minio mailhog"

echo [INFO] Şu servisler için image'lar oluşturulacak:
for %%s in (%services%) do (
    echo   • %%s
)

echo [INFO] Şu altyapı servisleri için image'lar oluşturulacak:
for %%i in (%infrastructure%) do (
    echo   • %%i
)
echo.

set /p "build_choice=Tüm image'ları build etmek istediğinizden emin misiniz? (y/N): "
if /i not "%build_choice%"=="y" (
    echo [INFO] İşlem iptal edildi.
    pause
    exit /b 0
)

echo.
echo [INFO] Docker image'ları oluşturuluyor...
echo ================================================

REM Build infrastructure services first
for %%i in (%infrastructure%) do (
    echo.
    echo [INFO] %%i infrastructure image'ı oluşturuluyor...
    
    cd infrastructure/%%i
    docker build -t e-ticaret/%%i:latest .
    
    if errorlevel 1 (
        echo [ERROR] %%i infrastructure image'ı oluşturulamadı!
        cd ../..
        pause
        exit /b 1
    )
    
    echo [SUCCESS] %%i infrastructure image'ı başarıyla oluşturuldu ✓
    cd ../..
)

REM Build application services
for %%s in (%services%) do (
    echo.
    echo [INFO] %%s application image'ı oluşturuluyor...
    
    cd %%s
    docker build -t e-ticaret/%%s:latest .
    
    if errorlevel 1 (
        echo [ERROR] %%s application image'ı oluşturulamadı!
        cd ..
        pause
        exit /b 1
    )
    
    echo [SUCCESS] %%s application image'ı başarıyla oluşturuldu ✓
    cd ..
)

echo.
echo ================================================
echo [SUCCESS] 🎉 Tüm Docker image'ları başarıyla oluşturuldu!
echo.

echo 📦 Oluşturulan Image'lar:
docker images | findstr "e-ticaret"

echo.
echo 🚀 Servisleri başlatmak için:
echo    cd docker
echo    docker-compose up -d
echo.

echo 🗑️ Image'ları silmek için:
echo    docker rmi e-ticaret/auth-service:latest
echo    docker rmi e-ticaret/gateway-service:latest
echo    docker rmi e-ticaret/catalog-service:latest
echo    docker rmi e-ticaret/seller-service:latest
echo    docker rmi e-ticaret/review-service:latest
echo    docker rmi e-ticaret/search-service:latest
echo    docker rmi e-ticaret/order-payment-service:latest
echo    docker rmi e-ticaret/notification-service:latest
echo.

pause
