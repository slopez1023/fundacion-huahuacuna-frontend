/**
 * GodchildDetail - Detalle completo del niño apadrinado
 * @author Fundación Huahuacuna
 */

"use client";

import { INinoResponse, IBitacoraEntrada } from "@/types/apadrinamiento.types";
import { Heart, Calendar, Users, Award } from "lucide-react";
import GodchildLog from "./GodchildLog";
import GodparentChat from "./GodparentChat";
import { useState } from "react";

interface ChatMessage {
  id: number;
  contenido: string;
  fecha: string;
  enviado_por: "PADRINO" | "ADMINISTRADOR";
}

interface GodchildDetailProps {
  child: INinoResponse;
  logEntries: IBitacoraEntrada[];
  chatMessages: ChatMessage[];
  onAddLogEntry?: (titulo: string, contenido: string) => Promise<void>;
  onSendMessage?: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export default function GodchildDetail({
  child,
  logEntries,
  chatMessages,
  onAddLogEntry,
  onSendMessage,
  isLoading = false,
}: GodchildDetailProps) {
  const [activeTab, setActiveTab] = useState<"info" | "log" | "chat">("info");

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Card de info principal */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-pink-200">
        <div className="h-64 bg-gradient-to-br from-pink-400 to-pink-600 relative overflow-hidden">
          {child.fotoUrl ? (
            <img
              src={child.fotoUrl}
              alt={`${child.nombre} ${child.apellido}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Heart className="w-24 h-24 text-white/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        <div className="relative px-6 py-8 -mt-16">
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
            <h1 className="text-4xl font-bold text-[#1E3A5F] mb-4">
              {child.nombre} {child.apellido}
            </h1>

            {/* Información básica en grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-pink-50 rounded-xl">
                <Calendar className="w-5 h-5 text-pink-600 mx-auto mb-1" />
                <p className="text-sm font-bold text-gray-900">
                  {calculateAge(child.fechaNacimiento)} años
                </p>
                <p className="text-xs text-gray-600">Edad</p>
              </div>

              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-sm font-bold text-gray-900">
                  {child.genero}
                </p>
                <p className="text-xs text-gray-600">Género</p>
              </div>

              <div className="text-center p-3 bg-green-50 rounded-xl">
                <Award className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-sm font-bold text-gray-900">
                  {new Date(child.fechaRegistro).toLocaleDateString("es-ES")}
                </p>
                <p className="text-xs text-gray-600">Registrado</p>
              </div>

              <div className="text-center p-3 bg-yellow-50 rounded-xl">
                <Heart className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                <p className="text-sm font-bold text-gray-900">Apadrinado</p>
                <p className="text-xs text-gray-600">Estado</p>
              </div>
            </div>

            {/* Biografía */}
            {child.biografia && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#1E3A5F] mb-2">
                  Sobre {child.nombre}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {child.biografia}
                </p>
              </div>
            )}

            {/* Necesidades */}
            {child.necesidades && (
              <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
                <h4 className="font-bold text-amber-900 mb-2">
                  Necesidades especiales:
                </h4>
                <p className="text-amber-800">{child.necesidades}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-gray-200 overflow-x-auto">
        {(
          [
            { id: "info", label: "Información" },
            { id: "log", label: "Bitácora" },
            { id: "chat", label: "Chat" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "text-pink-600 border-b-2 border-pink-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de tabs */}
      <div>
        {activeTab === "info" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-4">
                Información del Niño
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Nombre:</span>
                  <span className="text-gray-900">
                    {child.nombre} {child.apellido}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Edad:</span>
                  <span className="text-gray-900">
                    {calculateAge(child.fechaNacimiento)} años
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Género:</span>
                  <span className="text-gray-900">{child.genero}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">
                    Fecha de Nacimiento:
                  </span>
                  <span className="text-gray-900">
                    {new Date(child.fechaNacimiento).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>

                {child.necesidades && (
                  <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
                    <p className="font-semibold text-amber-900 mb-2">
                      Necesidades Especiales:
                    </p>
                    <p className="text-amber-800">{child.necesidades}</p>
                  </div>
                )}
              </div>
            </div>

            {child.biografia && (
              <div>
                <h3 className="text-lg font-bold text-[#1E3A5F] mb-3">
                  Biografía
                </h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {child.biografia}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "log" && (
          <GodchildLog
            entries={logEntries}
            onAddEntry={onAddLogEntry}
            isLoading={isLoading}
          />
        )}

        {activeTab === "chat" && onSendMessage && (
          <div className="h-96">
            <GodparentChat
              apadrinamientoId={0}
              messages={chatMessages}
              onSendMessage={onSendMessage}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
