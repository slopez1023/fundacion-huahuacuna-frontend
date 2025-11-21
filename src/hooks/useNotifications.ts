/**
 * useNotifications - Hook para gestión de notificaciones
 * @author Fundación Huahuacuna
 * @version 1.0
 */

"use client";

import { useState, useCallback, useEffect } from 'react';
import {
  getAllNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  Notification
} from '@/src/lib/api/notificationApi';

interface UseNotificationsOptions {
  autoFetch?: boolean;
  pollInterval?: number; // Intervalo para actualizar automáticamente (en ms)
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { autoFetch = false, pollInterval } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtener todas las notificaciones
   */
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllNotifications();

      if (response.success && response.data) {
        setNotifications(Array.isArray(response.data) ? response.data : [response.data]);
      } else {
        throw new Error('Error al cargar notificaciones');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Obtener solo notificaciones no leídas
   */
  const fetchUnread = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getUnreadNotifications();

      if (response.success && response.data) {
        setNotifications(Array.isArray(response.data) ? response.data : [response.data]);
      } else {
        throw new Error('Error al cargar notificaciones no leídas');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching unread notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Obtener contador de no leídas
   */
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadCount();

      if (response.success && typeof response.count === 'number') {
        setUnreadCount(response.count);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, []);

  /**
   * Marcar una notificación como leída
   */
  const markRead = useCallback(async (id: number): Promise<void> => {
    setError(null);

    try {
      const response = await markAsRead(id);

      if (response.success) {
        // Actualizar estado local
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === id ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        throw new Error(response.message || 'Error al marcar como leída');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Marcar todas como leídas
   */
  const markAllRead = useCallback(async (): Promise<void> => {
    setError(null);

    try {
      const response = await markAllAsRead();

      if (response.success) {
        // Actualizar estado local
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, isRead: true }))
        );
        setUnreadCount(0);
      } else {
        throw new Error(response.message || 'Error al marcar todas como leídas');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Eliminar una notificación
   */
  const remove = useCallback(async (id: number): Promise<void> => {
    setError(null);

    try {
      const response = await deleteNotification(id);

      if (response.success) {
        // Actualizar estado local
        setNotifications(prev => prev.filter(notif => notif.id !== id));
        
        // Si era no leída, decrementar contador
        const wasUnread = notifications.find(n => n.id === id)?.isRead === false;
        if (wasUnread) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      } else {
        throw new Error(response.message || 'Error al eliminar notificación');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    }
  }, [notifications]);

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch al montar
  useEffect(() => {
    if (autoFetch) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [autoFetch, fetchNotifications, fetchUnreadCount]);

  // Polling automático (si está configurado)
  useEffect(() => {
    if (pollInterval && pollInterval > 0) {
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, pollInterval);

      return () => clearInterval(interval);
    }
  }, [pollInterval, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    fetchUnread,
    fetchUnreadCount,
    markRead,
    markAllRead,
    remove,
    clearError
  };
}