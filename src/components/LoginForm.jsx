import React, { useState } from 'react';
import { X, LogIn, Eye, EyeOff, Mail, Lock } from 'lucide-react';

const LoginForm = ({ setUser, setShowLogin, showNotification }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showNotification('Por favor completa todos los campos', 'error');
      return;
    }

    setIsLoading(true);
    
    // Simulación de llamada a API
    setTimeout(() => {
      const userName = email.split('@')[0];
      const user = { 
        name: userName.charAt(0).toUpperCase() + userName.slice(1), 
        email: email,
        id: Date.now(),
        joinDate: new Date().toISOString()
      };
      
      setUser(user);
      setShowLogin(false);
      showNotification(`¡Bienvenido ${user.name}!`);
      setEmail('');
      setPassword('');
      setIsLoading(false);
    }, 1500);
  };

  const handleDemoLogin = () => {
    setEmail('demo@ticketapp.com');
    setPassword('demo123');
    setTimeout(() => handleLogin(), 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-bounce-in shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Bienvenido</h2>
            <p className="text-gray-600">Inicia sesión para continuar</p>
          </div>
          <button 
            onClick={() => setShowLogin(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Form */}
        <div className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="tu@email.com"
                disabled={isLoading}
              />
            </div>
          </div>
          
          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading || !email || !password}
            className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>
          
          {/* Demo Button */}
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium disabled:opacity-50"
          >
            Probar con cuenta demo
          </button>
          
          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Crear cuenta
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;