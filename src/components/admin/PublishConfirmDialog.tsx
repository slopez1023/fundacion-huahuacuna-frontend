/**
 * PublishConfirmDialog - Modal para confirmar la publicación de proyectos/eventos
 * Permite al admin revisar antes de publicar en la página pública
 * 
 * @author Fundación Huahuacuna
 * @version 1.0
 */

"use client";

import { Share2, X } from "lucide-react";

interface PublishConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemType: 'proyecto' | 'evento';
  isLoading?: boolean;
}

export default function PublishConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemType,
  isLoading = false,
}: PublishConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform animate-in zoom-in-95 duration-200">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Publicar {itemType === 'proyecto' ? 'Proyecto' : 'Evento'}
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-gray-700 text-base leading-relaxed mb-4">
            ¿Deseas publicar este {itemType} en la página pública?
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm font-semibold text-blue-900">{title}</p>
            <p className="text-xs text-blue-700 mt-2">
              Una vez publicado, será visible para todos los usuarios en la página de {itemType}s.
            </p>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Publicando...</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Publicar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
