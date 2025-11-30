/**
 * Página de Notificaciones - Panel de Administrador
 * @author Fundación Huahuacuna
 * @version 1.0
 */

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/lib/api/notificationApi';
import { useAuth } from '@/hooks/useAuth';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { 
  Bell, 
  DollarSign, 
  UserPlus, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Trash2, 
  Check, 
  Filter,
  RefreshCw,
  Clock
} from 'lucide-react';

export default function NotificationsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markRead,
    markAllRead,
    remove,
    clearError
  } = useNotifications({ autoFetch: true, pollInterval: 30000 });

  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; type: 'delete' | 'markAll' | null; notificationId?: number }>({ isOpen: false, type: null });

  // Filtrar notificaciones
  const filteredNotifications = notifications.filter(notif => {
    const matchesReadFilter = filter === 'all' || (filter === 'unread' && !notif.isRead);
    const matchesTypeFilter = selectedType === 'all' || notif.type === selectedType;
    return matchesReadFilter && matchesTypeFilter;
  });

  // Función para obtener el ícono según el tipo
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'DONATION':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'APPLICATION':
        return <UserPlus className="w-5 h-5 text-blue-600" />;
      case 'SYSTEM':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  // Función para obtener el color de fondo según el tipo
  const getNotificationBgColor = (type: string, isRead: boolean) => {
    const baseClass = isRead ? 'bg-opacity-5' : 'bg-opacity-10';
    switch (type) {
      case 'DONATION':
        return `bg-green-100 ${baseClass}`;
      case 'APPLICATION':
        return `bg-blue-100 ${baseClass}`;
      case 'SYSTEM':
        return `bg-yellow-100 ${baseClass}`;
      default:
        return `bg-gray-100 ${baseClass}`;
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Hace un momento';
    if (diffInMins < 60) return `Hace ${diffInMins} min`;
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInDays < 7) return `Hace ${diffInDays}d`;
    
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Handlers
  const handleMarkAsRead = async (id: number) => {
    try {
      await markRead(id);
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  };

  const handleMarkAllAsRead = () => {
    setConfirmDialog({ isOpen: true, type: 'markAll' });
  };

  const handleDelete = (id: number) => {
    setConfirmDialog({ isOpen: true, type: 'delete', notificationId: id });
  };

  const confirmAction = async () => {
    try {
      if (confirmDialog.type === 'markAll') {
        await markAllRead();
      } else if (confirmDialog.type === 'delete' && confirmDialog.notificationId) {
        await remove(confirmDialog.notificationId);
      }
      setConfirmDialog({ isOpen: false, type: null });
    } catch (err) {
      console.error('Error al realizar acción:', err);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 font-['Poppins']">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Bell className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Notificaciones
                  </h1>
                  <p className="text-white/90 mt-1">
                    Mantente al tanto de las últimas actualizaciones
                  </p>
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="bg-[#FDD835] text-[#1E3A5F] px-5 py-2.5 rounded-xl font-semibold hover:bg-[#fce34f] transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="hidden sm:inline">Marcar todas como leídas</span>
                </button>
              )}
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-3xl font-bold text-[#1E3A5F] mt-2">{notifications.length}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <Bell className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sin leer</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{unreadCount}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Leídas</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {notifications.length - unreadCount}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-[#1E3A5F]" />
              <h3 className="text-lg font-bold text-[#1E3A5F]">Filtrar por:</h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Filtro de lectura */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    filter === 'all'
                      ? 'bg-[#1E3A5F] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    filter === 'unread'
                      ? 'bg-[#FDD835] text-[#1E3A5F] shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sin leer ({unreadCount})
                </button>
              </div>

              {/* Filtro de tipo */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none transition-all text-gray-900"
              >
                <option value="all">Todos los tipos</option>
                <option value="DONATION">Donaciones</option>
                <option value="APPLICATION">Solicitudes</option>
                <option value="SYSTEM">Sistema</option>
                <option value="INFO">Información</option>
              </select>

              {/* Botón refrescar */}
              <button
                onClick={fetchNotifications}
                disabled={isLoading}
                className="ml-auto px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-2 font-medium"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Actualizando...' : 'Actualizar'}</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
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

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A5F] mb-4"></div>
              <p className="text-gray-600">Cargando notificaciones...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredNotifications.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Bell className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">
                No hay notificaciones
              </h3>
              <p className="text-gray-600">
                {filter === 'unread' 
                  ? '¡Excelente! No tienes notificaciones sin leer.' 
                  : 'Aún no has recibido ninguna notificación.'}
              </p>
            </div>
          )}

          {/* Lista de Notificaciones */}
          {!isLoading && filteredNotifications.length > 0 && (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${
                    notification.isRead ? 'border-gray-100' : 'border-[#FDD835] border-2'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icono */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${getNotificationBgColor(notification.type, notification.isRead)} flex items-center justify-center`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className={`text-lg font-semibold ${
                              notification.isRead ? 'text-gray-700' : 'text-[#1E3A5F]'
                            }`}>
                              {notification.title}
                            </h3>
                            <p className={`mt-1 text-sm ${
                              notification.isRead ? 'text-gray-500' : 'text-gray-700'
                            }`}>
                              {notification.message}
                            </p>
                          </div>

                          {/* Badge de estado */}
                          {!notification.isRead && (
                            <span className="flex-shrink-0 px-3 py-1 text-xs font-semibold bg-[#FDD835] text-[#1E3A5F] rounded-full">
                              Nueva
                            </span>
                          )}
                        </div>

                        {/* Fecha y acciones */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {formatDate(notification.createdAt)}
                          </div>

                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-110"
                                title="Marcar como leída"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                              title="Eliminar"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* ConfirmDialog para Marcar todas como leídas */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen && confirmDialog.type === 'markAll'}
          onClose={() => setConfirmDialog({ isOpen: false, type: null })}
          onConfirm={confirmAction}
          title="Marcar todas como leídas"
          message="¿Deseas marcar todas las notificaciones como leídas? Esta acción es irreversible."
          confirmText="Marcar todas"
          cancelText="Cancelar"
          type="info"
        />

        {/* ConfirmDialog para Eliminar notificación */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen && confirmDialog.type === 'delete'}
          onClose={() => setConfirmDialog({ isOpen: false, type: null })}
          onConfirm={confirmAction}
          title="Eliminar Notificación"
          message="¿Estás seguro de que deseas eliminar esta notificación? No podrás recuperarla."
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
        />
        </div>
      </main>
    </ProtectedRoute>
  );
}