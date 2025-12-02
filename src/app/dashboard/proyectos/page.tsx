"use client";

import { useEffect, useState } from "react";
import { projectService, Project } from "@/services/ProjectService";
import { Trash2, Plus, Target, DollarSign, Search, Edit, FolderOpen, Share2 } from "lucide-react";
import ProjectModal from "@/components/admin/ProjectModal";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import PublishConfirmDialog from "@/components/admin/PublishConfirmDialog";

export default function ProyectosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; projectId: number | null }>({ isOpen: false, projectId: null });
  const [publishDialog, setPublishDialog] = useState<{ isOpen: boolean; projectId: number | null; projectTitle: string }>({ isOpen: false, projectId: null, projectTitle: "" });

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const filteredProjects = projects.filter(proj =>
    proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proj.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setConfirmDialog({ isOpen: true, projectId: id });
  };

  const confirmDelete = async () => {
    if (confirmDialog.projectId) {
      try {
        await projectService.delete(confirmDialog.projectId);
        await loadProjects();
        setConfirmDialog({ isOpen: false, projectId: null });
      } catch (error) {
        console.error("Error al eliminar proyecto:", error);
      }
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handlePublish = (project: Project) => {
    setPublishDialog({
      isOpen: true,
      projectId: project.id || null,
      projectTitle: project.title
    });
  };

  const confirmPublish = async () => {
    if (publishDialog.projectId) {
      try {
        await projectService.publish(publishDialog.projectId);
        await loadProjects();
        setPublishDialog({ isOpen: false, projectId: null, projectTitle: "" });
      } catch (error) {
        console.error("Error al publicar proyecto:", error);
      }
    }
  };

  // Calcula el porcentaje de progreso
  const getProgress = (current: number, goal: number) => {
    if (goal === 0) return 0;
    return Math.min(100, Math.round((current / goal) * 100));
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 font-['Poppins']">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header con gradiente completo */}
          <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2c5282] rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FolderOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Gestión de Proyectos
                  </h1>
                  <p className="text-white/90 mt-1">
                    Administra y da seguimiento a los proyectos de la fundación
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setIsModalOpen(true);
                }}
                className="bg-[#FDD835] text-[#1E3A5F] px-5 py-2.5 rounded-xl font-semibold hover:bg-[#fce34f] transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Nuevo Proyecto</span>
              </button>
            </div>
          </div>

          {/* Sección de búsqueda */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-[#1E3A5F]" />
              <h3 className="text-lg font-bold text-[#1E3A5F]">Búsqueda</h3>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Proyectos Registrados */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Proyectos Registrados</h3>
                <p className="text-sm text-gray-600">
                  {filteredProjects.length} {filteredProjects.length === 1 ? 'proyecto encontrado' : 'proyectos encontrados'}
                </p>
              </div>
            </div>
          </div>

          {/* Tabla mejorada */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-700">Imagen</th>
              <th className="p-4 text-sm font-semibold text-gray-700">Proyecto</th>
              <th className="p-4 text-sm font-semibold text-gray-700">Meta</th>
              <th className="p-4 text-sm font-semibold text-gray-700">Progreso</th>
              <th className="p-4 text-sm font-semibold text-gray-700 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Cargando proyectos...</td></tr>
            ) : filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <FolderOpen className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No hay proyectos</p>
                    <p className="text-sm">Crea tu primer proyecto para comenzar</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProjects.map((proj) => (
                <tr key={proj.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-200 group">
                  <td className="p-4">
                    <img
                      src={proj.imageUrl || "https://via.placeholder.com/100"}
                      alt={proj.title}
                      className="w-20 h-14 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-gray-900">{proj.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{proj.description}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="p-1.5 rounded-lg bg-green-100">
                        <Target className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-semibold">${proj.goalAmount.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="w-full max-w-[180px]">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-600 font-medium">${proj.currentAmount.toLocaleString()}</span>
                        <span className="font-bold text-[#1E3A5F]">{getProgress(proj.currentAmount, proj.goalAmount)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8f] h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${getProgress(proj.currentAmount, proj.goalAmount)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(proj)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-110"
                        title="Editar proyecto"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {!proj.published && (
                        <button
                          onClick={() => handlePublish(proj)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all hover:scale-110"
                          title="Publicar proyecto"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => proj.id && handleDelete(proj.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                        title="Eliminar proyecto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

          {/* ConfirmDialog para Eliminar */}
          <ConfirmDialog
            isOpen={confirmDialog.isOpen}
            onClose={() => setConfirmDialog({ isOpen: false, projectId: null })}
            onConfirm={confirmDelete}
            title="Eliminar Proyecto"
            message="¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer."
            confirmText="Eliminar"
            cancelText="Cancelar"
            type="danger"
          />

          {/* PublishConfirmDialog para Publicar */}
          <PublishConfirmDialog
            isOpen={publishDialog.isOpen}
            onClose={() => setPublishDialog({ isOpen: false, projectId: null, projectTitle: "" })}
            onConfirm={confirmPublish}
            title={publishDialog.projectTitle}
            itemType="proyecto"
          />

          <ProjectModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedProject(null);
            }}
            onSaved={loadProjects}
            project={selectedProject}
          />
        </div>
      </main>
    </ProtectedRoute>
  );
}