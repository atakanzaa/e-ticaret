/* Lightweight API client with auth and helpers */
import { Product, User } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8080';

function getAuthToken(): string | null {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };

  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
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
  async me(): Promise<User> {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');
    const me = await request<{ id: string; email: string; name: string; roles: string[] }>('/api/auth/me');
    const role: User['role'] = (me.roles || []).includes('ADMIN')
      ? 'admin'
      : (me.roles || []).includes('SELLER')
      ? 'seller'
      : 'customer';
    return { id: me.id, email: me.email, name: me.name, role };
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

  // Admin
  async setProductActive(id: string, isActive: boolean): Promise<any> {
    return request(`/api/catalog/products/${id}/active`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  },
  async listUsers(): Promise<Array<{ id: string; email: string; name: string; roles: string[] }>> {
    return request('/api/auth/users');
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


