#!/bin/bash

# E-Ticaret Marketplace - Basit Başlatma Scripti

echo "🚀 E-Ticaret Marketplace Başlatılıyor..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Docker kontrolü
if ! docker info > /dev/null 2>&1; then
    print_error "Docker çalışmıyor!"
    exit 1
fi

print_success "Docker çalışıyor ✓"

# Image'ları kontrol et
print_info "Docker image'ları kontrol ediliyor..."
if ! docker images | grep -q "e-ticaret"; then
    print_warning "E-ticaret image'ları bulunamadı!"
    print_info "Image'ları oluşturmak için ./build-all-images.sh çalıştırın."
    read -p "Şimdi image'ları oluşturulsun mu? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if ! ./build-all-images.sh; then
            exit 1
        fi
    else
        print_info "İşlem iptal edildi."
        exit 0
    fi
fi

print_success "Image'lar mevcut ✓"

# Docker Compose ile başlat
print_info "Servisler başlatılıyor..."
cd docker
docker-compose up -d

echo ""
print_success "🎉 Sistem başlatıldı!"
echo ""
echo "🌐 Web Arayüzler:"
echo "  • API Gateway: http://localhost:8080"
echo "  • RabbitMQ: http://localhost:15672 (admin/admin)"
echo "  • MinIO: http://localhost:9001 (minioadmin/minioadmin)"
echo "  • MailHog: http://localhost:8025"
echo ""
echo "📊 Durum kontrolü: docker-compose ps"
echo "⏹️  Durdurmak için: docker-compose down"
echo ""
