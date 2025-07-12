import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navigation/Navbar';
import { AuthProvider } from '../contexts/AuthContext'; // Import AuthProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Banda Milenio',
  description: 'Sitio web oficial de la Banda Milenio',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-azul-milenio text-blanco min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />

          <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>

          <footer className="w-full bg-primario text-texto-primario text-center p-4 mt-8">
            <p>&copy; {new Date().getFullYear()} Banda Milenio. Todos los derechos reservados.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
