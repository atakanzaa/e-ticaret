import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { api } from '../api/client';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [backendItemCount, setBackendItemCount] = useState<number | null>(null);

  const addToCart = async (product: Product, quantity = 1) => {
    try {
      await api.addCartItem({ productId: product.id, name: product.name || (product as any).title, price: product.price, quantity });
      // refresh count from backend
      const cart = await api.getCart();
      if (typeof cart.itemCount === 'number') setBackendItemCount(cart.itemCount);
    } catch (e) {
      // optimistic update even if backend fails
    }
    setItems(current => {
      const existingItem = current.find(item => item.productId === product.id);
      if (existingItem) {
        return current.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...current, { productId: product.id, quantity, product }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(current => current.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(current =>
      current.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = backendItemCount ?? items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    (async () => {
      try {
        const cart = await api.getCart();
        if (typeof cart.itemCount === 'number') setBackendItemCount(cart.itemCount);
      } catch {}
    })();
  }, []);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}