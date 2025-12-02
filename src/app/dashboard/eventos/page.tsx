"use client";

import { useEffect, useState } from "react";
import { eventService, Event } from "@/services/EventService";
import { Trash2, Plus, Calendar, MapPin, Edit, Search, Filter, CalendarDays, Clock, Share2 } from "lucide-react";
import EventModal from "@/components/admin/EventModal";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import PublishConfirmDialog from "@/components/admin/PublishConfirmDialog";

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; eventId: number | null }>({ isOpen: false, eventId: null });
  const [publishDialog, setPublishDialog] = useState<{ isOpen: boolean; eventId: number | null; eventTitle: string }>({ isOpen: false, eventId: null, eventTitle: "" });

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    try {
      const data = await eventService.getAll();
      setEvents(data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const handleDelete = (id: number) => {
    setConfirmDialog({ isOpen: true, eventId: id });
  };

  const confirmDelete = async () => {
    if (confirmDialog.eventId) {
      try {
        await eventService.delete(confirmDialog.eventId);
        await loadEvents();
        setConfirmDialog({ isOpen: false, eventId: null });
      } catch (error) {
        console.error("Error al eliminar evento:", error);
      }
    }
  };

  const handlePublish = (event: Event) => {
    setPublishDialog({
      isOpen: true,
      eventId: event.id || null,
      eventTitle: event.title
    });
  };

  const confirmPublish = async () => {
    if (publishDialog.eventId) {
      try {
        await eventService.publish(publishDialog.eventId);
        await loadEvents();
        setPublishDialog({ isOpen: false, eventId: null, eventTitle: "" });
      } catch (error) {
        console.error("Error al publicar evento:", error);
      }
    }
  };

  // Filtrar eventos
  const filteredEvents = events.filter((event) => {
    const matchesSearch = searchTerm === "" ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 font-['Poppins']">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header sin breadcrumb */}
          <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <CalendarDays className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Gestión de Eventos
                  </h1>
                  <p className="text-white/90 mt-1">
                    Administra los eventos de la fundación
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#FDD835] text-[#1E3A5F] px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#FEC601] transition-all shadow-lg hover:shadow-xl font-bold transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span>Nuevo Evento</span>
              </button>
            </div>
          </div>

          {/* Filtros y búsqueda */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-[#1E3A5F]" />
              <h3 className="text-lg font-bold text-[#1E3A5F]">Búsqueda</h3>
            </div>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o ubicación..."
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] transition-all text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Tabla de eventos */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1E3A5F]">Eventos Registrados</h2>
                  <p className="text-sm text-gray-600">
                    {filteredEvents.length} {filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
                  </p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="p-16 text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#1E3A5F] border-t-transparent mb-6"></div>
                <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">Cargando eventos...</h3>
                <p className="text-gray-600">Por favor espera un momento</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CalendarDays className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {searchTerm ? 'No se encontraron resultados' : 'No hay eventos registrados'}
                </h3>
                <p className="text-gray-600 text-lg mb-6">
                  {searchTerm
                    ? 'Intenta ajustar la búsqueda'
                    : 'Comienza agregando el primer evento'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Imagen</th>
                      <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Evento</th>
                      <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Fecha</th>
                      <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Ubicación</th>
                      <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-green-50/50 transition-colors">
                        <td className="p-4">
                          <img 
                            src={event.imageUrl || "https://via.placeholder.com/100"} 
                            alt={event.title} 
                            className="w-20 h-14 object-cover rounded-xl border-2 border-gray-200 shadow-sm" 
                          />
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-gray-900">{event.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{event.description}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Clock className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{new Date(event.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                              <p className="text-xs text-gray-500">{new Date(event.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-red-600" />
                            </div>
                            <span className="font-medium">{event.location}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {!event.published && (
                              <button 
                                onClick={() => handlePublish(event)}
                                className="p-2.5 text-green-600 hover:bg-green-100 rounded-xl transition-all hover:scale-110 border border-green-200"
                                title="Publicar evento"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all hover:scale-110 border border-blue-200"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => event.id && handleDelete(event.id)}
                              className="p-2.5 text-red-600 hover:bg-red-100 rounded-xl transition-all hover:scale-110 border border-red-200"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ConfirmDialog para Eliminar */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ isOpen: false, eventId: null })}
          onConfirm={confirmDelete}
          title="Eliminar Evento"
          message="¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
        />

        {/* PublishConfirmDialog para Publicar */}
        <PublishConfirmDialog
          isOpen={publishDialog.isOpen}
          onClose={() => setPublishDialog({ isOpen: false, eventId: null, eventTitle: "" })}
          onConfirm={confirmPublish}
          title={publishDialog.eventTitle}
          itemType="evento"
        />

        {/* Modal */}
        <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSaved={loadEvents} />
      </main>
    </ProtectedRoute>
  );
}