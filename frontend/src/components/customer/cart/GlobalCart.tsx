import { createContext, useContext, useState, ReactNode } from "react";
import { AIResponse, Product } from "../../../services/Props";

export interface CartItem extends Product {
    quantity: number;
    total_amount: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Product, quantity?: number, scannedID?: number) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, newQuantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    scannedID: number | undefined;
    setScannedID: (id: number) => void; 
    extractedText: AIResponse['extractedText'] | undefined;
    setExtractedText: (extractedText: AIResponse['extractedText'] | undefined) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scannedID, setScannedID] = useState<number | undefined>();
  const [extractedText, setExtractedText] = useState<AIResponse['extractedText'] | undefined>();  

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id 
            ? { ...i, quantity: i.quantity + quantity, total_amount: i.price * (i.quantity + quantity) } 
            : i
        );
      }
      return [...prev, { ...product, quantity, total_amount: product.price * quantity }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const updateQuantity = (id: number, newQuantity: number) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.id === id) {
          return { ...i, quantity: Math.max(0, newQuantity), total_amount: i.price * Math.max(0, newQuantity) };
        }
        return i;
      });
    });
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, 
    clearCart, getTotalItems, scannedID, setScannedID, extractedText, setExtractedText }}>

      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
