"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Settings, 
  BarChart3,
  Users as UsersIcon,
  Heart,
  Handshake,
  CheckCircle2,
  Edit
} from "lucide-react";

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
      <ProtectedRoute>
        <main className="min-h-screen bg-gray-50 font-['Poppins'] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A5F]"></div>
        </main>
      </ProtectedRoute>
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
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 font-['Poppins']">
        <section className="max-w-7xl mx-auto px-6 py-8">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Mi Perfil
                  </h1>
                  <p className="text-white/90 mt-1">
                    Visualiza y gestiona tu información personal
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push("/dashboard/settings")}
                className="bg-[#FDD835] text-[#1E3A5F] px-5 py-2.5 rounded-xl font-semibold hover:bg-[#fce34f] transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
              >
                <Edit className="w-5 h-5" />
                <span className="hidden sm:inline">Editar Perfil</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda - Tarjeta principal */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center">
                {/* Avatar grande */}
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-blue-50">
                  {getInitials(user.name)}
                </div>

                {/* Nombre y email */}
                <h2 className="text-2xl font-bold text-[#1E3A5F] mt-6">{user.name}</h2>
                <p className="text-gray-600 mt-1 text-sm">{user.email}</p>

                {/* Badge de rol */}
                <div className="mt-4">{getRoleBadge(user.role)}</div>

                {/* Estado de la cuenta */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-semibold text-gray-700">Cuenta Activa</span>
                  </div>
                </div>

                {/* Botón ir a configuración */}
                <button
                  onClick={() => router.push("/dashboard/settings")}
                  className="w-full mt-6 px-4 py-3 rounded-xl bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8f] text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  Configuración
                </button>
              </div>
            </div>

            {/* Columna derecha - Información detallada */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información Personal */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
                  <User className="w-6 h-6" />
                  Información Personal
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-[#1E3A5F]" />
                      <label className="text-sm font-semibold text-gray-600">Nombre Completo</label>
                    </div>
                    <p className="text-gray-900 font-medium">{user.name}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-[#1E3A5F]" />
                      <label className="text-sm font-semibold text-gray-600">Correo Electrónico</label>
                    </div>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-[#1E3A5F]" />
                      <label className="text-sm font-semibold text-gray-600">Teléfono</label>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {user.telefono || "No registrado"}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-[#1E3A5F]" />
                      <label className="text-sm font-semibold text-gray-600">Rol en el Sistema</label>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {user.role === "ADMIN"
                        ? "Administrador"
                        : user.role === "PADRINO"
                        ? "Padrino"
                        : "Voluntario"}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-[#1E3A5F]" />
                      <label className="text-sm font-semibold text-gray-600">Fecha de Registro</label>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {user.createdAt ? formatDate(user.createdAt) : "No disponible"}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-[#1E3A5F]" />
                      <label className="text-sm font-semibold text-gray-600">ID de Usuario</label>
                    </div>
                    <p className="text-gray-900 font-medium">#{user.userId}</p>
                  </div>
                </div>
              </div>

              {/* Estadísticas según rol */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  {user.role === "ADMIN" ? "Estadísticas Administrativas" : "Mi Actividad"}
                </h3>

                {user.role === "ADMIN" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 text-center border border-purple-200">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <UsersIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-purple-700">--</div>
                      <div className="text-sm text-purple-600 mt-1 font-medium">Total Usuarios</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 text-center border border-blue-200">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-blue-700">--</div>
                      <div className="text-sm text-blue-600 mt-1 font-medium">Padrinos Activos</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 text-center border border-green-200">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Handshake className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-green-700">--</div>
                      <div className="text-sm text-green-600 mt-1 font-medium">Voluntarios</div>
                    </div>
                  </div>
                )}

                {user.role === "PADRINO" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 text-center border border-blue-200">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-blue-700">--</div>
                      <div className="text-sm text-blue-600 mt-1 font-medium">Niños Apadrinados</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 text-center border border-green-200">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-green-700">--</div>
                      <div className="text-sm text-green-600 mt-1 font-medium">Aportes Realizados</div>
                    </div>
                  </div>
                )}

                {user.role === "VOLUNTARIO" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 text-center border border-green-200">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Handshake className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-green-700">--</div>
                      <div className="text-sm text-green-600 mt-1 font-medium">Actividades Participadas</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 text-center border border-blue-200">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-blue-700">--</div>
                      <div className="text-sm text-blue-600 mt-1 font-medium">Horas Voluntariadas</div>
                    </div>
                  </div>
                )}

                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-gray-700 text-center">
                    <span className="font-bold text-[#1E3A5F]">Próximamente:</span> Aquí podrás ver estadísticas
                    detalladas de tu actividad en la plataforma.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}