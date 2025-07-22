import React from 'react';
import { ShoppingCart, Plus, Minus, X, CreditCard, Trash2, ArrowRight, AlertCircle, Tag, Calendar, MapPin } from 'lucide-react';

const CartPage = ({ 
  cart, 
  setCart, 
  user, 
  setShowLogin, 
  setCurrentPage, 
  setPurchasedTickets,
  purchasedTickets,
  showNotification 
}) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.event.price * item.quantity), 0);
  const serviceFee = Math.floor(subtotal * 0.05); // 5% service fee
  const total = subtotal + serviceFee;

  const updateQuantity = (eventId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.eventId !== eventId));
      showNotification('Producto eliminado del carrito');
    } else {
      setCart(cart.map(item => 
        item.eventId === eventId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeFromCart = (eventId) => {
    setCart(cart.filter(item => item.eventId !== eventId));
    showNotification('Producto eliminado del carrito');
  };

  const clearCart = () => {
    setCart([]);
    showNotification('Carrito vaciado');
  };

  const checkout = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    
    const newTickets = cart.map(item => ({
      id: Date.now() + Math.random(),
      event: item.event,
      quantity: item.quantity,
      purchaseDate: new Date().toISOString().split('T')[0],
      ticketNumber: `TK${Date.now()}${Math.floor(Math.random() * 1000)}`,
      status: 'active',
      totalPaid: item.event.price * item.quantity
    }));
    
    setPurchasedTickets([...purchasedTickets, ...newTickets]);
    setCart([]);
    
    showNotification('¡Compra realizada con éxito!');
    setTimeout(() => {
      setCurrentPage('tickets');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Carrito de Compras</h1>
        <p className="text-gray-600">Revisa tus tickets antes de finalizar la compra</p>
      </div>
      
      {cart.length === 0 ? (
        /* Empty Cart */
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
        /* Cart with Items */
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cart Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Tickets seleccionados ({cart.length})
              </h2>
              <button
                onClick={clearCart}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Vaciar carrito</span>
              </button>
            </div>

            {/* Cart Items List */}
            {cart.map((item) => (
              <div key={item.eventId} className="card group hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Event Image */}
                  <div className="sm:w-32 h-32 gradient-bg flex items-center justify-center rounded-xl flex-shrink-0">
                    <span className="text-white font-bold text-center text-sm px-2">
                      {item.event.name}
                    </span>
                  </div>
                  
                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                          {item.event.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{item.event.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{item.event.venue}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.eventId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar del carrito"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {/* Price */}
                      <div>
                        <p className="text-lg font-bold text-green-600">
                          ${item.event.price.toLocaleString()} <span className="text-sm text-gray-500">c/u</span>
                        </p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.eventId, item.quantity - 1)}
                            className="p-2 hover:bg-white rounded-md transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.eventId, item.quantity + 1)}
                            className="p-2 hover:bg-white rounded-md transition-colors"
                            disabled={item.quantity >= 10}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Total for this item */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-800">
                            ${(item.event.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">Total</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="text-2xl font-bold mb-6 text-center">Resumen de Compra</h3>
              
              {/* Order Details */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.eventId} className="flex justify-between items-center text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {item.event.name}
                      </p>
                      <p className="text-gray-500">
                        {item.quantity} × ${item.event.price.toLocaleString()}
                      </p>
                    </div>
                    <span className="font-bold text-gray-800 ml-2">
                      ${(item.event.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Price Breakdown */}
              <div className="border-t pt-4 mb-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Tag className="h-4 w-4" />
                    <span>Cargo por servicio:</span>
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
              
              {/* Checkout Button */}
              <button
                onClick={checkout}
                className="w-full btn-success py-4 text-lg font-semibold flex items-center justify-center space-x-2 mb-4"
              >
                <CreditCard className="h-5 w-5" />
                <span>Finalizar Compra</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              {/* Login Notice */}
              {!user && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-amber-700">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm font-medium">
                      Debes iniciar sesión para completar tu compra
                    </p>
                  </div>
                </div>
              )}
              
              {/* Security Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Compra Segura</span>
                </div>
                <p className="text-xs text-gray-500">
                  Tu información está protegida con encriptación SSL
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
