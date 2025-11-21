/**
 * ProtectedRoute - Componente de protección de rutas
 * 
 * Propósito:
 * - Verificar autenticación del usuario
 * - Validar que el usuario tenga rol ADMIN
 * - Redirigir si no cumple los requisitos
 * 
 * @author Fundación Huahuacuna
 * @version 1.0
 */

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificar autenticación y rol
    if (!isLoading) {
      if (!token || !user) {
        // No autenticado, redirigir a login
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        // Usuario autenticado pero no es admin
        router.push('/');
      } else {
        // Usuario válido
        setIsChecking(false);
      }
    }
  }, [user, token, isLoading, router]);

  // Mostrar loader mientras verifica
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A5F]"></div>
          <p className="mt-4 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Renderizar contenido protegido
  return <>{children}</>;
}