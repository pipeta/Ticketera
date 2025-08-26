import { API_CONFIG } from '../config/api.js';

const cartRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  try {
    console.log(`🛒 ${options.method || 'GET'} ${url}`);
    if (options.body) {
      console.log('📤 Body:', JSON.parse(options.body));
    }
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log(`📥 Response: ${response.status} ${response.statusText}`);
    
    // 🔥 FIX PRINCIPAL: Leer el contenido SOLO UNA VEZ
    let responseText;
    try {
      responseText = await response.text();
      console.log('📄 Raw response:', responseText);
    } catch (readError) {
      console.error('❌ Error reading response:', readError);
      throw new Error('Error al leer respuesta del servidor');
    }

    // Verificar si la respuesta es exitosa DESPUÉS de leer
    if (!response.ok) {
      console.error('❌ Error response:', responseText);
      throw new Error(responseText || `Error ${response.status}: ${response.statusText}`);
    }

    // Intentar parsear como JSON, si falla usar como texto plano
    let result;
    if (responseText.trim()) {
      try {
        result = JSON.parse(responseText);
        console.log('✅ JSON parsed:', result);
      } catch (jsonError) {
        console.log('⚠️ Not JSON, using as text:', responseText);
        result = { 
          message: responseText, 
          success: true,
          data: responseText 
        };
      }
    } else {
      // Respuesta vacía
      result = { success: true, data: [] };
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Cart API Error:', error);
    throw new Error(error.message || 'Error de conexión con el carrito');
  }
};

export const cartApi = {
  // GET /cart?user_id={id} - Obtener items del carrito
  getItems: async (userId) => {
    if (!userId) {
      console.log('⚠️ No user ID provided, returning empty cart');
      return [];
    }
    
    try {
      const result = await cartRequest(`/cart/cart?user_id=${userId}`);
      
      // El backend devuelve un array directamente o dentro de 'data'
      if (Array.isArray(result)) {
        return result;
      } else if (Array.isArray(result.data)) {
        return result.data;
      } else {
        console.log('⚠️ Unexpected response format:', result);
        return [];
      }
    } catch (error) {
      console.error('❌ Error getting cart items:', error);
      return []; // Devolver array vacío en caso de error
    }
  },

  // POST /cart - Agregar item al carrito
  addItem: async (userId, ticketStockId, quantity) => {
    return await cartRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        ticket_stock_id: ticketStockId,
        quantity: quantity
      }),
    });
  },

  // POST /cart/remove - Eliminar item del carrito
  removeItem: async (userId, ticketStockId) => {
    return await cartRequest('/cart/remove', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        ticket_stock_id: ticketStockId
      }),
    });
  },

  // POST /cart/checkout - Realizar checkout
  checkout: async (userId, buyerFullname, buyerEmail) => {
    return await cartRequest('/cart/checkout', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        buyer_fullname: buyerFullname,
        buyer_email: buyerEmail
      }),
    });
  }
};