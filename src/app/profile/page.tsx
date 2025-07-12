'use client';

import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';

const ProfilePageContent = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-400">Nombre de Usuario</p>
            <p className="text-lg">{user.username}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Correo Electrónico</p>
            <p className="text-lg">{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Rol</p>
            <p className="text-lg capitalize">{user.role}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Miembro desde</p>
            <p className="text-lg">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


// The main page component wraps the content with the ProtectedRoute
const ProfilePage = () => {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
};

export default ProfilePage;
