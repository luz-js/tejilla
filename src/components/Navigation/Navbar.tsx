'use client';

import { useState, useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '../../contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  if (!authContext) {
    // This can happen on initial render if context is not yet available.
    // Render a placeholder or null until the context is hydrated.
    return null;
  }

  const { isAuthenticated, logout, user } = authContext;

  const handleLogout = () => {
    logout();
    // The logout function in context already handles redirecting
  };

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/songs', label: 'Canciones' },
    { href: '/events', label: 'Eventos' },
    { href: '/members', label: 'Miembros' },
  ];

  const authLinks = isAuthenticated
    ? [{ href: '/profile', label: `Perfil (${user?.username})` }, { href: '#', label: 'Cerrar Sesión', onClick: handleLogout }]
    : [{ href: '/login', label: 'Iniciar Sesión' }, { href: '/register', label: 'Registrarse' }];

  return (
    <nav className="bg-primario shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo or Brand Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-texto-primario text-xl font-bold">
              Banda Milenio
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${
                      isActive ? 'bg-primario-hover text-white' : 'text-gray-300 hover:bg-primario-hover hover:text-white'
                    } px-3 py-2 rounded-md text-sm font-medium`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="border-l border-gray-500 h-6 mx-4"></div>
              {authLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={link.onClick}
                  className="text-gray-300 hover:bg-primario-hover hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-primario-hover inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-primario focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primario-hover focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    isActive ? 'bg-primario-hover text-white' : 'text-gray-300 hover:bg-primario-hover hover:text-white'
                  } block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="px-2 space-y-1">
              {authLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    if (link.onClick) link.onClick();
                    setIsOpen(false);
                  }}
                  className="text-gray-300 hover:bg-primario-hover hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
