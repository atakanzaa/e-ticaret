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

export interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
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