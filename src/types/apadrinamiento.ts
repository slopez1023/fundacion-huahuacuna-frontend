/**
 * Tipos para el sistema de apadrinamiento
 * @author Fundación Huahuacuna
 */

export enum EstadoNino {
  DISPONIBLE = "DISPONIBLE",
  APADRINADO = "APADRINADO",
  INACTIVO = "INACTIVO"
}

export interface ICrearNinoRequest {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  genero: string;
  biografia?: string;
  fotoUrl?: string;
  necesidades?: string;
  estado?: EstadoNino;
}

export interface IActualizarNinoRequest {
  nombre?: string;
  apellido?: string;
  fechaNacimiento?: string;
  genero?: string;
  biografia?: string;
  fotoUrl?: string;
  necesidades?: string;
  estado?: EstadoNino;
}

export interface ICambiarEstadoRequest {
  estado: EstadoNino;
}

export interface INinoResponse {
  id: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  edad: number;
  genero: string;
  biografia?: string;
  fotoUrl?: string;
  necesidades?: string;
  estado: EstadoNino;
  fechaRegistro: string;
  fechaActualizacion: string;
}
