import React, { useState } from 'react';
import { Ticket, Download, QrCode, Calendar, Clock, MapPin, Search, Filter, Star, CheckCircle, XCircle } from 'lucide-react';

const TicketsPage = ({ 
  user, 
  setShowLogin, 
  setCurrentPage, 
  purchasedTickets,
  showNotification 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="card max-w-md mx-auto">
          <Ticket className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-400 mb-4">Acceso restringido</h3>
          <p className="text-gray-500 mb-8">Debes iniciar sesión para ver tus tickets comprados</p>
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

  // Filter tickets
  const filteredTickets = purchasedTickets.filter(ticket => {
    const matchesSearch = ticket.event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownload = (ticket) => {
    showNotification(`Descargando ticket: ${ticket.ticketNumber}`);
  };

  const handleViewQR = (ticket) => {
    showNotification(`Mostrando código QR para: ${ticket.event.name}`);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'used':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'used':
        return <XCircle className="h-4 w-4" />;
      case 'expired':
        return <XCircle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'VÁLIDO';
      case 'used':
        return 'USADO';
      case 'expired':
        return 'EXPIRADO';
      default:
        return 'VÁLIDO';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Mis Tickets</h1>
        <p className="text-gray-600">Gestiona tus tickets comprados y accede a tus eventos</p>
      </div>

      {/* Filters */}
      {purchasedTickets.length > 0 && (
        <div className="card mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
              />
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 appearance-none"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Válidos</option>
                <option value="used">Usados</option>
                <option value="expired">Expirados</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {filteredTickets.length === 0 ? (
        <div className="text-center py-16">
          <div className="card max-w-md mx-auto">
            <Ticket className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-400 mb-4">
              {purchasedTickets.length === 0 ? 'No tienes tickets' : 'No se encontraron tickets'}
            </h3>
            <p className="text-gray-500 mb-8">
              {purchasedTickets.length === 0 
                ? 'Explora nuestros eventos y compra tus primeros tickets'
                : 'Intenta con otros filtros de búsqueda'
              }
            </p>
            <button
              onClick={() => setCurrentPage('events')}
              className="btn-primary"
            >
              {purchasedTickets.length === 0 ? 'Explorar Eventos' : 'Ver Todos los Eventos'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredTickets.length} de {purchasedTickets.length} tickets
            </p>
          </div>

          {/* Tickets List */}
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="card border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 group">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Ticket Visual */}
                <div className="lg:w-1/4">
                  <div className="h-40 gradient-bg flex items-center justify-center rounded-xl relative overflow-hidden">
                    {ticket.event.featured && (
                      <div className="absolute top-2 right-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      </div>
                    )}
                    <div className="text-center text-white z-10">
                      <p className="font-bold text-lg mb-1">{ticket.event.name}</p>
                      <p className="text-sm opacity-90">{ticket.event.category}</p>
                    </div>
                  </div>
                </div>
                
                {/* Ticket Info */}
                <div className="lg:w-3/4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {ticket.event.name}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{ticket.event.description}</p>
                      <div className="flex items-center space-x-4 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1 border ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          <span>{getStatusText(ticket.status)}</span>
                        </span>
                        <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                          #{ticket.ticketNumber}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600 mb-1">
                        ${ticket.totalPaid.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">{ticket.quantity} ticket(s)</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-gray-500">Evento</p>
                        <p className="font-medium">{formatDate(ticket.event.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-gray-500">Hora</p>
                        <p className="font-medium">{ticket.event.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="text-gray-500">Lugar</p>
                        <p className="font-medium">{ticket.event.venue}</p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-500">Comprado</p>
                      <p className="font-medium">{ticket.purchaseDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    <button 
                      onClick={() => handleViewQR(ticket)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>Ver QR</span>
                    </button>
                    <button 
                      onClick={() => handleDownload(ticket)}
                      className="flex items-center space-x-2 text-green-600 hover:text-green-800 transition-colors bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg"
                    >
                      <Download className="h-4 w-4" />
                      <span>Descargar PDF</span>
                    </button>
                    <div className="text-xs text-gray-500 flex items-center ml-auto">
                      Presenta este ticket en el evento
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketsPage;