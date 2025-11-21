/**
 * ApplicationModal - Modal de detalles de solicitud
 * Muestra información completa y permite gestionar la solicitud
 * 
 * @author Fundación Huahuacuna
 * @version 1.0
 */

"use client";

import { useState } from 'react';
import { ApplicationResponse, ApplicationStatus, ApplicationType } from '@/src/types/application';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ApplicationModalProps {
  application: ApplicationResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: number, comments?: string) => Promise<void>;
  onReject: (id: number, comments: string) => Promise<void>;
  onUpdateStatus?: (id: number, status: ApplicationStatus, comments?: string) => Promise<void>;
}

export default function ApplicationModal({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onUpdateStatus
}: ApplicationModalProps) {
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeAction, setActiveAction] = useState<'approve' | 'reject' | null>(null);

  if (!isOpen || !application) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    setActiveAction('approve');
    try {
      await onApprove(application.id, comments || undefined);
      setComments('');
      onClose();
    } catch (error) {
      console.error('Error al aprobar:', error);
      alert('Error al aprobar la solicitud. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
      setActiveAction(null);
    }
  };

  const handleReject = async () => {
    if (!comments.trim()) {
      alert('Por favor, ingresa un comentario explicando el motivo del rechazo');
      return;
    }
    
    setIsSubmitting(true);
    setActiveAction('reject');
    try {
      await onReject(application.id, comments);
      setComments('');
      onClose();
    } catch (error) {
      console.error('Error al rechazar:', error);
      alert('Error al rechazar la solicitud. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
      setActiveAction(null);
    }
  };

  const getStatusLabel = (status: ApplicationStatus) => {
    const labels = {
      PENDIENTE: 'Pendiente',
      EN_REVISION: 'En Revisión',
      APROBADO: 'Aprobado',
      RECHAZADO: 'Rechazado'
    };
    return labels[status];
  };

  const isVolunteer = application.type === ApplicationType.VOLUNTARIO;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1E3A5F]">Detalles de Solicitud</h2>
            <p className="text-sm text-gray-600 mt-1">
              {isVolunteer ? 'Voluntariado' : 'Apadrinamiento'} • {getStatusLabel(application.status)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Información Personal */}
          <div>
            <h3 className="font-semibold text-[#1E3A5F] mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Información Personal
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500">Nombre Completo</label>
                  <p className="text-sm text-gray-900 font-medium">{application.fullName}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Correo Electrónico</label>
                  <p className="text-sm text-gray-900">{application.email}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Teléfono</label>
                  <p className="text-sm text-gray-900">{application.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Fecha de Solicitud</label>
                  <p className="text-sm text-gray-900">
                    {format(new Date(application.createdAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información Específica de Voluntario */}
          {isVolunteer && (
            <div>
              <h3 className="font-semibold text-[#1E3A5F] mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Información de Voluntariado
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Área de Interés</label>
                  <p className="text-sm text-gray-900">{application.interestArea || 'No especificado'}</p>
                </div>
                {application.availability && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">Disponibilidad Horaria</label>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{application.availability}</p>
                  </div>
                )}
                {application.previousExperience && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">Experiencia Previa</label>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{application.previousExperience}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-gray-500">Acepta recibir información</label>
                  <p className="text-sm text-gray-900">
                    {application.acceptsInformation ? 'Sí' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Información Específica de Padrino */}
          {!isVolunteer && (
            <div>
              <h3 className="font-semibold text-[#1E3A5F] mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Información de Apadrinamiento
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">País de Residencia</label>
                    <p className="text-sm text-gray-900">{application.country || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Número de Documento</label>
                    <p className="text-sm text-gray-900">{application.idNumber || 'No especificado'}</p>
                  </div>
                </div>
                {application.idDocumentPath && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">Documento de Identidad</label>
                    <p className="text-sm text-blue-600 hover:underline cursor-pointer">
                      Ver documento adjunto
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Información de Revisión */}
          {(application.reviewedAt || application.adminComments) && (
            <div>
              <h3 className="font-semibold text-[#1E3A5F] mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Información de Revisión
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {application.reviewedAt && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">Fecha de Revisión</label>
                    <p className="text-sm text-gray-900">
                      {format(new Date(application.reviewedAt), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                    </p>
                  </div>
                )}
                {application.adminComments && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">Comentarios del Administrador</label>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{application.adminComments}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Acciones (solo si está pendiente) */}
          {application.status === ApplicationStatus.PENDIENTE && (
            <div>
              <h3 className="font-semibold text-[#1E3A5F] mb-3">Gestionar Solicitud</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentarios (opcional para aprobar, requerido para rechazar)
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent resize-none"
                    placeholder="Ingresa comentarios sobre esta solicitud..."
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting && activeAction === 'approve' ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Aprobando...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Aprobar Solicitud
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleReject}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting && activeAction === 'reject' ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
</svg>
Rechazando...
</>
) : (
<>
<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
</svg>
Rechazar Solicitud
</>
)}
</button>
</div>
</div>
</div>
)}
</div>
  {/* Footer */}
    <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
      <button
        onClick={onClose}
        disabled={isSubmitting}
        className="px-6 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        Cerrar
      </button>
    </div>
  </div>
</div>
);
}
