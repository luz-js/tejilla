'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMembers } from '../../services/memberApi';
import { Member } from '../../types/member';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated, user } = useAuth();
  const canAddMembers = isAuthenticated && user?.role === UserRole.ADMIN;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const response = await getMembers({ isActiveMember: true }); // Default to showing active members
        setMembers(response.data);
      } catch (err: any) {
        setError(err.message || 'No se pudieron cargar los miembros de la banda.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Cargando miembros..." />;
  }

  if (error) {
    return <ErrorMessage title="Error" message={error} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Miembros de la Banda</h1>
        {canAddMembers && (
          <Link href="/members/new">
            <span className="px-4 py-2 font-bold text-white bg-primario rounded-md hover:bg-primario-hover">
              + Agregar Miembro
            </span>
          </Link>
        )}
      </div>

      {members.length === 0 ? (
        <p className="text-gray-400">No hay miembros para mostrar.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <div key={member.id} className="bg-gray-800 rounded-lg shadow p-6 text-center flex flex-col items-center">
              <img
                src={member.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`}
                alt={`Foto de ${member.name}`}
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-gray-700"
              />
              <h2 className="text-xl font-bold">{member.name}</h2>
              <p className="text-primario-hover">{member.roleInBand}</p>
              {member.instrument && <p className="text-sm text-gray-400 mt-2">{member.instrument}</p>}
              {/* Optional: Add a link to a member detail page */}
              {/* <Link href={`/members/${member.id}`} className="mt-4 text-sm hover:underline">Ver más</Link> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MembersPage;
