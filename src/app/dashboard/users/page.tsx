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
import Navbar from '@/src/components/ui/Navbar';
import Breadcrumb from '@/src/components/ui/Breadcrumb';
import ProtectedRoute from '@/src/components/admin/ProtectedRoute';
import UserModal from '@/src/components/admin/UserModal';
import UsersTable from '@/src/components/admin/UsersTable';
import DeleteConfirmModal from '@/src/components/admin/DeleteConfirmModal';
import { useUsers } from '@/src/hooks/useUsers';
import { useAuth } from '@/src/hooks/useAuth';
import type { User, CreateUserDTO, UpdateUserDTO, UserRole } from '@/src/types/user';

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
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Panel Administrativo", href: "/dashboard" },
                { label: "Gestión de Usuarios" }
              ]} 
            />
            
            <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#1E3A5F]">
                  Gestión de Usuarios
                </h1>
                <p className="text-gray-600 mt-2">
                  Administra los usuarios del sistema
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Botón crear usuario */}
                <button
                  onClick={handleCreateUser}
                  className="px-4 py-2 bg-[#FDD835] text-[#1E3A5F] font-semibold rounded-lg hover:bg-[#F7C948] transition-colors flex items-center gap-2 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Crear Usuario
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

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-[#1E3A5F]">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <p className="text-sm text-gray-600 mb-1">Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <p className="text-sm text-gray-600 mb-1">Inactivos</p>
              <p className="text-2xl font-bold text-gray-400">{stats.inactive}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <p className="text-sm text-gray-600 mb-1">Admins</p>
              <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <p className="text-sm text-gray-600 mb-1">Padrinos</p>
              <p className="text-2xl font-bold text-blue-600">{stats.padrinos}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <p className="text-sm text-gray-600 mb-1">Voluntarios</p>
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
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Buscar por nombre o email..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Filtro por rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as UserRole | 'ALL')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900"
                >
                  <option value="ALL">Todos los roles</option>
                  <option value="ADMIN">Administradores</option>
                  <option value="PADRINO">Padrinos</option>
                  <option value="VOLUNTARIO">Voluntarios</option>
                </select>
              </div>

              {/* Filtro por estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={filterActive}
                  onChange={(e) => setFilterActive(e.target.value as 'ALL' | 'true' | 'false')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900"
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
                className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#152a45] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isLoading ? 'Actualizando...' : 'Actualizar'}
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