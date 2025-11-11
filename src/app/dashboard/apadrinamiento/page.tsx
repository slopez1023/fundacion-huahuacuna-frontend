
"use client"; // Es una página interactiva, por lo que es un Client Component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // Tu hook de autenticación
import { ninoService } from "@/lib/apiService"; // Nuestro servicio de API
import type { INinoResponse } from "@/types/apadrinamiento.types";
import { Plus, Edit, Trash2 } from "lucide-react"; // Iconos (¡se ven geniales!)

export default function ApadrinamientoAdminPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth(); // Obtenemos el usuario

  // Estado para la lista de niños
  const [ninos, setNinos] = useState<INinoResponse[]>([]);
  // Estado de carga para la lista
  const [isLoadingNinos, setIsLoadingNinos] = useState(true);
  // Estado de error para la lista
  const [error, setError] = useState<string | null>(null);

  // --- 1. Protección de la Ruta (lado del cliente) ---
  useEffect(() => {
    // Si la autenticación terminó (isAuthLoading es false) 
    // y el usuario no existe O no es ADMIN, lo sacamos.
    if (!isLoading) {
      if (!user || user.role !== "ADMIN") {
        router.push("/login"); // Redirige al login
      }
    }
  }, [user, isLoading, router]);

  // --- 2. Carga de Datos (cuando el componente se monta) ---
  useEffect(() => {
    // Solo cargamos datos si el usuario es ADMIN
    if (user && user.role === "ADMIN") {
      const fetchNinos = async () => {
        try {
          setIsLoadingNinos(true);
          // Llamamos a nuestro apiService
          const response = await ninoService.obtenerTodos(); 
          setNinos(response.data);
          setError(null);
        } catch (err) {
          console.error("Error al cargar los niños:", err);
          setError("No se pudo cargar la lista de niños.");
        } finally {
          setIsLoadingNinos(false);
        }
      };

      fetchNinos();
    }
  }, [user]); // Se ejecuta cada vez que 'user' cambia

  // --- 3. Manejadores de Acciones ---

  const handleCreate = () => {
    // Aún no creamos esta página, pero preparamos la ruta
    router.push("/dashboard/apadrinamiento/crear");
  };

  const handleEdit = (id: number) => {
    // Aún no creamos esta página, pero preparamos la ruta
    router.push(`/dashboard/apadrinamiento/editar/${id}`);
  };

  const handleDelete = async (id: number) => {
    // Pedimos confirmación
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      try {
        await ninoService.eliminar(id); // Llamamos a la API
        // Actualizamos la lista en el UI sin recargar la página
        setNinos(ninos.filter((nino) => nino.id !== id));
      } catch (err) {
        console.error("Error al eliminar:", err);
        alert("Error al eliminar el registro.");
      }
    }
  };

  // --- 4. Renderizado ---

  // Estado de carga principal (esperando al hook de autenticación)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Cargando...
      </div>
    );
  }

  // Si no es admin (aunque ya lo redirigimos, es una doble seguridad)
  if (!user || user.role !== "ADMIN") {
    return null; // O un mensaje de "Acceso Denegado"
  }

  // ¡El Admin ya está validado! Mostramos el panel.
  return (
    <div className="p-8"> {/* Asumo que esta página se muestra dentro de un layout de Dashboard */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#1E3A5F]">
          Gestión de Apadrinamiento
        </h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 font-semibold text-[#1E3A5F] bg-[#FDD835] rounded-full hover:bg-[#FBC02D] transition-all"
        >
          <Plus size={18} />
          Agregar Niño
        </button>
      </header>

      {/* Manejo de estados de carga/error de la lista */}
      {isLoadingNinos && <p>Cargando lista de niños...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Tabla de Datos */}
      {!isLoadingNinos && !error && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ninos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No hay niños registrados.
                  </td>
                </tr>
              ) : (
                ninos.map((nino) => (
                  <tr key={nino.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{nino.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{nino.nombres} {nino.apellidos}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{nino.estado}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(nino.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(nino.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}