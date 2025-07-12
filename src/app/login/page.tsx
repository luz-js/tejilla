'use client';

import { useState, FormEvent, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import Link from 'next/link';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) {
    // This can happen if the component is rendered outside of AuthProvider
    // You can return a loader or an error message.
    return <div>Loading authentication context...</div>;
  }

  const { login, isAuthenticated } = authContext;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      // On successful login, the user will be redirected.
      // We can add a redirect here or rely on a wrapper component.
      // For now, let's redirect manually.
      router.push('/songs'); // Redirect to a protected or main page
    } catch (err: any) {
      // The error from the API service is caught here
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already authenticated, redirect them
  if (typeof window !== 'undefined' && isAuthenticated) {
    router.replace('/songs'); // or profile page
    return null; // Render nothing while redirecting
  }

  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">Iniciar Sesión</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primario"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primario"
              placeholder="********"
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-900 bg-opacity-50 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 font-bold text-white bg-primario rounded-md hover:bg-primario-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primario disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-400">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="font-medium text-primario-hover hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
