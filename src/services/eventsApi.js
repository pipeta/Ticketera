
import { API_CONFIG } from '../config/api.js';


const fetchApi = async (endpoint) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  console.log('URL completa:', url); 
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


const transformEvent = (apiEvent) => {
  return {
    id: apiEvent.id,
    name: apiEvent.name,
    description: apiEvent.description,
    date: apiEvent.date.split('T')[0], 
    time: new Date(apiEvent.date).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    fullDate: apiEvent.date, 
    location: apiEvent.location_address,
    venue: apiEvent.location_name,
    image: apiEvent.image_url,
    duration: `${apiEvent.duration} horas`,
    maxTicketsPerUser: apiEvent.max_tickets_quantity_per_user,
    
    price: apiEvent.id === '1' ? 35000 : 25000, 
    category: apiEvent.id === '1' ? 'Festival' : 'Fiesta',
    availableTickets: 150,
    featured: apiEvent.id === '1', 
    ageRestriction: '+18'
  };
};


export const eventsApi = {
  
  getAll: async () => {
    const rawEvents = await fetchApi('/events');
    return rawEvents.map(transformEvent);
  },

  
  getById: async (id) => {
    const rawEvent = await fetchApi(`/events/${id}`);
    return transformEvent(rawEvent);
  }
};