import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { menServices } from "../../pages/user/Menservices";
import { femaleServices } from "../../pages/user/Femaleservices";
import { kidsservices } from "../../pages/user/Kidsservices";

const STORAGE_KEY = "dobhivala_cart_v2";
const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  const allServices = useMemo(
    () => [...menServices, ...femaleServices, ...kidsservices],
    []
  );

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = allServices.find((service) => String(service.id) === String(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        setCart({});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (id) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const removeFromCart = (id) => {
    setCart((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      if (prev[id] - 1 <= 0) delete next[id];
      else next[id] = prev[id] - 1;
      return next;
    });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, totalItems, subtotal, allServices }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
