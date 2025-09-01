# Frontend - E-Ticaret Platform

React + TypeScript + Vite frontend for the e-commerce platform with iyzico 3D Secure payment integration.

## Setup

### 1. Environment Variables

Create a `.env` file in the frontend directory:

```bash
# Copy from .env.example
cp .env.example .env
```

Environment variables:
```bash
# API Configuration
VITE_API_BASE=http://localhost:8080

# Development settings
VITE_APP_NAME=E-Ticaret Platform
VITE_APP_VERSION=1.0.0

# Feature flags
VITE_ENABLE_3DS=true
VITE_ENABLE_ANALYTICS=false

# Payment settings
VITE_PAYMENT_CURRENCY=TRY
VITE_PAYMENT_LOCALE=tr
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Features

### Payment Integration
- ✅ iyzico 3D Secure payment processing
- ✅ Secure iframe-based 3DS verification
- ✅ Cart management
- ✅ Order creation with idempotency
- ✅ Real-time payment status updates

### Components
- ✅ ThreeDSHelper - Secure 3DS payment modal
- ✅ Payment API client with TypeScript types
- ✅ Cart and order management
- ✅ Error handling and loading states

### API Integration
- ✅ Type-safe API calls
- ✅ JWT authentication support
- ✅ Error handling and retries
- ✅ Environment-based configuration

## Usage Examples

### Adding Item to Cart
```typescript
import { paymentApi } from './api/payment';

const addToCart = async () => {
  try {
    const result = await paymentApi.addToCart({
      productId: 'prod-123',
      name: 'iPhone 15',
      quantity: 1,
      price: 25000
    });
    console.log('Added to cart:', result);
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
};
```

### Creating Order
```typescript
const createOrder = async () => {
  try {
    const order = await paymentApi.createOrder({
      shippingAddress: 'İstanbul, Türkiye',
      billingAddress: 'İstanbul, Türkiye'
    });

    // Proceed to payment
    const threeDSResponse = await paymentApi.initialize3DS(order.orderId, {
      // 3DS request configuration
    });

    return threeDSResponse;
  } catch (error) {
    console.error('Order creation failed:', error);
  }
};
```

### 3DS Payment Modal
```tsx
import ThreeDSHelper from './components/ThreeDSHelper';

const PaymentComponent = ({ threeDSHtml }) => {
  const handleComplete = (data) => {
    console.log('Payment completed:', data);
    // Redirect to success page
  };

  const handleError = (error) => {
    console.log('Payment failed:', error);
    // Show error message
  };

  return (
    <ThreeDSHelper
      html={threeDSHtml}
      onComplete={handleComplete}
      onError={handleError}
      onClose={() => setShowPayment(false)}
    />
  );
};
```

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── payment.ts          # Payment API client
│   ├── components/
│   │   ├── ThreeDSHelper.tsx   # 3DS payment modal
│   │   └── DevStubs.tsx        # Development stubs
│   ├── types/
│   └── App.tsx
├── .env.example                # Environment template
├── vite.config.ts              # Vite configuration
└── package.json
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE` | Backend API base URL | `http://localhost:8080` |
| `VITE_APP_NAME` | Application name | `E-Ticaret Platform` |
| `VITE_ENABLE_3DS` | Enable 3DS payment flow | `true` |
| `VITE_PAYMENT_CURRENCY` | Default currency | `TRY` |
| `VITE_PAYMENT_LOCALE` | Payment locale | `tr` |

## Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Ensure `.env` file exists in frontend directory
   - Restart development server after adding new variables

2. **API connection errors**
   - Check if backend services are running
   - Verify `VITE_API_BASE` URL is correct

3. **3DS payment not working**
   - Ensure iyzico credentials are configured in backend
   - Check browser console for iframe security errors

4. **TypeScript errors**
   - Run `npm run lint` to check for type errors
   - Ensure all dependencies are installed

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries

### API Integration
- Use the centralized API client in `src/api/payment.ts`
- Implement proper error handling for all API calls
- Use loading states for better UX

### Security
- Never store sensitive payment data in frontend
- Use HTTPS in production
- Implement proper CORS policies
- Validate all user inputs

## Contributing

1. Create feature branch from `main`
2. Implement changes with proper TypeScript types
3. Add/update tests if applicable
4. Update documentation
5. Create pull request

## License

This project is licensed under the MIT License.
