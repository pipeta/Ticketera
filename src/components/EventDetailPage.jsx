import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Minus, ShoppingCart, ArrowLeft, Users, Timer, Star, Shield, Info } from 'lucide-react';

const EventDetailPage = ({ 
  selectedEvent, 
  setCurrentPage, 
  cart, 
  setCart, 
  user, 
  setShowLogin,
  showNotification 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const addToCart = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    const existingItem = cart.find(item => item.eventId === selectedEvent.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.eventId === selectedEvent.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { 
        eventId: selectedEvent.id, 
        event: selectedEvent, 
        quantity: quantity 
      }]);
    }
    
    showNotification(`${quantity} ticket(s) agregado(s) al carrito`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!selectedEvent) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Back Button */}
      <button
        onClick={() => setCurrentPage('events')}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors mb-8 group"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="font-medium">Volver a eventos</span>
      </button>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Hero Image */}
          <div className="card overflow-hidden mb-8">
            <div className="h-80 gradient-bg flex items-center justify-center rounded-xl relative">
              {selectedEvent.featured && (
                <div className="absolute top-4 right-4">
                  <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span>Destacado</span>
                  </div>
                </div>
              )}
              <div className="text-center text-white z-10">
                <h1 className="text-4xl font-bold mb-4">{selectedEvent.name}</h1>
                <div className="flex items-center justify-center space-x-4 text-lg">
                  <span className="bg-white/20 px-4 py-2 rounded-full">{selectedEvent.category}</span>
                  <span className="bg-white/20 px-4 py-2 rounded-full">{selectedEvent.ageRestriction}</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>

          {/* Event Details */}
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Información del Evento</h2>
            
            <div className="prose max-w-none mb-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                {showFullDescription 
                  ? selectedEvent.description 
                  : selectedEvent.description.substring(0, 200) + '...'}
              </p>
              {selectedEvent.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 hover:text-blue-700 font-medium mt-2"
                >
                  {showFullDescription ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </div>
            
            {/* Event Info Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-500" />
                  Detalles
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="text-sm text-gray-500">Fecha</span>
                      <p className="font-medium text-gray-800">{formatDate(selectedEvent.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-green-500" />
                    <div>
                      <span className="text-sm text-gray-500">Hora</span>
                      <p className="font-medium text-gray-800">{selectedEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Timer className="h-5 w-5 text-purple-500" />
                    <div>
                      <span className="text-sm text-gray-500">Duración</span>
                      <p className="font-medium text-gray-800">{selectedEvent.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-red-500" />
                  Ubicación
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-800 mb-1">{selectedEvent.venue}</p>
                    <p className="text-gray-600">{selectedEvent.location}</p>
                  </div>
                  
                  {/* Availability */}
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">Disponibilidad</span>
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-green-700 font-medium mb-2">
                      {selectedEvent.availableTickets} tickets disponibles
                    </p>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((selectedEvent.availableTickets / 500) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-500" />
              Información Importante
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p><strong>Restricción de edad:</strong> {selectedEvent.ageRestriction}</p>
                <p><strong>Categoría:</strong> {selectedEvent.category}</p>
                <p><strong>Duración:</strong> {selectedEvent.duration}</p>
              </div>
              <div className="space-y-2">
                <p><strong>Política de devolución:</strong> 48 horas antes del evento</p>
                <p><strong>Entrada:</strong> Presentar ticket digital o impreso</p>
                <p><strong>Parking:</strong> Disponible en el lugar</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar - Purchase Widget */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="text-2xl font-bold mb-6 text-center">Comprar Tickets</h3>
            
            {/* Price Display */}
            <div className="text-center mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-4xl font-bold text-green-600">
                  ${selectedEvent.price.toLocaleString()}
                </span>
                <span className="text-gray-500">CLP</span>
              </div>
              <p className="text-sm text-gray-600">por ticket</p>
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                Cantidad de tickets
              </label>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-5 w-5" />
                </button>
                <div className="text-center">
                  <span className="text-3xl font-bold text-gray-800">{quantity}</span>
                  <p className="text-sm text-gray-500">tickets</p>
                </div>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="p-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={quantity >= 10}
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Máximo 10 tickets por compra
              </p>
            </div>
            
            {/* Price Summary */}
            <div className="mb-6 p-4 bg-white rounded-xl border-2 border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({quantity} tickets):</span>
                  <span>${(selectedEvent.price * quantity).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cargo por servicio:</span>
                  <span>$0</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${(selectedEvent.price * quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <button
              onClick={addToCart}
              className="w-full btn-success py-4 text-lg font-semibold flex items-center justify-center space-x-2 mb-4"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Agregar al Carrito</span>
            </button>
            
            {!user && (
              <p className="text-sm text-gray-500 text-center">
                <span className="text-amber-600">⚠️</span> Debes iniciar sesión para comprar tickets
              </p>
            )}
            
            {/* Security Badge */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg text-center">
              <Shield className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-xs text-gray-600">
                Compra 100% segura y protegida
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;