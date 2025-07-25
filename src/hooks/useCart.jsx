/* eslint-disable react-refresh/only-export-components */
// hooks/useCart.js - Enhanced cart management with better performance and error handling
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { LOCAL_STORAGE_KEYS, MESSAGES } from '../constants/index.js';
import { getStorageItem, setStorageItem } from '../utils/helpers.js';
import { notification } from 'antd';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    return getStorageItem(LOCAL_STORAGE_KEYS.CART, []);
  });

  const [isLoading, setIsLoading] = useState(false);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    setStorageItem(LOCAL_STORAGE_KEYS.CART, cart);
  }, [cart]);

  // Memoized calculations for better performance
  const { totalItems, totalPrice, uniqueItems } = useMemo(() => {
    const items = cart.reduce((sum, item) => sum + item.quantity, 0);
    const price = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const unique = cart.length;
    
    return {
      totalItems: items,
      totalPrice: price,
      uniqueItems: unique
    };
  }, [cart]);

  // Check if product is in cart
  const isInCart = useCallback((productId) => {
    return cart.some(item => item.id === productId);
  }, [cart]);

  // Get cart item by product ID
  const getCartItem = useCallback((productId) => {
    return cart.find(item => item.id === productId);
  }, [cart]);

  // Add product to cart with enhanced logic
  const addToCart = useCallback((product, quantity = 1) => {
    if (!product || !product.id) {
      notification.error({
        message: 'Error',
        description: 'Invalid product data',
        placement: 'topRight'
      });
      return;
    }

    if (product.stock < quantity) {
      notification.warning({
        message: 'Insufficient Stock',
        description: `Only ${product.stock} items available`,
        placement: 'topRight'
      });
      return;
    }

    setIsLoading(true);
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        
        if (newQuantity > product.stock) {
          notification.warning({
            message: 'Stock Limit',
            description: `Cannot add more than ${product.stock} items`,
            placement: 'topRight'
          });
          return prevCart;
        }
        
        const updatedCart = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
        
        notification.success({
          message: 'Updated Cart',
          description: `${product.name} quantity updated`,
          placement: 'topRight'
        });
        
        return updatedCart;
      }
      
      const newCart = [...prevCart, { 
        ...product, 
        quantity,
        addedAt: new Date().toISOString()
      }];
      
      notification.success({
        message: 'Added to Cart',
        description: `${product.name} ${MESSAGES.ADDED_TO_CART}`,
        placement: 'topRight'
      });
      
      return newCart;
    });
    
    setIsLoading(false);
  }, []);

  // Remove product from cart
  const removeFromCart = useCallback((productId, showNotification = true) => {
    setCart(prevCart => {
      const itemToRemove = prevCart.find(item => item.id === productId);
      const newCart = prevCart.filter(item => item.id !== productId);
      
      if (showNotification && itemToRemove) {
        notification.success({
          message: 'Removed from Cart',
          description: `${itemToRemove.name} ${MESSAGES.REMOVED_FROM_CART}`,
          placement: 'topRight'
        });
      }
      
      return newCart;
    });
  }, []);

  // Update quantity with validation
  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          if (newQuantity > item.stock) {
            notification.warning({
              message: 'Stock Limit',
              description: `Only ${item.stock} items available`,
              placement: 'topRight'
            });
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  }, [removeFromCart]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart([]);
    notification.success({
      message: 'Cart Cleared',
      description: MESSAGES.CART_CLEARED,
      placement: 'topRight'
    });
  }, []);

  // Increment quantity
  const incrementQuantity = useCallback((productId) => {
    const item = getCartItem(productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  }, [getCartItem, updateQuantity]);

  // Decrement quantity
  const decrementQuantity = useCallback((productId) => {
    const item = getCartItem(productId);
    if (item) {
      updateQuantity(productId, item.quantity - 1);
    }
  }, [getCartItem, updateQuantity]);

  // Get cart summary for checkout
  const getCartSummary = useCallback(() => {
    return {
      items: cart,
      totalItems,
      totalPrice,
      uniqueItems,
      isEmpty: cart.length === 0,
      subtotal: totalPrice,
      tax: totalPrice * 0.1, // 10% tax
      shipping: totalPrice > 50 ? 0 : 5.99, // Free shipping over $50
      total: totalPrice + (totalPrice * 0.1) + (totalPrice > 50 ? 0 : 5.99)
    };
  }, [cart, totalItems, totalPrice, uniqueItems]);

  const contextValue = {
    // State
    cart,
    totalItems,
    totalPrice,
    uniqueItems,
    isLoading,
    
    // Utility functions
    isInCart,
    getCartItem,
    getCartSummary,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    incrementQuantity,
    decrementQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>
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
