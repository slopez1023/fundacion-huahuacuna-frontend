/**
 * Servicio API para gestión de notificaciones
 * @author Fundación Huahuacuna
 * @version 1.0
 */

import { API_ENDPOINTS, fetchWithAuth } from '@/src/lib/api';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'DONATION' | 'APPLICATION' | 'SYSTEM' | 'INFO';
  isRead: boolean;
  createdAt: string;
  relatedEntityId?: number;
  relatedEntityType?: string;
}

export interface NotificationApiResponse {
  success: boolean;
  data?: Notification | Notification[];
  message?: string;
  count?: number;
}

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

// ========== OPERACIONES DE NOTIFICACIONES ==========

/**
 * Obtener todas las notificaciones
 */
export const getAllNotifications = async (): Promise<NotificationApiResponse> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.NOTIFICATIONS.BASE, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Obtener notificaciones no leídas
 */
export const getUnreadNotifications = async (): Promise<NotificationApiResponse> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.NOTIFICATIONS.UNREAD, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones no leídas');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Obtener contador de notificaciones no leídas
 */
export const getUnreadCount = async (): Promise<NotificationApiResponse> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al obtener contador');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Marcar una notificación como leída
 */
export const markAsRead = async (id: number): Promise<NotificationApiResponse> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(id), {
      method: 'PATCH',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al marcar como leída');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Marcar todas las notificaciones como leídas
 */
export const markAllAsRead = async (): Promise<NotificationApiResponse> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ, {
      method: 'PATCH',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al marcar todas como leídas');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Eliminar una notificación
 */
export const deleteNotification = async (id: number): Promise<NotificationApiResponse> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id), {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar notificación');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};