import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as apiAddToCart, removeCartItem as apiRemoveCartItem, validatePromoCode } from '../api/cartApi';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], count: 0, subtotal: 0 });
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMessage, setPromoMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = async () => {
    setIsLoading(true);
    try {
      const data = await getCart();
      setCart(data);
    } catch (e) {
      console.warn('Refresh cart error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addItem = async (payload) => {
    setIsLoading(true);
    try {
      const addedItem = await apiAddToCart(payload);
      await refreshCart();
      return addedItem;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    setIsLoading(true);
    try {
      await apiRemoveCartItem(itemId);
      await refreshCart();
    } finally {
      setIsLoading(false);
    }
  };

  const applyPromo = async (code) => {
    if (!code || !code.trim()) return;
    const subtotal = cart.subtotal || 0;
    try {
      const result = await validatePromoCode(code, subtotal);
      if (result.valid) {
        setAppliedPromo(result);
        setPromoMessage({ text: result.message, isError: false });
        return { success: true, message: result.message };
      } else {
        setPromoMessage({ text: result.message || 'Invalid coupon code', isError: true });
        return { success: false, message: result.message };
      }
    } catch (err) {
      const fallbackMsg = 'Could not verify coupon.';
      setPromoMessage({ text: fallbackMsg, isError: true });
      return { success: false, message: fallbackMsg };
    }
  };

  const clearPromo = () => {
    setAppliedPromo(null);
    setPromoMessage(null);
  };

  const clearCart = () => {
    setCart({ items: [], count: 0, subtotal: 0 });
    clearPromo();
  };

  // Pricing calculations
  const subtotal = cart.subtotal || 0;
  const discountAmount = appliedPromo?.discount_amount
    ? Number(appliedPromo.discount_amount)
    : appliedPromo?.discount_percent
    ? (subtotal * appliedPromo.discount_percent) / 100
    : 0;
  const isFreeShipping = subtotal >= 500 || subtotal === 0 || appliedPromo?.freeShipping;
  const shippingFee = isFreeShipping ? 0 : 50;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount: cart.items?.length || 0,
        subtotal,
        discountAmount,
        shippingFee,
        grandTotal,
        appliedPromo,
        promoMessage,
        isLoading,
        refreshCart,
        addItem,
        removeItem,
        applyPromo,
        clearPromo,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
