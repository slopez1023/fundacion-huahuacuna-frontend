/**
 * GodparentService - Servicio para gestionar padrinos y apadrinamiento
 * @author Fundación Huahuacuna
 */

import axios from 'axios';
import {
  IPadrinoResponse,
  INinoResponse,
  ISeleccionarNinoRequest,
  IApadrinamientoResponse,
  IBitacoraEntrada,
  EstadoApadrinamiento,
} from '@/types/apadrinamiento.types';

const API_URL = 'http://localhost:8080/api/padrinos';

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    return { headers: { Authorization: `Bearer ${token}` } };
  }
  return {};
};

export const godparentService = {
  /**
   * Obtiene el perfil del padrino actual (usuario logueado)
   */
  getMyProfile: async (): Promise<IPadrinoResponse> => {
    const response = await axios.get<IPadrinoResponse>(
      `${API_URL}/me`,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Obtiene lista de niños disponibles para apadrinar
   */
  getAvailableChildren: async (): Promise<INinoResponse[]> => {
    const response = await axios.get<INinoResponse[]>(
      `${API_URL}/children/available`,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Selecciona un niño para apadrinar
   */
  selectChild: async (childId: number): Promise<IApadrinamientoResponse> => {
    const response = await axios.post<IApadrinamientoResponse>(
      `${API_URL}/select-child`,
      { idNino: childId } as ISeleccionarNinoRequest,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Obtiene el apadrinamiento actual del padrino
   */
  getMyGodchild: async (): Promise<IApadrinamientoResponse | null> => {
    try {
      const response = await axios.get<IApadrinamientoResponse>(
        `${API_URL}/my-godchild`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      // Si no tiene apadrinado, retorna null
      return null;
    }
  },

  /**
   * Obtiene la bitácora del niño apadrinado
   */
  getGodchildLog: async (apadrinamientoId: number): Promise<IBitacoraEntrada[]> => {
    const response = await axios.get<IBitacoraEntrada[]>(
      `${API_URL}/apadrinamientos/${apadrinamientoId}/bitacora`,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Agrega una entrada a la bitácora
   */
  addLogEntry: async (
    apadrinamientoId: number,
    titulo: string,
    contenido: string
  ): Promise<IBitacoraEntrada> => {
    const response = await axios.post<IBitacoraEntrada>(
      `${API_URL}/apadrinamientos/${apadrinamientoId}/bitacora`,
      { titulo, contenido },
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Obtiene los mensajes del chat con el administrador
   */
  getChatMessages: async (apadrinamientoId: number) => {
    const response = await axios.get(
      `${API_URL}/apadrinamientos/${apadrinamientoId}/mensajes`,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Envía un mensaje al administrador
   */
  sendMessage: async (apadrinamientoId: number, contenido: string) => {
    const response = await axios.post(
      `${API_URL}/apadrinamientos/${apadrinamientoId}/mensajes`,
      { contenido },
      getAuthHeaders()
    );
    return response.data;
  },
};
