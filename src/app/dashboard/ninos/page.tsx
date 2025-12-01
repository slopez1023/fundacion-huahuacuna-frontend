"use client";

import { useEffect, useState } from "react";
import { childService, Child } from "@/services/ChildService";
import { Trash2, Plus, Edit, Users, Search, Filter, Heart, Ban } from "lucide-react";
import ChildModal from "@/components/admin/ChildModal";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import InactivateDialog from "@/components/admin/InactivateDialog";

export default function NinosPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [childToEdit, setChildToEdit] = useState<Child | null>(null);
  const [inactivateDialog, setInactivateDialog] = useState<{ 
    isOpen: boolean; 
    child: Child | null 
  }>({ isOpen: false, child: null });

  // Cargar niños al entrar
  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const data = await childService.getAll();
      setChildren(data);
    } catch (error) {
      console.error("Error cargando niños:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (child: Child) => {
    setChildToEdit(child);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setChildToEdit(null);
  };

  const handleInactivate = (child: Child) => {
    setInactivateDialog({ isOpen: true, child });
  };

  const confirmInactivate = async (reason: string) => {
    if (inactivateDialog.child?.id) {
      try {
        await childService.inactivate(inactivateDialog.child.id, reason);
        await loadChildren();
        setInactivateDialog({ isOpen: false, child: null });
      } catch (error) {
        console.error("Error al inhabilitar niño:", error);
        throw error;
      }
    }
  };

  // Filtrar niños
  const filteredChildren = children.filter((child) => {
    const matchesSearch = searchTerm === "" ||
      `${child.firstName} ${child.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || child.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 font-['Poppins']">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            {/* Título con gradiente */}
            <div className="mt-6 bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] rounded-2xl p-6 md:p-8 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      Gestión de Niños
                    </h1>
                    <p className="text-white/90 mt-1">
                      Administra los niños disponibles para apadrinamiento
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setChildToEdit(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-[#FDD835] text-[#1E3A5F] px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#FEC601] transition-all shadow-lg hover:shadow-xl font-bold transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nuevo Niño</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filtros y búsqueda */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-[#1E3A5F]" />
              <h3 className="text-lg font-bold text-[#1E3A5F]">Filtros y Búsqueda</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-1">
                  <Search className="w-3 h-3" />
                  Buscar
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre..."
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] transition-all text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Filtro por estado */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Estado
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDD835] focus:border-[#FDD835] transition-all text-gray-900 font-medium hover:border-gray-300 cursor-pointer"
                >
                  <option value="ALL">Todos</option>
                  <option value="AVAILABLE">Disponibles</option>
                  <option value="SPONSORED">Apadrinados</option>
                  <option value="INACTIVE">Inactivos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1E3A5F]">Niños Registrados</h2>
                  <p className="text-sm text-gray-600">
                    {filteredChildren.length} {filteredChildren.length === 1 ? 'niño encontrado' : 'niños encontrados'}
                  </p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="p-16 text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#1E3A5F] border-t-transparent mb-6"></div>
                <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">Cargando niños...</h3>
                <p className="text-gray-600">Por favor espera un momento</p>
              </div>
            ) : filteredChildren.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {searchTerm || filterStatus !== "ALL" ? 'No se encontraron resultados' : 'No hay niños registrados'}
                </h3>
                <p className="text-gray-600 text-lg mb-6">
                  {searchTerm || filterStatus !== "ALL" 
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Comienza agregando el primer niño al sistema'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Foto</th>
                      <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Nombre</th>
                      <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Edad</th>
                      <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Estado</th>
                      <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredChildren.map((child) => (
                      <tr key={child.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="p-4">
                          <div className="relative">
                            <img 
                              src={child.imageUrl || "https://ui-avatars.com/api/?name=" + child.firstName} 
                              alt={child.firstName} 
                              className="w-14 h-14 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + child.firstName;
                              }}
                            />
                            {child.status === 'AVAILABLE' && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-gray-900">{child.firstName} {child.lastName}</p>
                          <p className="text-sm text-gray-500">ID: {child.id}</p>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-900">{child.age}</span>
                          <span className="text-gray-600 text-sm ml-1">años</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                            child.status === 'AVAILABLE' ? 'bg-green-100 text-green-700 border border-green-200' :
                            child.status === 'SPONSORED' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}>
                            {child.status === 'AVAILABLE' && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                            {child.status === 'AVAILABLE' ? 'Disponible' : 
                             child.status === 'SPONSORED' ? 'Apadrinado' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEdit(child)}
                              className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all hover:scale-110 border border-blue-200"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {child.status !== 'INACTIVE' && (
                              <button 
                                onClick={() => handleInactivate(child)}
                                className="p-2.5 text-orange-600 hover:bg-orange-100 rounded-xl transition-all hover:scale-110 border border-orange-200"
                                title="Inhabilitar"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            )}
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

        {/* Dialog para Inhabilitar */}
        <InactivateDialog
          isOpen={inactivateDialog.isOpen}
          child={inactivateDialog.child}
          onClose={() => setInactivateDialog({ isOpen: false, child: null })}
          onConfirm={confirmInactivate}
        />

        {/* Modal */}
        <ChildModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          onSaved={loadChildren}
          childToEdit={childToEdit}
        />
      </main>
    </ProtectedRoute>
  );
}