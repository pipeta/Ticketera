import { useState, useEffect, useCallback } from 'react';
import { cartApi } from '../services/cartApi.js';

export const useCart = (user) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartExpiration, setCartExpiration] = useState(null);

  const userId = user?.id;

  // Cargar items del carrito
  const fetchCartItems = useCallback(async () => {
    if (!userId) {
      console.log('📝 No user, clearing cart');
      setCartItems([]);
      setCartExpiration(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching cart for user:', userId);
      const items = await cartApi.getItems(userId);
      
      console.log('✅ Cart items received:', items);
      setCartItems(Array.isArray(items) ? items : []);
      
      // Si hay items, calcular expiración (3 minutos desde ahora para las pruebas)
      if (items && items.length > 0) {
        const expirationTime = new Date(Date.now() + 3 * 60 * 1000); // 3 minutos
        setCartExpiration(expirationTime);
        console.log('⏰ Cart expires at:', expirationTime.toLocaleTimeString());
      } else {
        setCartExpiration(null);
        console.log('📭 Cart is empty, no expiration');
      }
      
    } catch (err) {
      console.error('❌ Error loading cart:', err);
      setError(err.message);
      setCartItems([]); // En caso de error, mostrar carrito vacío
      setCartExpiration(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Agregar item al carrito
  const addToCart = async (ticketStockId, quantity = 1) => {
    if (!userId) {
      throw new Error('Debes iniciar sesión para agregar al carrito');
    }

    try {
      setError(null);
      console.log('➕ Adding to cart:', { ticketStockId, quantity });
      
      await cartApi.addItem(userId, ticketStockId, quantity);
      await fetchCartItems(); // Recargar carrito
      
      console.log('✅ Item added successfully');
      return true;
    } catch (err) {
      console.error('❌ Error adding to cart:', err);
      setError(err.message);
      throw err;
    }
  };

  // Eliminar item del carrito
  const removeFromCart = async (ticketStockId) => {
    if (!userId) return;

    try {
      setError(null);
      console.log('➖ Removing from cart:', ticketStockId);
      
      await cartApi.removeItem(userId, ticketStockId);
      await fetchCartItems(); // Recargar carrito
      
      console.log('✅ Item removed successfully');
      return true;
    } catch (err) {
      console.error('❌ Error removing from cart:', err);
      setError(err.message);
      throw err;
    }
  };

  // Checkout del carrito
  const checkout = async (buyerFullname, buyerEmail) => {
    if (!userId) {
      throw new Error('Debes iniciar sesión para finalizar la compra');
    }

    if (!cartItems || cartItems.length === 0) {
      throw new Error('El carrito está vacío');
    }

    try {
      setError(null);
      console.log('💳 Starting checkout...');
      
      await cartApi.checkout(userId, buyerFullname, buyerEmail);
      
      // Limpiar carrito local después del checkout exitoso
      setCartItems([]);
      setCartExpiration(null);
      
      console.log('✅ Checkout completed successfully');
      return true;
    } catch (err) {
      console.error('❌ Error during checkout:', err);
      setError(err.message);
      throw err;
    }
  };

  // Verificar si el carrito está expirado
  const isCartExpired = () => {
    return cartExpiration && new Date() > cartExpiration;
  };

  // Tiempo restante en minutos
  const getTimeRemaining = () => {
    if (!cartExpiration) return 0;
    const diff = cartExpiration.getTime() - new Date().getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60)));
  };

  // Auto-refresh del carrito cada 30 segundos
  useEffect(() => {
    if (!userId) {
      setCartItems([]);
      return;
    }

    console.log('🔄 Setting up cart auto-refresh for user:', userId);
    fetchCartItems();
    
    const interval = setInterval(() => {
      if (!isCartExpired()) {
        console.log('🔄 Auto-refreshing cart...');
        fetchCartItems();
      }
    }, 30000); // 30 segundos

    return () => {
      console.log('🛑 Cleaning up cart interval');
      clearInterval(interval);
    };
  }, [userId, fetchCartItems]);

  // Auto-limpiar carrito cuando expire
  useEffect(() => {
    if (isCartExpired() && cartItems.length > 0) {
      console.log('⏰ Cart expired, clearing items');
      setCartItems([]);
      setCartExpiration(null);
    }
  }, [cartExpiration, cartItems.length]);

  return {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    checkout,
    refreshCart: fetchCartItems,
    isCartExpired: isCartExpired(),
    timeRemaining: getTimeRemaining(),
    itemCount: cartItems ? cartItems.length : 0
  };
};