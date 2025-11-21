/**
 * useUsers - Hook para gestión de usuarios
 * @author Fundación Huahuacuna
 * @version 1.0
 */

"use client";

import { useState, useCallback, useEffect } from 'react';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  resetUserPassword,
  searchUsers,
  getUsersByRole
} from '@/src/lib/api/userApi';
import type { User, CreateUserDTO, UpdateUserDTO, UserRole } from '@/src/types/user';

interface UseUsersOptions {
  autoFetch?: boolean;
}

export function useUsers(options: UseUsersOptions = {}) {
  const { autoFetch = false } = options;

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtener todos los usuarios
   */
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllUsers();

      if (response.success && response.data) {
        setUsers(Array.isArray(response.data) ? response.data : [response.data]);
      } else {
        throw new Error('Error al cargar usuarios');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Crear nuevo usuario
   */
  const create = useCallback(async (data: CreateUserDTO): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createUser(data);

      if (response.success) {
        await fetchUsers();
      } else {
        throw new Error(response.message || 'Error al crear usuario');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsers]);

  /**
   * Actualizar usuario
   */
  const update = useCallback(async (id: number, data: UpdateUserDTO): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateUser(id, data);

      if (response.success) {
        await fetchUsers();
      } else {
        throw new Error(response.message || 'Error al actualizar usuario');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsers]);

  /**
   * Eliminar usuario
   */
  const remove = useCallback(async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await deleteUser(id);

      if (response.success) {
        await fetchUsers();
      } else {
        throw new Error(response.message || 'Error al eliminar usuario');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsers]);

  /**
   * Cambiar estado del usuario
   */
  const toggleStatus = useCallback(async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await toggleUserStatus(id);

      if (response.success) {
        await fetchUsers();
      } else {
        throw new Error(response.message || 'Error al cambiar estado');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsers]);

  /**
   * Resetear contraseña
   */
  const resetPassword = useCallback(async (id: number, newPassword: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await resetUserPassword(id, newPassword);

      if (!response.success) {
        throw new Error(response.message || 'Error al resetear contraseña');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Buscar usuarios
   */
  const search = useCallback(async (searchTerm: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await searchUsers(searchTerm);

      if (response.success && response.data) {
        setUsers(Array.isArray(response.data) ? response.data : [response.data]);
      } else {
        throw new Error('Error al buscar usuarios');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error searching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Filtrar por rol
   */
  const filterByRole = useCallback(async (role: UserRole) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getUsersByRole(role);

      if (response.success && response.data) {
        setUsers(Array.isArray(response.data) ? response.data : [response.data]);
      } else {
        throw new Error('Error al filtrar usuarios');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error filtering users:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch al montar
  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch, fetchUsers]);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    create,
    update,
    remove,
    toggleStatus,
    resetPassword,
    search,
    filterByRole,
    clearError
  };
}