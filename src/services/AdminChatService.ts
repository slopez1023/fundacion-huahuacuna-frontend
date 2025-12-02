/**
 * AdminChatService - Servicio para gestionar chat del administrador con padrinos
 * @author Fundación Huahuacuna
 */

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin/chat';

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    return { headers: { Authorization: `Bearer ${token}` } };
  }
  return {};
};

export interface Conversation {
  sponsorshipId: number;
  godparentId: number;
  godparentName: string;
  godparentEmail: string;
  childId: number;
  childName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: number;
  contenido: string;
  enviadoPor: "PADRINO" | "ADMINISTRADOR";
  fecha: string;
  leido: boolean;
}

export const adminChatService = {
  /**
   * Obtiene todas las conversaciones con padrinos
   */
  getConversations: async (): Promise<Conversation[]> => {
    const response = await axios.get<Conversation[]>(
      `${API_URL}/conversations`,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Obtiene los mensajes de una conversación específica
   */
  getMessages: async (sponsorshipId: number): Promise<ChatMessage[]> => {
    const response = await axios.get<ChatMessage[]>(
      `${API_URL}/conversations/${sponsorshipId}/messages`,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Envía un mensaje como administrador
   */
  sendMessage: async (sponsorshipId: number, contenido: string): Promise<ChatMessage> => {
    const response = await axios.post<ChatMessage>(
      `${API_URL}/conversations/${sponsorshipId}/messages`,
      { contenido },
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Marca los mensajes de una conversación como leídos
   */
  markAsRead: async (sponsorshipId: number): Promise<void> => {
    await axios.put(
      `${API_URL}/conversations/${sponsorshipId}/read`,
      {},
      getAuthHeaders()
    );
  },

  /**
   * Obtiene el conteo de mensajes no leídos
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await axios.get<{ count: number }>(
      `${API_URL}/unread-count`,
      getAuthHeaders()
    );
    return response.data.count;
  },
};