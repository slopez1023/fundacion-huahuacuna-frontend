/**
 * Página de Voluntariado
 * Formulario público para que visitantes se postulen como voluntarios
 * 
 * @author Fundación Huahuacuna
 * @version 1.0
 */

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { createVolunteerApplication } from '@/lib/api/applicationApi';
import type { VolunteerApplicationDTO } from '@/types/application';
import Footer from "@/components/ui/Footer";


export default function VoluntariadoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState<VolunteerApplicationDTO>({
    fullName: '',
    email: '',
    phone: '',
    interestArea: '',
    availability: '',
    previousExperience: '',
    acceptsInformation: false
  });

  const opportunities = [
    {
      title: "Tutor Educativo",
      description: "Brinda refuerzo escolar y apoyo académico personalizado a nuestros niños.",
      icon: (
        <svg className="w-10 h-10 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      commitment: "4 horas semanales",
      type: "Presencial",
    },
    {
      title: "Instructor de Arte",
      description: "Dirige talleres creativos y actividades artísticas para desarrollar habilidades expresivas.",
      icon: (
        <svg className="w-10 h-10 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      commitment: "2 horas semanales",
      type: "Presencial",
    },
    {
      title: "Apoyo en Eventos",
      description: "Colabora en la organización y ejecución de eventos especiales y actividades recreativas.",
      icon: (
        <svg className="w-10 h-10 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      commitment: "Según evento",
      type: "Presencial",
    },
    {
      title: "Mentor Digital",
      description: "Enseña habilidades tecnológicas y apoya en proyectos digitales de manera remota.",
      icon: (
        <svg className="w-10 h-10 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      commitment: "3 horas semanales",
      type: "Virtual",
    }
  ];

  /**
   * Maneja cambios en los inputs
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: VolunteerApplicationDTO) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: VolunteerApplicationDTO) => ({ ...prev, [name]: value }));
    }
  };

  /**
   * Función para scroll suave al formulario
   */
  const scrollToForm = () => {
    const formElement = document.getElementById('inscription-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /**
   * Valida el formulario
   */
  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError('El nombre completo es obligatorio');
      return false;
    }

    if (!formData.email.trim()) {
      setError('El correo electrónico es obligatorio');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, ingresa un correo electrónico válido');
      return false;
    }

    if (!formData.phone.trim()) {
      setError('El teléfono es obligatorio');
      return false;
    }

    if (!formData.interestArea.trim()) {
      setError('El área de interés es obligatoria');
      return false;
    }

    return true;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await createVolunteerApplication(formData);

      if (response.success) {
        setSuccess(true);
        // Limpiar formulario
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          interestArea: '',
          availability: '',
          previousExperience: '',
          acceptsInformation: false
        });

        // Mostrar mensaje de éxito por 3 segundos y redirigir
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setError(response.message || 'Error al enviar la solicitud');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] font-['Poppins']">
      <Navbar />
      
      {/* Hero Section Premium */}
      <section className="relative bg-gradient-to-br from-[#1E3A5F] via-[#2C5F7F] to-[#1E3A5F] pt-24 pb-20 overflow-hidden">
        {/* Decoraciones de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"></div>
          <svg className="absolute top-40 left-20 w-24 h-24 text-yellow-400/40" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" />
          </svg>
          <svg className="absolute bottom-40 right-32 w-16 h-16 text-yellow-400/30" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Dona Tu Tiempo
                <span className="block text-[#FDD835] mt-2">¡Hazte Voluntario!</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Un voluntario es toda persona que de manera reflexiva, solidaria y desinteresada, 
                desarrolla una actividad en beneficio de la comunidad. Tu tiempo y talento pueden 
                transformar vidas.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={scrollToForm}
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#FDD835] to-[#FBC02D] text-[#1E3A5F] font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <span className="relative z-10">Postularme Ahora</span>
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                <Link
                  href="#oportunidades"
                  className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-[#1E3A5F] text-[#1E3A5F] font-bold rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  Ver Oportunidades
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/50">
                <Image
                  src="/Voluntariado.jpg"
                  alt="Voluntarios en acción"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Decoración flotante */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#FDD835] to-[#FBC02D] rounded-2xl blur-xl opacity-50"></div>
            </div>
          </div>

          {/* Stats con glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1E3A5F]">50+</p>
                  <p className="text-sm text-gray-600 font-medium">Voluntarios Activos</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1E3A5F]">2,500+</p>
                  <p className="text-sm text-gray-600 font-medium">Horas Donadas</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1E3A5F]">15+</p>
                  <p className="text-sm text-gray-600 font-medium">Proyectos Apoyados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Separador visual */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16"></div>

        {/* Opportunities Section */}
        <section id="oportunidades" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E3A5F] mb-4">
              Oportunidades de Voluntariado
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Encuentra el área donde tu talento y pasión puedan generar el mayor impacto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {opportunities.map((opportunity, index) => {
              const gradients = [
                'from-yellow-400 to-orange-500',
                'from-red-400 to-rose-500',
                'from-blue-400 to-cyan-500',
                'from-green-400 to-emerald-500'
              ];
              const gradient = gradients[index % 4];
              
              return (
                <div 
                  key={index} 
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105"
                >
                  {/* Borde de gradiente */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  
                  <div className="relative p-8">
                    <div className="flex items-start gap-5">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                        {opportunity.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#1E3A5F] mb-3 group-hover:text-[#2C5F7F] transition-colors">
                          {opportunity.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                          {opportunity.description}
                        </p>
                        <div className="flex items-center gap-3 text-sm flex-wrap">
                          <span className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${gradient} text-white font-semibold shadow-sm`}>
                            {opportunity.commitment}
                          </span>
                          <span className="px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm text-[#1E3A5F] font-medium border border-gray-200 shadow-sm">
                            {opportunity.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Separador visual */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16"></div>

        {/* ¿Por Qué Ser Voluntario? Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E3A5F] mb-4">
              ¿Por Qué Ser Voluntario?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Descubre las razones que hacen del voluntariado una experiencia transformadora
            </p>
          </div>

          {/* Primera fila: 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Razón 1 */}
            <div className="group bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-yellow-100">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">Pon en Práctica tus Habilidades</h3>
              <p className="text-gray-700 leading-relaxed">
                Gracias al voluntariado pones en práctica lo que sabes y eres, y de paso ayudas a alguien que te necesita.
              </p>
            </div>

            {/* Razón 2 */}
            <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">Impacto Social Real</h3>
              <p className="text-gray-700 leading-relaxed">
                Ayudas a una población que ha sido descuidada y con esto das tu grano de arena para mejorar su desarrollo integral.
              </p>
            </div>

            {/* Razón 3 */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">Comunidad de Propósito</h3>
              <p className="text-gray-700 leading-relaxed">
                Compartes con otras personas con iguales anhelos altruistas y ayudas de manera organizada y desinteresada.
              </p>
            </div>
          </div>

          {/* Segunda fila: 2 cards centradas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Razón 4 */}
            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">Favorece tu Hoja de Vida</h3>
              <p className="text-gray-700 leading-relaxed">
                La experiencia de voluntariado enriquece tu perfil profesional y demuestra tu compromiso con la sociedad.
              </p>
            </div>

            {/* Razón 5 */}
            <div className="group bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-red-100">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">Desarrollo Personal</h3>
              <p className="text-gray-700 leading-relaxed">
                Aprende nuevas habilidades, adquiere experiencia valiosa y da significado a tu vida mientras retribuyes a la sociedad.
              </p>
            </div>
          </div>
        </section>

        {/* Separador visual */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16"></div>

        {/* Registration Form */}
        <section id="inscription-form" className="mb-16 scroll-mt-24">
          <div className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-2xl shadow-xl border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-3">
                Formulario de Inscripción
              </h2>
              <p className="text-lg text-gray-600">
                Completa el formulario y nos pondremos en contacto contigo pronto
              </p>
            </div>

            {/* Mensajes de error o éxito */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-green-800 text-sm font-medium">
                      ¡Solicitud enviada exitosamente!
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      Hemos recibido tu solicitud. Te contactaremos pronto.
                      Serás redirigido en unos segundos...
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Nombres y Apellidos */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombres y Apellidos *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="Ingresa tu nombre completo"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Correo Electrónico */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="tu@email.com"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="+57 300 123 4567"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Área de Interés */}
                <div>
                  <label htmlFor="interestArea" className="block text-sm font-medium text-gray-700 mb-1">
                    Área de Interés *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <select
                      id="interestArea"
                      name="interestArea"
                      value={formData.interestArea}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 appearance-none bg-white"
                      disabled={isLoading}
                      required
                    >
                      <option value="">Selecciona un área</option>
                      <option value="Apoyo Educativo">Apoyo Educativo</option>
                      <option value="Arte y Cultura">Arte y Cultura</option>
                      <option value="Eventos">Eventos</option>
                      <option value="Apoyo Digital">Apoyo Digital</option>
                      <option value="Salud">Salud</option>
                      <option value="Nutrición">Nutrición</option>
                      <option value="Recreación">Recreación</option>
                      <option value="Logística">Logística</option>
                      <option value="Comunicación">Comunicación</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Otro">Otro</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Disponibilidad Horaria */}
                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                    Disponibilidad Horaria
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <textarea
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      rows={3}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="Describe tu disponibilidad de horarios..."
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Experiencia Previa */}
                <div>
                  <label htmlFor="previousExperience" className="block text-sm font-medium text-gray-700 mb-1">
                    Experiencia Previa
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <textarea
                      id="previousExperience"
                      name="previousExperience"
                      value={formData.previousExperience}
                      onChange={handleChange}
                      rows={3}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="Cuéntanos sobre tu experiencia en voluntariado o áreas relacionadas..."
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Checkbox */}
                <div>
                  <label className="flex items-start gap-3">
                    <input 
                      type="checkbox"
                      id="acceptsInformation"
                      name="acceptsInformation"
                      checked={formData.acceptsInformation}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-[#FDD835] focus:ring-[#FDD835] border-gray-300 rounded"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-gray-600 leading-relaxed">
                      Acepto recibir información sobre oportunidades de voluntariado y actividades 
                      de la fundación
                    </span>
                  </label>
                </div>

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={isLoading || success}
                  className="group relative w-full px-8 py-4 bg-gradient-to-r from-[#FDD835] to-[#FBC02D] text-[#1E3A5F] font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Postulación
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>

                <p className="text-sm text-gray-500 text-center">
                  * Campos obligatorios
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* Separador visual */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16"></div>

        {/* Additional Information - Mejorado con glassmorphism */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="group bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl border border-yellow-200 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">
              ¿Tienes dudas?
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Contáctanos para resolver todas tus preguntas sobre el programa de voluntariado y cómo puedes ser parte del cambio.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FDD835] to-[#FBC02D] text-[#1E3A5F] rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contactar
            </Link>
          </div>

          <div className="group bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1E3A5F] mb-4">
              Proceso de Selección
            </h3>
            <ul className="space-y-3">
              {[
                "Envío de postulación",
                "Revisión de perfil",
                "Entrevista virtual",
                "Inducción y capacitación",
                "Inicio de actividades"
              ].map((step, index) => (
                <li key={index} className="flex items-start gap-4 text-gray-700">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 text-white font-bold flex items-center justify-center shadow-md">
                    {index + 1}
                  </div>
                  <span className="pt-1 font-medium">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Separador visual */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16"></div>

        {/* Tu Compromiso como Voluntario */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E3A5F] mb-4">
              Tu Compromiso como Voluntario
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Al aceptar ser voluntario de la Fundación Huahuacuna, asumes el compromiso de participar activamente en el trabajo de la misma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">Colaboración Regular</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Tienes la responsabilidad básica de colaborar en forma regular con el equipo de trabajo existente, contribuyendo eficazmente a los objetivos de la Fundación.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">Compromiso Activo</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Tu participación es reflexiva, solidaria y desinteresada, desarrollando actividades en beneficio de la comunidad dentro del marco de nuestra organización.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
      {/* Footer Profesional */}
                  <Footer />
    </main>
  );
}