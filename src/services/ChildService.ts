import axios from 'axios';

const API_URL = 'http://localhost:8080/api/children';

export interface Child {
  id?: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  age?: number;
  gender: string;  // MASCULINO, FEMENINO
  story: string;
  imageUrl: string;
  needs?: string;  // Necesidades especiales
  status: 'AVAILABLE' | 'SPONSORED' | 'INACTIVE';
}

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

export const childService = {
  // OBTENER TODOS
  getAll: async () => {
    const response = await axios.get<Child[]>(API_URL, getAuthHeaders());
    return response.data;
  },

  // OBTENER UNO POR ID
  getById: async (id: number) => {
    const response = await axios.get<Child>(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  },

  // OBTENER DISPONIBLES
  getAvailable: async () => {
    const response = await axios.get<Child[]>(`${API_URL}/available`, getAuthHeaders());
    return response.data;
  },
  
  // CREAR
  create: async (child: Child) => {
    const response = await axios.post<Child>(API_URL, child, getAuthHeaders());
    return response.data;
  },

  // ACTUALIZAR
  update: async (id: number, child: Partial<Child>) => {
    const response = await axios.put<Child>(`${API_URL}/${id}`, child, getAuthHeaders());
    return response.data;
  },

  // ELIMINAR
  delete: async (id: number) => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  }
};