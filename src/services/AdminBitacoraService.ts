/**
 * AdminBitacoraService - Servicio para gestionar bitácoras desde el panel de admin
 * 
 * @author Fundación Huahuacuna
 * @version 1.0
 */

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin';

// ========== INTERFACES ==========

export interface Sponsorship {
  id: number;
  godparentName: string;
  godparentEmail: string;
  childName: string;
  childId: number;
  childImageUrl?: string;
  status: string;
  createdAt: string;
  entriesCount?: number;
}

export interface LogEntry {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  registradoPor: "ADMINISTRADOR" | "PADRINO";
}

export interface CreateLogEntryRequest {
  titulo: string;
  contenido: string;
}

// ========== HELPERS ==========

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }
  return {
    headers: {
      'Content-Type': 'application/json'
    }
  };
};

// ========== SERVICIO ==========

export const adminBitacoraService = {
  /**
   * Obtiene todos los apadrinamientos activos para mostrar en la lista
   */
  getActiveSponsorships: async (): Promise<Sponsorship[]> => {
    const response = await axios.get<Sponsorship[]>(
      `${API_URL}/apadrinamientos`,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Obtiene las entradas de bitácora de un apadrinamiento
   */
  getLogEntries: async (sponsorshipId: number): Promise<LogEntry[]> => {
    const response = await axios.get<LogEntry[]>(
      `${API_URL}/apadrinamientos/${sponsorshipId}/bitacora`,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Agrega una nueva entrada a la bitácora
   */
  addLogEntry: async (sponsorshipId: number, data: CreateLogEntryRequest): Promise<LogEntry> => {
    const response = await axios.post(
      `${API_URL}/apadrinamientos/${sponsorshipId}/bitacora`,
      data,
      getAuthHeaders()
    );
    return response.data.entry || response.data;
  },

  /**
   * Elimina una entrada de la bitácora
   */
  deleteLogEntry: async (sponsorshipId: number, entryId: number): Promise<void> => {
    await axios.delete(
      `${API_URL}/apadrinamientos/${sponsorshipId}/bitacora/${entryId}`,
      getAuthHeaders()
    );
  }
};