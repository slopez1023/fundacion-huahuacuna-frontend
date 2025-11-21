/**
 * Tipos TypeScript para el sistema de solicitudes de participación
 * @author Fundación Huahuacuna
 * @version 1.0
 */

/**
 * Tipos de solicitud disponibles
 */
export enum ApplicationType {
  VOLUNTARIO = 'VOLUNTARIO',
  PADRINO = 'PADRINO'
}

/**
 * Estados posibles de una solicitud
 */
export enum ApplicationStatus {
  PENDIENTE = 'PENDIENTE',
  EN_REVISION = 'EN_REVISION',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO'
}

/**
 * DTO para crear una nueva solicitud de voluntariado
 */
export interface VolunteerApplicationDTO {
  fullName: string;
  email: string;
  phone: string;
  interestArea: string;
  availability: string;
  previousExperience: string;
  acceptsInformation: boolean;
}

/**
 * DTO para crear una nueva solicitud de apadrinamiento
 */
export interface SponsorApplicationDTO {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  idNumber: string;
  idDocumentPath?: string;
}

/**
 * Respuesta completa de una solicitud desde el backend
 */
export interface ApplicationResponse {
  id: number;
  type: ApplicationType;
  status: ApplicationStatus;
  fullName: string;
  email: string;
  phone: string;
  
  // Campos de voluntarios
  interestArea?: string;
  availability?: string;
  previousExperience?: string;
  acceptsInformation?: boolean;
  
  // Campos de padrinos
  country?: string;
  idNumber?: string;
  idDocumentPath?: string;
  
  // Auditoría
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  adminComments?: string;
}

/**
 * DTO para actualizar el estado de una solicitud
 */
export interface UpdateApplicationStatusDTO {
  status: ApplicationStatus;
  comments?: string;
}

/**
 * Respuesta estándar de la API
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
  count?: number;
}

/**
 * Estadísticas de solicitudes
 */
export interface ApplicationStatistics {
  total: number;
  pendientes: number;
  enRevision: number;
  aprobadas: number;
  rechazadas: number;
  totalVoluntarios: number;
  totalPadrinos: number;
  recientes: number;
}

/**
 * Filtros para búsqueda de solicitudes
 */
export interface ApplicationFilters {
  type?: ApplicationType;
  status?: ApplicationStatus;
  searchTerm?: string;
}