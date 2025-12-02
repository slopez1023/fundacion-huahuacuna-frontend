"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { 
  Settings as SettingsIcon, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Shield,
  Info
} from "lucide-react";

/**
 * SettingsPage
 * 
 * Página de configuración del usuario que permite:
 * - Editar información personal
 * - Cambiar contraseña
 * - Configurar notificaciones
 * - Gestionar preferencias de privacidad
 * 
 * @author Fundación Huahuacuna
 * @version 1.0
 */
export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Estado para información personal
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    telefono: "",
  });

  // Estado para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Estado para notificaciones
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    activityUpdates: true,
    newsletterSubscription: false,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router, isMounted]);

  useEffect(() => {
    if (user) {
      setPersonalInfo({
        fullName: user.name || "",
        email: user.email || "",
        telefono: user.telefono || "",
      });
    }
  }, [user]);

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

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/users/${user.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: personalInfo.fullName,
          email: personalInfo.email,
          telefono: personalInfo.telefono,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Información actualizada exitosamente" });
        // Aquí podrías actualizar el contexto del usuario si es necesario
      } else {
        setMessage({ type: "error", text: data.message || "Error al actualizar" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error de conexión. Intenta nuevamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validaciones
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "La contraseña debe tener al menos 6 caracteres" });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/users/${user.userId}/reset-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Contraseña actualizada exitosamente" });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage({ type: "error", text: data.message || "Error al actualizar contraseña" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error de conexión. Intenta nuevamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    {
      id: "personal",
      label: "Información Personal",
      icon: <User className="w-5 h-5" />,
    },
    {
      id: "security",
      label: "Seguridad",
      icon: <Lock className="w-5 h-5" />,
    },
    {
      id: "notifications",
      label: "Notificaciones",
      icon: <Bell className="w-5 h-5" />,
    },
  ];

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 font-['Poppins']">
        <section className="max-w-7xl mx-auto px-6 py-8">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <SettingsIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Configuración
                </h1>
                <p className="text-white/90 mt-1">
                  Gestiona tu información personal y preferencias
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar con tabs */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMessage(null);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8f] text-white font-semibold shadow-md"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {tab.icon}
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="lg:col-span-3">
              {/* Mensajes de éxito/error */}
              {message && (
                <div
                  className={`mb-6 p-4 rounded-xl ${
                    message.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {message.type === "success" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                      <span className="font-medium">{message.text}</span>
                    </div>
                    <button onClick={() => setMessage(null)} className="hover:opacity-70">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Tab: Información Personal */}
              {activeTab === "personal" && (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
                    <User className="w-6 h-6" />
                    Información Personal
                  </h2>
                  <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4 text-[#1E3A5F]" />
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={personalInfo.fullName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none transition-all text-gray-900"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 text-[#1E3A5F]" />
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none transition-all text-gray-900"
                        required
                      />
                      <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Usaremos este correo para comunicarnos contigo
                      </p>
                    </div>

                    <div>
                      <label htmlFor="telefono" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 text-[#1E3A5F]" />
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        value={personalInfo.telefono}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, telefono: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none transition-all text-gray-900"
                        placeholder="Ej: 3001234567"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => router.push("/dashboard/profile")}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-gradient-to-r from-[#FDD835] to-[#fce34f] text-[#1E3A5F] font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Save className="w-5 h-5" />
                        {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tab: Seguridad */}
              {activeTab === "security" && (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Cambiar Contraseña
                  </h2>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Lock className="w-4 h-4 text-[#1E3A5F]" />
                        Contraseña Actual
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none transition-all text-gray-900"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Lock className="w-4 h-4 text-[#1E3A5F]" />
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none transition-all text-gray-900"
                        required
                        minLength={6}
                      />
                      <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Mínimo 6 caracteres
                      </p>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Lock className="w-4 h-4 text-[#1E3A5F]" />
                        Confirmar Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none transition-all text-gray-900"
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex gap-3">
                        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-blue-900 mb-2">Recomendaciones de seguridad</p>
                          <ul className="text-xs text-blue-700 space-y-1">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3" />
                              Usa una combinación de letras, números y símbolos
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3" />
                              No uses información personal obvia
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3" />
                              Cambia tu contraseña regularmente
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                          setMessage(null);
                        }}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-gradient-to-r from-[#FDD835] to-[#fce34f] text-[#1E3A5F] font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Save className="w-5 h-5" />
                        {isSubmitting ? "Actualizando..." : "Actualizar Contraseña"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tab: Notificaciones */}
              {activeTab === "notifications" && (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
                    <Bell className="w-6 h-6" />
                    Preferencias de Notificaciones
                  </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">Notificaciones por Email</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Recibe actualizaciones importantes por correo electrónico
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.emailNotifications}
                        onChange={(e) =>
                          setNotifications({ ...notifications, emailNotifications: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FDD835]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FDD835]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">Actualizaciones de Actividad</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Recibe notificaciones sobre actividades y eventos de la fundación
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.activityUpdates}
                        onChange={(e) =>
                          setNotifications({ ...notifications, activityUpdates: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FDD835]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FDD835]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">Boletín Informativo</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Suscríbete al boletín mensual con noticias y actualizaciones
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.newsletterSubscription}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            newsletterSubscription: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FDD835]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FDD835]"></div>
                    </label>
                  </div>

                    <div className="pt-6">
                      <button
                        onClick={() => {
                          setMessage({ type: "success", text: "Preferencias guardadas exitosamente" });
                        }}
                        className="w-full px-6 py-3 bg-gradient-to-r from-[#FDD835] to-[#fce34f] text-[#1E3A5F] font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Save className="w-5 h-5" />
                        Guardar Preferencias
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}