'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getEvents } from '../../services/eventApi';
import { Event } from '../../types/event';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';

const EventCard = ({ event }: { event: Event }) => {
  const eventDate = new Date(event.date);
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
      <div className="flex-grow">
        <p className="text-sm font-semibold text-primario-hover">{new Intl.DateTimeFormat('es-ES', dateOptions).format(eventDate)}</p>
        <h3 className="text-2xl font-bold mt-2 hover:underline">
          <Link href={`/events/${event.id}`}>{event.title}</Link>
        </h3>
        <p className="text-gray-400 mt-1">{new Intl.DateTimeFormat('es-ES', timeOptions).format(eventDate)}</p>
        {event.venueName && <p className="text-gray-300 mt-2 font-semibold">{event.venueName}</p>}
        {event.venueAddress && <p className="text-gray-400 text-sm">{event.venueAddress}</p>}
        {event.description && <p className="text-gray-400 mt-4 text-sm">{event.description}</p>}
      </div>
      <div className="mt-6">
        <Link href={`/events/${event.id}`}>
          <span className="font-semibold text-white hover:text-primario-hover">Ver detalles y Setlist &rarr;</span>
        </Link>
      </div>
    </div>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated, user } = useAuth();
  const canAddEvents = isAuthenticated && (user?.role === UserRole.ADMIN || user?.role === UserRole.EDITOR);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        // Fetch public, upcoming events by default
        const response = await getEvents({
          isPublic: true,
          dateFrom: new Date().toISOString(), // From now...
        });
        setEvents(response.data);
      } catch (err: any) {
        setError(err.message || 'No se pudieron cargar los eventos.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Cargando próximos eventos..." />;
  }

  if (error) {
    return <ErrorMessage title="Error" message={error} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Próximos Eventos</h1>
        {canAddEvents && (
          <Link href="/events/new">
            <span className="px-4 py-2 font-bold text-white bg-primario rounded-md hover:bg-primario-hover">
              + Agregar Evento
            </span>
          </Link>
        )}
      </div>

      {events.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No hay eventos próximos programados. ¡Vuelve pronto!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
