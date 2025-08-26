import { useState } from 'react';
import { authApi } from '../services/authApi.js';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validaciones básicas
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }
      
      if (!email.includes('@')) {
        throw new Error('Email inválido');
      }
      
      if (password.length < 3) {
        throw new Error('La contraseña debe tener al menos 3 caracteres');
      }
      
      // Llamada a la API
      const result = await authApi.login(email, password);
      
      // Guardar token si existe
      if (result.token) {
        authApi.storeToken(result.token);
      }
      
      return result;
      
    } catch (err) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.removeToken();
    localStorage.removeItem('user');
  };

  return {
    login,
    logout,
    isLoading,
    error,
    isAuthenticated: authApi.isAuthenticated()
  };
};
