// src/app/forgot-password/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/**
 * ForgotPasswordPage
 * 
 * Página para solicitar recuperación de contraseña.
 * El usuario ingresa su email y recibe un token para resetear su contraseña.
 */
export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, isLoading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setLocalError('Por favor, ingresa tu correo');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Correo electrónico inválido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!validateEmail()) return;

    try {
      const resetToken = await forgotPassword(email);
      setToken(resetToken);
      setSubmitted(true);
    } catch (err) {
      console.error('Error al solicitar recuperación:', err);
    }
  };

  const displayError = localError || error;

  // Pantalla de éxito
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#1F2937] mb-2">
                ✅ Solicitud enviada
              </h2>
              <p className="text-sm text-gray-600">
                Se ha generado un enlace de recuperación para tu correo.
              </p>
            </div>

            {/* SOLO PARA DESARROLLO - Mostrar token */}
            {token && (
              <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <p className="text-xs font-bold text-yellow-800 mb-2">
                  ⚠️ MODO DESARROLLO
                </p>
                <p className="text-xs text-yellow-700 mb-3 break-all">
                  Token: <code className="bg-yellow-100 px-1 py-0.5 rounded">{token}</code>
                </p>
                <button
                  onClick={() => router.push(`/reset-password?token=${token}`)}
                  className="w-full py-2 px-4 bg-yellow-600 text-white text-xs font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Ir a resetear contraseña →
                </button>
              </div>
            )}

            <button
              onClick={() => router.push('/login')}
              className="w-full py-3.5 rounded-full bg-[#FDD835] text-[#1E3A5F] font-semibold text-[15px] hover:bg-[#FBC02D] transition-all shadow-sm"
            >
              Volver al login
            </button>
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
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="text-sm text-gray-600">
              Ingresa tu correo y te enviaremos un enlace para recuperarla.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {displayError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">{displayError}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[14px] font-semibold text-[#1F2937] mb-2.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (displayError) setLocalError(null);
                  }}
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] text-[14px] text-[#1F2937] placeholder:text-gray-400 font-normal transition-all"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#FDD835] text-[#1E3A5F] font-semibold text-[15px] hover:bg-[#FBC02D] transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#1E3A5F] border-t-transparent rounded-full animate-spin"></span>
                  Enviando...
                </span>
              ) : (
                'Enviar enlace de recuperación'
              )}
            </button>
          </form>

          {/* Back to login */}
          <div className="pt-2">
            <Link 
              href="/login"
              className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-[#FDD835] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}