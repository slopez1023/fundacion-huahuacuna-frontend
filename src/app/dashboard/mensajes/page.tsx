/**
 * Página de Mensajes del Administrador
 * Permite ver y responder mensajes de todos los padrinos
 * @author Fundación Huahuacuna
 */

"use client";

import { useEffect, useState } from "react";
import { 
  MessageCircle, 
  Send, 
  User, 
  Clock, 
  Search,
  RefreshCw,
  ChevronLeft,
  Bell,
  Check,
  CheckCheck
} from "lucide-react";
import { adminChatService, Conversation, ChatMessage } from "@/services/AdminChatService";

export default function MensajesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Cargar conversaciones
  useEffect(() => {
    loadConversations();
  }, []);

  // Cargar mensajes cuando se selecciona una conversación
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.sponsorshipId);
    }
  }, [selectedConversation]);

  // Auto-refresh de mensajes cada 10 segundos
  useEffect(() => {
    if (selectedConversation) {
      const interval = setInterval(() => {
        loadMessages(selectedConversation.sponsorshipId);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await adminChatService.getConversations();
      setConversations(data);
    } catch (err) {
      setError("Error al cargar conversaciones");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (sponsorshipId: number) => {
    try {
      const data = await adminChatService.getMessages(sponsorshipId);
      setMessages(data);
      // Marcar como leídos
      await adminChatService.markAsRead(sponsorshipId);
      // Actualizar contador en la lista
      setConversations(prev => 
        prev.map(c => 
          c.sponsorshipId === sponsorshipId 
            ? { ...c, unreadCount: 0 } 
            : c
        )
      );
    } catch (err) {
      console.error("Error al cargar mensajes:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

    setSendingMessage(true);
    try {
      await adminChatService.sendMessage(selectedConversation.sponsorshipId, newMessage);
      setNewMessage("");
      // Recargar mensajes
      await loadMessages(selectedConversation.sponsorshipId);
    } catch (err) {
      setError("Error al enviar mensaje");
      console.error(err);
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.godparentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.childName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <MessageCircle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Mensajes de Padrinos</h1>
              <p className="text-blue-100">Gestiona la comunicación con los padrinos</p>
            </div>
          </div>
          {totalUnread > 0 && (
            <div className="flex items-center gap-2 bg-[#FDD835] text-[#1E3A5F] px-4 py-2 rounded-full font-bold">
              <Bell className="w-5 h-5" />
              {totalUnread} sin leer
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
        {/* Lista de conversaciones */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar padrino o niño..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all text-gray-900"
              />
            </div>
            <button
              onClick={loadConversations}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#1E3A5F] border-t-transparent"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <MessageCircle className="w-12 h-12 mb-2 opacity-30" />
                <p>No hay conversaciones</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.sponsorshipId}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-all text-left ${
                    selectedConversation?.sponsorshipId === conversation.sponsorshipId
                      ? "bg-blue-50 border-l-4 border-l-[#1E3A5F]"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A5F] to-[#2c5282] rounded-full flex items-center justify-center text-white font-bold">
                        {conversation.godparentName.charAt(0)}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900 truncate">
                          {conversation.godparentName}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        Padrino de: {conversation.childName}
                      </p>
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A5F] to-[#2c5282] rounded-full flex items-center justify-center text-white font-bold">
                    {selectedConversation.godparentName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {selectedConversation.godparentName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Padrino de {selectedConversation.childName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageCircle className="w-16 h-16 mb-3 opacity-30" />
                    <p>No hay mensajes aún</p>
                    <p className="text-sm">Inicia la conversación</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.enviadoPor === "ADMINISTRADOR" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                          msg.enviadoPor === "ADMINISTRADOR"
                            ? "bg-[#1E3A5F] text-white rounded-br-md"
                            : "bg-white text-gray-900 shadow-md rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm">{msg.contenido}</p>
                        <div className={`flex items-center gap-1 mt-1 ${
                          msg.enviadoPor === "ADMINISTRADOR" ? "justify-end" : ""
                        }`}>
                          <span className={`text-xs ${
                            msg.enviadoPor === "ADMINISTRADOR" 
                              ? "text-blue-200" 
                              : "text-gray-500"
                          }`}>
                            {formatTime(msg.fecha)}
                          </span>
                          {msg.enviadoPor === "ADMINISTRADOR" && (
                            msg.leido 
                              ? <CheckCheck className="w-4 h-4 text-blue-200" />
                              : <Check className="w-4 h-4 text-blue-200" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    disabled={sendingMessage}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all text-gray-900 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !newMessage.trim()}
                    className="px-6 py-3 bg-[#1E3A5F] hover:bg-[#2c5282] text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {sendingMessage ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    <span className="hidden sm:inline">Enviar</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Selecciona una conversación
              </h3>
              <p className="text-gray-500 text-center max-w-sm">
                Elige un padrino de la lista para ver los mensajes y responder
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Función auxiliar para formatear tiempo
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Ahora";
  if (diffMins < 60) return `${diffMins} min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}