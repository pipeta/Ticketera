// src/services/eventsApi.js
import { API_CONFIG } from '../config/api.js';

// Función helper para hacer requests
const fetchApi = async (endpoint) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  try {
    console.log('🔄 Fetching:', url);
    
    const response = await fetch(url, {
      headers: API_CONFIG.HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Data received:', data);
    return data;
    
  } catch (error) {
    console.error('❌ API Error:', error);
    throw new Error(error.message || 'Error de conexión');
  }
};

// Transformar datos de la API al formato del frontend
const transformEvent = (apiEvent) => {
  return {
    id: apiEvent.id,
    name: apiEvent.name,
    description: apiEvent.description,
    date: apiEvent.date.split('T')[0], // "2025-02-21"
    time: new Date(apiEvent.date).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    fullDate: apiEvent.date, // Guardar fecha completa también
    location: apiEvent.location_address,
    venue: apiEvent.location_name,
    image: apiEvent.image_url,
    duration: `${apiEvent.duration} horas`,
    maxTicketsPerUser: apiEvent.max_tickets_quantity_per_user,
    
    // Campos por defecto (hasta que estén en la API)
    price: apiEvent.id === '1' ? 35000 : 25000, // Precio diferente por evento
    category: apiEvent.id === '1' ? 'Festival' : 'Fiesta',
    availableTickets: 150,
    featured: apiEvent.id === '1', // Solo el primero destacado
    ageRestriction: '+18'
  };
};

// Servicios de eventos
export const eventsApi = {
  // GET /events - Obtener todos los eventos
  getAll: async () => {
    const rawEvents = await fetchApi('/events');
    return rawEvents.map(transformEvent);
  },

  // GET /events/{id} - Obtener evento específico (para cuando lo necesites)
  getById: async (id) => {
    const rawEvent = await fetchApi(`/events/${id}`);
    return transformEvent(rawEvent);
  }
};