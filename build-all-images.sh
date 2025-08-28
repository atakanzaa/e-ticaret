#!/bin/bash

# E-Ticaret Marketplace - Docker Image Builder
# Bu script tüm servisleri Docker image haline getirir

echo "🐳 E-Ticaret Marketplace - Docker Image Builder"
echo "================================================"

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker çalışmıyor! Önce Docker'ı başlatın."
    exit 1
fi

print_success "Docker çalışıyor ✓"
echo ""

# Define services and infrastructure
services=(
    "auth-service"
    "gateway-service" 
    "catalog-service"
    "seller-service"
    "review-service"
    "search-service"
    "order-payment-service"
    "notification-service"
)

infrastructure=(
    "postgres"
    "zookeeper"
    "kafka"
    "rabbitmq"
    "minio"
    "mailhog"
)

print_info "Şu servisler için image'lar oluşturulacak:"
for service in "${services[@]}"; do
    echo "  • $service"
done

print_info "Şu altyapı servisleri için image'lar oluşturulacak:"
for infra in "${infrastructure[@]}"; do
    echo "  • $infra"
done
echo ""

read -p "Tüm image'ları build etmek istediğinizden emin misiniz? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "İşlem iptal edildi."
    exit 0
fi

echo ""
print_info "Docker image'ları oluşturuluyor..."
echo "================================================"

# Build infrastructure services first
for infra in "${infrastructure[@]}"; do
    echo ""
    print_info "$infra infrastructure image'ı oluşturuluyor..."
    
    cd "infrastructure/$infra" || {
        print_error "infrastructure/$infra dizini bulunamadı!"
        exit 1
    }
    
    if docker build -t "e-ticaret/$infra:latest" .; then
        print_success "$infra infrastructure image'ı başarıyla oluşturuldu ✓"
    else
        print_error "$infra infrastructure image'ı oluşturulamadı!"
        cd ../..
        exit 1
    fi
    
    cd ../..
done

# Build application services
for service in "${services[@]}"; do
    echo ""
    print_info "$service application image'ı oluşturuluyor..."
    
    cd "$service" || {
        print_error "$service dizini bulunamadı!"
        exit 1
    }
    
    if docker build -t "e-ticaret/$service:latest" .; then
        print_success "$service application image'ı başarıyla oluşturuldu ✓"
    else
        print_error "$service application image'ı oluşturulamadı!"
        cd ..
        exit 1
    fi
    
    cd ..
done

echo ""
echo "================================================"
print_success "🎉 Tüm Docker image'ları başarıyla oluşturuldu!"
echo ""

print_info "📦 Oluşturulan Image'lar:"
docker images | grep "e-ticaret"

echo ""
print_info "🚀 Servisleri başlatmak için:"
echo "   cd docker"
echo "   docker-compose up -d"
echo ""

print_info "🗑️ Tüm image'ları silmek için:"
echo "   docker rmi \$(docker images -q 'e-ticaret/*')"
echo ""

print_info "📊 Image boyutları:"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep "e-ticaret"
