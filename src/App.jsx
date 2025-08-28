import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import EventsPage from './components/EventsPage';
import EventDetailPage from './components/EventDetailPage';
import CartPage from './components/CartPage';
import TicketsPage from './components/TicketsPage';
import { authApi } from './services/authApi.js';


const App = () => {
  const [currentPage, setCurrentPage] = useState('events');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [purchasedTickets, setPurchasedTickets] = useState([]);

 
  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

 
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedCart = localStorage.getItem('cart');
    const savedTickets = localStorage.getItem('purchasedTickets');

    // Verificar si hay sesión activa
    if (savedUser && authApi.isAuthenticated()) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedTickets) {
      setPurchasedTickets(JSON.parse(savedTickets));
    }
  }, []);

  
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      authApi.removeToken(); // Limpiar token también
    }
  }, [user]);

  
  const handleLogout = () => {
    setUser(null);
    authApi.removeToken();
    setCurrentPage('events');
    showNotification('Sesión cerrada correctamente');
  };

  const appState = {
    currentPage,
    setCurrentPage,
    user,
    setUser,
    cart,
    setCart,
    selectedEvent,
    setSelectedEvent,
    showLogin,
    setShowLogin,
    purchasedTickets,
    setPurchasedTickets,
    showNotification,
    handleLogout
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...appState} />
      
      <main className="animate-fade-in">
        {currentPage === 'events' && <EventsPage {...appState} />}
        {currentPage === 'event-detail' && <EventDetailPage {...appState} />}
        {currentPage === 'cart' && <CartPage {...appState} />}
        {currentPage === 'tickets' && <TicketsPage {...appState} />}
      </main>
      
      {showLogin && <LoginForm {...appState} />}
    </div>
  );
};

export default App;