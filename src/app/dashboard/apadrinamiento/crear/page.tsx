
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ninoService } from "@/lib/apiService";
import type { ICrearNinoRequest, EstadoNino } from "@/types/apadrinamiento.types";
import { ArrowLeft } from "lucide-react";

export default function CrearNinoPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();  

  // --- 1. Estado del Formulario ---
  const [formData, setFormData] = useState<ICrearNinoRequest>({
    nombres: "",
    apellidos: "",
    fechaNacimiento: "", // Formato "YYYY-MM-DD"
    historia: "",
    urlFotoPrincipal: "",
    estado: "DISPONIBLE", // Estado por defecto
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- 2. Protección de la Ruta ---
  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== "ADMIN") {
        router.push("/login"); // Redirige si no es Admin
      }
    }
  }, [user, isLoading, router]);

  // --- 3. Manejadores del Formulario ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(false);
    setError(null);

    try {
      // 4. Llamar al servicio de la API
      await ninoService.crear(formData);
      
      // 5. Éxito: Mostrar alerta y redirigir
      alert("Niño creado exitosamente.");
      router.push("/dashboard/apadrinamiento"); // Volver a la lista
    } catch (err) {
      console.error("Error al crear:", err);
      setError("No se pudo crear el registro. Revisa los campos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 5. Renderizado ---
  if (isLoading || !user || user.role !== "ADMIN") {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
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
          Agregar Nuevo Niño
        </h1>
      </header>

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

        {/* Fila 2: Fecha de Nacimiento y Estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado Inicial
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FDD835] focus:border-transparent"
            >
              <option value="DISPONIBLE">Disponible</option>
              <option value="EN_PROCESO">En Proceso</option>
              <option value="APADRINADO">Apadrinado</option>
            </select>
          </div>
        </div>

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

        {/* Errores y Botón de Envío */}
        {error && (
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
            {isSubmitting ? "Guardando..." : "Guardar Niño"}
          </button>
        </div>
      </form>
    </div>
  );
}