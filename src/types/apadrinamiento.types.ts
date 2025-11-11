
// Estos tipos deben coincidir con los DTOs de tu backend

/**
 * Define los estados posibles de un niño.
 */
export type EstadoNino = "DISPONIBLE" | "EN_PROCESO" | "APADRINADO";

/**
 * DTO de respuesta que recibimos del backend (NinoResponse)
 */
export interface INinoResponse {
  id: number;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string; // Recibimos la fecha como un string ISO (ej. "2010-05-20")
  historia: string;
  urlFotoPrincipal: string;
  estado: EstadoNino;
}

/**
 * DTO para crear un niño (CrearNinoRequest)
 * Omitimos 'id' porque lo genera el backend.
 */
export type ICrearNinoRequest = Omit<INinoResponse, "id">;

/**
 * DTO para actualizar un niño (ActualizarNinoRequest)
 * Omitimos 'id' (va en la URL) y 'estado' (se maneja aparte).
 */
export type IActualizarNinoRequest = Omit<INinoResponse, "id" | "estado">;

/**
 * DTO para cambiar el estado (CambiarEstadoRequest)
 */
export interface ICambiarEstadoRequest {
  nuevoEstado: EstadoNino;
}