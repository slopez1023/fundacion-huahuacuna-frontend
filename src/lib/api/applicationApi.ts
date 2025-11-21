/**
 * Servicio API para gestión de solicitudes de participación
 * Centraliza todas las llamadas HTTP al backend
 * @author Fundación Huahuacuna
 * @version 2.0
 */

import {
  VolunteerApplicationDTO,
  SponsorApplicationDTO,
  ApplicationResponse,
  ApplicationStatistics,
  ApplicationStatus,
  ApplicationType,
  UpdateApplicationStatusDTO,
  ApiResponse
} from '@/src/types/application';
import { API_ENDPOINTS, fetchWithAuth, fetchWithTimeout } from '@/src/lib/api';

/**
 * Manejo centralizado de errores de API
 */
const handleApiError = (error: any): never => {
  if (error.response) {
    throw new Error(error.response.data.message || 'Error en la solicitud');
  } else if (error.request) {
    throw new Error('No se pudo conectar con el servidor');
  } else {
    throw new Error(error.message || 'Error desconocido');
  }
};

// ========== ENDPOINTS PÚBLICOS ==========

/**
 * Crea una nueva solicitud de voluntariado
 */
export const createVolunteerApplication = async (
  data: VolunteerApplicationDTO
): Promise<ApiResponse<ApplicationResponse>> => {
  try {
    const response = await fetchWithTimeout(API_ENDPOINTS.APPLICATIONS.VOLUNTEER, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al enviar la solicitud');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Crea una nueva solicitud de apadrinamiento
 */
export const createSponsorApplication = async (
  data: SponsorApplicationDTO
): Promise<ApiResponse<ApplicationResponse>> => {
  try {
    const response = await fetchWithTimeout(API_ENDPOINTS.APPLICATIONS.SPONSOR, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al enviar la solicitud');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// ========== ENDPOINTS PROTEGIDOS (ADMIN) ==========

/**
 * Obtiene todas las solicitudes
 */
export const getAllApplications = async (): Promise<ApiResponse<ApplicationResponse[]>> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.APPLICATIONS.BASE, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al obtener las solicitudes');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Obtiene una solicitud por su ID
 */
export const getApplicationById = async (
  id: number
): Promise<ApiResponse<ApplicationResponse>> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.APPLICATIONS.BY_ID(id), {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al obtener la solicitud');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Obtiene solicitudes filtradas por tipo
 */
export const getApplicationsByType = async (
  type: ApplicationType
): Promise<ApiResponse<ApplicationResponse[]>> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.APPLICATIONS.BY_TYPE(type), {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al filtrar las solicitudes');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Obtiene solicitudes filtradas por estado
 */
export const getApplicationsByStatus = async (
  status: ApplicationStatus
): Promise<ApiResponse<ApplicationResponse[]>> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.APPLICATIONS.BY_STATUS(status), {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al filtrar las solicitudes');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Obtiene todas las solicitudes pendientes
 */
export const getPendingApplications = async (): Promise<ApiResponse<ApplicationResponse[]>> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.APPLICATIONS.PENDING, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al obtener solicitudes pendientes');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Obtiene solicitudes recientes pendientes (últimos 7 días)
 */
export const getRecentPendingApplications = async (): Promise<ApiResponse<ApplicationResponse[]>> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.APPLICATIONS.RECENT, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al obtener solicitudes recientes');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Busca solicitudes por nombre
 */
export const searchApplications = async (
  name: string
): Promise<ApiResponse<ApplicationResponse[]>> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.APPLICATIONS.SEARCH(name), {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al buscar solicitudes');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Obtiene estadísticas de solicitudes
 */
export const getApplicationStatistics = async (): Promise<ApiResponse<ApplicationStatistics>> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.APPLICATIONS.STATISTICS, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al obtener estadísticas');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Actualiza el estado de una solicitud
 */
export const updateApplicationStatus = async (
  id: number,
  data: UpdateApplicationStatusDTO
): Promise<ApiResponse<ApplicationResponse>> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar el estado');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Aprueba una solicitud
 */
export const approveApplication = async (
  id: number,
  comments?: string
): Promise<ApiResponse<ApplicationResponse>> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.APPLICATIONS.APPROVE(id), {
      method: 'POST',
      body: JSON.stringify({ comments }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al aprobar la solicitud');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Rechaza una solicitud
 */
export const rejectApplication = async (
  id: number,
  comments: string
): Promise<ApiResponse<ApplicationResponse>> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.APPLICATIONS.REJECT(id), {
      method: 'POST',
      body: JSON.stringify({ comments }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al rechazar la solicitud');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Elimina una solicitud
 */
export const deleteApplication = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.APPLICATIONS.BY_ID(id), {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar la solicitud');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};