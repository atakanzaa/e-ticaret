export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'seller' | 'admin';
  // compatibility fields for older components
  username?: string;
  createdAt?: string;
  isActive?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  tags?: string[];
  sku?: string;
  status?: string;
  sales?: number;
  // compatibility fields used by some components/mock data
  title?: string;
  quantity?: number;
  reviews?: Review[];
  sellerId?: string;
  sellerName?: string;
}

export interface Address {
  id: string;
  type: 'SHIPPING' | 'BILLING';
  recipientName: string;
  phone?: string;
  country: string;
  state?: string;
  city: string;
  postalCode: string;
  streetLine1: string;
  streetLine2?: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  id?: string;
  productId: string;
  quantity: number;
  product: Product;
  // Additional fields for compatibility
  name?: string;
  title?: string;
  image?: string;
  unitPrice?: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface Store {
  id: string;
  sellerId: string;
  name: string;
  logo?: string;
  description: string;
}

export interface DashboardStats {
  dailySales: number;
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  profitLoss: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}