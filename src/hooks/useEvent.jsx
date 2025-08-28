// src/hooks/useEvents.js
import { useState, useEffect } from 'react';
import { eventsApi } from '../services/eventsApi.js';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Cargando eventos...');
      const eventsData = await eventsApi.getAll();
      
      console.log('✅ Eventos cargados:', eventsData);
      setEvents(eventsData);
      
    } catch (err) {
      console.error('❌ Error cargando eventos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents
  };
};