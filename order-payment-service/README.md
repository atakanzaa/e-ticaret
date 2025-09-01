# Order Payment Service

Spring Boot microservice for handling orders and payments with iyzico 3D Secure integration.

## Features

- ✅ Order management
- ✅ iyzico 3D Secure payment processing (SANDBOX)
- ✅ Kafka event publishing
- ✅ Webhook processing with idempotency
- ✅ PostgreSQL with Flyway migrations
- ✅ Comprehensive REST API

## Quick Start

### Environment Variables

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/eticaret?currentSchema=order_payment
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=123456

# Kafka
SPRING_KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# iyzico (Sandbox)
IYZICO_API_BASE=https://sandbox-api.iyzipay.com
IYZICO_API_KEY=sandbox-xxx
IYZICO_SECRET_KEY=sandbox-xxx
IYZICO_CALLBACK_URL=http://localhost:8086/api/payment/3ds/callback
IYZICO_CURRENCY=TRY
IYZICO_LOCALE=tr
```

### Build & Run

```bash
# Build
./mvnw clean package -DskipTests

# Run
java -jar target/order-payment-service-0.0.1-SNAPSHOT.jar

# Docker
docker build -t order-payment-service .
docker run -p 8086:8086 order-payment-service
```

## API Endpoints

### Order Endpoints
- `POST /api/order/cart/items` - Add item to cart
- `POST /api/order/checkout` - Create order
- `GET /api/order/{id}` - Get order details
- `GET /api/orders/daily` - Daily orders summary
- `GET /api/orders/profit/daily` - Daily profit summary

### Payment Endpoints
- `POST /api/payment/3ds/init` - Initialize 3DS payment
- `POST /api/payment/3ds/callback` - Handle 3DS callback
- `POST /api/payment/webhook/iyzico` - iyzico webhook
- `POST /api/payment/{orderId}/init` - Initialize payment
- `POST /api/payment/iyzico/webhook` - iyzico webhook endpoint

## Database Schema

```sql
-- Schema: order_payment
-- Tables: payments, payment_items, webhook_events, idempotency_keys
```

## Kafka Events

### payment_succeeded
```json
{
  "orderId": "uuid",
  "conversationId": "string",
  "paymentId": "string",
  "paidPrice": 100.00,
  "currency": "TRY",
  "installment": 1,
  "cardFamily": "Bonus",
  "cardAssociation": "VISA",
  "cardType": "CREDIT",
  "authCode": "123456",
  "timestamp": "2024-01-15T10:30:00Z",
  "status": "SUCCEEDED"
}
```

## Testing

```bash
# Unit tests
./mvnw test

# Integration tests
./mvnw test -Dtest=IntegrationTest
```

## Frontend Integration

### React 3DS Helper Usage

```tsx
import ThreeDSHelper from './components/ThreeDSHelper';

const PaymentPage = () => {
  const handle3DSComplete = (data) => {
    console.log('3DS completed:', data);
    // Redirect to success page
  };

  const handle3DSError = (error) => {
    console.log('3DS error:', error);
    // Show error message
  };

  return (
    <ThreeDSHelper
      html={threeDSHtmlContent}
      onComplete={handle3DSComplete}
      onError={handle3DSError}
    />
  );
};
```

### API Usage

```typescript
import { paymentApi } from './api/payment';

// Initialize 3DS payment
const response = await paymentApi.initialize3DS('order-123', initRequest);

// The response.threeDSHtmlContent contains the HTML to inject
```

## Security

- HMAC-SHA256 signature validation for webhooks
- Idempotency keys for duplicate prevention
- Input validation with Bean Validation
- Secure configuration management

## Monitoring

- Spring Boot Actuator endpoints
- Health checks
- Metrics collection
- Request logging

## Development

### Adding New Payment Methods

1. Create DTOs for the new payment method
2. Add service methods to handle the payment flow
3. Update controller with new endpoints
4. Add database migrations if needed
5. Update Kafka events
6. Add unit tests

### Testing iyzico Integration

Use the sandbox environment for testing:
- Test cards: https://sandbox-merchant.iyzipay.com/
- Webhook testing: Use ngrok for local webhook testing
- Error simulation: Modify request parameters to trigger errors

## Troubleshooting

### Common Issues

1. **403 Forbidden on iyzico API**
   - Check API key and secret
   - Verify sandbox vs production URLs

2. **Webhook signature validation fails**
   - Ensure secret key is correct
   - Check webhook payload encoding

3. **Database connection issues**
   - Verify PostgreSQL is running
   - Check connection string and credentials

4. **Kafka connection issues**
   - Verify Kafka is running
   - Check bootstrap servers configuration

## Contributing

1. Create feature branch
2. Add tests for new functionality
3. Update documentation
4. Create pull request

## License

This project is licensed under the MIT License.
