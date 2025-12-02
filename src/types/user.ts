/**
 * Tipos TypeScript para gestión de usuarios (CORREGIDO V2)
 * @author Fundación Huahuacuna
 * @version 2.0
 */

/**
 * Roles disponibles en el sistema
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  PADRINO = 'PADRINO',
  VOLUNTARIO = 'VOLUNTARIO'
}

/**
 * Estructura de un usuario
 * CORREGIDO: Ahora usa 'telefono' para coincidir exactamente con el backend
 */
export interface User {
  id: number;
  fullName: string;
  email: string;
  telefono: string; // CORREGIDO: Coincide con UserResponseDTO del backend
  role: UserRole | string;
  active: boolean;
  createdAt: string;
}

/**
 * DTO para crear un nuevo usuario
 */
export interface CreateUserDTO {
  fullName: string;
  email: string;
  telefono: string;
  password: string;
  role: string;
}

/**
 * DTO para actualizar un usuario
 */
export interface UpdateUserDTO {
  fullName?: string;
  email?: string;
  telefono?: string;
  role?: string;
  active?: boolean;
}

/**
 * Respuesta de la API para usuarios
 */
export interface UserApiResponse {
  success: boolean;
  message?: string;
  data?: User | User[];
  total?: number;
}

/**
 * Filtros para búsqueda de usuarios
 */
export interface UserFilters {
  role?: UserRole | 'ALL';
  active?: boolean | 'ALL';
  searchTerm?: string;
}