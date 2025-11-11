
"use client";

import { useState, useCallback, useEffect } from "react";
// 1. ¡IMPORTANTE! Importamos el authService de apiService.ts
import { authService } from "@/lib/apiService"; 
// 2. Importamos los tipos que tu hook necesita (IUserInfo, etc.)
import type { IUserInfo, IErrorResponse } from "../types/auth"; 
// 3. (Importamos los tipos de password reset, aunque aún no los usaremos)
import type {
  IForgotPasswordRequest,
  IForgotPasswordResponse,
  IResetPasswordRequest,
  IResetPasswordResponse,
  IVerifyTokenResponse,
} from "../types/auth";

// Definimos la respuesta de nuestro backend de Spring
interface SpringAuthResponse {
  accessToken: string;
  usuario: {
    id: number;
    email: string;
    nombre: string;
    roles: string[];
  };
}

export function useAuth() {
  // 3. CAMBIAMOS A LOCALSTORAGE
  // (para que el interceptor de apiService.ts pueda leer el token)
  const [user, setUser] = useState<IUserInfo | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("auth_user");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Login de usuario (MODIFICADO)
   */
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!email || !password) {
        throw new Error("Por favor, completa todos los campos");
      }

      // 4. ¡EL GRAN CAMBIO!
      // Llamamos a nuestro 'authService' (axios) en lugar de 'fetchWithTimeout'
      const response = await authService.login(email, password);
      
      // 'response.data' ya es el JSON. Axios lo maneja automáticamente.
      const data = response.data as SpringAuthResponse;

      // 5. Adaptamos la respuesta de Spring a la que tu hook espera
      const { accessToken, usuario } = data;
      
      // El rol principal (tu hook espera UN solo rol)
      const userRole = usuario.roles.includes("ROLE_ADMIN") ? "ADMIN" : "USER";

      const user: IUserInfo = {
        id: usuario.id.toString(),
        email: usuario.email,
        name: usuario.nombre,
        role: userRole 
      };

      setUser(user);
      setToken(accessToken);

      // 6. Guardamos en LOCALSTORAGE
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", accessToken);
        localStorage.setItem("auth_user", JSON.stringify(user));
      }

    } catch (err: any) {
      // Axios envuelve los errores en 'err.response'
      const errorData = err.response?.data as IErrorResponse;
      const errorMessage = errorData?.message || (err instanceof Error ? err.message : "Error inesperado");
      
      setError(errorMessage);
      setUser(null);
      setToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
      throw new Error(errorMessage); // Lanzamos el error para que LoginForm lo atrape
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout de usuario (MODIFICADO)
   */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    if (typeof window !== "undefined") {
      // 7. Limpiamos LOCALSTORAGE
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  }, []);

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);


  // --- ¡PENDIENTE! ---
  // Las siguientes funciones (forgotPassword, etc.) NO funcionarán
  // porque no hemos creado esos endpoints en el backend de Spring Boot.
  // Las dejamos aquí para no romper tu código, pero lanzarán un error.
  
  const forgotPassword = useCallback(async (email: string): Promise<string> => {
    setError("Función no implementada en el backend.");
    throw new Error("Función no implementada en el backend.");
  }, []);

  const verifyResetToken = useCallback(async (resetToken: string): Promise<{ valid: boolean; email?: string }> => {
    setError("Función no implementada en el backend.");
    throw new Error("Función no implementada en el backend.");
  }, []);

  const resetPassword = useCallback(async (resetToken: string, newPassword: string): Promise<void> => {
    setError("Función no implementada en el backend.");
    throw new Error("Función no implementada en el backend.");
  }, []);


  return { 
    user, 
    token, 
    isLoading, 
    error, 
    login, 
    logout, 
    forgotPassword, // Sigue aquí, pero no funcionará
    verifyResetToken, // Sigue aquí, pero no funcionará
    resetPassword, // Sigue aquí, pero no funcionará
    clearError 
  };
}