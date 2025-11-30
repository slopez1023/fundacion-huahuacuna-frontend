/**
 * Página de Solicitudes
 * Gestión de solicitudes de voluntarios y padrinos
 * 
 * @author Fundación Huahuacuna
 * @version 1.0
 */

"use client";

import { useState, useEffect } from "react";
import { Search, Filter, RefreshCw, X, FileText, Clock, Eye, CheckCircle2, XCircle } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useAuth } from "@/hooks/useAuth";
import { useApplications } from "@/hooks/useApplications";
import ApplicationCard from "@/components/admin/ApplicationCard";
import ApplicationModal from "@/components/admin/ApplicationModal";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import type { ApplicationResponse, ApplicationType, ApplicationStatus } from "@/types/application";

export default function SolicitudesPage() {
  const { user } = useAuth();
  
  // Hooks de datos
  const {
    applications,
    isLoading,
    error,
    fetchApplications,
    approve,
    reject,
    updateStatus,
    clearError
  } = useApplications({ autoFetch: true });

  // Estado local
  const [selectedApplication, setSelectedApplication] = useState<ApplicationResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<ApplicationType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Refrescar datos al montar
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Filtrar aplicaciones
  const filteredApplications = applications.filter((app: ApplicationResponse) => {
    const matchesType = filterType === 'ALL' || app.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  // Handlers
  const handleViewDetails = (application: ApplicationResponse) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleApprove = async (id: number, comments?: string): Promise<void> => {
    try {
      await approve(id, comments);
      await fetchApplications();
    } catch (error) {
      console.error('Error al aprobar:', error);
      alert('Error al aprobar la solicitud. Por favor, intenta nuevamente.');
    }
  };

  const handleReject = async (id: number, comments: string): Promise<void> => {
    try {
      await reject(id, comments);
      await fetchApplications();
    } catch (error) {
      console.error('Error al rechazar:', error);
      alert('Error al rechazar la solicitud. Por favor, intenta nuevamente.');
    }
  };

  const handleUpdateStatus = async (
    id: number, 
    status: ApplicationStatus, 
    comments?: string
  ): Promise<void> => {
    try {
      await updateStatus(id, status, comments);
      await fetchApplications();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado. Por favor, intenta nuevamente.');
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 font-['Poppins']">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            {/* Título con gradiente */}
            <div className="mt-6 bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] rounded-2xl p-6 md:p-8 text-white shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Gestión de Solicitudes
                  </h1>
                  <p className="text-white/90 mt-1">
                    Administra las solicitudes de voluntarios y padrinos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros y búsqueda */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#1E3A5F] flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros y Búsqueda
              </h3>
              <button
                onClick={fetchApplications}
                disabled={isLoading}
                className="px-4 py-2 bg-[#1E3A5F] text-white rounded-xl hover:bg-[#152a45] transition-all disabled:opacity-50 flex items-center gap-2 shadow-md hover:shadow-lg font-medium"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-1">
                  <Search className="w-3 h-3" />
                  Buscar
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o email..."
                    className="w-full pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] transition-all text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filtro por tipo */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Tipo
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as ApplicationType | 'ALL')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] transition-all text-gray-900 font-medium hover:border-gray-300 cursor-pointer"
                >
                  <option value="ALL">Todos</option>
                  <option value="VOLUNTARIO">Voluntarios</option>
                  <option value="PADRINO">Padrinos</option>
                </select>
              </div>

              {/* Filtro por estado */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Estado
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | 'ALL')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] transition-all text-gray-900 font-medium hover:border-gray-300 cursor-pointer"
                >
                  <option value="ALL">Todos</option>
                  <option value="PENDIENTE">Pendientes</option>
                  <option value="EN_REVISION">En Revisión</option>
                  <option value="APROBADO">Aprobados</option>
                  <option value="RECHAZADO">Rechazados</option>
                </select>
              </div>
            </div>

            {/* Indicadores de filtros activos */}
            {(searchTerm || filterType !== 'ALL' || filterStatus !== 'ALL') && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs font-medium text-gray-600">Filtros activos:</span>
                {searchTerm && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                    Búsqueda: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterType !== 'ALL' && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                    Tipo: {filterType}
                    <button onClick={() => setFilterType('ALL')} className="hover:text-purple-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterStatus !== 'ALL' && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                    Estado: {filterStatus}
                    <button onClick={() => setFilterStatus('ALL')} className="hover:text-green-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 text-sm font-medium">{error}</p>
                <button
                  onClick={clearError}
                  className="text-red-600 text-sm underline mt-1 hover:text-red-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {/* Lista de solicitudes */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A5F] to-[#2c5282] rounded-xl flex items-center justify-center shadow-md">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#1E3A5F]">
                    Solicitudes Registradas
                  </h2>
                  <p className="text-sm text-gray-600 font-medium">
                    {filteredApplications.length} {filteredApplications.length === 1 ? 'solicitud encontrada' : 'solicitudes encontradas'}
                  </p>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border-2 border-blue-200 p-16 text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#1E3A5F] border-t-transparent mb-6"></div>
                <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">Cargando solicitudes...</h3>
                <p className="text-gray-600">Por favor espera un momento</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg border-2 border-gray-200 p-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {searchTerm || filterType !== 'ALL' || filterStatus !== 'ALL'
                    ? 'No se encontraron resultados'
                    : 'No hay solicitudes aún'}
                </h3>
                <p className="text-gray-600 text-lg mb-6">
                  {searchTerm || filterType !== 'ALL' || filterStatus !== 'ALL'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Las nuevas solicitudes aparecerán aquí automáticamente'}
                </p>
                {(searchTerm || filterType !== 'ALL' || filterStatus !== 'ALL') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterType('ALL');
                      setFilterStatus('ALL');
                    }}
                    className="px-6 py-3 bg-[#1E3A5F] text-white rounded-xl font-bold hover:bg-[#152a45] transition-all shadow-md hover:shadow-lg"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredApplications.map((application: ApplicationResponse) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onView={handleViewDetails}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal de detalles */}
        <ApplicationModal
          application={selectedApplication}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedApplication(null);
          }}
          onApprove={handleApprove}
          onReject={handleReject}
          onUpdateStatus={handleUpdateStatus}
        />
      </main>
    </ProtectedRoute>
  );
}
