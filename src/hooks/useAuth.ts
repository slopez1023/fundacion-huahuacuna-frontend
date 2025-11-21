"use client";

import { useState, useCallback } from "react";
import { API_ENDPOINTS, fetchWithTimeout } from "../lib/api";
import { saveToken, saveUser, getToken, getUser, removeToken } from "../lib/auth/tokenStorage";
import type {
  ILoginRequest,
  ILoginResponse,
  IErrorResponse,
  IUserInfo,
  IForgotPasswordRequest,
  IForgotPasswordResponse,
  IResetPasswordRequest,
  IResetPasswordResponse,
  IVerifyTokenResponse,
} from "../types/auth";

/*
  useAuth - Hook de autenticación (ACTUALIZADO V2)

  Propósito:
  - Centraliza la lógica de autenticación del frontend: login, register, logout,
    gestión de estado (user, token) y persistencia en localStorage.
  - ACTUALIZADO: Incluye todas las propiedades del usuario (telefono, createdAt, userId, isActive)

  Responsabilidad:
  - Exponer una API simple: { user, token, isLoading, error, login, logout, 
    forgotPassword, resetPassword, verifyResetToken, clearError }
  - Manejar side-effects mínimos (guardar/leer de localStorage)

  Interacciones:
  - Usa `fetchWithTimeout` y `API_ENDPOINTS` desde `src/lib/api.ts` para comunicarse con el backend.
  - Consumido por `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm` y `Navbar`.
*/

export function useAuth() {
  const [user, setUser] = useState<IUserInfo | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = getUser();
      if (savedUser) {
        return {
          id: savedUser.userId?.toString() || '',
          email: savedUser.email || '',
          name: savedUser.fullName || '',
          role: savedUser.role || '',
          // ✅ Propiedades adicionales
          userId: savedUser.userId,
          telefono: savedUser.telefono,
          createdAt: savedUser.createdAt,
          isActive: savedUser.isActive ?? true,
        };
      }
    }
    return null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return getToken();
    }
    return null;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Login de usuario
   */
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!email || !password) {
        throw new Error("Por favor, completa todos los campos");
      }

      const payload: ILoginRequest = { email, password };

      const response = await fetchWithTimeout(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as IErrorResponse;
        throw new Error(errorData.message || "Error en la autenticación");
      }

      // El backend devuelve: { success, message, data: { token, userId, email, fullName, role } }
      if (data.success && data.data) {
        const { token, userId, email: userEmail, fullName, role } = data.data;
        
        // ✅ Guardar token usando tokenStorage con todas las propiedades
        saveToken(token);
        saveUser({
          userId,
          email: userEmail,
          fullName,
          role,
          // Propiedades adicionales que podrían venir del backend
          telefono: data.data.telefono,
          createdAt: data.data.createdAt,
          isActive: data.data.isActive,
        });

        // ✅ Adaptar al formato completo que espera el frontend
        const user: IUserInfo = {
          id: userId.toString(),
          email: userEmail,
          name: fullName,
          role: role,
          // Propiedades adicionales
          userId: userId,
          telefono: data.data.telefono,
          createdAt: data.data.createdAt,
          isActive: data.data.isActive ?? true,
        };

        setUser(user);
        setToken(token);
      } else {
        throw new Error(data.message || "Error desconocido");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error inesperado";
      setError(errorMessage);
      setUser(null);
      setToken(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout de usuario
   */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    if (typeof window !== "undefined") {
      removeToken();
    }
  }, []);

  /**
   * Solicitar recuperación de contraseña
   * @param email - Email del usuario que solicita recuperar contraseña
   * @returns Token de recuperación (solo en desarrollo, en producción se envía por email)
   */
  const forgotPassword = useCallback(async (email: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!email) {
        throw new Error("Por favor, ingresa tu correo electrónico");
      }

      const payload: IForgotPasswordRequest = { email };

      const response = await fetchWithTimeout(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al solicitar recuperación");
      }

      const forgotPasswordResponse = data as IForgotPasswordResponse;

      if (!forgotPasswordResponse.success) {
        throw new Error(forgotPasswordResponse.message || "Error desconocido");
      }

      // Retornar el token (en desarrollo)
      return forgotPasswordResponse.token || "";
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error inesperado";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Verificar si un token de recuperación es válido
   * @param resetToken - Token de recuperación a verificar
   * @returns Objeto con validez del token y email asociado
   */
  const verifyResetToken = useCallback(async (resetToken: string): Promise<{ valid: boolean; email?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!resetToken) {
        throw new Error("Token no proporcionado");
      }

      const response = await fetchWithTimeout(
        API_ENDPOINTS.AUTH.VERIFY_TOKEN(resetToken),
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Error al verificar el token");
      }

      const verifyResponse = data as IVerifyTokenResponse;

      return {
        valid: verifyResponse.valid,
        email: verifyResponse.email,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error inesperado";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Resetear contraseña con token
   * @param resetToken - Token de recuperación
   * @param newPassword - Nueva contraseña
   */
  const resetPassword = useCallback(async (resetToken: string, newPassword: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!resetToken || !newPassword) {
        throw new Error("Token y contraseña son requeridos");
      }

      if (newPassword.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      const payload: IResetPasswordRequest = {
        token: resetToken,
        newPassword,
      };

      const response = await fetchWithTimeout(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al resetear contraseña");
      }

      const resetResponse = data as IResetPasswordResponse;

      if (!resetResponse.success) {
        throw new Error(resetResponse.message || "Error desconocido");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error inesperado";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { 
    user, 
    token, 
    isLoading, 
    error, 
    login, 
    logout, 
    forgotPassword,
    verifyResetToken,
    resetPassword,
    clearError 
  };
}