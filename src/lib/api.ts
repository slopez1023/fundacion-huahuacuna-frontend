// src/lib/api.ts

/*
  src/lib/api.ts

  Propósito:
  - Centralizar la configuración de la comunicación con el backend (URL base y endpoints)
  - Proveer utilidades para llamadas HTTP con manejo de autenticación y errores.
  - Manejar automáticamente tokens expirados y redireccionar al login.

  Uso:
  - Importar `API_ENDPOINTS` para obtener las rutas del backend.
  - Usar `fetchWithAuth` para realizar llamadas autenticadas.

  Notas:
  - La variable `NEXT_PUBLIC_API_URL` permite apuntar a diferentes servidores sin tocar el código.
  - `fetchWithAuth` maneja automáticamente tokens expirados (401/403).
*/

export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    VERIFY_TOKEN: (token: string) => `${API_BASE_URL}/auth/verify-token/${token}`,
  },
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    BY_ID: (id: number) => `${API_BASE_URL}/users/${id}`,
    TOGGLE_STATUS: (id: number) => `${API_BASE_URL}/users/${id}/toggle-status`,
    RESET_PASSWORD: (id: number) => `${API_BASE_URL}/users/${id}/reset-password`,
    SEARCH: (term: string) => `${API_BASE_URL}/users/search?q=${encodeURIComponent(term)}`,
    BY_ROLE: (role: string) => `${API_BASE_URL}/users/role/${role}`,
  },
  APPLICATIONS: {
    BASE: `${API_BASE_URL}/applications`,
    BY_ID: (id: number) => `${API_BASE_URL}/applications/${id}`,
    BY_TYPE: (type: string) => `${API_BASE_URL}/applications/type/${type}`,
    BY_STATUS: (status: string) => `${API_BASE_URL}/applications/status/${status}`,
    PENDING: `${API_BASE_URL}/applications/pending`,
    RECENT: `${API_BASE_URL}/applications/recent`,
    STATISTICS: `${API_BASE_URL}/applications/statistics`,
    VOLUNTEER: `${API_BASE_URL}/applications/volunteer`,
    SPONSOR: `${API_BASE_URL}/applications/sponsor`,
    SEARCH: (name: string) => `${API_BASE_URL}/applications/search?name=${encodeURIComponent(name)}`,
    UPDATE_STATUS: (id: number) => `${API_BASE_URL}/applications/${id}/status`,
    APPROVE: (id: number) => `${API_BASE_URL}/applications/${id}/approve`,
    REJECT: (id: number) => `${API_BASE_URL}/applications/${id}/reject`,
  },
  NOTIFICATIONS: {
    BASE: `${API_BASE_URL}/notifications`,
    BY_ID: (id: number) => `${API_BASE_URL}/notifications/${id}`,
    UNREAD: `${API_BASE_URL}/notifications/unread`,
    UNREAD_COUNT: `${API_BASE_URL}/notifications/unread/count`,
    MARK_AS_READ: (id: number) => `${API_BASE_URL}/notifications/${id}/read`,
    MARK_ALL_AS_READ: `${API_BASE_URL}/notifications/read-all`,
  },
  DONATIONS: {
    BASE: `${API_BASE_URL}/donations`,
    BY_ID: (id: number) => `${API_BASE_URL}/donations/${id}`,
    REPORTS: `${API_BASE_URL}/donations/reports`,
    EXPORT: `${API_BASE_URL}/donations/export`,
    UPDATE_STATUS: (id: number) => `${API_BASE_URL}/donations/${id}/status`,
  },
};

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

export const REQUEST_TIMEOUT = 10000;

/**
 * fetchWithTimeout
 * - url: ruta a llamar
 * - options: init de fetch (method, body, headers...)
 * - timeout: tiempo máximo en ms antes de abortar la petición
 *
 * Lanza: Error('La solicitud tardó demasiado tiempo') si AbortController cancela la petición.
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...DEFAULT_HEADERS,
        ...options.headers,
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado tiempo');
    }
    throw error;
  }
}

/**
 * Utilidad para obtener el token del localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Utilidad para guardar el token en localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

/**
 * Utilidad para eliminar el token del localStorage
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

/**
 * ✅ NUEVA FUNCIÓN: Manejar tokens expirados
 */
function handleUnauthorized(): void {
  if (typeof window === 'undefined') return;
  
  console.warn('🔒 Token expirado o no autorizado. Redirigiendo al login...');
  
  // Limpiar sesión
  removeAuthToken();
  
  // Guardar URL actual para redirección después del login
  const currentPath = window.location.pathname;
  if (currentPath !== '/login' && currentPath !== '/auth/login') {
    localStorage.setItem('redirectAfterLogin', currentPath);
  }
  
  // Redirigir al login
  window.location.href = '/login?reason=expired';
}

/**
 * ✅ MEJORADO: Utilidad para hacer fetch con autenticación
 * Ahora maneja automáticamente tokens expirados (401/403)
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  timeout: number = REQUEST_TIMEOUT
): Promise<Response> {
  const token = getAuthToken();
  
  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }, timeout);
    
    // ✅ Detectar token expirado o no autorizado
    if (response.status === 401 || response.status === 403) {
      handleUnauthorized();
      throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
    }
    
    return response;
  } catch (error) {
    // Si es un error de red o timeout, propagarlo
    if (error instanceof Error && 
        (error.message.includes('tiempo') || error.message.includes('network'))) {
      throw error;
    }
    
    // Para otros errores, también propagar
    throw error;
  }
}

/**
 * ✅ NUEVA FUNCIÓN: Verificar si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * ✅ NUEVA FUNCIÓN: Obtener usuario del localStorage
 */
export function getAuthUser(): any | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('auth_user');
  return user ? JSON.parse(user) : null;
}

/**
 * ✅ NUEVA FUNCIÓN: Guardar usuario en localStorage
 */
export function setAuthUser(user: any): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_user', JSON.stringify(user));
}