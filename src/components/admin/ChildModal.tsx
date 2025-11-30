"use client";

import { useState } from "react";
import { Child, childService } from "@/services/ChildService";
import { 
  X, 
  User, 
  Calendar, 
  Image, 
  FileText, 
  Save, 
  Heart,
  Users,
  MapPin,
  AlertCircle
} from "lucide-react";

interface ChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  childToEdit?: Child | null; // Para editar un niño existente
}

export default function ChildModal({ isOpen, onClose, onSaved, childToEdit }: ChildModalProps) {
  const [formData, setFormData] = useState<Partial<Child>>({
    firstName: childToEdit?.firstName || "",
    lastName: childToEdit?.lastName || "",
    birthDate: childToEdit?.birthDate || "",
    gender: childToEdit?.gender || "",
    story: childToEdit?.story || "",
    imageUrl: childToEdit?.imageUrl || "",
    status: childToEdit?.status || "AVAILABLE",
    needs: childToEdit?.needs || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "El nombre es obligatorio";
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = "El apellido es obligatorio";
    }
    if (!formData.birthDate) {
      newErrors.birthDate = "La fecha de nacimiento es obligatoria";
    }
    if (!formData.gender) {
      newErrors.gender = "El género es obligatorio";
    }
    if (!formData.story?.trim()) {
      newErrors.story = "La historia es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (childToEdit?.id) {
        // Editar existente
        await childService.update(childToEdit.id, formData as Child);
      } else {
        // Crear nuevo
        await childService.create(formData as Child);
      }
      onSaved();
      onClose();
      // Limpiar formulario
      setFormData({ 
        firstName: "", 
        lastName: "", 
        birthDate: "", 
        gender: "",
        story: "", 
        imageUrl: "", 
        status: "AVAILABLE",
        needs: ""
      });
      setErrors({});
    } catch (error) {
      console.error("Error al guardar:", error);
      setErrors({ submit: "Error al guardar el niño. Intenta nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ 
      firstName: "", 
      lastName: "", 
      birthDate: "", 
      gender: "",
      story: "", 
      imageUrl: "", 
      status: "AVAILABLE",
      needs: ""
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Encabezado con gradiente */}
        <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {childToEdit ? "Editar Niño" : "Registrar Nuevo Niño"}
                </h2>
                <p className="text-white/80 text-sm">
                  {childToEdit ? "Actualiza la información del niño" : "Completa la información del niño"}
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Error general */}
        {errors.submit && (
          <div className="mx-8 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Formulario con scroll */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-[#1E3A5F]" />
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Juan"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] outline-none text-gray-900 transition-all hover:border-gray-300 ${
                  errors.firstName ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value });
                  if (errors.firstName) setErrors({ ...errors, firstName: "" });
                }}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-[#1E3A5F]" />
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Pérez"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] outline-none text-gray-900 transition-all hover:border-gray-300 ${
                  errors.lastName ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value });
                  if (errors.lastName) setErrors({ ...errors, lastName: "" });
                }}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Fecha de Nacimiento y Género */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1E3A5F]" />
                Fecha de Nacimiento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] outline-none text-gray-900 transition-all hover:border-gray-300 ${
                  errors.birthDate ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                value={formData.birthDate}
                onChange={(e) => {
                  setFormData({ ...formData, birthDate: e.target.value });
                  if (errors.birthDate) setErrors({ ...errors, birthDate: "" });
                }}
              />
              {errors.birthDate && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.birthDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1E3A5F]" />
                Género <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] outline-none text-gray-900 transition-all hover:border-gray-300 cursor-pointer ${
                  errors.gender ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                value={formData.gender}
                onChange={(e) => {
                  setFormData({ ...formData, gender: e.target.value });
                  if (errors.gender) setErrors({ ...errors, gender: "" });
                }}
              >
                <option value="">Seleccionar género</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.gender}
                </p>
              )}
            </div>
          </div>

          {/* Estado (solo visible al editar) */}
          {childToEdit && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#1E3A5F]" />
                Estado
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] outline-none text-gray-900 transition-all hover:border-gray-300 cursor-pointer"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Child["status"] })}
              >
                <option value="AVAILABLE">Disponible</option>
                <option value="SPONSORED">Apadrinado</option>
                <option value="INACTIVE">Inactivo</option>
              </select>
            </div>
          )}

          {/* URL de la Foto */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Image className="w-4 h-4 text-[#1E3A5F]" />
              URL de la Foto
            </label>
            <input
              type="url"
              placeholder="https://ejemplo.com/foto.jpg"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] outline-none text-gray-900 transition-all hover:border-gray-300"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-2">
              Pega aquí el enlace directo a la imagen del niño (opcional)
            </p>
            {formData.imageUrl && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-2">Vista previa:</p>
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Historia */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1E3A5F]" />
              Historia / Biografía <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Cuéntanos la historia del niño, sus sueños, personalidad..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] outline-none resize-none text-gray-900 transition-all hover:border-gray-300 ${
                errors.story ? "border-red-300 bg-red-50" : "border-gray-200"
              }`}
              value={formData.story}
              onChange={(e) => {
                setFormData({ ...formData, story: e.target.value });
                if (errors.story) setErrors({ ...errors, story: "" });
              }}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.story ? (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.story}
                </p>
              ) : (
                <span></span>
              )}
              <p className="text-xs text-gray-500">
                {formData.story?.length || 0} caracteres
              </p>
            </div>
          </div>

          {/* Necesidades especiales */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#1E3A5F]" />
              Necesidades Especiales
            </label>
            <textarea
              rows={2}
              placeholder="¿Tiene alguna necesidad especial? (médica, educativa, etc.)"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] outline-none resize-none text-gray-900 transition-all hover:border-gray-300"
              value={formData.needs}
              onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Opcional - Información importante para los padrinos
            </p>
          </div>

          {/* Footer con botones */}
          <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={handleClose}
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
                  <span>{childToEdit ? "Actualizar" : "Guardar Niño"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}