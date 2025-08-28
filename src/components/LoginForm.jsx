

import React, { useState } from 'react';
import { X, LogIn, Eye, EyeOff, Mail, Lock, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LoginForm = ({ setUser, setShowLogin, showNotification }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    try {
      
      const result = await login(email, password);
      
    
      setUser(result.user);
      setShowLogin(false);
      showNotification(`¡Bienvenido ${result.user.name}!`);
      
    
      setEmail('');
      setPassword('');
      
    } catch (err) {
     
      console.error('Error en login:', err);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@ticketapp.com');
    setPassword('demo123');
  };

  
  const handleTestLogin = () => {
    setEmail('test@example.com');
    setPassword('password123');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-bounce-in shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h2>
            <p className="text-gray-600">Conecta con la API real</p>
          </div>
          <button 
            onClick={() => setShowLogin(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Estado de conexión API */}
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              API: {import.meta.env.VITE_API_BASE_URL}/auth/login
            </span>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Error de autenticación</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="space-y-6">
          
          {/* Campo Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                placeholder="tu@email.com"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                placeholder="••••••••"
                disabled={isLoading}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Botón de Login */}
          <button
            onClick={handleLogin}
            disabled={isLoading || !email || !password}
            className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>

          {/* Botones de prueba */}
          <div className="space-y-2">
            <button
              onClick={handleTestLogin}
              disabled={isLoading}
              className="w-full bg-green-100 text-green-700 py-3 rounded-xl hover:bg-green-200 transition-colors font-medium disabled:opacity-50"
            >
              🧪 Usar credenciales de prueba
            </button>
            
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
            >
              🎭 Modo demo (sin API)
            </button>
          </div>

          {/* Información adicional */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Crear cuenta
              </button>
            </p>
            
            {import.meta.env.DEV && (
              <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
                <strong>Dev Info:</strong><br/>
                API espera: {`{"email": "string", "password": "string"}`}<br/>
                Respuesta: {`{"message": "Login exitoso"}`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;