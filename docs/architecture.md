# E-Ticaret Marketplace Architecture

## Overview
Trendyol-style marketplace built with microservices architecture using Spring Boot 3.3.x and Java 21.

## Architecture Components

### API Gateway (8080)
- Spring Cloud Gateway
- JWT token validation (OAuth2 Resource Server)
- Routes requests to microservices
- CORS configuration for frontend

### Services and Ports
- **gateway-service**: 8080 - API Gateway and routing
- **auth-service**: 8081 - Authentication & user management
- **catalog-service**: 8082 - Products & stores management
- **seller-service**: 8083 - Seller applications & management
- **review-service**: 8084 - Product reviews & ratings
- **search-service**: 8085 - Full-text search
- **order-payment-service**: 8086 - Orders, carts & payments
- **notification-service**: 8087 - Email notifications

### Infrastructure
- **PostgreSQL 16**: Database with separate DB per service
- **Apache Kafka**: Event streaming (order.created, payment.succeeded, etc.)
- **RabbitMQ**: Message queue for emails
- **MinIO**: S3-compatible object storage for product images
- **MailHog**: SMTP server for development

### Event-Driven Architecture
**Kafka Topics:**
- `order.created` - Published when order is placed
- `payment.succeeded` - Payment completed successfully
- `payment.failed` - Payment failed
- `product.updated` - Product information changed
- `store.updated` - Store information changed
- `review.approved` - Review approved by admin

**RabbitMQ Queues:**
- `email.send` - Email notifications

### Security
- JWT tokens issued by auth-service
- Gateway validates JWT and forwards user context via headers
- Role-based access control (USER, SELLER, ADMIN)
- Soft delete with anonymization for GDPR compliance

### Database Design
Each service has its own PostgreSQL database with Flyway migrations:
- `auth_db` - Users and authentication
- `catalog_db` - Products, stores, categories
- `seller_db` - Seller applications
- `review_db` - Product reviews
- `search_db` - Full-text search indexes
- `order_payment_db` - Orders, carts, payments

### Technology Stack
- **Backend**: Java 21, Spring Boot 3.3.x, Spring Cloud 2023.0.x
- **Database**: PostgreSQL 16 with Flyway migrations
- **Messaging**: Apache Kafka, RabbitMQ
- **Storage**: MinIO (S3-compatible)
- **Frontend**: Next.js, TypeScript, Material-UI
- **Containerization**: Docker, Docker Compose
- **Build**: Maven
