'use client';

import { useState, FormEvent, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreateUserDto } from '../../dtos/user';

const RegisterPage = () => {
  const [formData, setFormData] = useState<CreateUserDto>({
    username: '',
    email: '',
    password: '',
  });
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) {
    return <div>Loading authentication context...</div>;
  }

  const { register } = authContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await register(formData);
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      // Optionally redirect after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Fallo en el registro. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">Crear una Cuenta</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">Nombre de Usuario</label>
            <input id="username" name="username" type="text" required value={formData.username} onChange={handleChange} className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primario" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Correo Electrónico</label>
            <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primario" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Contraseña</label>
            <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primario" />
          </div>
          <div>
            <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-300">Confirmar Contraseña</label>
            <input id="passwordConfirmation" name="passwordConfirmation" type="password" required value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primario" />
          </div>

          {error && <div className="p-3 text-sm text-red-400 bg-red-900 bg-opacity-50 rounded-md">{error}</div>}
          {success && <div className="p-3 text-sm text-green-400 bg-green-900 bg-opacity-50 rounded-md">{success}</div>}

          <div>
            <button type="submit" disabled={isLoading} className="w-full px-4 py-2 font-bold text-white bg-primario rounded-md hover:bg-primario-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primario disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-400">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="font-medium text-primario-hover hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
