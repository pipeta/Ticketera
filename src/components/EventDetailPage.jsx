import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus, Minus, ShoppingCart, ArrowLeft, Users, Timer, Star, Shield, Info } from 'lucide-react';
import { API_CONFIG } from '../config/api.js';

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
  const [ticketStocks, setTicketStocks] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);

 
  useEffect(() => {
    if (selectedEvent && selectedEvent.id) {
      loadTicketStocks();
    }
  }, [selectedEvent]);

  // const loadTicketStocks = async () => {
  //   try {
  //     setLoadingTickets(true);
  //     console.log('📋 Loading ticket stocks for event:', selectedEvent.id);
  //     console.log('URL completa:', url); 
  //     const response = await fetch(`${API_CONFIG.BASE_URL}/tickets/${selectedEvent.id}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       }
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Error ${response.status}`);
  //     }

  //     const stocks = await response.json();
  //     console.log('✅ Ticket stocks loaded:', stocks);
      
  //     setTicketStocks(stocks);
      
  //     // Seleccionar el primer ticket por defecto si existe
  //     if (stocks.length > 0) {
  //       setSelectedTicket(stocks[0]);
  //     }
  //   } catch (error) {
  //     console.error('❌ Error loading ticket stocks:', error);
  //     showNotification('Error al cargar los tipos de tickets');
  //   } finally {
  //     setLoadingTickets(false);
  //   }
  // };
  const loadTicketStocks = async () => {
  try {
    setLoadingTickets(true);
    const url = `${API_CONFIG.BASE_URL}/tickets/${selectedEvent.id}`;
    console.log('📋 Loading ticket stocks for event:', selectedEvent.id);
    console.log('URL completa:', url); 

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const stocks = await response.json();
    console.log('✅ Ticket stocks loaded:', stocks);
    
    setTicketStocks(stocks);
    
    if (stocks.length > 0) {
      setSelectedTicket(stocks[0]);
    }
  } catch (error) {
    console.error('❌ Error loading ticket stocks:', error);
    showNotification('Error al cargar los tipos de tickets');
  } finally {
    setLoadingTickets(false);
  }
};

  const addToCart = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    if (!selectedTicket) {
      showNotification('Por favor selecciona un tipo de ticket');
      return;
    }

    if (selectedTicket.actual_stock < quantity) {
      showNotification(`Solo quedan ${selectedTicket.actual_stock} tickets disponibles`);
      return;
    }

    try {
      setLoading(true);
      console.log('🛒 Adding to cart:', {
        user_id: user.id,
        ticket_stock_id: selectedTicket.id,
        quantity: quantity
      });

     
      const response = await fetch(`${API_CONFIG.BASE_URL}/cart/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          ticket_stock_id: selectedTicket.id, 
          quantity: quantity
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Added to cart:', result);

      // Actualizar el carrito local (para el frontend)
      const existingItem = cart.find(item => item.ticket_stock_id === selectedTicket.id);
      if (existingItem) {
        setCart(cart.map(item => 
          item.ticket_stock_id === selectedTicket.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));
      } else {
        setCart([...cart, { 
          eventId: selectedEvent.id,
          ticket_stock_id: selectedTicket.id,
          event: selectedEvent, 
          ticket: selectedTicket,
          quantity: quantity 
        }]);
      }
      
      showNotification(`✅ ${quantity} ticket(s) agregado(s) al carrito`);
      
      // Recargar los stocks para actualizar disponibilidad
      loadTicketStocks();
      
      // Reset cantidad
      setQuantity(1);
      
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      showNotification(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
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

  const formatPrice = (price) => {
    return price ? price.toLocaleString('es-CL') : '0';
  };

  if (!selectedEvent) return null;

 
  const currentPrice = selectedTicket ? selectedTicket.price : (selectedEvent.price || 0);
  const subtotal = currentPrice * quantity;
  const serviceFee = 0; // Puedes calcular esto según tu lógica
  const total = subtotal + serviceFee;

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
                  
                  {/* Availability basada en el ticket seleccionado */}
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">Disponibilidad</span>
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-green-700 font-medium mb-2">
                      {selectedTicket 
                        ? `${selectedTicket.actual_stock} tickets disponibles (${selectedTicket.name})`
                        : `${selectedEvent.availableTickets || 0} tickets disponibles`
                      }
                    </p>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: selectedTicket 
                            ? `${Math.min((selectedTicket.actual_stock / selectedTicket.initial_stock) * 100, 100)}%`
                            : `${Math.min((selectedEvent.availableTickets / 500) * 100, 100)}%` 
                        }}
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
                <p><strong>Máximo por usuario:</strong> {selectedEvent.max_tickets_quantity_per_user || 10} tickets</p>
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
            
            {/* Ticket Type Selector */}
            {loadingTickets ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Cargando tipos de tickets...</p>
              </div>
            ) : ticketStocks.length > 0 ? (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Tipo de ticket
                </label>
                <select 
                  value={selectedTicket?.id || ''} 
                  onChange={(e) => {
                    const ticket = ticketStocks.find(t => t.id === e.target.value);
                    setSelectedTicket(ticket);
                  }}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  {ticketStocks.map(ticket => (
                    <option key={ticket.id} value={ticket.id}>
                      {ticket.name} - ${formatPrice(ticket.price)} CLP ({ticket.actual_stock} disponibles)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg text-center">
                <p className="text-yellow-700">No hay tickets disponibles para este evento</p>
              </div>
            )}
            
            {/* Price Display */}
            {selectedTicket && (
              <div className="text-center mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-4xl font-bold text-green-600">
                    ${formatPrice(currentPrice)}
                  </span>
                  <span className="text-gray-500">CLP</span>
                </div>
                <p className="text-sm text-gray-600">por ticket</p>
                <p className="text-xs text-gray-500 mt-1">{selectedTicket.name}</p>
              </div>
            )}
            
            {/* Quantity Selector */}
            {selectedTicket && (
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
                    onClick={() => setQuantity(Math.min(
                      selectedEvent.max_tickets_quantity_per_user || 10, 
                      selectedTicket.actual_stock,
                      quantity + 1
                    ))}
                    className="p-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={quantity >= Math.min(selectedEvent.max_tickets_quantity_per_user || 10, selectedTicket.actual_stock)}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Máximo {Math.min(selectedEvent.max_tickets_quantity_per_user || 10, selectedTicket.actual_stock)} tickets disponibles
                </p>
              </div>
            )}
            
            {/* Price Summary */}
            {selectedTicket && (
              <div className="mb-6 p-4 bg-white rounded-xl border-2 border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({quantity} tickets):</span>
                    <span>${formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cargo por servicio:</span>
                    <span>${formatPrice(serviceFee)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Add to Cart Button */}
            <button
              onClick={addToCart}
              disabled={loading || !selectedTicket || selectedTicket.actual_stock === 0}
              className={`w-full py-4 text-lg font-semibold flex items-center justify-center space-x-2 mb-4 rounded-lg transition-colors ${
                loading || !selectedTicket || selectedTicket.actual_stock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'btn-success'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{loading ? 'Agregando...' : 'Agregar al Carrito'}</span>
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