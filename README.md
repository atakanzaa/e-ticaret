# E-Ticaret Marketplace

Trendyol tarzı marketplace projesi - microservices mimarisi ile geliştirilmiş e-ticaret platformu.

## 🏗️ Teknoloji Stack

- **Backend:** Java 21, Spring Boot 3.3.x, Spring Cloud
- **Frontend:** Next.js, TypeScript, Material-UI
- **Database:** PostgreSQL 16 + Flyway migrations
- **Message Queue:** Apache Kafka (with Zookeeper), RabbitMQ
- **Storage:** MinIO (S3 compatible)
- **Email:** MailHog (development SMTP server)
- **Build:** Maven, Docker, Docker Compose

## 📦 Proje Yapısı

```
e-ticaret/
├── docker/                 # Docker Compose configuration
├── env/dev/               # Environment files
├── contracts/             # Event schemas (Kafka/AMQP)
├── http/                  # REST client examples
├── docs/                  # Architecture documentation
├── frontend/              # Next.js application
└── services/              # Microservices
    ├── gateway-service/   # API Gateway (8080)
    ├── auth-service/      # Authentication & Authorization (8081)
    ├── catalog-service/   # Product & Store management (8082)
    ├── seller-service/    # Seller operations (8083)
    ├── review-service/    # Product reviews (8084)
    ├── search-service/    # Full-text search (8085)
    ├── order-payment-service/ # Orders & Payments (8086)
    └── notification-service/  # Email notifications (8087)
```

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Docker & Docker Compose
- Node.js 18+ (frontend için)

### Kurulum ve Çalıştırma

#### **Yöntem 1: Otomatik (Önerilen)**

1. **Tüm sistemi başlat:**
   ```bash
   # Windows
   start-system.bat
   
   # Linux/Mac
   ./start-system.sh
   ```

#### **Yöntem 2: Manuel**

1. **Docker image'ları oluştur:**
   ```bash
   # Windows
   build-all-images.bat
   
   # Linux/Mac  
   ./build-all-images.sh
   ```

2. **Servisleri başlat:**
   ```bash
   cd docker
   docker-compose up -d
   ```

3. **Frontend'i başlat (ayrı terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   **Google OAuth Yapılandırması (isteğe bağlı):**
   - Google ile giriş yapmak için [Google Cloud Console](https://console.cloud.google.com/) üzerinden OAuth 2.0 Client ID oluşturun
   - Frontend klasöründe `.env.local` dosyası oluşturun:
     ```
     VITE_API_BASE_URL=http://localhost:8080
     VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
     ```

4. **Servislerin sağlık durumunu kontrol et:**
   - Gateway: http://localhost:8080/actuator/health
   - Auth: http://localhost:8081/actuator/health
   - Diğer servisler için port numaralarını yukarıdaki listeden kontrol edin

### 🐳 Docker Image'ları

Projede her servis için ayrı Docker image'ı bulunur:
- `e-ticaret/gateway-service:latest`
- `e-ticaret/auth-service:latest`
- `e-ticaret/catalog-service:latest`
- `e-ticaret/seller-service:latest`
- `e-ticaret/review-service:latest`
- `e-ticaret/search-service:latest`
- `e-ticaret/order-payment-service:latest`
- `e-ticaret/notification-service:latest`

## 🔐 Roller

- **USER:** Normal kullanıcı (varsayılan)
- **SELLER:** Satıcı (onay gerektirir)
- **ADMIN:** Sistem yöneticisi

## 🛠️ Geliştirme

### API Test

`http/` klasöründe her servis için örnek HTTP istekleri bulunmaktadır. VS Code REST Client veya Postman ile kullanabilirsiniz.

### Database Migrations

Her servis kendi Flyway migration'larını `src/main/resources/db/migration/` klasöründe barındırır.

### Event-Driven Architecture

- **Kafka Topics:** order.created, payment.succeeded, payment.failed, product.updated, store.updated, review.approved
- **RabbitMQ Queue:** email.send

## 📝 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.
