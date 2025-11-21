/**
 * Tipos TypeScript para el sistema de notificaciones
 * @author Fundación Huahuacuna
 * @version 1.0
 */

/**
 * Tipos de notificación
 */
export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

/**
 * Estructura de una notificación
 */
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  applicationId?: number;
  createdAt: string;
  readAt?: string;
}

/**
 * Respuesta de la API de notificaciones
 */
export interface NotificationResponse {
  success: boolean;
  data?: Notification[];
  total?: number;
  count?: number;
  message?: string;
}