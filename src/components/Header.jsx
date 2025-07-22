import React from 'react';
import { ShoppingCart, User, LogIn, LogOut, Ticket, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = ({ 
  currentPage,
  setCurrentPage, 
  user, 
  setUser, 
  cart, 
  setShowLogin,
  showNotification 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('events');
    showNotification('Sesión cerrada correctamente');
    setMobileMenuOpen(false);
  };

  const navigation = [
    {
      name: 'Eventos',
      icon: Home,
      page: 'events',
      show: true
    },
    {
      name: 'Mis Tickets',
      icon: Ticket,
      page: 'tickets',
      show: !!user
    }
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setCurrentPage('events')}
              className="flex items-center space-x-2 text-2xl font-bold text-gradient hover:scale-105 transition-transform duration-200"
            >
              <span className="text-3xl">🎫</span>
              <span>TicketApp</span>
            </button>
          </div>
          
          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => 
              item.show && (
                <button
                  key={item.page}
                  onClick={() => setCurrentPage(item.page)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === item.page || 
                    (item.page === 'events' && currentPage === 'event-detail')
                      ? 'bg-blue-100 text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.name}</span>
                </button>
              )
            )}
          </nav>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Cart Button */}
            <button
              onClick={() => setCurrentPage('cart')}
              className={`relative p-3 rounded-xl transition-all duration-200 ${
                currentPage === 'cart'
                  ? 'bg-blue-100 text-blue-600 shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-bounce-in">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            {/* User Section */}
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-xl">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Hola, {user.name.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors p-2 rounded-xl hover:bg-red-50"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="hidden md:flex items-center space-x-2 btn-primary"
              >
                <LogIn className="h-4 w-4" />
                <span>Iniciar Sesión</span>
              </button>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-slide-up">
            <div className="space-y-2">
              {navigation.map((item) => 
                item.show && (
                  <button
                    key={item.page}
                    onClick={() => {
                      setCurrentPage(item.page);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      currentPage === item.page
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                )
              )}
              
              {user ? (
                <div className="pt-4 border-t border-gray-200">
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Conectado como: {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Iniciar Sesión</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;