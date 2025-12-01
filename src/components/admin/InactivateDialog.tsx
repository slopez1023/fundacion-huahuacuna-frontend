"use client";

import { useState } from "react";
import { X, AlertTriangle, Ban } from "lucide-react";
import { Child } from "@/services/ChildService";

interface InactivateDialogProps {
  isOpen: boolean;
  child: Child | null;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export default function InactivateDialog({ isOpen, child, onClose, onConfirm }: InactivateDialogProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !child) return null;

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setError("Debes proporcionar una razón para inhabilitar al niño");
      return;
    }

    if (reason.trim().length < 10) {
      setError("La razón debe tener al menos 10 caracteres");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await onConfirm(reason);
      setReason("");
      onClose();
    } catch (err) {
      setError("Error al inhabilitar. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Ban className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Inhabilitar Niño</h2>
                <p className="text-white/90 text-sm mt-1">
                  {child.firstName} {child.lastName}
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Advertencia */}
          <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-orange-900">
                Estás a punto de inhabilitar a este niño
              </p>
              <p className="text-xs text-orange-700 mt-1">
                El niño quedará marcado como INACTIVO y no aparecerá en el listado de apadrinamiento.
              </p>
            </div>
          </div>

          {/* Info del niño */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <img 
              src={child.imageUrl || `https://ui-avatars.com/api/?name=${child.firstName}`}
              alt={child.firstName}
              className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${child.firstName}`;
              }}
            />
            <div>
              <p className="font-bold text-gray-900 text-lg">
                {child.firstName} {child.lastName}
              </p>
              <p className="text-sm text-gray-600">
                {child.age} años • ID: {child.id}
              </p>
            </div>
          </div>

          {/* Campo de razón */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Razón de inhabilitación <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              placeholder="Ejemplo: El niño fue adoptado, el niño ya no vive en la fundación, etc."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none resize-none text-gray-900 transition-all ${
                error ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
              disabled={loading}
            />
            <div className="flex justify-between items-center mt-2">
              {error && (
                <p className="text-red-600 text-xs font-medium">{error}</p>
              )}
              <p className={`text-xs ml-auto ${reason.length < 10 ? 'text-gray-500' : 'text-green-600 font-medium'}`}>
                {reason.length} / 10 caracteres mínimo
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-6 py-3 text-gray-700 hover:bg-white rounded-xl transition-all font-semibold border-2 border-gray-300 hover:border-gray-400"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !reason.trim()}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Inhabilitando...</span>
              </>
            ) : (
              <>
                <Ban className="w-5 h-5" />
                <span>Inhabilitar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}