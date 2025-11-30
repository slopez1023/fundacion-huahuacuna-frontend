import axios from 'axios';

const API_URL = 'http://localhost:8080/api/events';

export interface Event {
  id?: number;
  title: string;
  description: string;
  date: string; // Se manejará como string ISO
  location: string;
  imageUrl: string;
  published?: boolean;
}

// Helper para el token
const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    return { headers: { Authorization: `Bearer ${token}` } };
  }
  return {};
};

export const eventService = {
  getAll: async () => {
    const response = await axios.get<Event[]>(API_URL, getAuthHeaders());
    return response.data;
  },
  
  create: async (event: Event) => {
    const response = await axios.post<Event>(API_URL, event, getAuthHeaders());
    return response.data;
  },

  delete: async (id: number) => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  },

  publish: async (id: number) => {
    const response = await axios.patch<Event>(`${API_URL}/${id}/publish`, {}, getAuthHeaders());
    return response.data;
  }
};