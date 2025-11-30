"use client";

import { useState, useEffect } from "react";
import { Project, projectService } from "@/services/ProjectService";
import { X, FolderOpen, Target, DollarSign, Image as ImageIcon, FileText, Save } from "lucide-react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  project?: Project | null;
}

export default function ProjectModal({ isOpen, onClose, onSaved, project }: ProjectModalProps) {
  const [formData, setFormData] = useState<Project>({
    title: "",
    description: "",
    goalAmount: 0,
    currentAmount: 0,
    imageUrl: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({ title: "", description: "", goalAmount: 0, currentAmount: 0, imageUrl: "" });
    }
  }, [project]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (project?.id) {
        await projectService.update(project.id, formData);
      } else {
        await projectService.create(formData);
      }
      onSaved();
      onClose();
      setFormData({ title: "", description: "", goalAmount: 0, currentAmount: 0, imageUrl: "" });
    } catch (error) {
      alert("Error al guardar el proyecto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8f] p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{project ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
                <p className="text-blue-100 text-sm">Completa la información del proyecto</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FolderOpen className="w-4 h-4 text-[#1E3A5F]" />
              Nombre del Proyecto
            </label>
            <input
              required
              type="text"
              placeholder="Ej: Construcción de aulas escolares"
              className="w-full p-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none transition-all"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Target className="w-4 h-4 text-green-600" />
                Meta ($)
              </label>
              <input
                required
                type="number"
                min="0"
                placeholder="10000"
                className="w-full p-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none transition-all"
                value={formData.goalAmount}
                onChange={(e) => setFormData({ ...formData, goalAmount: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                Recaudado Actual ($)
              </label>
              <input
                required
                type="number"
                min="0"
                placeholder="5000"
                className="w-full p-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none transition-all"
                value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <ImageIcon className="w-4 h-4 text-purple-600" />
              Imagen del Proyecto (URL)
            </label>
            <input
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full p-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none transition-all"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            {formData.imageUrl && (
              <div className="mt-3 p-2 border border-gray-200 rounded-xl">
                <p className="text-xs text-gray-600 mb-2 font-medium">Vista previa:</p>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Imagen+no+disponible';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 text-orange-600" />
              Descripción del Proyecto
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe los objetivos, alcance e impacto del proyecto..."
              className="w-full p-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none resize-none transition-all"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.description.length} caracteres</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8f] text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{project ? 'Actualizar' : 'Guardar'} Proyecto</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}