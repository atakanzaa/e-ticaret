import { User, Product, Review, DashboardStats } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@demo.com',
    username: 'John Doe',
    role: 'user',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'seller@demo.com',
    username: 'Jane Smith',
    role: 'seller',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    email: 'admin@demo.com',
    username: 'Admin User',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z'
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    username: 'John Doe',
    rating: 5,
    comment: 'Excellent product! Highly recommended.',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    username: 'John Doe',
    rating: 4,
    comment: 'Good quality, fast delivery.',
    createdAt: '2024-01-15T00:00:00Z'
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Wireless Bluetooth Headphones',
    description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 199.99,
    quantity: 50,
    category: 'Electronics',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    sellerId: '2',
    sellerName: 'Jane Smith',
    rating: 4.8,
    reviews: mockReviews,
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '2',
    title: 'Smart Watch Series X',
    description: 'Advanced smartwatch with health monitoring, GPS tracking, and smartphone connectivity. Water-resistant with 7-day battery life.',
    price: 299.99,
    quantity: 30,
    category: 'Electronics',
    images: [
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1697911/pexels-photo-1697911.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    sellerId: '2',
    sellerName: 'Jane Smith',
    rating: 4.6,
    reviews: [],
    createdAt: '2024-01-08T00:00:00Z'
  },
  {
    id: '3',
    title: 'Organic Coffee Beans',
    description: 'Premium organic coffee beans sourced from sustainable farms. Rich flavor profile with notes of chocolate and caramel.',
    price: 24.99,
    quantity: 100,
    category: 'Food & Beverage',
    images: [
      'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    sellerId: '2',
    sellerName: 'Jane Smith',
    rating: 4.9,
    reviews: [],
    createdAt: '2024-01-12T00:00:00Z'
  },
  {
    id: '4',
    title: 'Vintage Leather Backpack',
    description: 'Handcrafted vintage leather backpack with multiple compartments. Perfect for travel, work, or everyday use.',
    price: 149.99,
    quantity: 25,
    category: 'Fashion',
    images: [
      'https://images.pexels.com/photos/1545558/pexels-photo-1545558.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    sellerId: '2',
    sellerName: 'Jane Smith',
    rating: 4.7,
    reviews: [],
    createdAt: '2024-01-18T00:00:00Z'
  }
];

export const mockDashboardStats: DashboardStats = {
  dailySales: 15420.50,
  totalUsers: 1250,
  totalSellers: 89,
  totalProducts: 450,
  profitLoss: 8930.25
};