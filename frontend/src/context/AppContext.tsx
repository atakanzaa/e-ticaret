import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Product, CartItem, Order, Notification } from '../types';

interface AppState {
  user: User | null;
  cart: CartItem[];
  orders: Order[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  products: Product[];
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: { orderId: string; updates: Partial<Order> } }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp' | 'read'> }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_SORT_BY'; payload: string }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  user: null,
  cart: [],
  orders: [],
  notifications: [],
  loading: false,
  error: null,
  isAuthenticated: false,
  products: [],
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'featured',
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload,
        isAuthenticated: !!action.payload 
      };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.product.id === action.payload.product.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload),
      };
    
    case 'UPDATE_CART_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.product.id !== action.payload.productId),
        };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, ...action.payload.updates }
            : order
        ),
      };
    
    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        ...action.payload,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        read: false,
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    
    case 'LOGOUT':
      localStorage.removeItem('auth_token');
      return {
        ...initialState,
        cart: state.cart, // Keep cart for guest users
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        cartItems.forEach((item: CartItem) => {
          dispatch({ type: 'ADD_TO_CART', payload: item });
        });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state.cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.cart]);

  // Check for existing auth token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Helper hooks
export function useAuth() {
  const { state, dispatch } = useApp();
  
  const login = (token: string, user: User) => {
    localStorage.setItem('auth_token', token);
    dispatch({ type: 'SET_USER', payload: user });
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
  };
  
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };
  
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    login,
    logout,
  };
}

export function useCart() {
  const { state, dispatch } = useApp();
  
  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { 
        type: 'success', 
        title: 'Ürün Eklendi', 
        message: `${product.name} sepete eklendi` 
      } 
    });
  };
  
  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const cartTotal = state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartItemCount = state.cart.reduce((count, item) => count + item.quantity, 0);
  
  return {
    cart: state.cart,
    cartTotal,
    cartItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}

export function useNotifications() {
  const { state, dispatch } = useApp();
  
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };
  
  const markAsRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };
  
  const clearAll = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };
  
  const unreadCount = state.notifications.filter(n => !n.read).length;
  
  return {
    notifications: state.notifications,
    unreadCount,
    addNotification,
    markAsRead,
    clearAll,
  };
}
