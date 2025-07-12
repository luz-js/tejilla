import Link from 'next/link';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Acceso Denegado</h1>
      <p className="text-lg text-gray-300 mb-6">
        No tienes los permisos necesarios para ver esta página.
      </p>
      <Link href="/">
        <span className="px-6 py-2 font-bold text-white bg-primario rounded-md hover:bg-primario-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primario">
          Volver al Inicio
        </span>
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
