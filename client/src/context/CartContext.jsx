import { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.productId === product.id);
      if (existing) {
        return prev.map((it) =>
          it.productId === product.id
            ? { ...it, quantity: it.quantity + quantity }
            : it
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity
        }
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setItems((prev) =>
      prev
        .map((it) =>
          it.productId === productId ? { ...it, quantity } : it
        )
        .filter((it) => it.quantity > 0)
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((it) => it.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const total = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items]
  );

  const value = {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    total
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return ctx;
}

