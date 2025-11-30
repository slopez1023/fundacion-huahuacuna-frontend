import axios from 'axios';

const API_URL = 'http://localhost:8080/api/projects';

export interface Project {
  id?: number;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  imageUrl: string;
  published?: boolean;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    return { headers: { Authorization: `Bearer ${token}` } };
  }
  return {};
};

export const projectService = {
  getAll: async () => {
    const response = await axios.get<Project[]>(API_URL, getAuthHeaders());
    return response.data;
  },
  
  create: async (project: Project) => {
    const response = await axios.post<Project>(API_URL, project, getAuthHeaders());
    return response.data;
  },

  update: async (id: number, project: Project) => {
    const response = await axios.put<Project>(`${API_URL}/${id}`, project, getAuthHeaders());
    return response.data;
  },

  delete: async (id: number) => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  },

  publish: async (id: number) => {
    const response = await axios.patch<Project>(`${API_URL}/${id}/publish`, {}, getAuthHeaders());
    return response.data;
  }
};