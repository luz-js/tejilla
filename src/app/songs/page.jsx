'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSongs } from '../../services/songApi';
import { Song } from '../../types/song';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { useAuth } from '../../hooks/useAuth'; // To check user role for 'Add' button
import { UserRole } from '../../types/auth';

const SongsPage = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use auth context to conditionally show admin controls
  const { isAuthenticated, user } = useAuth();
  const canAddSongs = isAuthenticated && (user?.role === UserRole.ADMIN || user?.role === UserRole.EDITOR);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true);
        const response = await getSongs(); // Using our new API service
        setSongs(response.data);
      } catch (err: any) {
        setError(err.message || 'No se pudieron cargar las canciones.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Cargando canciones..." />;
  }

  if (error) {
    return <ErrorMessage title="Error" message={error} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cancionero</h1>
        {canAddSongs && (
          <Link href="/songs/new">
            <span className="px-4 py-2 font-bold text-white bg-primario rounded-md hover:bg-primario-hover">
              + Agregar Canción
            </span>
          </Link>
        )}
      </div>

      {songs.length === 0 ? (
        <p className="text-gray-400">No hay canciones en la lista.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="tracking-wider border-b-2 border-gray-600">
              <tr>
                <th scope="col" className="px-6 py-3">Título</th>
                <th scope="col" className="px-6 py-3">Artista Original</th>
                <th scope="col" className="px-6 py-3">Tonalidad</th>
                <th scope="col" className="px-6 py-3">Género</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
                <tr key={song.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="px-6 py-4 font-medium">
                    <Link href={`/songs/${song.id}`} className="hover:underline">
                      {song.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{song.original_artist || '-'}</td>
                  <td className="px-6 py-4">{song.key || '-'}</td>
                  <td className="px-6 py-4">{song.genre || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SongsPage;
