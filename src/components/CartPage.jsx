import  { useState } from 'react';
import { ShoppingCart, Plus, Minus, X, CreditCard, Trash2, ArrowRight, AlertCircle, Tag, Clock, Timer, User, Mail } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const CartPage = ({ 
  user, 
  setShowLogin, 
  setCurrentPage, 
  showNotification 
}) => {
  const { 
    cartItems, 
    loading, 
    error, 
    removeFromCart, 
    checkout, 
    refreshCart,
    isCartExpired,
    timeRemaining
  } = useCart(user);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [buyerFullname, setBuyerFullname] = useState(user?.name || '');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');

 
  const subtotal = cartItems.reduce((sum, item) => {
    
    const price = 25000; 
    return sum + (price * item.quantity);
  }, 0);

  const serviceFee = Math.floor(subtotal * 0.05);
  const total = subtotal + serviceFee;


  const handleRemoveItem = async (ticketStockId) => {
    try {
      await removeFromCart(ticketStockId);
      showNotification('Producto eliminado del carrito');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

 
  const handleCheckout = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    if (!buyerFullname || !buyerEmail) {
      showNotification('Completa todos los campos', 'error');
      return;
    }

    try {
      setIsCheckingOut(true);
      await checkout(buyerFullname, buyerEmail);
      
      showNotification('¡Compra realizada con éxito!');
      setTimeout(() => {
        setCurrentPage('tickets');
      }, 1500);
      
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="card max-w-md mx-auto">
          <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-400 mb-4">Inicia sesión</h3>
          <p className="text-gray-500 mb-8">Debes iniciar sesión para ver tu carrito</p>
          <button
            onClick={() => setShowLogin(true)}
            className="btn-primary"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header con timer */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Carrito de Compras</h1>
            <p className="text-gray-600">Revisa tus tickets antes de finalizar la compra</p>
          </div>
          
          {/* Timer de expiración */}
          {cartItems.length > 0 && !isCartExpired && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 flex items-center space-x-2">
              <Timer className="h-5 w-5 text-yellow-600" />
              <div className="text-sm">
                <span className="font-medium text-yellow-800">Tiempo restante:</span>
                <span className="text-yellow-700 ml-1">{timeRemaining} minutos</span>
              </div>
            </div>
          )}
        </div>

        {/* Alerta de carrito expirado */}
        {isCartExpired && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-800 font-medium">Tu carrito ha expirado</span>
            </div>
            <p className="text-red-700 text-sm mt-1">Los tickets han sido devueltos al stock. Agrega nuevamente los que desees.</p>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando carrito...</p>
        </div>
      ) : cartItems.length === 0 ? (
        /* Carrito vacío */
        <div className="text-center py-16">
          <div className="card max-w-md mx-auto">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-400 mb-4">Tu carrito está vacío</h3>
            <p className="text-gray-500 mb-8">Agrega algunos tickets increíbles para comenzar tu experiencia</p>
            <button
              onClick={() => setCurrentPage('events')}
              className="btn-primary"
            >
              Explorar Eventos
            </button>
          </div>
        </div>
      ) : (
        /* Carrito con items */
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items del carrito */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Tickets seleccionados ({cartItems.length})
              </h2>
              <button
                onClick={refreshCart}
                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
              >
                Actualizar
              </button>
            </div>

            {cartItems.map((item) => (
              <div key={item.ticket_stock_id} className="card group hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Ticket Stock ID: {item.ticket_stock_id}
                    </h3>
                    <p className="text-gray-600 mb-2">Cantidad: {item.quantity}</p>
                    <p className="text-lg font-medium text-green-600">
                      $25,000 c/u {/* Precio por defecto, vendría del backend */}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-800">
                        ${(25000 * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">Total</p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.ticket_stock_id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar del carrito"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Resumen de compra */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="text-2xl font-bold mb-6 text-center">Resumen de Compra</h3>
              
              {/* Información del comprador */}
              <div className="mb-6 space-y-4">
                <h4 className="font-semibold text-gray-800">Información del comprador</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={buyerFullname}
                      onChange={(e) => setBuyerFullname(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
              </div>
              
              {/* Desglose de precios */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.ticket_stock_id} className="flex justify-between text-sm">
                    <span>Ticket x{item.quantity}</span>
                    <span>${(25000 * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mb-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Tag className="h-4 w-4" />
                    <span>Cargo por servicio (5%):</span>
                  </span>
                  <span>${serviceFee.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-3xl font-bold text-green-600">
                      ${total.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 text-right">CLP</p>
                </div>
              </div>
              
              {/* Botón de checkout */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || isCartExpired || !buyerFullname || !buyerEmail}
                className="w-full btn-success py-4 text-lg font-semibold flex items-center justify-center space-x-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Finalizar Compra</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
              
              {/* Info adicional */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>✅ Compra segura y protegida</p>
                <p>⏰ El carrito expira en {timeRemaining} minutos</p>
                <p>🎫 Recibirás tus tickets por email</p>
              </div>
              
              {/* Error display */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Info técnica (desarrollo) */}
      {import.meta.env.DEV && (
        <div className="mt-12 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
          <strong>🛠️ Backend Info:</strong><br/>
          Carrito temporal con expiración de 15 minutos<br/>
          Auto-limpieza cada 10 minutos (cron job)<br/>
          Stock se devuelve automáticamente al expirar<br/>
          Items en carrito: {cartItems.length}<br/>
          Tiempo restante: {timeRemaining} minutos
        </div>
      )}
    </div>
  );
};

export default CartPage;