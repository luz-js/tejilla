'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth'; // Import UserRole if checking roles

// Define the props for the ProtectedRoute component
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[]; // Optional: specify which roles are allowed
}

/**
 * A client-side component to protect routes.
 * It checks for authentication and optionally for specific user roles.
 * Redirects to the login page if checks fail.
 *
 * @param {ProtectedRouteProps} props - The component props.
 * @param {ReactNode} props.children - The content to render if authorized.
 * @param {UserRole[]} [props.allowedRoles] - An optional array of roles that are allowed to view the content.
 */
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't do anything while loading authentication state
    if (loading) {
      return;
    }

    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // If allowedRoles are specified, check if the user has one of them
    if (allowedRoles && allowedRoles.length > 0 && user) {
      if (!allowedRoles.includes(user.role)) {
        // Redirect to a 'forbidden' page or home page if role is not allowed
        console.warn(`Access denied for role: ${user.role}. Allowed: ${allowedRoles.join(', ')}`);
        router.replace('/unauthorized'); // Or '/' or any other appropriate page
      }
    }
  }, [isAuthenticated, loading, user, router, allowedRoles]);

  // While loading, you can show a loader
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div> {/* Assuming .loader class is in globals.css */}
      </div>
    );
  }

  // If authenticated and (no roles specified or role is allowed), render the children
  if (isAuthenticated && (!allowedRoles || (user && allowedRoles.includes(user.role)))) {
    return <>{children}</>;
  }

  // If checks are failing but useEffect hasn't redirected yet, render null
  // or a fallback loader to prevent flashing content.
  return null;
};

export default ProtectedRoute;
