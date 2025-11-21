"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useAuth } from "@/hooks/useAuth";

/**
 * ProfilePage
 * 
 * Página de perfil del usuario que muestra:
 * - Información personal completa
 * - Estadísticas según el rol
 * - Estado de la cuenta
 * - Fecha de registro
 * 
 * @author Fundación Huahuacuna
 * @version 1.0
 */
export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router, isMounted]);

  if (!isMounted || isLoading) {
    return (
      <main className="min-h-screen bg-[var(--background)] font-['Poppins']">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A5F]"></div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  // Obtener iniciales del usuario
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Obtener badge de rol
  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: "bg-purple-100 text-purple-800 border-purple-200",
      PADRINO: "bg-blue-100 text-blue-800 border-blue-200",
      VOLUNTARIO: "bg-green-100 text-green-800 border-green-200",
    };
    const labels = {
      ADMIN: "Administrador",
      PADRINO: "Padrino",
      VOLUNTARIO: "Voluntario",
    };
    return (
      <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${styles[role as keyof typeof styles]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-[var(--background)] font-['Poppins']">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-12">
        {/* Header con breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <button onClick={() => router.push("/dashboard")} className="hover:text-[#1E3A5F]">
              Dashboard
            </button>
            <span>/</span>
            <span className="text-[#1E3A5F] font-medium">Mi Perfil</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1E3A5F]">Mi Perfil</h1>
          <p className="text-gray-600 mt-2">Visualiza y gestiona tu información personal</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Tarjeta principal */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              {/* Avatar grande */}
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {getInitials(user.name)}
              </div>

              {/* Nombre y email */}
              <h2 className="text-2xl font-bold text-[#1E3A5F] mt-6">{user.name}</h2>
              <p className="text-gray-500 mt-1">{user.email}</p>

              {/* Badge de rol */}
              <div className="mt-4">{getRoleBadge(user.role)}</div>

              {/* Estado de la cuenta */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Cuenta Activa</span>
                </div>
              </div>

              {/* Botón editar perfil */}
              <button
                onClick={() => router.push("/dashboard/settings")}
                className="w-full mt-6 px-4 py-2.5 rounded-lg bg-[#FDD835] text-[#1E3A5F] font-semibold hover:bg-[#FBC02D] transition-colors"
              >
                Editar Perfil
              </button>
            </div>
          </div>

          {/* Columna derecha - Información detallada */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Información Personal
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                  <p className="mt-1 text-gray-900 font-medium">{user.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Correo Electrónico</label>
                  <p className="mt-1 text-gray-900 font-medium">{user.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono</label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {user.telefono || "No registrado"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Rol en el Sistema</label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {user.role === "ADMIN"
                      ? "Administrador"
                      : user.role === "PADRINO"
                      ? "Padrino"
                      : "Voluntario"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de Registro</label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {user.createdAt ? formatDate(user.createdAt) : "No disponible"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">ID de Usuario</label>
                  <p className="mt-1 text-gray-900 font-medium">#{user.userId}</p>
                </div>
              </div>
            </div>

            {/* Estadísticas según rol */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                {user.role === "ADMIN" ? "Estadísticas Administrativas" : "Mi Actividad"}
              </h3>

              {user.role === "ADMIN" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-100">
                    <div className="text-3xl font-bold text-purple-700">--</div>
                    <div className="text-sm text-purple-600 mt-1">Total Usuarios</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                    <div className="text-3xl font-bold text-blue-700">--</div>
                    <div className="text-sm text-blue-600 mt-1">Padrinos Activos</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
                    <div className="text-3xl font-bold text-green-700">--</div>
                    <div className="text-sm text-green-600 mt-1">Voluntarios</div>
                  </div>
                </div>
              )}

              {user.role === "PADRINO" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                    <div className="text-3xl font-bold text-blue-700">--</div>
                    <div className="text-sm text-blue-600 mt-1">Niños Apadrinados</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
                    <div className="text-3xl font-bold text-green-700">--</div>
                    <div className="text-sm text-green-600 mt-1">Aportes Realizados</div>
                  </div>
                </div>
              )}

              {user.role === "VOLUNTARIO" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
                    <div className="text-3xl font-bold text-green-700">--</div>
                    <div className="text-sm text-green-600 mt-1">Actividades Participadas</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                    <div className="text-3xl font-bold text-blue-700">--</div>
                    <div className="text-sm text-blue-600 mt-1">Horas Voluntariadas</div>
                  </div>
                </div>
              )}

              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  <span className="font-semibold">Próximamente:</span> Aquí podrás ver estadísticas
                  detalladas de tu actividad en la plataforma.
                </p>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="bg-gradient-to-r from-[#FDD835]/10 to-[#FDD835]/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#1E3A5F] mb-4">Acciones Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => router.push("/dashboard/settings")}
                  className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg hover:shadow-md transition-shadow text-left"
                >
                  <div className="w-10 h-10 bg-[#1E3A5F] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E3A5F]">Configuración</p>
                    <p className="text-xs text-gray-500">Editar información personal</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg hover:shadow-md transition-shadow text-left"
                >
                  <div className="w-10 h-10 bg-[#1E3A5F] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E3A5F]">Dashboard</p>
                    <p className="text-xs text-gray-500">Volver al inicio</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}