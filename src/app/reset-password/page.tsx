// src/app/reset-password/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

/**
 * ResetPasswordPage
 * 
 * Página para establecer nueva contraseña usando un token de recuperación.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyResetToken, resetPassword, isLoading, error } = useAuth();

  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/forgot-password');
      return;
    }

    const checkToken = async () => {
      try {
        const result = await verifyResetToken(token);
        setTokenValid(result.valid);
        if (result.email) {
          setUserEmail(result.email);
        }
      } catch (err) {
        setTokenValid(false);
      }
    };

    checkToken();
  }, [token, router, verifyResetToken]);

  const validateForm = (): boolean => {
    if (!newPassword.trim()) {
      setLocalError('Por favor, ingresa tu nueva contraseña');
      return false;
    }
    if (newPassword.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!validateForm() || !token) return;

    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      console.error('Error al resetear contraseña:', err);
    }
  };

  const displayError = localError || error;

  // Loading inicial
  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FDD835] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium">Verificando token...</p>
        </div>
      </div>
    );
  }

  // Token inválido
  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1F2937] mb-2">
                ❌ Token inválido o expirado
              </h2>
              <p className="text-sm text-gray-600">
                El enlace de recuperación no es válido o ha expirado.
              </p>
            </div>
            <Link
              href="/forgot-password"
              className="inline-block w-full py-3.5 rounded-full bg-[#FDD835] text-[#1E3A5F] font-semibold text-[15px] hover:bg-[#FBC02D] transition-all shadow-sm"
            >
              Solicitar nuevo enlace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                ✅ Contraseña actualizada
              </h2>
              <p className="text-sm text-gray-600">
                Tu contraseña ha sido actualizada exitosamente.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Serás redirigido al login en unos segundos...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formulario
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1F2937] mb-2">
              Crear nueva contraseña
            </h2>
            {userEmail && (
              <p className="text-sm text-gray-600">
                Para: <strong>{userEmail}</strong>
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {displayError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">{displayError}</p>
              </div>
            )}

            {/* Nueva contraseña */}
            <div>
              <label htmlFor="new-password" className="block text-[14px] font-semibold text-[#1F2937] mb-2.5">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (displayError) setLocalError(null);
                  }}
                  disabled={isLoading}
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] text-[14px] text-[#1F2937] placeholder:text-gray-400 font-normal transition-all"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label htmlFor="confirm-password" className="block text-[14px] font-semibold text-[#1F2937] mb-2.5">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (displayError) setLocalError(null);
                  }}
                  disabled={isLoading}
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] text-[14px] text-[#1F2937] placeholder:text-gray-400 font-normal transition-all"
                  placeholder="Repite la contraseña"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || newPassword !== confirmPassword}
              className="w-full py-3.5 rounded-full bg-[#FDD835] text-[#1E3A5F] font-semibold text-[15px] hover:bg-[#FBC02D] transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#1E3A5F] border-t-transparent rounded-full animate-spin"></span>
                  Actualizando...
                </span>
              ) : (
                'Actualizar contraseña'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}