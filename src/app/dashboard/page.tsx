/**
 * Dashboard Principal - Resumen
 * Vista general del panel administrativo con estadísticas y actividad reciente
 * 
 * @author Fundación Huahuacuna
 * @version 1.0
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Heart, 
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Activity,
  UserPlus,
  FolderHeart
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useAuth } from "@/hooks/useAuth";
import { useApplications } from "@/hooks/useApplications";
import { useNotifications } from "@/hooks/useNotifications";
import StatCard from "@/components/admin/StatCard";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import type { ApplicationResponse } from "@/types/application";

export default function DashboardResumenPage() {
  const { user } = useAuth();
  
  // Hooks de datos
  const {
    applications,
    statistics,
    isLoading,
    fetchApplications
  } = useApplications({ autoFetch: true });

  const {
    unreadCount,
    fetchUnreadCount
  } = useNotifications({ pollInterval: 30000 });

  // Refrescar datos al montar
  useEffect(() => {
    fetchApplications();
    fetchUnreadCount();
  }, [fetchApplications, fetchUnreadCount]);

  // Obtener las últimas 5 solicitudes
  const recentApplications = applications.slice(0, 5);

  // Calcular tasa de aprobación
  const approvalRate = statistics?.total 
    ? Math.round((statistics.aprobadas / statistics.total) * 100) 
    : 0;

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 font-['Poppins']">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            {/* Bienvenida con gradiente */}
            <div className="mt-6 bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] rounded-2xl p-6 md:p-8 text-white shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <LayoutDashboard className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-white/90 text-sm font-medium">
                    {new Date().getHours() < 12 ? '¡Buenos días!' : new Date().getHours() < 18 ? '¡Buenas tardes!' : '¡Buenas noches!'}
                  </p>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {user?.name || 'Santiago Cardona'}
                  </h1>
                </div>
              </div>
              <p className="text-white/90 mt-3">
                Bienvenido al panel de control de la Fundación Huahuacuna
              </p>
            </div>
          </div>

          {/* Estadísticas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Solicitudes"
              value={statistics?.total || 0}
              icon={<FileText className="w-6 h-6" />}
              color="blue"
            />

            <StatCard
              title="Pendientes"
              value={statistics?.pendientes || 0}
              icon={<Clock className="w-6 h-6" />}
              color="yellow"
            />

            <StatCard
              title="Aprobadas"
              value={statistics?.aprobadas || 0}
              icon={<CheckCircle2 className="w-6 h-6" />}
              color="green"
            />

            <StatCard
              title="Voluntarios"
              value={statistics?.totalVoluntarios || 0}
              icon={<Users className="w-6 h-6" />}
              color="blue"
            />
          </div>

          {/* Grid de dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Actividad Reciente - 2/3 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#1E3A5F]">Actividad Reciente</h2>
                      <p className="text-sm text-gray-600">Últimas solicitudes registradas</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/solicitudes"
                    className="text-[#1E3A5F] hover:text-[#FDD835] font-medium text-sm flex items-center gap-1 transition-colors"
                  >
                    Ver todas
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#1E3A5F] border-t-transparent"></div>
                    <p className="text-gray-600 mt-3">Cargando actividad...</p>
                  </div>
                ) : recentApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">No hay actividad reciente</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentApplications.map((app: ApplicationResponse) => (
                      <div
                        key={app.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A5F] to-[#2c5282] text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">
                          {app.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{app.fullName}</p>
                          <p className="text-sm text-gray-600 truncate">{app.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            app.type === 'VOLUNTARIO' 
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-pink-100 text-pink-700'
                          }`}>
                            {app.type === 'VOLUNTARIO' ? 'Voluntario' : 'Padrino'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            app.status === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-700' :
                            app.status === 'APROBADO' ? 'bg-green-100 text-green-700' :
                            app.status === 'RECHAZADO' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {app.status === 'PENDIENTE' ? 'Pendiente' :
                             app.status === 'APROBADO' ? 'Aprobado' :
                             app.status === 'RECHAZADO' ? 'Rechazado' :
                             'En Revisión'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Métricas Rápidas - 1/3 */}
            <div className="space-y-6">
              {/* Tasa de Aprobación */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-700">Tasa de Aprobación</h3>
                    <p className="text-xs text-gray-500">Del total de solicitudes</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - approvalRate / 100)}`}
                        className="text-green-500"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-[#1E3A5F]">{approvalRate}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accesos Rápidos */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-[#1E3A5F] mb-4">Accesos Rápidos</h3>
                <div className="space-y-2">
                  <Link
                    href="/dashboard/solicitudes"
                    className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200"
                  >
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Ver Solicitudes</span>
                  </Link>
                  <Link
                    href="/dashboard/ninos"
                    className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-200"
                  >
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-900">Gestionar Niños</span>
                  </Link>
                  <Link
                    href="/dashboard/eventos"
                    className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors border border-green-200"
                  >
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Ver Eventos</span>
                  </Link>
                  <Link
                    href="/dashboard/proyectos"
                    className="flex items-center gap-3 p-3 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors border border-yellow-200"
                  >
                    <FolderHeart className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-900">Ver Proyectos</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjetas informativas adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notificaciones */}
            {unreadCount > 0 && (
              <Link href="/dashboard/notifications">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-md border-2 border-yellow-200 p-6 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                      <AlertCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-yellow-900">
                        Tienes {unreadCount} {unreadCount === 1 ? 'notificación nueva' : 'notificaciones nuevas'}
                      </h3>
                      <p className="text-sm text-yellow-700">Haz clic para ver los detalles</p>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Solicitudes Pendientes */}
            {statistics && statistics.pendientes > 0 && (
              <Link href="/dashboard/solicitudes">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-md border-2 border-blue-200 p-6 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-blue-900">
                        {statistics.pendientes} {statistics.pendientes === 1 ? 'solicitud pendiente' : 'solicitudes pendientes'}
                      </h3>
                      <p className="text-sm text-blue-700">Requieren tu atención</p>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
