// src/lib/api.ts

/*
  src/lib/api.ts

  Propósito:
  - Centralizar la configuración de la comunicación con el backend (URL base y endpoints)
  - Proveer una utilidad `fetchWithTimeout` para llamadas HTTP con timeout y headers por defecto.

  Uso:
  - Importar `API_ENDPOINTS` para obtener las rutas del backend.
  - Usar `fetchWithTimeout` para realizar llamadas que necesiten un timeout y manejo de errores por tiempo.

  Notas:
  - La variable `NEXT_PUBLIC_API_URL` permite apuntar a diferentes servidores sin tocar el código.
  - `fetchWithTimeout` usa AbortController; lanza un error claro cuando la petición se agota.
*/

export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    // ⬇️ AGREGAR ESTAS 3 LÍNEAS ⬇️
    FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
    VERIFY_TOKEN: (token: string) => `${API_BASE_URL}/api/auth/verify-token/${token}`,
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
  return localStorage.getItem('authToken');
}

/**
 * Utilidad para guardar el token en localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
}

/**
 * Utilidad para eliminar el token del localStorage
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
}

/**
 * Utilidad para hacer fetch con autenticación
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  timeout: number = REQUEST_TIMEOUT
): Promise<Response> {
  const token = getAuthToken();
  
  return fetchWithTimeout(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: token } : {}),
    },
  }, timeout);
}