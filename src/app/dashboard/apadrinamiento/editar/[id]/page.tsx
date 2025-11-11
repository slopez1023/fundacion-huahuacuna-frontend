
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // Importamos useParams
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ninoService } from "@/lib/apiService";
// Usamos el tipo de Actualizar, que no incluye el 'estado'
import type { IActualizarNinoRequest } from "@/types/apadrinamiento.types";
import { ArrowLeft } from "lucide-react";

// Estado inicial para el formulario
const initialState: IActualizarNinoRequest = {
  nombres: "",
  apellidos: "",
  fechaNacimiento: "",
  historia: "",
  urlFotoPrincipal: "",
};

export default function EditarNinoPage() {
  const router = useRouter();
  const params = useParams(); // Hook para leer la URL
  const { user, isLoading: isAuthLoading } = useAuth(); // Corregido a 'isLoading'

  const id = params.id as string; // Obtenemos el ID de la URL

  // --- 1. Estado del Formulario ---
  const [formData, setFormData] = useState(initialState);
  // Estado para saber si la página está cargando los datos iniciales
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  // Estado para saber si el formulario se está enviando
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- 2. Protección de la Ruta ---
  useEffect(() => {
    if (!isAuthLoading) {
      if (!user || user.role !== "ADMIN") {
        router.push("/login");
      }
    }
  }, [user, isAuthLoading, router]);

  // --- 3. Carga de Datos Inicial ---
  useEffect(() => {
    if (id && user && user.role === "ADMIN") {
      const fetchNino = async () => {
        try {
          const response = await ninoService.obtenerPorId(Number(id));
          const nino = response.data;
          
          // Formateamos la fecha para el input type="date" (YYYY-MM-DD)
          const fechaFormateada = nino.fechaNacimiento 
            ? nino.fechaNacimiento.split('T')[0] 
            : "";

          // Seteamos los datos en el formulario
          setFormData({
            nombres: nino.nombres,
            apellidos: nino.apellidos,
            fechaNacimiento: fechaFormateada,
            historia: nino.historia || "", // Manejar nulos
            urlFotoPrincipal: nino.urlFotoPrincipal || "", // Manejar nulos
          });
          
        } catch (err) {
          console.error("Error al cargar el niño:", err);
          setError("No se pudieron cargar los datos del niño.");
        } finally {
          setIsLoadingPage(false); // Terminamos la carga de la página
        }
      };

      fetchNino();
    }
  }, [id, user]); // Se ejecuta cuando el 'id' y el 'user' estén listos

  // --- 4. Manejadores del Formulario ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // Usamos 'isSubmitting'
    setError(null);

    try {
      // 5. Llamar al servicio de 'actualizar'
      await ninoService.actualizar(Number(id), formData);
      
      alert("Niño actualizado exitosamente.");
      router.push("/dashboard/apadrinamiento"); // Volver a la lista
    } catch (err) {
      console.error("Error al actualizar:", err);
      setError("No se pudo actualizar el registro.");
    } finally {
      setIsSubmitting(false); // Usamos 'isSubmitting'
    }
  };

  // --- 6. Renderizado ---
  if (isAuthLoading || isLoadingPage) {
    return <div className="flex items-center justify-center min-h-screen">Cargando datos...</div>;
  }
  
  if (!user || user.role !== "ADMIN") {
    return null; // El hook de seguridad ya está redirigiendo
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <Link 
          href="/dashboard/apadrinamiento"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={18} />
          Volver a la lista
        </Link>
        <h1 className="text-3xl font-bold text-[#1E3A5F]">
          Editar Información del Niño
        </h1>
      </header>

      {/* Mostramos el error de carga si existe */}
      {error && !isSubmitting && (
         <p className="text-sm text-center text-red-600 mb-4">{error}</p>
      )}

      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        {/* Fila 1: Nombres y Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-1">
              Nombres
            </label>
            <input
              type="text"
              id="nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FDD835] focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">
              Apellidos
            </label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FDD835] focus:border-transparent"
            />
          </div>
        </div>

        {/* Fila 2: Fecha de Nacimiento */}
        <div>
          <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            id="fechaNacimiento"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FDD835] focus:border-transparent"
          />
        </div>
        {/* Nota: Quitamos el campo 'Estado' porque se maneja por separado (PATCH) */}

        {/* Fila 3: URL de la Foto */}
        <div>
          <label htmlFor="urlFotoPrincipal" className="block text-sm font-medium text-gray-700 mb-1">
            URL de la Foto Principal
          </label>
          <input
            type="url"
            id="urlFotoPrincipal"
            name="urlFotoPrincipal"
            value={formData.urlFotoPrincipal}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FDD835] focus:border-transparent"
          />
        </div>

        {/* Fila 4: Historia */}
        <div>
          <label htmlFor="historia" className="block text-sm font-medium text-gray-700 mb-1">
            Historia del Niño
          </label>
          <textarea
            id="historia"
            name="historia"
            rows={5}
            value={formData.historia}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FDD835] focus:border-transparent"
            placeholder="Escribe una breve historia..."
          ></textarea>
        </div>

        {/* Errores de envío */}
        {error && isSubmitting && (
          <p className="text-sm text-center text-red-600">{error}</p>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/apadrinamiento")}
            className="px-6 py-2 font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 font-semibold text-[#1E3A5F] bg-[#FDD835] rounded-full hover:bg-[#FBC02D] transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Actualizando..." : "Actualizar Niño"}
          </button>
        </div>
      </form>
    </div>
  );
}