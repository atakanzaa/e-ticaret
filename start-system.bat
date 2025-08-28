@echo off
REM E-Ticaret Marketplace - Basit Başlatma Scripti

echo 🚀 E-Ticaret Marketplace Başlatılıyor...

REM Docker kontrolü
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker çalışmıyor!
    pause
    exit /b 1
)

echo [SUCCESS] Docker çalışıyor ✓

REM Image'ları kontrol et
echo [INFO] Docker image'ları kontrol ediliyor...
docker images | findstr "e-ticaret" >nul
if errorlevel 1 (
    echo [WARNING] E-ticaret image'ları bulunamadı!
    echo [INFO] Image'ları oluşturmak için build-all-images.bat çalıştırın.
    set /p "build_now=Şimdi image'ları oluşturulsun mu? (y/N): "
    if /i "!build_now!"=="y" (
        call build-all-images.bat
        if errorlevel 1 exit /b 1
    ) else (
        echo [INFO] İşlem iptal edildi.
        pause
        exit /b 0
    )
)

echo [SUCCESS] Image'lar mevcut ✓

REM Docker Compose ile başlat
echo [INFO] Servisler başlatılıyor...
cd docker
docker-compose up -d

echo.
echo [SUCCESS] 🎉 Sistem başlatıldı!
echo.
echo 🌐 Web Arayüzler:
echo   • API Gateway: http://localhost:8080
echo   • RabbitMQ: http://localhost:15672 (admin/admin)
echo   • MinIO: http://localhost:9001 (minioadmin/minioadmin)  
echo   • MailHog: http://localhost:8025
echo.
echo 📊 Durum kontrolü: docker-compose ps
echo ⏹️  Durdurmak için: docker-compose down
echo.
pause
