// src/services/authApi.js (VERSIÓN CORREGIDA)
import { API_CONFIG } from '../config/api.js';

const authRequest = async (endpoint, data) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  try {
    console.log('🔐 Auth request to:', url);
    console.log('📤 Sending data:', data);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    console.log('📥 Response status:', response.status);
    
    // Leer el contenido SOLO UNA VEZ
    let responseText;
    try {
      responseText = await response.text();
      console.log('📄 Raw response:', responseText);
    } catch (readError) {
      console.error('❌ Error reading response:', readError);
      throw new Error('Error al leer respuesta del servidor');
    }

    // IMPORTANTE: No lanzar error si el status es 200
    // El backend puede devolver 200 con datos válidos
    
    // Intentar parsear como JSON
    let result;
    if (responseText.trim()) {
      try {
        result = JSON.parse(responseText);
        console.log('✅ JSON parsed:', result);
      } catch (jsonError) {
        console.log('⚠️ Not JSON, using as text:', responseText);
        result = { 
          message: responseText, 
          success: true 
        };
      }
    } else {
      result = { success: true };
    }
    
    // Solo lanzar error si el status NO es exitoso (no es 2xx)
    if (!response.ok) {
      console.error('❌ Error response:', result);
      throw new Error(result.message || result.error || `Error ${response.status}: ${response.statusText}`);
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Auth request failed:', error);
    throw new Error(error.message || 'Error de conexión');
  }
};

export const authApi = {
  login: async (email, password) => {
    const loginData = {
      email: email,
      password: password
    };
    
    try {
      const response = await authRequest('/auth/login', loginData);
      
      console.log('✅ Login response processed:', response);
      
      // Verificar si el login fue exitoso basándose en la respuesta
      // Si el backend devuelve id, name y email, es exitoso
      const isSuccess = response && (response.id || response.name || response.email);
      
      // Si el backend devuelve un error explícito
      if (response.error || response.status === 'error') {
        throw new Error(response.message || response.error || 'Credenciales incorrectas');
      }
      
      // Si no hay datos de usuario en la respuesta
      if (!isSuccess) {
        console.error('❌ Invalid response structure:', response);
        throw new Error('Respuesta inválida del servidor');
      }
      
      // Usar datos reales del backend
      const normalizedResponse = {
        success: true,
        message: 'Login exitoso',
        user: {
          id: response.id || response.user_id || 'unknown',
          name: response.name || response.username || 'Usuario',
          email: response.email || email, // Usar el email del login si no viene en respuesta
          loginTime: new Date().toISOString()
        },
        token: response.token || `token_${Date.now()}` // Usar token del backend si existe
      };
      
      // Guardar el token
      if (normalizedResponse.token) {
        authApi.storeToken(normalizedResponse.token);
      }
      
      // Guardar información del usuario
      localStorage.setItem('user', JSON.stringify(normalizedResponse.user));
      
      console.log('✅ User stored:', normalizedResponse.user);
      console.log('✅ Login successful!');
      
      return normalizedResponse;
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  },

  register: async (name, secondName, email, password) => {
    const registerData = {
      name: name,
      second_name: secondName,
      email: email,
      password: password
    };
    
    try {
      const response = await authRequest('/users', registerData);
      
      console.log('✅ Register response processed:', response);
      
      // Verificar si el registro fue exitoso
      const isSuccess = response && (response.id || response.name || response.email);
      
      // Si el backend devuelve un error explícito
      if (response.error || response.status === 'error') {
        throw new Error(response.message || response.error || 'Error en el registro');
      }
      
      if (!isSuccess) {
        throw new Error('Respuesta inválida del servidor');
      }
      
      return {
        success: true,
        message: response.message || 'Usuario creado exitosamente',
        user: {
          id: response.id,
          name: response.name || name,
          email: response.email || email
        }
      };
      
    } catch (error) {
      console.error('❌ Register failed:', error);
      throw error;
    }
  },

  logout: () => {
    try {
      authApi.removeToken();
      localStorage.removeItem('user');
      console.log('✅ Logout successful');
      return { success: true, message: 'Sesión cerrada correctamente' };
    } catch (error) {
      console.error('❌ Logout error:', error);
      return { success: false, message: 'Error al cerrar sesión' };
    }
  },

  // Funciones helper
  getStoredToken: () => localStorage.getItem('auth_token'),
  
  storeToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token);
    }
  },
  
  removeToken: () => localStorage.removeItem('auth_token'),
  
  isAuthenticated: () => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    return !!(token || user);
  },
  
  getCurrentUser: () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
      return null;
    }
  }
};

// ===============================================
// 🧪 FUNCIÓN DE TEST PARA DEBUGGING
// ===============================================

export const testAuth = async () => {
  console.log('🧪 Testing auth with real backend...');
  
  try {
    // Probar login con las credenciales que estás usando
    const result = await authApi.login('cristhianzabireyes@gmail.com', '666');
    console.log('✅ Test login successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Test login failed:', error);
    return { error: error.message };
  }
};