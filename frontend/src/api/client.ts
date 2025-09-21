/* Lightweight API client with auth and helpers */
import { Product, User, Address } from '../types';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

function parseJwt(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem('auth_token');
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    return raw;
  } catch {
    return null;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    ...(init.headers as Record<string, string> | undefined),
  };

  // Get token fresh every time to avoid timing issues
  const token = getAuthToken();
  const isAuthPublic = path.startsWith('/api/auth/register') || path.startsWith('/api/auth/login') || path.startsWith('/api/auth/google');
  if (token && !isAuthPublic) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log(`API Request to ${path} with token:`, token.substring(0, 50) + '...');
  } else {
    console.log(`API Request to ${path} without token`);
  }

  console.log('Request headers:', headers);
  console.log('Request URL:', `${API_BASE_URL}${path}`);

  const res = await fetch(`${API_BASE_URL}${path}`, { 
    ...init, 
    headers,
    cache: 'no-store',
    mode: 'cors',
    credentials: 'include'
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  // Handle 204
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

function toProduct(ui: any, featured = false): Product {
  const images: string[] = ui.images || ui.imageUrls || [];
  const image: string = ui.image || images[0] || 'https://via.placeholder.com/600x600.png?text=Product';
  const rating = typeof ui.rating_avg === 'number' ? ui.rating_avg : ui.rating || 0;
  const reviewCount = typeof ui.rating_count === 'number' ? ui.rating_count : ui.reviewCount || 0;
  const category = ui.categoryName || ui.category || ui.categoryId || 'General';

  const product: Product = {
    id: ui.id || ui.productId || crypto.randomUUID(),
    slug: ui.slug || ui.id || ui.productId || '',
    name: ui.name || 'Unnamed',
    description: ui.description || '',
    price: Number(ui.price ?? 0),
    originalPrice: ui.originalPrice,
    category,
    image,
    images,
    stock: Number(ui.stock ?? 0),
    rating: Number(rating ?? 0),
    reviewCount: Number(reviewCount ?? 0),
    featured: Boolean(ui.featured ?? featured),
    tags: ui.tags || [],
    sku: ui.sku,
    status: ui.status,
    sales: ui.sales,
  };

  return product;
}

export type ListProductsParams = {
  category?: string;
  q?: string;
  sort?: string; // e.g. "price,asc" | "price,desc"
  page?: number;
};

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string }> {
    const data = await request<{ jwt: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return { token: data.jwt };
  },

  async register(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role?: 'customer' | 'seller';
  }): Promise<{ token: string }> {
    const data = await request<{ jwt: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return { token: data.jwt };
  },

  async me(): Promise<User> {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');
    const claims = parseJwt(token) || {};
    let role: User['role'] | undefined;
    if (Array.isArray(claims.roles)) {
      role = claims.roles.includes('ADMIN') ? 'admin' : (claims.roles.includes('SELLER') ? 'seller' : 'customer');
    } else if (typeof claims.role === 'string') {
      const r = String(claims.role).toUpperCase();
      role = r === 'ADMIN' ? 'admin' : r === 'SELLER' ? 'seller' : 'customer';
    }
    try {
      const me = await request<{ id: string; email: string; name: string; roles?: string[] }>('/api/auth/me');
      if (!role) {
        const roles = me.roles || [];
        role = roles.includes('ADMIN') ? 'admin' : (roles.includes('SELLER') ? 'seller' : 'customer');
      }
      return { id: me.id, email: me.email, name: me.name, role: role as User['role'] };
    } catch (error) {
      console.warn('api.me() falling back to JWT claims due to error:', error);
      const id = String((claims.sub || claims.userId || claims.id || 'me'));
      const email = String((claims.email || 'user@local'));
      const name = String((claims.name || claims.username || email.split('@')[0] || 'User'));
      return { id, email, name, role: (role || 'customer') as User['role'] };
    }
  },

  // User
  async userMe(): Promise<User> {
    return request('/api/user/me');
  },

  // Addresses (Auth Service)
  async listAddresses(): Promise<Address[]> {
    return request('/api/auth/addresses');
  },
  async createAddress(dto: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> {
    return request('/api/auth/addresses', { method: 'POST', body: JSON.stringify(dto) });
  },
  async updateAddress(id: string, dto: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> {
    return request(`/api/auth/addresses/${id}`, { method: 'PUT', body: JSON.stringify(dto) });
  },
  async deleteAddress(id: string): Promise<void> {
    await request(`/api/auth/addresses/${id}`, { method: 'DELETE' });
  },

  // Orders
  async myOrders(): Promise<any[]> {
    return request('/api/orders');
  },

  // Cart
  async addCartItem(payload: { productId: string; name: string; price: number; quantity: number }): Promise<{ itemCount: number }> {
    const res = await request<{ itemCount: number }>('/api/order/cart/items', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res;
  },

  async getCart(): Promise<{ items: Array<{ id: string; productId: string; name: string; quantity: number; price: number }>; itemCount: number; totalAmount: number }> {
    return request('/api/cart');
  },

  // Catalog - public
  async listProducts(params: ListProductsParams = {}): Promise<Product[]> {
    const qs = new URLSearchParams();
    if (params.category && params.category !== 'all') qs.set('category', params.category);
    if (params.q) qs.set('q', params.q);
    if (params.sort) qs.set('sort', params.sort);
    if (params.page) qs.set('page', String(params.page));
    const data = await request<any[]>(`/api/catalog/products${qs.toString() ? `?${qs.toString()}` : ''}`);
    return (data || []).map((p) => toProduct(p));
  },

  async homeProducts(limit = 8): Promise<Product[]> {
    const data = await request<any[]>(`/api/catalog/home?limit=${limit}`);
    return (data || []).map((p) => toProduct(p, true));
  },

  // Product Detail
  async getProductBySlug(slug: string): Promise<Product> {
    const data = await request<any>(`/api/catalog/products/${slug}`);
    return toProduct(data);
  },

  // Store Detail
  async getStoreBySlug(slug: string): Promise<{
    id: string;
    name: string;
    slug: string;
    bio: string;
    isApproved: boolean;
    rating: number;
    reviewCount: number;
    productCount: number;
    location?: string;
    joinedAt: string;
  }> {
    return request(`/api/catalog/stores/${slug}`);
  },

  async getStoreProducts(storeId: string, params: { sort?: string } = {}): Promise<Product[]> {
    const qs = new URLSearchParams();
    if (params.sort) qs.set('sort', params.sort);
    const data = await request<any[]>(`/api/catalog/stores/${storeId}/products${qs.toString() ? `?${qs.toString()}` : ''}`);
    return (data || []).map((p) => toProduct(p));
  },

  // Cart & Orders
  async addToCart(productId: string, quantity: number): Promise<void> {
    await request('/api/order/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  async checkout(orderData: {
    items: Array<{ productId: string; quantity: number; price: number }>;
    totalAmount: number;
    currency: string;
    shippingAddress: any;
    billingAddress: any;
  }): Promise<{ orderId: string }> {
    return request('/api/order/checkout', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async getMyOrders(): Promise<Array<{
    id: string;
    userId: string;
    totalAmount: number;
    currency: string;
    status: string;
    createdAt: string;
    items: Array<{ productId: string; quantity: number; price: number }>;
  }>> {
    return request('/api/order/my');
  },

  async getOrderById(id: string): Promise<{
    id: string;
    userId: string;
    totalAmount: number;
    currency: string;
    status: string;
    createdAt: string;
    shippingAddress: any;
    billingAddress: any;
    items: Array<{ productId: string; quantity: number; price: number }>;
  }> {
    return request(`/api/order/${id}`);
  },

  // Search
  async search(query: string, type: 'product' | 'store' = 'product'): Promise<any[]> {
    const qs = new URLSearchParams({ q: query, type });
    return request(`/api/search?${qs.toString()}`);
  },

  // Reviews
  async addReview(productId: string, reviewData: {
    rating: number;
    comment: string;
  }): Promise<{
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }> {
    return request('/api/review/', {
      method: 'POST',
      body: JSON.stringify({ productId, ...reviewData }),
    });
  },

  async getProductReviews(productId: string): Promise<Array<{
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>> {
    return request(`/api/review/product/${productId}`);
  },

  // Seller
  async getMyStore(): Promise<any> {
    return request<any>('/api/catalog/my/store');
  },
  async createProduct(payload: {
    name: string;
    price: number;
    currency: 'TRY' | 'USD' | 'EUR';
    stock: number;
    categoryId: string;
    description?: string;
    image?: string;
    attrs?: Record<string, string>;
  }): Promise<{ id: string; slug?: string }> {
    return request('/api/catalog/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async updateProduct(id: string, payload: Partial<{
    name: string;
    price: number;
    currency: 'TRY' | 'USD' | 'EUR';
    stock: number;
    categoryId: string;
    description: string;
    image: string;
    attrs: Record<string, string>;
  }>): Promise<any> {
    return request(`/api/catalog/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  async deleteProduct(id: string): Promise<void> {
    await request(`/api/catalog/products/${id}`, { method: 'DELETE' });
  },

  // Seller Application
  async applyForSeller(userId: string): Promise<void> {
    await request('/api/seller/apply', {
      method: 'POST',
      headers: { 'X-User-Id': userId },
    });
  },
  async listSellerApplications(): Promise<Array<{ id: string; userId: string; status: string }>> {
    return request('/api/seller/applications');
  },
  async updateSellerApplication(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING'): Promise<any> {
    return request(`/api/seller/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Payment
  async initPayment(orderId: string): Promise<{ paymentUrl: string }> {
    return request(`/api/payment/${orderId}/init`, {
      method: 'POST',
    });
  },

  // Admin
  async setProductActive(id: string, isActive: boolean): Promise<any> {
    return request(`/api/catalog/products/${id}/active`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  },
  async listSellers(): Promise<Array<{ id: string; email: string; name: string; roles: string[] }>> {
    const page = await request<{ content: Array<{ id: string; email: string; name: string; roles: string[] }> }>(`/api/auth/users?role=SELLER`);
    return page.content;
  },
  async toggleUserRole(userId: string, enableSeller: boolean): Promise<void> {
    const roles = enableSeller ? ['USER', 'SELLER'] : ['USER'];
    await request(`/api/auth/users/${userId}/roles`, { method: 'PATCH', body: JSON.stringify({ roles }) });
  },
  async listUsers(): Promise<Array<{ id: string; email: string; name: string; roles: string[] }>> {
    const res = await request<any>('/api/auth/users');
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.content)) return res.content;
    return [];
  },
  async deleteUser(id: string): Promise<void> {
    await request(`/api/auth/users/${id}`, { method: 'DELETE' });
  },
  async updateUserRoles(id: string, roles: string[]): Promise<any> {
    return request(`/api/auth/users/${id}/roles`, {
      method: 'PATCH',
      body: JSON.stringify({ roles }),
    });
  },
};

export type { Product };
