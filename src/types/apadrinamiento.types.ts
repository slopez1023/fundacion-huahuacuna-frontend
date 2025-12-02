/**
 * Tipos para el sistema de apadrinamiento
 * @author Fundación Huahuacuna
 */

export enum EstadoNino {
  DISPONIBLE = "DISPONIBLE",
  APADRINADO = "APADRINADO",
  INACTIVO = "INACTIVO"
}

export enum EstadoPadrino {
  PENDIENTE = "PENDIENTE",
  APROBADO = "APROBADO",
  RECHAZADO = "RECHAZADO",
  INACTIVO = "INACTIVO"
}

export enum EstadoApadrinamiento {
  ACTIVO = "ACTIVO",
  PAUSADO = "PAUSADO",
  TERMINADO = "TERMINADO"
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

// Tipos para Padrinos
export interface IPadrinoResponse {
  id: number;
  usuario: { id: number; email: string };
  nombreCompleto: string;
  telefono: string;
  pais: string;
  numeroDocumento: string;
  estado: EstadoPadrino;
  ninoApadrinado?: INinoResponse;
  estadoApadrinamiento?: EstadoApadrinamiento;
  fechaRegistro: string;
  fechaAprobacion?: string;
}

export interface ISeleccionarNinoRequest {
  idNino: number;
}

export interface IApadrinamientoResponse {
  id: number;
  padrino: IPadrinoResponse;
  nino: INinoResponse;
  estado: EstadoApadrinamiento;
  fechaInicio: string;
  fechaFin?: string;
}

export interface IBitacoraEntrada {
  id: number;
  apadrinamiento: IApadrinamientoResponse;
  titulo: string;
  contenido: string;
  fecha: string;
  registradoPor: string; // "PADRINO" | "ADMINISTRADOR"
}
