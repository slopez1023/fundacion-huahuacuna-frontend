/**
 * Página de Gestión de Bitácoras - Panel Administrativo
 * 
 * Permite al administrador:
 * - Ver todos los apadrinamientos activos
 * - Seleccionar un apadrinamiento para gestionar su bitácora
 * - Agregar nuevas entradas a la bitácora
 * - Ver historial de entradas
 * 
 * @author Fundación Huahuacuna
 * @version 1.0
 */

"use client";

import { useEffect, useState } from "react";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Calendar, 
  User, 
  Heart,
  ChevronRight,
  X,
  FileText,
  ArrowLeft,
  Send,
  Loader2
} from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { 
  adminBitacoraService, 
  Sponsorship, 
  LogEntry, 
  CreateLogEntryRequest 
} from "@/services/AdminBitacoraService";
// NOTA: Asegúrate de que el archivo esté en /src/services/AdminBitacoraService.ts

export default function BitacorasPage() {
  // Estados principales
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [selectedSponsorship, setSelectedSponsorship] = useState<Sponsorship | null>(null);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados de formulario
  const [formData, setFormData] = useState<CreateLogEntryRequest>({
    titulo: "",
    contenido: ""
  });
  
  // Estados de mensajes
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cargar apadrinamientos al iniciar
  useEffect(() => {
    loadSponsorships();
  }, []);

  // Auto-ocultar mensajes
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadSponsorships = async () => {
    try {
      setLoading(true);
      const data = await adminBitacoraService.getActiveSponsorships();
      setSponsorships(data);
    } catch (err) {
      console.error("Error cargando apadrinamientos:", err);
      setError("Error al cargar los apadrinamientos");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSponsorship = async (sponsorship: Sponsorship) => {
    setSelectedSponsorship(sponsorship);
    setLoadingEntries(true);
    setShowForm(false);
    
    try {
      const entries = await adminBitacoraService.getLogEntries(sponsorship.id);
      setLogEntries(entries);
    } catch (err) {
      console.error("Error cargando bitácora:", err);
      setError("Error al cargar la bitácora");
      setLogEntries([]);
    } finally {
      setLoadingEntries(false);
    }
  };

  const handleBack = () => {
    setSelectedSponsorship(null);
    setLogEntries([]);
    setShowForm(false);
    setFormData({ titulo: "", contenido: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSponsorship || !formData.titulo.trim() || !formData.contenido.trim()) return;

    setIsSubmitting(true);
    try {
      await adminBitacoraService.addLogEntry(selectedSponsorship.id, formData);
      
      // Recargar entradas
      const entries = await adminBitacoraService.getLogEntries(selectedSponsorship.id);
      setLogEntries(entries);
      
      // Limpiar formulario
      setFormData({ titulo: "", contenido: "" });
      setShowForm(false);
      setSuccess("Entrada agregada exitosamente a la bitácora");
    } catch (err) {
      console.error("Error agregando entrada:", err);
      setError("Error al agregar la entrada");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrar apadrinamientos
  const filteredSponsorships = sponsorships.filter((s) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      s.childName.toLowerCase().includes(searchLower) ||
      s.godparentName.toLowerCase().includes(searchLower)
    );
  });

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 font-['Poppins']">
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Mensajes de éxito/error */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-md animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-semibold text-green-900">{success}</p>
                <button onClick={() => setSuccess(null)} className="ml-auto text-green-600 hover:text-green-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </div>
                <p className="font-semibold text-red-900">{error}</p>
                <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] rounded-2xl p-6 md:p-8 text-white shadow-lg">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  {selectedSponsorship && (
                    <button
                      onClick={handleBack}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                  )}
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {selectedSponsorship 
                        ? `Bitácora de ${selectedSponsorship.childName}`
                        : "Gestión de Bitácoras"
                      }
                    </h1>
                    <p className="text-white/90 mt-1">
                      {selectedSponsorship 
                        ? `Padrino: ${selectedSponsorship.godparentName}`
                        : "Registra el progreso y actividades de los niños apadrinados"
                      }
                    </p>
                  </div>
                </div>
                
                {selectedSponsorship && (
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#FDD835] text-[#1E3A5F] px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#FEC601] transition-all shadow-lg hover:shadow-xl font-bold transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Nueva Entrada</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Contenido */}
          {!selectedSponsorship ? (
            // Vista de lista de apadrinamientos
            <>
              {/* Búsqueda */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-5 h-5 text-[#1E3A5F]" />
                  <h3 className="text-lg font-bold text-[#1E3A5F]">Buscar Apadrinamiento</h3>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre del niño o padrino..."
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] transition-all text-gray-900 placeholder:text-gray-400"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Lista de apadrinamientos */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-md">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#1E3A5F]">Apadrinamientos Activos</h2>
                      <p className="text-sm text-gray-600">
                        {filteredSponsorships.length} {filteredSponsorships.length === 1 ? 'apadrinamiento' : 'apadrinamientos'}
                      </p>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="p-16 text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#1E3A5F] border-t-transparent mb-6"></div>
                    <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">Cargando...</h3>
                  </div>
                ) : filteredSponsorships.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {searchTerm ? 'No se encontraron resultados' : 'No hay apadrinamientos activos'}
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm 
                        ? 'Intenta con otros términos de búsqueda'
                        : 'Los apadrinamientos aparecerán aquí cuando se registren'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredSponsorships.map((sponsorship) => (
                      <div
                        key={sponsorship.id}
                        onClick={() => handleSelectSponsorship(sponsorship)}
                        className="p-6 hover:bg-blue-50/50 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          {/* Foto del niño */}
                          <div className="relative">
                            <img
                              src={sponsorship.childImageUrl || `https://ui-avatars.com/api/?name=${sponsorship.childName}&background=1E3A5F&color=fff`}
                              alt={sponsorship.childName}
                              className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 shadow-sm group-hover:border-[#1E3A5F] transition-all"
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <Heart className="w-3 h-3 text-white" />
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <h3 className="font-bold text-[#1E3A5F] text-lg group-hover:text-[#2c5282] transition-colors">
                              {sponsorship.childName}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {sponsorship.godparentName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(sponsorship.createdAt).toLocaleDateString('es-ES')}
                              </span>
                            </div>
                          </div>

                          {/* Badge de entradas */}
                          {sponsorship.entriesCount !== undefined && (
                            <div className="text-center px-4">
                              <div className="text-2xl font-bold text-[#1E3A5F]">
                                {sponsorship.entriesCount}
                              </div>
                              <div className="text-xs text-gray-500">entradas</div>
                            </div>
                          )}

                          {/* Flecha */}
                          <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-[#1E3A5F] group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            // Vista de detalle de bitácora
            <div className="space-y-6">
              {/* Formulario para nueva entrada */}
              {showForm && (
                <div className="bg-white rounded-2xl shadow-lg border-2 border-[#1E3A5F]/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1E3A5F]/5 to-[#2c5282]/5 p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A5F] to-[#2c5282] rounded-xl flex items-center justify-center">
                          <Plus className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1E3A5F]">Nueva Entrada de Bitácora</h3>
                      </div>
                      <button
                        onClick={() => setShowForm(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Título de la entrada *
                      </label>
                      <input
                        type="text"
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        placeholder="Ej: Progreso académico, Actividad especial, Logro importante..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] transition-all text-gray-900 placeholder:text-gray-400"
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Contenido *
                      </label>
                      <textarea
                        value={formData.contenido}
                        onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                        placeholder="Describe el progreso, actividad o logro del niño..."
                        rows={5}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.titulo.trim() || !formData.contenido.trim()}
                        className="flex-1 bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Guardar Entrada
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setFormData({ titulo: "", contenido: "" });
                        }}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Lista de entradas */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#1E3A5F]">Historial de Entradas</h2>
                      <p className="text-sm text-gray-600">
                        {logEntries.length} {logEntries.length === 1 ? 'entrada registrada' : 'entradas registradas'}
                      </p>
                    </div>
                  </div>
                </div>

                {loadingEntries ? (
                  <div className="p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#1E3A5F] border-t-transparent mb-4"></div>
                    <p className="text-gray-600">Cargando bitácora...</p>
                  </div>
                ) : logEntries.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Sin entradas aún</h3>
                    <p className="text-gray-600 mb-6">
                      Agrega la primera entrada para comenzar el registro de progreso
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] text-white rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      Agregar Primera Entrada
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {logEntries.map((entry, index) => (
                      <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-4">
                          {/* Número de entrada */}
                          <div className="w-10 h-10 bg-[#1E3A5F]/10 rounded-xl flex items-center justify-center text-[#1E3A5F] font-bold flex-shrink-0">
                            {logEntries.length - index}
                          </div>

                          {/* Contenido */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <h4 className="font-bold text-[#1E3A5F] text-lg">{entry.titulo}</h4>
                              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1 flex-shrink-0">
                                <Calendar className="w-4 h-4" />
                                {new Date(entry.fecha).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            
                            <p className="text-gray-700 leading-relaxed mb-3 whitespace-pre-wrap">
                              {entry.contenido}
                            </p>

                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                                entry.registradoPor === "ADMINISTRADOR"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}>
                                <span className={`w-2 h-2 rounded-full ${
                                  entry.registradoPor === "ADMINISTRADOR" ? "bg-blue-500" : "bg-green-500"
                                }`}></span>
                                {entry.registradoPor === "ADMINISTRADOR" ? "Administrador" : "Padrino"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}