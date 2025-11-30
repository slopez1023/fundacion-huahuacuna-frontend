/**
 * GodchildLog - Bitácora del niño apadrinado
 * @author Fundación Huahuacuna
 */

"use client";

import { IBitacoraEntrada } from "@/types/apadrinamiento.types";
import { BookOpen, Plus, Calendar } from "lucide-react";
import { useState } from "react";

interface GodchildLogProps {
  entries: IBitacoraEntrada[];
  onAddEntry?: (titulo: string, contenido: string) => Promise<void>;
  isLoading?: boolean;
}

export default function GodchildLog({
  entries,
  onAddEntry,
  isLoading = false,
}: GodchildLogProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ titulo: "", contenido: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.contenido.trim()) return;

    setIsSubmitting(true);
    try {
      if (onAddEntry) {
        await onAddEntry(formData.titulo, formData.contenido);
        setFormData({ titulo: "", contenido: "" });
        setShowForm(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-[#1E3A5F]" />
          <h3 className="text-2xl font-bold text-[#1E3A5F]">Bitácora</h3>
        </div>
        {onAddEntry && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar entrada
          </button>
        )}
      </div>

      {/* Formulario para nueva entrada */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-r from-[#1E3A5F]/5 to-[#2c5282]/5 border-2 border-[#1E3A5F]/20 rounded-2xl p-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
                placeholder="Ej: Progreso académico, Nota importante..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F] focus:border-[#1E3A5F] transition-all text-gray-900 placeholder:text-gray-400 bg-white"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Contenido
              </label>
              <textarea
                value={formData.contenido}
                onChange={(e) =>
                  setFormData({ ...formData, contenido: e.target.value })
                }
                placeholder="Escribe los detalles de esta entrada..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F] focus:border-[#1E3A5F] transition-all text-gray-900 placeholder:text-gray-400 bg-white resize-none"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !formData.titulo.trim() || !formData.contenido.trim()}
                className="flex-1 bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Guardando..." : "Guardar entrada"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-xl font-semibold hover:bg-gray-400 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Lista de entradas */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#1E3A5F] border-t-transparent"></div>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No hay entradas en la bitácora aún</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-bold text-[#1E3A5F]">
                  {entry.titulo}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(entry.fecha).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-3">
                {entry.contenido}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="px-2 py-1 bg-gray-100 rounded-full">
                  Por:{" "}
                  {entry.registradoPor === "PADRINO"
                    ? "Padrino"
                    : "Administrador"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
