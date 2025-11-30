/**
 * ApplicationCard - Tarjeta de solicitud
 * Muestra información resumida de una solicitud con acciones rápidas
 * 
 * @author Fundación Huahuacuna
 * @version 1.0
 */

"use client";

import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import { ApplicationResponse, ApplicationStatus, ApplicationType } from '@/types/application';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ApplicationCardProps {
  application: ApplicationResponse;
  onView: (application: ApplicationResponse) => void;
  onApprove: (id: number, comments?: string) => Promise<void>;
  onReject: (id: number, comments: string) => Promise<void>;
}

export default function ApplicationCard({ 
  application, 
  onView, 
  onApprove, 
  onReject 
}: ApplicationCardProps) {
  
  const getStatusBadge = (status: ApplicationStatus) => {
    const styles = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      EN_REVISION: 'bg-blue-100 text-blue-800 border-blue-200',
      APROBADO: 'bg-green-100 text-green-800 border-green-200',
      RECHAZADO: 'bg-red-100 text-red-800 border-red-200'
    };

    const labels = {
      PENDIENTE: 'Pendiente',
      EN_REVISION: 'En Revisión',
      APROBADO: 'Aprobado',
      RECHAZADO: 'Rechazado'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getTypeBadge = (type: ApplicationType) => {
    const isVolunteer = type === ApplicationType.VOLUNTARIO;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        isVolunteer 
          ? 'bg-purple-100 text-purple-800 border border-purple-200' 
          : 'bg-pink-100 text-pink-800 border border-pink-200'
      }`}>
        {isVolunteer ? 'Voluntario' : 'Padrino'}
      </span>
    );
  };

  const timeAgo = formatDistanceToNow(new Date(application.createdAt), { 
    addSuffix: true, 
    locale: es 
  });

  const handleApprove = async () => {
    try {
      await onApprove(application.id);
    } catch (error) {
      console.error('Error al aprobar:', error);
    }
  };

  const handleReject = async () => {
    const comments = prompt('Por favor, ingresa el motivo del rechazo:');
    if (comments && comments.trim()) {
      try {
        await onReject(application.id, comments);
      } catch (error) {
        console.error('Error al rechazar:', error);
      }
    } else if (comments !== null) {
      alert('Debes ingresar un comentario para rechazar la solicitud');
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-xl hover:border-[#FDD835] transition-all duration-300 transform hover:-translate-y-1">
      {/* Header mejorado */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 flex items-start gap-3">
          {/* Avatar con inicial */}
          <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A5F] to-[#2c5282] text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md flex-shrink-0">
            {application.fullName.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#1E3A5F] text-lg mb-2 truncate">
              {application.fullName}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {getTypeBadge(application.type)}
              {getStatusBadge(application.status)}
            </div>
          </div>
        </div>
      </div>

      {/* Info mejorada */}
      <div className="space-y-3 mb-5 bg-gray-50 rounded-xl p-4">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="truncate font-medium">{application.email}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <span className="font-medium">{application.phone}</span>
        </div>

        {application.type === ApplicationType.VOLUNTARIO && application.interestArea && (
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="truncate font-medium">{application.interestArea}</span>
          </div>
        )}

        {application.type === ApplicationType.PADRINO && application.country && (
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="truncate font-medium">{application.country}</span>
          </div>
        )}
      </div>

      {/* Footer mejorado */}
      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-4 h-4" />
          <span className="font-medium">{timeAgo}</span>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {application.status === ApplicationStatus.PENDIENTE && (
            <>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-1"
                title="Aprobar"
              >
                <CheckCircle className="w-4 h-4" />
                Aprobar
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-1"
                title="Rechazar"
              >
                <XCircle className="w-4 h-4" />
                Rechazar
              </button>
            </>
          )}
          
          <button
            onClick={() => onView(application)}
            className="px-4 py-2 bg-[#1E3A5F] text-white text-sm font-bold rounded-xl hover:bg-[#152a45] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-1"
          >
            <Eye className="w-4 h-4" />
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
}