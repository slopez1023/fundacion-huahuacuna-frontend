/**
 * AvailableChildrenList - Lista de niños disponibles para apadrinar
 * @author Fundación Huahuacuna
 */

"use client";

import { useState } from "react";
import { INinoResponse } from "@/types/apadrinamiento.types";
import { Heart, Users, Calendar, MapPin } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface AvailableChildrenListProps {
  children: INinoResponse[];
  onSelectChild: (childId: number, childName: string) => void;
  isLoading?: boolean;
}

export default function AvailableChildrenList({
  children,
  onSelectChild,
  isLoading = false,
}: AvailableChildrenListProps) {
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [selectedChildName, setSelectedChildName] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSelectClick = (child: INinoResponse) => {
    setSelectedChildId(child.id);
    setSelectedChildName(`${child.nombre} ${child.apellido}`);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (selectedChildId) {
      onSelectChild(selectedChildId, selectedChildName);
      setShowConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#1E3A5F] border-t-transparent mb-6"></div>
        <p className="text-gray-600 text-lg">Cargando niños disponibles...</p>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="text-center py-16">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          No hay niños disponibles en este momento
        </h3>
        <p className="text-gray-600">
          Por favor, intenta más tarde o contacta con el administrador
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child) => (
          <div
            key={child.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-300"
          >
            {/* Foto del niño */}
            <div className="relative h-48 bg-gradient-to-br from-green-400 to-green-600 overflow-hidden">
              {child.fotoUrl ? (
                <img
                  src={child.fotoUrl}
                  alt={`${child.nombre} ${child.apellido}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart className="w-16 h-16 text-white/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            {/* Contenido */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[#1E3A5F] mb-2">
                {child.nombre} {child.apellido}
              </h3>

              {/* Información básica */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span className="text-sm">
                    {child.edad} años • {child.genero}
                  </span>
                </div>
              </div>

              {/* Biografía */}
              {child.biografia && (
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {child.biografia}
                </p>
              )}

              {/* Necesidades */}
              {child.necesidades && (
                <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-400 rounded">
                  <p className="text-xs font-semibold text-amber-900 mb-1">
                    Necesidades especiales:
                  </p>
                  <p className="text-xs text-amber-800 line-clamp-2">
                    {child.necesidades}
                  </p>
                </div>
              )}

              {/* Botón */}
              <button
                onClick={() => handleSelectClick(child)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Apadrinar a {child.nombre}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="Confirmar apadrinamiento"
        message={`¿Deseas apadrinar a ${selectedChildName}? Esto notificará al administrador y comenzaremos con el proceso de apadrinamiento.`}
        confirmText="Sí, apadrinar"
        cancelText="Cancelar"
        type="success"
      />
    </div>
  );
}
