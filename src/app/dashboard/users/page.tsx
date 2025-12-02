/**
 * Página de Gestión de Usuarios
 * Panel administrativo para CRUD completo de usuarios del sistema
 * 
 * @author Fundación Huahuacuna
 * @version 1.0
 */

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import UserModal from '@/components/admin/UserModal';
import UsersTable from '@/components/admin/UsersTable';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import type { User, CreateUserDTO, UpdateUserDTO, UserRole } from '@/types/user';
import { 
  Users, 
  UserPlus, 
  Search, 
  RefreshCw, 
  CheckCircle2,
  XCircle,
  Shield,
  Heart,
  Handshake
} from 'lucide-react';

export default function UsersManagementPage() {
  const router = useRouter();
  const { user: currentUser, logout } = useAuth();

  // Hook de usuarios
  const {
    users,
    isLoading,
    error,
    fetchUsers,
    create,
    update,
    remove,
    toggleStatus,
    search,
    filterByRole,
    clearError
  } = useUsers({ autoFetch: true });

  // Estados locales
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [filterRole, setFilterRole] = useState<UserRole | 'ALL'>('ALL');
  const [filterActive, setFilterActive] = useState<'ALL' | 'true' | 'false'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-ocultar mensajes de éxito
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Filtrar usuarios localmente
  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    const matchesActive = filterActive === 'ALL' || 
      (filterActive === 'true' ? user.active : !user.active);
    const matchesSearch = searchTerm === '' || 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRole && matchesActive && matchesSearch;
  });

  // Estadísticas rápidas
  const stats = {
    total: users.length,
    active: users.filter(u => u.active).length,
    inactive: users.filter(u => !u.active).length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    padrinos: users.filter(u => u.role === 'PADRINO').length,
    voluntarios: users.filter(u => u.role === 'VOLUNTARIO').length
  };

  // ========== HANDLERS ==========

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsUserModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await remove(selectedUser.id);
      setSuccessMessage(`Usuario "${selectedUser.fullName}" eliminado exitosamente`);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await toggleStatus(user.id);
      setSuccessMessage(
        `Usuario "${user.fullName}" ${user.active ? 'desactivado' : 'activado'} exitosamente`
      );
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    }
  };

  const handleSubmitUser = async (data: CreateUserDTO | UpdateUserDTO) => {
    try {
      if (modalMode === 'create') {
        await create(data as CreateUserDTO);
        setSuccessMessage('Usuario creado exitosamente');
      } else if (selectedUser) {
        await update(selectedUser.id, data as UpdateUserDTO);
        setSuccessMessage('Usuario actualizado exitosamente');
      }
      setIsUserModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      throw err; // El modal manejará el error
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
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
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Gestión de Usuarios
                  </h1>
                  <p className="text-white/90 mt-1">
                    Administra los usuarios del sistema
                  </p>
                </div>
              </div>
              <button
                onClick={handleCreateUser}
                className="bg-[#FDD835] text-[#1E3A5F] px-5 py-2.5 rounded-xl font-semibold hover:bg-[#fce34f] transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
              >
                <UserPlus className="w-5 h-5" />
                <span className="hidden sm:inline">Crear Usuario</span>
              </button>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#1E3A5F]">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Inactivos</p>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-gray-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-500">{stats.inactive}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Padrinos</p>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.padrinos}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Voluntarios</p>
                <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center">
                  <Handshake className="w-5 h-5 text-teal-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-teal-600">{stats.voluntarios}</p>
            </div>
          </div>

          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-green-800 text-sm font-medium">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-green-600 hover:text-green-700"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

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

          {/* Filtros y búsqueda */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-[#1E3A5F]" />
              <h3 className="text-lg font-bold text-[#1E3A5F]">Búsqueda y Filtros</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Buscar por nombre o email..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Filtro por rol */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rol
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as UserRole | 'ALL')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none transition-all text-gray-900 font-medium"
                >
                  <option value="ALL">Todos los roles</option>
                  <option value="ADMIN">Administradores</option>
                  <option value="PADRINO">Padrinos</option>
                  <option value="VOLUNTARIO">Voluntarios</option>
                </select>
              </div>

              {/* Filtro por estado */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={filterActive}
                  onChange={(e) => setFilterActive(e.target.value as 'ALL' | 'true' | 'false')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none transition-all text-gray-900 font-medium"
                >
                  <option value="ALL">Todos</option>
                  <option value="true">Activos</option>
                  <option value="false">Inactivos</option>
                </select>
              </div>
            </div>

            {/* Botón de refrescar */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={fetchUsers}
                disabled={isLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-2 font-medium"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Actualizando...' : 'Actualizar'}</span>
              </button>
            </div>
          </div>

          {/* Tabla de usuarios */}
          <UsersTable
            users={filteredUsers}
            isLoading={isLoading}
            onEdit={handleEditUser}
            onDelete={handleDeleteClick}
            onToggleStatus={handleToggleStatus}
            currentUserId={currentUser?.id ? Number(currentUser.id) : undefined}
          />
        </div>

        {/* Modal de usuario (crear/editar) */}
        <UserModal
          isOpen={isUserModalOpen}
          onClose={() => {
            setIsUserModalOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={handleSubmitUser}
          user={selectedUser}
          mode={modalMode}
        />

        {/* Modal de confirmación de eliminación */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleConfirmDelete}
          userName={selectedUser?.fullName || ''}
          isLoading={isLoading}
        />
      </main>
    </ProtectedRoute>
  );
}