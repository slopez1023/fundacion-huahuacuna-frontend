/**
 * Servicio API para gestión de usuarios (CRUD)
 * @author Fundación Huahuacuna
 * @version 1.0
 */

import { User, CreateUserDTO, UpdateUserDTO, UserApiResponse } from '@/src/types/user';
import { API_ENDPOINTS, fetchWithAuth } from '@/src/lib/api';

/**
 * Manejo de errores
 */
const handleApiError = (error: any): never => {
  if (error.response) {
    throw new Error(error.response.data.message || 'Error en la solicitud');
  } else if (error.request) {
    throw new Error('No se pudo conectar con el servidor');
  } else {
    throw new Error(error.message || 'Error desconocido');
  }
};

// ========== CRUD OPERATIONS ==========

export const createUser = async (data: CreateUserDTO): Promise<UserApiResponse> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.USERS.BASE, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear usuario');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAllUsers = async (): Promise<UserApiResponse> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.USERS.BASE, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

export const getUserById = async (id: number): Promise<UserApiResponse> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.USERS.BY_ID(id), {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al obtener usuario');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateUser = async (id: number, data: UpdateUserDTO): Promise<UserApiResponse> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.USERS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar usuario');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteUser = async (id: number): Promise<UserApiResponse> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.USERS.BY_ID(id), {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar usuario');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

export const toggleUserStatus = async (id: number): Promise<UserApiResponse> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.USERS.TOGGLE_STATUS(id), {
      method: 'PATCH',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al cambiar estado');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

export const resetUserPassword = async (id: number, newPassword: string): Promise<UserApiResponse> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.USERS.RESET_PASSWORD(id), {
      method: 'PATCH',
      body: JSON.stringify({ newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al resetear contraseña');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

export const searchUsers = async (searchTerm: string): Promise<UserApiResponse> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.USERS.SEARCH(searchTerm), {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al buscar usuarios');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

export const getUsersByRole = async (role: string): Promise<UserApiResponse> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.USERS.BY_ROLE(role), {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al obtener usuarios por rol');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};