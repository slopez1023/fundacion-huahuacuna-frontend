/**
 * Dashboard Administrativo
 * Panel de control exclusivo para administradores de la Fundación Huahuacuna
 * 
 * @author Fundación Huahuacuna
 * @version 1.0
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  // Hooks de datos
  const {
    applications,
    statistics,
    isLoading,
    error,
    fetchApplications,
    approve,
    reject,
    updateStatus,
    clearError
  } = useApplications({ autoFetch: true });

const {
  unreadCount,
  fetchUnreadCount
} = useNotifications({ pollInterval: 30000 });

  // Estado local
  const [selectedApplication, setSelectedApplication] = useState<ApplicationResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<ApplicationType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Refrescar datos al montar
  useEffect(() => {
    fetchApplications();
    fetchUnreadCount();
  }, [fetchApplications, fetchUnreadCount]);

  // Filtrar aplicaciones
  const filteredApplications = applications.filter(app => {
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

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 font-['Poppins']">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <Breadcrumb items={[{ label: "Panel Administrativo" }]} />
            
            <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#1E3A5F]">
                  Panel Administrativo
                </h1>
                <p className="text-gray-600 mt-2">
                  Bienvenida, <span className="font-semibold">{user?.name || 'Administradora'}</span>
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Notificaciones */}
                <button 
                  onClick={() => router.push('/dashboard/notifications')}
                  className="relative p-2 text-gray-600 hover:text-[#1E3A5F] transition-colors rounded-lg hover:bg-gray-100"
                  title="Notificaciones"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors font-medium rounded-lg hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Solicitudes"
              value={statistics?.total || 0}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              color="blue"
            />

            <StatCard
              title="Pendientes"
              value={statistics?.pendientes || 0}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="yellow"
            />

            <StatCard
              title="Aprobadas"
              value={statistics?.aprobadas || 0}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="green"
            />

            <StatCard
              title="Voluntarios"
              value={statistics?.totalVoluntarios || 0}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              color="blue"
            />
          </div>

          {/* Filtros y búsqueda */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o email..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Filtro por tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as ApplicationType | 'ALL')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900"                >
                  <option value="ALL">Todos</option>
                  <option value="VOLUNTARIO">Voluntarios</option>
                  <option value="PADRINO">Padrinos</option>
                </select>
              </div>

              {/* Filtro por estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | 'ALL')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900"
                >
                  <option value="ALL">Todos</option>
                  <option value="PENDIENTE">Pendientes</option>
                  <option value="EN_REVISION">En Revisión</option>
                  <option value="APROBADO">Aprobados</option>
                  <option value="RECHAZADO">Rechazados</option>
                </select>
              </div>
            </div>

            {/* Botón de refrescar */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={fetchApplications}
                disabled={isLoading}
                className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#152a45] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isLoading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#1E3A5F]">
                Solicitudes ({filteredApplications.length})
              </h2>
            </div>

            {isLoading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A5F] mb-4"></div>
                <p className="text-gray-600">Cargando solicitudes...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay solicitudes
                </h3>
                <p className="text-gray-600">
                  {searchTerm || filterType !== 'ALL' || filterStatus !== 'ALL'
                    ? 'No se encontraron solicitudes con los filtros aplicados'
                    : 'Aún no hay solicitudes registradas'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredApplications.map((application) => (
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