/**
 * ApprovedGodparentView - Vista para padrinos aprobados
 * Muestra lista de niños disponibles o el niño apadrinado con bitácora y chat
 * 
 * CORRECCIÓN v2.0: Removida la funcionalidad de agregar entradas a la bitácora.
 * El padrino solo puede VER la bitácora y DESCARGARLA.
 * Solo el administrador puede agregar entradas.
 * 
 * @author Fundación Huahuacuna
 * @version 2.0 - Solo lectura de bitácora
 */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { godparentService } from "@/services/GodparentService";
import {
  IPadrinoResponse,
  INinoResponse,
  IApadrinamientoResponse,
  IBitacoraEntrada,
} from "@/types/apadrinamiento.types";
import AvailableChildrenList from "@/components/apadrinamiento/AvailableChildrenList";
import GodchildDetail from "@/components/apadrinamiento/GodchildDetail";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Bell, X } from "lucide-react";

interface ChatMessage {
  id: number;
  contenido: string;
  fecha: string;
  enviado_por?: "PADRINO" | "ADMINISTRADOR";
  enviadoPor?: "PADRINO" | "ADMINISTRADOR";
}

export default function ApprovedGodparentView() {
  const { user } = useAuth();
  const [godparentProfile, setGodparentProfile] = useState<IPadrinoResponse | null>(null);
  const [availableChildren, setAvailableChildren] = useState<INinoResponse[]>([]);
  const [godchild, setGodchild] = useState<IApadrinamientoResponse | null>(null);
  const [logEntries, setLogEntries] = useState<IBitacoraEntrada[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cargar datos del padrino
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener perfil del padrino
        const profile = await godparentService.getMyProfile();
        setGodparentProfile(profile);

        // Obtener apadrinamiento actual
        const currentGodchild = await godparentService.getMyGodchild();
        setGodchild(currentGodchild);

        if (!currentGodchild) {
          // Si no tiene apadrinado, cargar niños disponibles
          const children = await godparentService.getAvailableChildren();
          setAvailableChildren(children);
        } else {
          // Si tiene apadrinado, cargar bitácora y mensajes
          const [log, messages] = await Promise.all([
            godparentService.getGodchildLog(currentGodchild.id),
            godparentService.getChatMessages(currentGodchild.id),
          ]);
          setLogEntries(log);
          setChatMessages(messages);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar datos";
        setError(errorMessage);
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // Auto-ocultar mensaje de éxito después de 5 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Seleccionar un niño para apadrinar
  const handleSelectChild = async (childId: number, childName: string) => {
    try {
      setLoading(true);
      const apadrinamiento = await godparentService.selectChild(childId);
      setGodchild(apadrinamiento);
      setSuccessMessage(
        `¡Felicidades! Has seleccionado a ${childName} para apadrinar. El administrador ha sido notificado.`
      );
      setAvailableChildren([]);

      // Cargar datos del nuevo apadrinado
      const [log, messages] = await Promise.all([
        godparentService.getGodchildLog(apadrinamiento.id),
        godparentService.getChatMessages(apadrinamiento.id),
      ]);
      setLogEntries(log);
      setChatMessages(messages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al seleccionar niño";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ❌ REMOVIDO: handleAddLogEntry
  // El padrino NO debe poder agregar entradas a la bitácora
  // Esta función ha sido eliminada porque solo el administrador puede hacerlo

  // Enviar mensaje al administrador (esto SÍ se mantiene)
  const handleSendMessage = async (message: string) => {
    if (!godchild) return;
    try {
      await godparentService.sendMessage(godchild.id, message);
      // Recargar mensajes
      const messages = await godparentService.getChatMessages(godchild.id);
      setChatMessages(messages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al enviar mensaje";
      setError(errorMessage);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 font-['Poppins']">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 pt-28">
        {/* Mensajes de éxito/error */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-md animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-green-900">{successMessage}</p>
              </div>
              <button 
                onClick={() => setSuccessMessage(null)}
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-red-900">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1E3A5F] mb-2">
            Mi Apadrinamiento
          </h1>
          {godparentProfile && (
            <p className="text-gray-600">
              Bienvenido, {godparentProfile.nombreCompleto}
            </p>
          )}
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#1E3A5F] border-t-transparent mb-6"></div>
            <p className="text-gray-600 text-lg">Cargando información...</p>
          </div>
        ) : godchild ? (
          // Vista del niño apadrinado
          <GodchildDetail
            child={godchild.nino}
            logEntries={logEntries}
            chatMessages={chatMessages}
            // ❌ REMOVIDO: onAddLogEntry={handleAddLogEntry}
            onSendMessage={handleSendMessage}
            isLoading={loading}
          />
        ) : (
          // Lista de niños disponibles
          <div className="space-y-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <Bell className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-1">
                    Selecciona un niño para apadrinar
                  </h3>
                  <p className="text-blue-800">
                    Elige al niño que deseas apadrinar. Una vez confirmado, el
                    administrador será notificado y podrás acceder a la
                    información completa, bitácora y chat de comunicación.
                  </p>
                </div>
              </div>
            </div>

            <AvailableChildrenList
              children={availableChildren}
              onSelectChild={handleSelectChild}
              isLoading={loading}
            />
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}