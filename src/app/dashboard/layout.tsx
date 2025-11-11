
"use client"; // El layout del dashboard también debe ser de cliente para usar 'useAuth'

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

// (Aquí importarías tus componentes de navegación: Sidebar, Navbar, etc.)
// import Sidebar from "@/components/dashboard/Sidebar"; 
// import Navbar from "@/components/dashboard/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // --- Protección de Ruta (CORREGIDA) ---
  // Este layout protege TODAS las páginas dentro de /dashboard
  useEffect(() => {
    if (!isLoading) {
      if (!user) { 
        // CAMBIO: Ahora solo revisa si el usuario NO está logueado
        // Si no está logueado, fuera
        router.push("/login");
      }
      // CAMBIO: Eliminamos el 'else if (user.role !== "ADMIN")'
    }
  }, [user, isLoading, router]);

  // --- Estado de Carga ---
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  // --- Renderizado del Layout ---
  // CAMBIO: Si hay un usuario (cualquier rol), muestra el layout
  if (user) { 
    return (
      <div className="flex h-screen bg-gray-100">
        
        {/* Aquí podrías tener lógica para mostrar un Sidebar
          diferente si es admin o user. Por ejemplo:
          {user.role === "ADMIN" ? <AdminSidebar /> : <UserSidebar />}
        */}

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tu 'Navbar' que se importa en 'dashboard/page.tsx' 
            probablemente ya maneja esto. 
          */}
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            {/* El contenido de la página (page.tsx o apadrinamiento/page.tsx) se inserta aquí */}
            {children} 
          </main>
        </div>
      </div>
    );
  }

  // Si no cumple las condiciones (aunque el useEffect ya lo redirigió)
  return null;
}