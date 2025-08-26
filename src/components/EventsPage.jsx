// src/components/EventsPage.jsx
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Eye,
  Star,
  Search,
  Filter,
  Loader,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useEvents } from "../hooks/useEvent";

const EventsPage = ({ setSelectedEvent, setCurrentPage, showNotification }) => {
  const { events, loading, error, refetch } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  // 🔄 Estado de carga
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader className="h-16 w-16 text-blue-600 animate-spin mb-4" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            Cargando eventos...
          </h3>
          <p className="text-gray-500 text-center">
            Conectando con la API
            <br />
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              {import.meta.env.VITE_API_BASE_URL}/events
            </code>
          </p>
        </div>
      </div>
    );
  }

  // ❌ Estado de error
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              Error al cargar eventos
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-gray-600 mb-4">
              Verificando:{" "}
              <code>{import.meta.env.VITE_API_BASE_URL}/events</code>
            </p>
            <button
              onClick={refetch}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reintentar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtrar eventos
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todas" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setCurrentPage("event-detail");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const categories = [
    "Todas",
    ...new Set(events.map((event) => event.category)),
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}

      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
          Descubre Eventos
          <span className="text-gradient block">Increíbles</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Los mejores eventos de la ciudad te esperan. Música, teatro,
          gastronomía y mucho más.
        </p>
      </div>

      {/* <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
          Eventos en Vivo
          <span className="text-gradient block">Desde la API 🌐</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
          Conectado a la base de datos real. {events.length} eventos disponibles.
        </p>
        
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full inline-flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">API conectada</span>
        </div>
      </div> */}

      {/* Eventos destacados */}
      {events.some((event) => event.featured) && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <Star className="h-8 w-8 text-yellow-400 mr-3 fill-current" />
              Eventos Destacados
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events
              .filter((event) => event.featured)
              .map((event) => (
                <div
                  key={event.id}
                  className="card relative overflow-hidden group hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute top-4 right-4 z-10">
                    <Star className="h-6 w-6 text-yellow-400 fill-current drop-shadow-lg" />
                  </div>

                  <div
                    className="h-48 bg-cover bg-center rounded-xl mb-6 relative overflow-hidden"
                    style={{
                      backgroundImage: event.image
                        ? `url(${event.image})`
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    {!event.image && (
                      <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2">
                            {event.name}
                          </h3>
                          <span className="text-sm opacity-90 bg-white/20 px-3 py-1 rounded-full">
                            {event.category}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      {event.name}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold text-green-600">
                          ${event.price.toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">CLP</span>
                      </div>
                      <button
                        onClick={() => handleEventClick(event)}
                        className="btn-primary group-hover:scale-105 transition-transform duration-200"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Filtros y búsqueda */}
      <section className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 appearance-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de eventos */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Todos los Eventos
            <span className="text-lg font-normal text-gray-500 ml-3">
              ({filteredEvents.length} encontrados)
            </span>
          </h2>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              No se encontraron eventos
            </h3>
            <p className="text-gray-400">
              Intenta con otros filtros o términos de búsqueda
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="card hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Imagen del evento */}
                  <div className="lg:w-1/3">
                    <div
                      className="h-64 lg:h-48 bg-cover bg-center rounded-xl relative overflow-hidden"
                      style={{
                        backgroundImage: event.image
                          ? `url(${event.image})`
                          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }}
                    >
                      {!event.image && (
                        <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                          <h3 className="text-lg font-bold">{event.name}</h3>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>

                  {/* Contenido del evento */}
                  <div className="lg:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                            {event.name}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap ml-4">
                          {event.category}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500 mb-6">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-red-500" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-500">⏱️</span>
                          <span>{event.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl font-bold text-green-600">
                            ${event.price.toLocaleString()}
                          </span>
                          <span className="text-gray-500">CLP</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Máximo {event.maxTicketsPerUser} tickets por persona
                        </p>
                      </div>

                      <button
                        onClick={() => handleEventClick(event)}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Ver Detalles</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer de debug (solo en desarrollo) */}
      {import.meta.env.DEV && (
        <div className="mt-12 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
          <strong>🛠️ Debug Info:</strong>
          <br />
          API: {import.meta.env.VITE_API_BASE_URL}
          <br />
          Eventos cargados: {events.length}
          <br />
          Eventos filtrados: {filteredEvents.length}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
