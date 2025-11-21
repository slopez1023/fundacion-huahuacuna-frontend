"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/**
 * Navbar
 *
 * Componente de navegación superior mejorado con:
 * - Menú dropdown del usuario con avatar
 * - Notificaciones con badge de contador
 * - Opciones de perfil y configuración
 * - Diseño alineado con la identidad visual de la fundación
 * - UX optimizada para administradores
 *
 * @author Fundación Huahuacuna
 * @version 2.2 (Con notificaciones)
 */
export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  // ✅ Hook de notificaciones (solo para admins)
  const { unreadCount, fetchUnreadCount } = useNotifications({
    autoFetch: false, // No cargar automáticamente
    pollInterval: user?.role === "ADMIN" ? 30000 : 0 // Actualizar cada 30s solo para admins
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // CORRECCIÓN: Solo renderizar usuario en el cliente después de montar
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ Cargar contador de notificaciones si es admin
  useEffect(() => {
    if (isMounted && user?.role === "ADMIN") {
      fetchUnreadCount();
    }
  }, [isMounted, user, fetchUnreadCount]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    router.push("/");
  };

  const handleDashboard = () => {
    setIsDropdownOpen(false);
    router.push("/dashboard");
  };

  const handleUsers = () => {
    setIsDropdownOpen(false);
    router.push("/dashboard/users");
  };

  const handleProfile = () => {
    setIsDropdownOpen(false);
    router.push("/dashboard/profile");
  };

  // ✅ NUEVO: Ir a notificaciones
  const handleNotifications = () => {
    setIsDropdownOpen(false);
    router.push("/dashboard/notifications");
  };

  // Obtener iniciales del usuario
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="w-full py-3 relative z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-[30px] border border-gray-200/80 shadow-lg bg-white">
          <div className="bg-gradient-to-r from-white via-yellow-50 to-yellow-300/70 px-6 py-2.5 rounded-[30px]">
            <div className="flex items-center justify-between gap-4">
              {/* Logo y navegación principal */}
              <div className="flex items-center gap-8">
                <Link href="/">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-white rounded-full p-1 shadow-sm">
                      <Image
                        src="/logo.png"
                        alt="logo"
                        width={36}
                        height={36}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                  <Link
                    href="/apadrinar"
                    className="text-[#1E3A5F]/90 hover:text-[#1E3A5F] font-semibold text-sm transition-colors"
                  >
                    Apadrinar
                  </Link>
                  <Link
                    href="/impacto"
                    className="text-[#1E3A5F]/90 hover:text-[#1E3A5F] font-semibold text-sm transition-colors"
                  >
                    Impacto
                  </Link>
                  <Link
                    href="/proyectos"
                    className="text-[#1E3A5F]/90 hover:text-[#1E3A5F] font-semibold text-sm transition-colors"
                  >
                    Proyectos
                  </Link>
                  <Link
                    href="/voluntariado"
                    className="text-[#1E3A5F]/90 hover:text-[#1E3A5F] font-semibold text-sm transition-colors"
                  >
                    Voluntariado
                  </Link>
                  <Link
                    href="/historia"
                    className="text-[#1E3A5F]/90 hover:text-[#1E3A5F] font-semibold text-sm transition-colors"
                  >
                    Historias
                  </Link>
                </nav>
              </div>

              {/* Sección derecha - Usuario */}
              <div className="flex items-center gap-3">
                {isMounted && user ? (
                  <>
                    {/* ✅ NUEVO: Botón de Notificaciones (solo para admins) */}
                    {user.role === "ADMIN" && (
                      <button
                        onClick={handleNotifications}
                        className="relative p-2 text-[#1E3A5F] hover:text-[#FDD835] hover:bg-white/50 transition-all rounded-full"
                        title="Notificaciones"
                      >
                        <svg 
                          className="w-6 h-6" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                          />
                        </svg>
                        
                        {/* Badge con contador */}
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </button>
                    )}

                    {/* Menú de usuario con dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white hover:bg-gray-50 transition-all shadow-sm border border-gray-200"
                      >
                        {/* Avatar con iniciales */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] flex items-center justify-center text-white text-xs font-bold shadow-inner">
                          {getInitials(user.name)}
                        </div>

                        {/* Nombre del usuario */}
                        <span className="text-[#1E3A5F] font-semibold text-sm max-w-[120px] truncate">
                          {user.name.split(" ")[0]}
                        </span>

                        {/* Icono flecha */}
                        <svg
                          className={`w-4 h-4 text-[#1E3A5F] transition-transform ${
                            isDropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Dropdown Menu - Solo renderizar si está abierto */}
                      {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[100] animate-fadeIn">
                          {/* Header del dropdown con info del usuario */}
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] flex items-center justify-center text-white text-sm font-bold shadow-inner">
                                {getInitials(user.name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#1E3A5F] truncate">
                                  {user.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Opciones del menú */}
                          <div className="py-1">
                            {/* Panel Administrativo */}
                            {user.role === "ADMIN" && (
                              <>
                                <button
                                  onClick={handleDashboard}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <svg
                                    className="w-5 h-5 text-[#1E3A5F]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                  </svg>
                                  <span className="font-medium">Solicitudes</span>
                                </button>

                                {/* ✅ NUEVO: Notificaciones en el dropdown también */}
                                <button
                                  onClick={handleNotifications}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <svg
                                    className="w-5 h-5 text-[#1E3A5F]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                  </svg>
                                  <div className="flex items-center justify-between flex-1">
                                    <span className="font-medium">Notificaciones</span>
                                    {unreadCount > 0 && (
                                      <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-2 py-0.5">
                                        {unreadCount}
                                      </span>
                                    )}
                                  </div>
                                </button>

                                {/* Gestión de Usuarios */}
                                <button
                                  onClick={handleUsers}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <svg
                                    className="w-5 h-5 text-[#1E3A5F]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                  </svg>
                                  <span className="font-medium">Gestión de Usuarios</span>
                                </button>
                              </>
                            )}

                            {/* Ver Perfil */}
                            <button
                              onClick={handleProfile}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <svg
                                className="w-5 h-5 text-[#1E3A5F]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              <span className="font-medium">Ver Perfil</span>
                            </button>

                            {/* Configuración */}
                            <button
                              onClick={() => {
                                setIsDropdownOpen(false);
                                router.push("/dashboard/settings");
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <svg
                                className="w-5 h-5 text-[#1E3A5F]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
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
                              <span className="font-medium">Configuración</span>
                            </button>
                          </div>

                          {/* Separador */}
                          <div className="border-t border-gray-100 my-1"></div>

                          {/* Cerrar Sesión */}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-xl"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            <span className="font-medium">Cerrar Sesión</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Usuario no autenticado - Solo renderizar después de montar */}
                    {isMounted && (
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-200 bg-white text-[#1E3A5F] shadow-sm hover:bg-gray-50 transition-colors font-semibold text-sm"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                        Iniciar Sesión
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos para animación */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}