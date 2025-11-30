"use client";

import { useState } from "react";
import { Event, eventService } from "@/services/EventService";
import { X, CalendarDays, MapPin, Image, FileText, Save, Clock } from "lucide-react";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function EventModal({ isOpen, onClose, onSaved }: EventModalProps) {
  const [formData, setFormData] = useState<Event>({
    title: "",
    description: "",
    date: "",
    location: "",
    imageUrl: ""
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await eventService.create(formData);
      onSaved();
      onClose();
      setFormData({ title: "", description: "", date: "", location: "", imageUrl: "" });
    } catch (error) {
      alert("Error al guardar el evento");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <CalendarDays className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Nuevo Evento</h2>
                <p className="text-white/80 text-sm">Completa la información del evento</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#1E3A5F]" />
              Título del Evento
            </label>
            <input 
              required 
              type="text"
              placeholder="Ej: Campaña de Donación 2025"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] outline-none text-gray-900 transition-all hover:border-gray-300"
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fecha y Hora */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1E3A5F]" />
                Fecha y Hora
              </label>
              <input 
                required 
                type="datetime-local"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] outline-none text-gray-900 transition-all hover:border-gray-300"
                value={formData.date} 
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1E3A5F]" />
                Ubicación
              </label>
              <input 
                required 
                type="text"
                placeholder="Ej: Armenia, Quindío"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] outline-none text-gray-900 transition-all hover:border-gray-300"
                value={formData.location} 
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Image className="w-4 h-4 text-[#1E3A5F]" />
              Imagen (URL)
            </label>
            <input 
              type="url" 
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] outline-none text-gray-900 transition-all hover:border-gray-300"
              value={formData.imageUrl} 
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              URL de la imagen del evento
            </p>
            {formData.imageUrl && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-2">Vista previa:</p>
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="w-full h-32 rounded-xl object-cover border-2 border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1E3A5F]" />
              Descripción
            </label>
            <textarea 
              required 
              rows={4}
              placeholder="Describe los detalles del evento..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] outline-none resize-none text-gray-900 transition-all hover:border-gray-300"
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-2">
              {formData.description?.length || 0} caracteres
            </p>
          </div>

          {/* Footer con botones */}
          <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all font-semibold border-2 border-gray-200 hover:border-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] text-white rounded-xl hover:from-[#152a45] hover:to-[#1E3A5F] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Guardar Evento</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}