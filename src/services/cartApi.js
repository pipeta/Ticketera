import { API_CONFIG } from '../config/api.js';

export const cartApi = {
  
  getTicketStocks: async (eventId) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/tickets/${eventId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();
      console.log('📋 Ticket stocks:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching ticket stocks:', error);
      throw error;
    }
  },


  addToCart: async (ticketStockId, quantity = 1) => {
    try {
     
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        throw new Error('Usuario no autenticado');
      }

      const cartItem = {
        user_id: user.id,
        ticket_stock_id: ticketStockId, 
        quantity: quantity
      };

      console.log('➕ Adding to cart:', cartItem);

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Item added to cart:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      throw error;
    }
  },

  getCart: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        return [];
      }

      console.log('🛒 Fetching cart for user:', user.id);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/cart/cart?user_id=${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Cart items received:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error fetching cart:', error);
      return [];
    }
  },


  removeFromCart: async (ticketStockId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        throw new Error('Usuario no autenticado');
      }

      console.log('🗑️ Removing from cart:', ticketStockId);

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/cart/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          ticket_stock_id: ticketStockId
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      console.log('✅ Item removed from cart');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Error removing from cart:', error);
      throw error;
    }
  },

 
  checkout: async (buyerFullname, buyerEmail) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        throw new Error('Usuario no autenticado');
      }

      const checkoutData = {
        user_id: user.id,
        buyer_fullname: buyerFullname,
        buyer_email: buyerEmail
      };

      console.log('💳 Processing checkout:', checkoutData);

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/cart/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Checkout successful:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Error during checkout:', error);
      throw error;
    }
  },

  
  getCartCount: async () => {
    try {
      const cartItems = await cartApi.getCart();
      const count = cartItems.reduce((total, item) => {
        const itemQuantity = item.items?.[0]?.ticket?.quantity || 0;
        return total + itemQuantity;
      }, 0);
      return count;
    } catch (error) {
      console.error('❌ Error getting cart count:', error);
      return 0;
    }
  }
};