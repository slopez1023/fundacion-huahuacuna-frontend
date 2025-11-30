/**
 * GodparentChat - Chat entre padrino y administrador
 * Vista del PADRINO: Sus mensajes a la derecha (verde), los del admin a la izquierda (blanco)
 * @author Fundación Huahuacuna
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle } from "lucide-react";

interface ChatMessage {
  id: number;
  contenido: string;
  fecha: string;
  enviado_por?: "PADRINO" | "ADMINISTRADOR";
  enviadoPor?: "PADRINO" | "ADMINISTRADOR"; // Alternativa camelCase
}

interface GodparentChatProps {
  apadrinamientoId: number;
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export default function GodparentChat({
  apadrinamientoId,
  messages,
  onSendMessage,
  isLoading = false,
}: GodparentChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Obtener el remitente del mensaje (maneja diferentes formatos)
  const getSender = (msg: ChatMessage): string => {
    // Intentar obtener el valor de cualquier variante del campo
    const sender = msg.enviado_por || msg.enviadoPor || "";
    return sender.toString().toUpperCase();
  };

  // En la vista del padrino: sus mensajes van a la derecha (verde)
  const isMyMessage = (msg: ChatMessage): boolean => {
    const sender = getSender(msg);
    // El padrino ve SUS mensajes a la derecha
    return sender === "PADRINO";
  };

  // Obtener nombre del remitente para mostrar
  const getSenderName = (msg: ChatMessage): string => {
    const sender = getSender(msg);
    return sender === "PADRINO" ? "Tú" : "Administrador";
  };

  // Formatear fecha del mensaje
  const formatMessageDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return "Hoy";
      } else if (date.toDateString() === yesterday.toDateString()) {
        return "Ayer";
      } else {
        return date.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    } catch {
      return "";
    }
  };

  // Formatear hora del mensaje
  const formatMessageTime = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  // Agrupar mensajes por fecha
  const getMessageGroups = () => {
    const groups: { date: string; messages: ChatMessage[] }[] = [];
    let currentDate = "";

    messages.forEach((msg) => {
      const msgDate = formatMessageDate(msg.fecha);
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ date: msgDate, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });

    return groups;
  };

  const messageGroups = getMessageGroups();

  // Debug: mostrar en consola los mensajes para verificar el formato
  useEffect(() => {
    if (messages.length > 0) {
      console.log("📨 Mensajes recibidos en GodparentChat:", messages);
      console.log("📨 Primer mensaje enviado_por:", messages[0]?.enviado_por);
      console.log("📨 Primer mensaje enviadoPor:", messages[0]?.enviadoPor);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">Chat con Administrador</h3>
            <p className="text-xs text-blue-100">Preguntas sobre tu apadrinado</p>
          </div>
        </div>
      </div>

      {/* Mensajes - Fondo estilo WhatsApp */}
      <div 
        className="flex-1 overflow-y-auto p-4"
        style={{
          backgroundColor: "#e5ddd5",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9c2b8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No hay mensajes aún</p>
              <p className="text-gray-500 text-sm">¡Inicia una conversación!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messageGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Separador de fecha */}
                {group.date && (
                  <div className="flex justify-center my-4">
                    <span className="bg-white/80 backdrop-blur-sm text-gray-600 text-xs font-medium px-4 py-1.5 rounded-full shadow-sm">
                      {group.date}
                    </span>
                  </div>
                )}

                {/* Mensajes del grupo */}
                {group.messages.map((msg, msgIndex) => {
                  const isMine = isMyMessage(msg);
                  const prevMsg = msgIndex > 0 ? group.messages[msgIndex - 1] : null;
                  const showSenderName = !isMine && (!prevMsg || getSender(prevMsg) !== getSender(msg));

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1`}
                    >
                      <div className="max-w-[75%]">
                        {/* Nombre del remitente (solo para mensajes del admin) */}
                        {showSenderName && (
                          <p className="text-xs font-semibold mb-1 ml-3 text-green-600">
                            {getSenderName(msg)}
                          </p>
                        )}

                        {/* Burbuja del mensaje */}
                        <div
                          className={`relative px-3 py-2 rounded-lg shadow-sm ${
                            isMine
                              ? "bg-[#dcf8c6] text-gray-900 rounded-tr-none"
                              : "bg-white text-gray-900 rounded-tl-none"
                          }`}
                        >
                          <p className="text-sm leading-relaxed break-words pr-12">
                            {msg.contenido}
                          </p>

                          {/* Hora del mensaje - posición absoluta */}
                          <span className="absolute bottom-1 right-2 text-[10px] text-gray-500">
                            {formatMessageTime(msg.fecha)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3 bg-gray-100 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading || isSending}
            className="flex-1 px-4 py-3 border-0 rounded-full focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm"
          />
          <button
            type="submit"
            disabled={isLoading || isSending || !newMessage.trim()}
            className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}