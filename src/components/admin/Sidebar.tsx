"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Heart, 
  LogOut,
  FolderHeart,
  Bell,
  UserCog,
  User,
  Settings,
  FileText,
  Home,
  CheckCircle2,
  MessageCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";

const menuItems = [
  { name: "Resumen", icon: LayoutDashboard, href: "/dashboard", section: "main" },
  { name: "Solicitudes", icon: FileText, href: "/dashboard/solicitudes", section: "main" },
  { name: "Niños (Apadrinar)", icon: Users, href: "/dashboard/ninos", section: "main" },
  { name: "Eventos", icon: Calendar, href: "/dashboard/eventos", section: "main" },
  { name: "Proyectos", icon: FolderHeart, href: "/dashboard/proyectos", section: "main" },
  // ✅ NUEVO: Enlace a mensajes de padrinos
  { name: "Mensajes", icon: MessageCircle, href: "/dashboard/mensajes", section: "main", badge: "chat" },
];

const userMenuItems = [
  { name: "Notificaciones", icon: Bell, href: "/dashboard/notifications", badge: "notifications" },
  { name: "Gestión de Usuarios", icon: UserCog, href: "/dashboard/users" },
  { name: "Ver Perfil", icon: User, href: "/dashboard/profile" },
  { name: "Configuración", icon: Settings, href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications({ pollInterval: 30000 });

  // TODO: Obtener contador de mensajes no leídos del chat
  const unreadMessages = 0; // Esto se puede conectar con adminChatService.getUnreadCount()

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-50 via-white to-gray-50 border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 h-full z-10 shadow-2xl">
      {/* Header con diseño moderno y elegante */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#2c5282] to-[#1a2f4d] p-6">
        {/* Efecto decorativo de fondo */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAgNi0xMiA2LTEyIDAgUzM2IDggMzYgMTR6bS0yNCAwYzAgNi0xMiA2LTEyIDAgUzEyIDggMTIgMTR6bTI0IDI0YzAgNi0xMiA2LTEyIDAgUzM2IDMyIDM2IDM4em0tMjQgMGMwIDYtMTIgNi0xMiAwIFMxMiAzMiAxMiAzOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        {/* Contenido del header */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-14 h-14 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl p-2 ring-2 ring-white/20">
                <Image 
                  src="/logo.png" 
                  alt="Huahuacuna Logo" 
                  width={44} 
                  height={44}
                  className="object-contain"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FDD835] rounded-full border-2 border-[#1E3A5F] flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-[#1E3A5F]" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Huahuacuna</h1>
              <p className="text-xs text-white/70 font-medium">Panel Administrativo</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Card con diseño premium */}
      <div className="px-4 pt-4 pb-3">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A5F] via-[#2c5282] to-[#1a2f4d] text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg ring-2 ring-blue-100">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1E3A5F] truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@huahuacuna.org'}</p>
            </div>
          </div>
          
          {/* Botón Volver al Home integrado */}
          <Link
            href="/home"
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-[#FDD835] to-[#fce34f] text-[#1E3A5F] rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>Volver al Home</span>
          </Link>
        </div>
      </div>

      {/* Navigation - Sección principal con diseño atractivo */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="mb-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const showBadge = item.badge === "chat" && unreadMessages > 0;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium group ${
                  isActive
                    ? "bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] text-white shadow-lg transform scale-105"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-[#1E3A5F] hover:shadow-md"
                }`}
              >
                <div className={`p-2 rounded-lg transition-all ${
                  isActive 
                    ? "bg-white/20" 
                    : "bg-gray-100 group-hover:bg-[#1E3A5F] group-hover:text-white"
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-semibold">{item.name}</span>
                {showBadge && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
                {isActive && !showBadge && (
                  <div className="ml-auto w-2 h-2 bg-[#FDD835] rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider elegante */}
        <div className="border-t-2 border-gray-200 my-4"></div>

        {/* User Menu Items con estilo */}
        <div className="space-y-2">
          {userMenuItems.map((item) => {
            const isActive = pathname === item.href;
            const showNotificationBadge = item.badge === "notifications" && unreadCount > 0;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group relative ${
                  isActive
                    ? "bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] text-white shadow-lg transform scale-105"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-[#1E3A5F] hover:shadow-md"
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all ${
                  isActive 
                    ? "bg-white/20" 
                    : "bg-gray-100 group-hover:bg-[#1E3A5F] group-hover:text-white"
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">{item.name}</span>
                {showNotificationBadge && (
                  <span className="ml-auto bg-[#FDD835] text-[#1E3A5F] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
                {isActive && !showNotificationBadge && (
                  <div className="ml-auto w-2 h-2 bg-[#FDD835] rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Info adicional con estilo mejorado */}
      <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 mx-4 rounded-xl mb-4 border-2 border-green-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs font-bold text-green-900">Estado del Sistema</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-700 font-medium">Todo operando correctamente</span>
        </div>
      </div>

      {/* Logout Footer con estilo mejorado */}
      <div className="p-4 border-t-2 border-gray-200 bg-white">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 rounded-xl transition-all font-bold border-2 border-transparent hover:border-red-200 hover:shadow-md group"
        >
          <div className="p-1.5 bg-red-100 group-hover:bg-red-200 rounded-lg transition-all">
            <LogOut className="w-5 h-5" />
          </div>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}