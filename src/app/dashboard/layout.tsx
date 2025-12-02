"use client";

import Sidebar from "@/components/admin/Sidebar";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-100 flex">
        {/* El Sidebar fijo a la izquierda */}
        <Sidebar />

        {/* El contenido cambiante a la derecha */}
        {/* ml-64 deja el espacio para que el sidebar no tape el contenido */}
        <main className="flex-1 ml-64 p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}