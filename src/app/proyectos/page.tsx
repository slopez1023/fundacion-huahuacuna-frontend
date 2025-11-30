"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Footer from "@/components/ui/Footer";
import { projectService, Project } from "@/services/ProjectService";
import { eventService, Event } from "@/services/EventService";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allProjects, allEvents] = await Promise.all([
          projectService.getAll(),
          eventService.getAll()
        ]);
        
        // Filtrar solo proyectos y eventos publicados
        const publishedProjects = allProjects.filter(p => p.published === true);
        const publishedEvents = allEvents.filter(e => e.published === true);
        
        setProjects(publishedProjects);
        setEvents(publishedEvents);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setProjects([]);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const activities = [
    {
      title: "Refuerzo Escolar",
      description: "Apoyo académico personalizado para mejorar el rendimiento escolar en matemáticas, español y ciencias.",
      image: "/activities/tutoring.jpg"
    },
    {
      title: "Actividades Recreativas",
      description: "Esparcimiento y desarrollo de habilidades sociales a través del juego y el uso positivo del tiempo libre.",
      image: "/activities/Actividad.jpg"
    },
    {
      title: "Talleres Creativos",
      description: "Desarrollo de habilidades artísticas, expresión personal y manejo de emociones.",
      image: "/activities/TallerCreativo.jpg"
    }
  ];

  const stats = [
    { value: 21, label: "Años de Experiencia" },
    { value: 542, label: "Niños Apadrinados" },
    { value: 8, label: "Municipios Impactados" }
  ];

  return (
    <main className="min-h-screen font-['Poppins']">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1E3A5F] via-[#2C5F7F] to-[#1E3A5F] overflow-hidden pt-8">
        {/* Decoraciones de fondo */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FDD835]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FDD835]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
          {/* Breadcrumb integrado en el hero */}
          <div className="mb-12">
            <Breadcrumb items={[{ label: "Proyectos" }]} />
          </div>
          
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
              <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white font-semibold">Nuestro Impacto</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Transformando Vidas a Través de <span className="text-[#FDD835]">Proyectos Comunitarios</span>
            </h1>
            <p className="text-white/90 text-lg max-w-3xl mx-auto leading-relaxed">
              Para seguir expandiendo nuestro impacto y alcanzar a más niños, la Fundación Huahuacuna desarrolla proyectos educativos y formativos que les permiten descubrir sus talentos, aprender nuevas habilidades y construir un futuro mejor.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FDD835]/10 rounded-full transform translate-x-8 -translate-y-8 blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="text-5xl font-bold text-[#FDD835] mb-3">{stat.value}+</div>
                  <div className="text-white/80 text-sm font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestros Proyectos */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FDD835]/10 px-4 py-2 rounded-full border border-[#FDD835]/20 mb-4">
            <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
            <span className="text-[#1E3A5F] font-semibold">Nuestros Programas</span>
          </div>
          <h2 className="text-4xl font-bold text-[#1E3A5F] mb-4">Proyectos y Actividades Representativos</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Conoce los programas que hacemos posibles para nuestros niños, niñas y adolescentes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto lg:max-w-none lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#1E3A5F] border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Cargando proyectos...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No hay proyectos publicados en este momento.</p>
            </div>
          ) : (
            projects.slice(0, 3).map((project, index) => (
              <div 
                key={project.id} 
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#FDD835]/30"
              >
                {/* Número de proyecto */}
                <div className="absolute top-4 left-4 z-10 w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg border border-gray-100">
                  <span className="text-2xl font-bold text-[#1E3A5F]">{index + 1}</span>
                </div>

                {/* Header con gradiente e imagen */}
                <div className="relative h-32 bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] flex items-center justify-center overflow-hidden">
                  {project.imageUrl && (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title}
                      className="w-full h-full object-cover opacity-50"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F]/80 to-[#2C5F7F]/80"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1E3A5F] mb-3 group-hover:text-[#2C5F7F] transition-colors">{project.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
                </div>

                {/* Decoración inferior */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FDD835] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            ))
          )}
        </div>

        {/* Segunda fila con 2 proyectos centrados */}
        {projects.length > 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-8">
            {projects.slice(3, 5).map((project, index) => (
              <div 
                key={project.id} 
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#FDD835]/30"
              >
                {/* Número de proyecto */}
                <div className="absolute top-4 left-4 z-10 w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg border border-gray-100">
                  <span className="text-2xl font-bold text-[#1E3A5F]">{index + 4}</span>
                </div>

                {/* Header con gradiente e imagen */}
                <div className="relative h-32 bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] flex items-center justify-center overflow-hidden">
                  {project.imageUrl && (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title}
                      className="w-full h-full object-cover opacity-50"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F]/80 to-[#2C5F7F]/80"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1E3A5F] mb-3 group-hover:text-[#2C5F7F] transition-colors">{project.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
                </div>

                {/* Decoración inferior */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FDD835] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Separador Visual */}
      <div className="mb-0">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      {/* Eventos Publicados */}
      {events.length > 0 && (
        <section className="py-20 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full border border-green-300 mb-4">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
              </svg>
              <span className="text-green-700 font-semibold">Próximos Eventos</span>
            </div>
            <h2 className="text-4xl font-bold text-[#1E3A5F] mb-4">
              Eventos y Actividades
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Acompáñanos en nuestras actividades especiales y eventos comunitarios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-300/50"
              >
                {/* Imagen del evento */}
                {event.imageUrl && (
                  <div className="relative h-40 bg-gradient-to-br from-green-500 to-green-600 overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                )}

                <div className="p-6">
                  {/* Fecha */}
                  <div className="flex items-center gap-2 mb-3 text-green-600 font-semibold">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">
                      {new Date(event.date).toLocaleDateString("es-ES", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#1E3A5F] mb-2 group-hover:text-green-600 transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {event.description}
                  </p>

                  {/* Ubicación */}
                  <div className="flex items-start gap-2 text-gray-700 text-sm">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>

                {/* Decoración inferior */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Separador Visual */}
      <div className="mb-0">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      {/* Programas Complementarios */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#FDD835]/10 px-4 py-2 rounded-full border border-[#FDD835]/20 mb-4">
              <svg className="w-5 h-5 text-[#FDD835]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <span className="text-[#1E3A5F] font-semibold">Más Allá del Apadrinamiento</span>
            </div>
            <h2 className="text-4xl font-bold text-[#1E3A5F] mb-4">
              Programas Complementarios: Impacto Más Allá del Apadrinamiento
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Además del apadrinamiento integral, la Fundación Huahuacuna desarrolla iniciativas clave para abordar necesidades específicas y promover el desarrollo sostenible de las comunidades.
            </p>
          </div>

          <div className="space-y-8">
            {/* Ayudas Ocasionales */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#FDD835]/30">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FDD835] to-[#FBC02D] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-[#1E3A5F]">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#1E3A5F] mb-3">Ayudas Ocasionales</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Asistencia para necesidades específicas de niños no apadrinados (matrícula, uniforme, medicamentos, calzado), según la disponibilidad de recursos de libre destinación.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#FDD835]/10 text-[#1E3A5F] rounded-full text-sm font-medium">Matrícula</span>
                    <span className="px-3 py-1 bg-[#FDD835]/10 text-[#1E3A5F] rounded-full text-sm font-medium">Uniformes</span>
                    <span className="px-3 py-1 bg-[#FDD835]/10 text-[#1E3A5F] rounded-full text-sm font-medium">Medicamentos</span>
                    <span className="px-3 py-1 bg-[#FDD835]/10 text-[#1E3A5F] rounded-full text-sm font-medium">Calzado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mañana sin Hambre */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#FDD835]/30">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-[#FDD835]">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#1E3A5F] mb-3">Mañana sin Hambre</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Este programa proporcionó desayunos balanceados a 40 niños del sector Córdoba durante los días de clase, desde febrero de 2008 hasta junio de 2009, contribuyendo a su nutrición y rendimiento escolar.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-gray-700">40 niños beneficiados</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-gray-700">2008-2009</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-gray-700">Sector Córdoba</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Escuela de Música y de Inglés (detallada) */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#FDD835]/30">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FDD835] to-[#FBC02D] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-[#1E3A5F]">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#1E3A5F] mb-3">Escuela de Música y de Inglés</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Desarrollamos talentos en música (flauta, teclado, guitarra, canto) e inglés, fomentando habilidades artísticas y lingüísticas esenciales para el futuro.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <svg className="w-6 h-6 text-[#1E3A5F] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-[#1E3A5F] mb-1">Música</h4>
                        <p className="text-sm text-gray-600">Flauta, teclado, guitarra y canto</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <svg className="w-6 h-6 text-[#1E3A5F] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-[#1E3A5F] mb-1">Inglés</h4>
                        <p className="text-sm text-gray-600">Habilidades lingüísticas para el futuro</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Talleres de Desarrollo Integral */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#FDD835]/30">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-[#FDD835]">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#1E3A5F] mb-3">Talleres de Desarrollo Integral</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Ofrecemos talleres de lectura, manejo de emociones, refuerzo escolar, modistería, emprendimiento y moda circular, enriqueciendo conocimientos y habilidades para niños y acudientes.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Lectura</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Emociones</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Refuerzo</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Modistería</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Emprendimiento</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Moda Circular</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ropero y Moda Circular */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#FDD835]/30">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FDD835] to-[#FBC02D] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-[#1E3A5F]">5</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#1E3A5F] mb-3">Ropero y Moda Circular</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Impulsamos la donación y reutilización de bienes (muebles, electrodomésticos, ropa), beneficiando a familias de bajos recursos y promoviendo la sostenibilidad ambiental.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-sm font-semibold text-green-700">Reutilización</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-blue-700">Sostenibilidad</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-semibold text-purple-700">Apoyo Social</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Separador Visual */}
      <div className="mb-0">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      {/* Impacto de Nuestros Proyectos */}
      <section className="relative py-20 bg-gradient-to-br from-[#1E3A5F] via-[#2C5F7F] to-[#1E3A5F] text-white overflow-hidden">
        {/* Decoraciones de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FDD835]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FDD835]/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
              <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="text-white font-semibold">Nuestro Impacto</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">El Impacto de Nuestros Proyectos</h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Cada proyecto está diseñado con un propósito claro: transformar vidas a través de la educación, el arte y el desarrollo personal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDD835]/10 rounded-full transform translate-x-16 -translate-y-16 blur-2xl"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FDD835] to-[#FBC02D] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Educación Integral</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Fortalecemos las habilidades académicas y cognitivas de cada niño
                </p>
              </div>
            </div>

            <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDD835]/10 rounded-full transform translate-x-16 -translate-y-16 blur-2xl"></div>
              <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FDD835] to-[#FBC02D] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Desarrollo de Talentos</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Descubrimos y potenciamos las habilidades artísticas y creativas
                  </p>
                </div>
              </div>

            <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDD835]/10 rounded-full transform translate-x-16 -translate-y-16 blur-2xl"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FDD835] to-[#FBC02D] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Bienestar Emocional</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Promovemos la salud mental y el manejo adecuado de las emociones
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Separador Visual */}
      <div className="mb-0">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      {/* Actividades */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#FDD835]/10 px-4 py-2 rounded-full border border-[#FDD835]/20 mb-4">
              <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-[#1E3A5F] font-semibold">Compromiso Diario</span>
            </div>
            <h2 className="text-4xl font-bold text-[#1E3A5F] mb-4">Actividades Diarias</h2>
            <p className="text-gray-600 text-lg">Nuestro compromiso constante con el desarrollo integral</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activities.map((activity, index) => (
              <div key={index} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#FDD835]/30">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="inline-flex items-center gap-2 bg-[#FDD835]/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <svg className="w-4 h-4 text-[#1E3A5F]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-bold text-[#1E3A5F]">Diario</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-[#1E3A5F] mb-3 text-xl group-hover:text-[#2C5F7F] transition-colors">{activity.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{activity.description}</p>
                </div>
                {/* Decoración inferior */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FDD835] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Separador Visual */}
      <div className="mb-0">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      {/* Sección ¿Cómo Participar? */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#FDD835]/10 px-4 py-2 rounded-full border border-[#FDD835]/20 mb-4">
              <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span className="text-[#1E3A5F] font-semibold">Únete a Nosotros</span>
            </div>
            <h2 className="text-4xl font-bold text-[#1E3A5F] mb-4">¿Cómo Puedes Participar?</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Hay múltiples formas de involucrarte y contribuir al bienestar de los niños y niñas de nuestra fundación
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Apadrinar */}
            <div className="group relative bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] rounded-2xl p-8 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDD835]/10 rounded-full transform translate-x-16 -translate-y-16 blur-2xl"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[#FDD835]/20 backdrop-blur-sm flex items-center justify-center mb-6 border border-[#FDD835]/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Apadrinar un Niño</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  Conviértete en padrino o madrina y transforma la vida de un niño mediante un compromiso anual integral.
                </p>
                <Link
                  href="/apadrinar"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FDD835] text-[#1E3A5F] rounded-xl font-bold hover:bg-[#FBC02D] hover:scale-105 transition-all shadow-lg"
                >
                  Comenzar
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Voluntariado */}
            <div className="group relative bg-gradient-to-br from-[#FDD835] to-[#FBC02D] rounded-2xl p-8 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full transform translate-x-16 -translate-y-16 blur-2xl"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/40 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#1E3A5F] mb-3">Ser Voluntario</h3>
                <p className="text-[#1E3A5F]/80 text-sm mb-6 leading-relaxed">
                  Dona tu tiempo y talento para impactar directamente en las actividades y proyectos de la fundación.
                </p>
                <Link
                  href="/voluntariado"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E3A5F] text-white rounded-xl font-bold hover:bg-[#152a45] hover:scale-105 transition-all shadow-lg"
                >
                  Unirme
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Donaciones */}
            <div className="group relative bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] rounded-2xl p-8 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDD835]/10 rounded-full transform translate-x-16 -translate-y-16 blur-2xl"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[#FDD835]/20 backdrop-blur-sm flex items-center justify-center mb-6 border border-[#FDD835]/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-[#FDD835]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Hacer una Donación</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  Realiza aportes puntuales para necesidades específicas o ayuda a sostener nuestros programas.
                </p>
                <Link
                  href="/donaciones"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FDD835] text-[#1E3A5F] rounded-xl font-bold hover:bg-[#FBC02D] hover:scale-105 transition-all shadow-lg"
                >
                  Donar
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Premium Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#1E3A5F] via-[#2C5F7F] to-[#1E3A5F] overflow-hidden">
        {/* Decoraciones */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FDD835]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FDD835]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
            <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-white font-semibold">Haz la Diferencia</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            ¿Listo para <span className="text-[#FDD835]">Transformar Vidas?</span>
          </h2>
          <p className="text-white/90 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
            Únete a nosotros en nuestra misión de transformar vidas. Tu apoyo hace la diferencia en la educación, el desarrollo artístico y el bienestar emocional de nuestros niños y niñas.
          </p>

          {/* Botones principales */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/apadrinar"
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#FDD835] text-[#1E3A5F] rounded-full font-bold text-lg hover:bg-[#FBC02D] transition-all hover:scale-105 shadow-2xl hover:shadow-[#FDD835]/50"
            >
              Apadrinar un Niño
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all hover:scale-105"
            >
              Contáctanos
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>21+ años de experiencia</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>542 niños beneficiados</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>Transparencia total</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}