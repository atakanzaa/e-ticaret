// Payment API helpers for 3DS integration

export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderRequest {
  shippingAddress: string;
  billingAddress: string;
}

export interface OrderResponse {
  orderId: string;
  totalAmount: number;
  currency: string;
  status: string;
}

export interface ThreeDSInitRequest {
  locale: string;
  conversationId: string;
  price: number;
  paidPrice: number;
  currency: string;
  installment: number;
  basketId: string;
  paymentChannel: string;
  paymentGroup: string;
  paymentSource: string;
  buyer: {
    id: string;
    name: string;
    surname: string;
    identityNumber: string;
    email: string;
    gsmNumber: string;
    registrationDate: string;
    lastLoginDate: string;
    registrationAddress: string;
    city: string;
    country: string;
    zipCode: string;
    ip: string;
  };
  shippingAddress: {
    address: string;
    zipCode: string;
    contactName: string;
    city: string;
    country: string;
  };
  billingAddress: {
    address: string;
    zipCode: string;
    contactName: string;
    city: string;
    country: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category1: string;
    category2: string;
    itemType: string;
    price: string;
    subMerchantKey?: string;
    subMerchantPrice?: string;
  }>;
  callbackUrl: string;
  paymentCard: string;
  merchantCallbackUrl: string;
  merchantErrorUrl: string;
  merchantSuccessUrl: string;
}

export interface ThreeDSInitResponse {
  status: string;
  locale: string;
  systemTime: number;
  conversationId: string;
  price: number;
  paidPrice: number;
  installment: number;
  paymentId: string;
  fraudStatus: string;
  merchantCommissionRate: string;
  merchantCommissionRateAmount: string;
  iyziCommissionRateAmount: string;
  iyziCommissionFee: string;
  cardType: string;
  cardAssociation: string;
  cardFamily: string;
  cardToken: string;
  cardUserKey: string;
  binNumber: string;
  lastFourDigits: string;
  basketId: string;
  currency: string;
  itemTransactions: string;
  authCode: string;
  phase: string;
  mDStatus: string;
  threeDSHtmlContent: string;
  errorCode: string;
  errorMessage: string;
  errorGroup: string;
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export const paymentApi = {
  // Add item to cart
  async addToCart(item: CartItem): Promise<{ cartId: string; totalAmount: number; itemCount: number }> {
    const response = await fetch(`${API_BASE}/api/order/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': (typeof localStorage !== 'undefined' ? localStorage.getItem('userId') : null) || 'anonymous',
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error(`Add to cart failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Create order from cart
  async createOrder(orderRequest: OrderRequest): Promise<OrderResponse> {
    const response = await fetch(`${API_BASE}/api/order/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': (typeof localStorage !== 'undefined' ? localStorage.getItem('userId') : null) || 'anonymous',
        'Idempotency-Key': `order-${Date.now()}-${Math.random()}`,
      },
      body: JSON.stringify(orderRequest),
    });

    if (!response.ok) {
      throw new Error(`Order creation failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Initialize 3DS payment
  async initialize3DS(orderId: string, request: ThreeDSInitRequest): Promise<ThreeDSInitResponse> {
    const response = await fetch(`${API_BASE}/api/payment/3ds/init?orderId=${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': (typeof localStorage !== 'undefined' ? localStorage.getItem('userId') : null) || 'anonymous',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`3DS initialization failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Handle 3DS callback
  async handle3DSCallback(paymentId: string, conversationData: string): Promise<any> {
    const response = await fetch(`${API_BASE}/api/payment/3ds/callback?paymentId=${paymentId}&conversationData=${conversationData}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`3DS callback failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Example usage:
  // const initRequest: ThreeDSInitRequest = {
  //   locale: 'tr',
  //   conversationId: 'conv-' + Date.now(),
  //   price: 100.00,
  //   paidPrice: 100.00,
  //   currency: 'TRY',
  //   installment: 1,
  //   basketId: 'basket-123',
  //   paymentChannel: 'WEB',
  //   paymentGroup: 'PRODUCT',
  //   paymentSource: 'DEFAULT',
  //   buyer: {
  //     id: 'buyer-123',
  //     name: 'John',
  //     surname: 'Doe',
  //     identityNumber: '12345678901',
  //     email: 'john@example.com',
  //     gsmNumber: '+905551234567',
  //     registrationDate: '2024-01-01',
  //     lastLoginDate: '2024-01-15',
  //     registrationAddress: 'Istanbul',
  //     city: 'Istanbul',
  //     country: 'Turkey',
  //     zipCode: '34000',
  //     ip: '127.0.0.1'
  //   },
  //   shippingAddress: {
  //     address: 'Shipping Address',
  //     zipCode: '34000',
  //     contactName: 'John Doe',
  //     city: 'Istanbul',
  //     country: 'Turkey'
  //   },
  //   billingAddress: {
  //     address: 'Billing Address',
  //     zipCode: '34000',
  //     contactName: 'John Doe',
  //     city: 'Istanbul',
  //     country: 'Turkey'
  //   },
  //   basketItems: [{
  //     id: 'item-1',
  //     name: 'Product Name',
  //     category1: 'Electronics',
  //     category2: 'Smartphones',
  //     itemType: 'PHYSICAL',
  //     price: '100.00'
  //   }],
  //   callbackUrl: 'http://localhost:8086/api/payment/3ds/callback',
  //   paymentCard: 'card-token-here',
  //   merchantCallbackUrl: 'http://localhost:8080/payment/callback',
  //   merchantErrorUrl: 'http://localhost:8080/payment/error',
  //   merchantSuccessUrl: 'http://localhost:8080/payment/success'
  // };

  // const response = await paymentApi.initialize3DS('order-123', initRequest);
};
