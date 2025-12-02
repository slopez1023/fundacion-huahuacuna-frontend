/**
 * Página de Apadrinamiento
 * - Para visitantes: Información completa del programa + enlace a postulación
 * - Para padrinos: Vista de niños disponibles o su apadrinamiento actual
 * - Para admin: Redirecciona al panel de gestión de niños
 * 
 * @author Fundación Huahuacuna
 * @version 4.1 - Con carruseles y formulario integrado
 */

"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ApprovedGodparentView from '@/components/apadrinamiento/ApprovedGodparentView';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { createSponsorApplication } from '@/lib/api/applicationApi';
import type { SponsorApplicationDTO } from '@/types/application';

export default function ApadrinarPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<'public' | 'godparent' | 'admin'>('public');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user && token) {
        const role = user.role?.toUpperCase();
        
        if (role === 'ADMIN') {
          setUserType('admin');
          router.push('/dashboard/ninos');
          return;
        } else if (role === 'PADRINO') {
          setUserType('godparent');
        } else {
          setUserType('public');
        }
      } else {
        setUserType('public');
      }
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [user, token, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#1E3A5F] border-t-transparent mb-6"></div>
          <p className="text-gray-600 text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  if (userType === 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#1E3A5F] border-t-transparent mb-6"></div>
          <p className="text-gray-600 text-lg">Redirigiendo al panel de administración...</p>
        </div>
      </div>
    );
  }

  if (userType === 'godparent') {
    return <ApprovedGodparentView />;
  }

  return <PublicApadrinamientoView />;
}

// ============================================================================
// COMPONENTE DE CARRUSEL REUTILIZABLE
// ============================================================================

interface CarouselProps {
  children: React.ReactNode[];
  itemsPerView?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

function Carousel({ 
  children, 
  itemsPerView = 3, 
  autoPlay = true, 
  autoPlayInterval = 5000 
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const totalItems = children.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, maxIndex, isHovered]);

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(Math.max(0, index), maxIndex));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Botón Anterior */}
      <button
        onClick={goToPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#1E3A5F] hover:bg-[#FDD835] hover:text-[#1E3A5F] transition-all duration-300 hover:scale-110"
        aria-label="Anterior"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Contenedor del carrusel */}
      <div className="overflow-hidden mx-8">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {children.map((child, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 px-3"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Botón Siguiente */}
      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#1E3A5F] hover:bg-[#FDD835] hover:text-[#1E3A5F] transition-all duration-300 hover:scale-110"
        aria-label="Siguiente"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicadores */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-[#FDD835] w-8' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTE DE VISTA PÚBLICA
// ============================================================================

function PublicApadrinamientoView() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  
  // Estados del formulario
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<SponsorApplicationDTO>({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    idNumber: '',
    idDocumentPath: ''
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToPrograms = () => {
    const element = document.getElementById('programas');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Maneja cambios en los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: SponsorApplicationDTO) => ({ ...prev, [name]: value }));
  };

  // Valida el formulario
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

    if (!formData.country.trim()) {
      setError('El país de residencia es obligatorio');
      return false;
    }

    if (!formData.idNumber.trim()) {
      setError('El número de cédula/documento es obligatorio');
      return false;
    }

    return true;
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoadingForm(true);

    try {
      const response = await createSponsorApplication(formData);

      if (response.success) {
        setSuccess(true);
        // Limpiar formulario
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          country: '',
          idNumber: '',
          idDocumentPath: ''
        });

        // Mostrar mensaje de éxito por 4 segundos y redirigir
        setTimeout(() => {
          router.push('/');
        }, 4000);
      } else {
        setError(response.message || 'Error al enviar la solicitud');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setIsLoadingForm(false);
    }
  };

  // Beneficios del apadrinamiento integral
  const beneficios = [
    {
      title: "Educación",
      description: "Matrícula, uniforme, calzado escolar, útiles escolares, fotocopias, transporte y comedor escolar.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "Salud",
      description: "Control odontológico semestral, control médico anual, tratamientos con especialistas y medicamentos.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: "from-red-400 to-rose-500",
    },
    {
      title: "Alimentación",
      description: "Complementos alimenticios para niños bajos de peso según prescripción médica.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "from-orange-400 to-orange-500",
    },
    {
      title: "Vestido y Calzado",
      description: "Para final de año cada niño recibe un conjunto completo de ropa y calzado.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: "from-purple-400 to-purple-600",
    },
    {
      title: "Implementos de Aseo",
      description: "Campaña semestral con jabón, crema dental, cepillo dental, champú, toalla y más.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: "from-cyan-400 to-cyan-600",
    },
    {
      title: "Esparcimiento",
      description: "Actividades de integración y celebración de fechas especiales para los niños.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-yellow-400 to-yellow-500",
    },
    {
      title: "Educación No Formal",
      description: "Talleres con profesionales para niños y acudientes en diferentes dimensiones del saber.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "from-green-400 to-emerald-500",
    },
  ];

  // Razones para apadrinar
  const razones = [
    {
      title: "Niños que lo Necesitan",
      description: "Los niños necesitados en Colombia y especialmente en nuestra región son bastantes. Es hora de pensar en quienes sufren cerca de nosotros.",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      title: "21 Años de Trayectoria",
      description: "Tenemos más de dos décadas al servicio de la niñez y adolescencia en el Quindío.",
      gradient: "from-blue-400 to-cyan-500",
    },
    {
      title: "Transparencia Total",
      description: "Somos una institución que hace uso transparente de los recursos, con rendición de cuentas anual.",
      gradient: "from-purple-400 to-pink-500",
    },
    {
      title: "Mayor Valor en Dar",
      description: "Hay mayor valor en dar que en recibir. Se trata de buscar hacer el bien a nuestros niños y niñas.",
      gradient: "from-green-400 to-emerald-500",
    },
    {
      title: "Aportas Esperanza",
      description: "Ayudando mantienes encendida una luz que dice que es posible ser mejor, llevar una vida digna y plena.",
      gradient: "from-red-400 to-rose-500",
    },
    {
      title: "Beneficio Tributario",
      description: "Las donaciones son reconocidas como deducciones en la declaración de renta según el Artículo 125 del Estatuto Tributario.",
      gradient: "from-indigo-400 to-indigo-600",
    },
    {
      title: "Rompe el Ciclo de Pobreza",
      description: "La niñez es el momento más oportuno para romper el ciclo de la pobreza, o para impedir que este comience.",
      gradient: "from-teal-400 to-teal-600",
    },
    {
      title: "Asegura un Mejor Futuro",
      description: "Gracias a tu apoyo, otros podrán ir a estudiar dignamente y asegurar un futuro más promisorio.",
      gradient: "from-amber-400 to-amber-600",
    },
  ];

  // Componente de card para beneficios
  const BeneficioCard = ({ beneficio }: { beneficio: typeof beneficios[0] }) => (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
      <div className={`absolute inset-0 bg-gradient-to-br ${beneficio.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
      <div className="relative p-6 h-full flex flex-col">
        <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${beneficio.color} flex items-center justify-center shadow-lg mb-4 transform group-hover:scale-110 transition-transform`}>
          {beneficio.icon}
        </div>
        <h3 className="text-lg font-bold text-[#1E3A5F] mb-2 group-hover:text-[#2C5F7F] transition-colors">
          {beneficio.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed flex-grow">
          {beneficio.description}
        </p>
      </div>
    </div>
  );

  // Componente de card para razones
  const RazonCard = ({ razon }: { razon: typeof razones[0] }) => (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
      <div className="p-6 h-full flex flex-col">
        <div className={`w-12 h-12 bg-gradient-to-br ${razon.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[#1E3A5F] mb-2">{razon.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed flex-grow">
          {razon.description}
        </p>
      </div>
    </div>
  );

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
                Transforma una Vida
                <span className="block text-[#FDD835] mt-2">¡Apadrina un Niño!</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Nuestra meta es acompañar a los niños durante <strong>cinco años</strong>, 
                brindándoles apoyo integral en educación, salud, alimentación y desarrollo personal. 
                Con más de <strong>21 años de experiencia</strong>, transformamos vidas en el Quindío.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#formulario-inscripcion"
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#FDD835] to-[#FBC02D] text-[#1E3A5F] font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <span className="relative z-10">Quiero Ser Padrino</span>
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </a>
                <button
                  onClick={scrollToPrograms}
                  className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-[#1E3A5F] text-[#1E3A5F] font-bold rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  Ver Programas
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/50">
                <Image
                  src="/Apadrinamiento.jpg"
                  alt="Niños de la fundación"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#FDD835] to-[#FBC02D] rounded-2xl blur-xl opacity-50"></div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1E3A5F]">21+</p>
                  <p className="text-sm text-gray-600 font-medium">Años de Servicio</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1E3A5F]">5</p>
                  <p className="text-sm text-gray-600 font-medium">Años de Acompañamiento</p>
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
                  <p className="text-3xl font-bold text-[#1E3A5F]">100%</p>
                  <p className="text-sm text-gray-600 font-medium">Transparencia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Separador visual */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16"></div>

        {/* Programas Section */}
        <section id="programas" className="mb-20 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E3A5F] mb-4">
              Nuestros Programas
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              La Fundación cuenta con dos programas diseñados para atender las necesidades 
              más apremiantes de los niños de nuestra región.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Programa 1: Apadrinamiento Integral */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-5 transition-opacity"></div>
              
              <div className="relative p-8">
                <div className="flex items-start gap-5 mb-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#1E3A5F] mb-2">
                      Apadrinamiento Integral
                    </h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold text-sm shadow-sm">
                        Compromiso anual
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-white/80 text-[#1E3A5F] font-medium border border-gray-200 text-sm shadow-sm">
                        Fondo común
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Niños que cuentan con la colaboración económica anual de un padrino italiano o nacional. 
                  El dinero es manejado mediante un <strong>fondo común</strong> que garantiza la igualdad 
                  entre todos los niños que disfrutan de este programa.
                </p>

                <a
                  href="#formulario-inscripcion"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FDD835] to-[#FBC02D] text-[#1E3A5F] rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Ser Padrino Integral
                </a>
              </div>
            </div>

            {/* Programa 2: Ayudas Ocasionales */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity"></div>
              
              <div className="relative p-8">
                <div className="flex items-start gap-5 mb-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#1E3A5F] mb-2">
                      Ayudas Ocasionales
                    </h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-semibold text-sm shadow-sm">
                        Sin compromiso
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-white/80 text-[#1E3A5F] font-medium border border-gray-200 text-sm shadow-sm">
                        Libre destinación
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Funciona según los recursos de libre destinación que recibe la fundación. 
                  Ayuda para necesidades específicas a niños que no están apadrinados: 
                  <strong> matrícula, uniforme, medicamentos, calzado</strong> y otros.
                </p>

                <Link
                  href="/donaciones"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  Hacer una Donación
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Separador visual */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16"></div>

        {/* Beneficios del Apadrinamiento Section - CARRUSEL */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E3A5F] mb-4">
              Beneficios del Apadrinamiento Integral
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Conoce todos los beneficios que reciben los niños gracias al apoyo de los padrinos
            </p>
          </div>

          {/* Carrusel de beneficios */}
          <div className="px-4">
            <Carousel itemsPerView={isMobile ? 1 : 3} autoPlay={true} autoPlayInterval={4000}>
              {beneficios.map((beneficio, index) => (
                <BeneficioCard key={index} beneficio={beneficio} />
              ))}
            </Carousel>
          </div>
        </section>

        {/* Separador visual */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16"></div>

        {/* ¿Por Qué Apadrinar? Section - CARRUSEL */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E3A5F] mb-4">
              ¿Por Qué Apadrinar con Nosotros?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Descubre las razones que hacen del apadrinamiento una experiencia transformadora
            </p>
          </div>

          {/* Carrusel de razones */}
          <div className="px-4">
            <Carousel itemsPerView={isMobile ? 1 : 4} autoPlay={true} autoPlayInterval={5000}>
              {razones.map((razon, index) => (
                <RazonCard key={index} razon={razon} />
              ))}
            </Carousel>
          </div>
        </section>

        {/* Separador visual */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16"></div>

        {/* FORMULARIO DE INSCRIPCIÓN */}
        <section id="formulario-inscripcion" className="mb-20 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E3A5F] mb-4">
              Formulario de Inscripción
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Completa tus datos para iniciar el proceso de apadrinamiento
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulario */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Mensajes de error o éxito */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm font-medium">
                    ¡Solicitud enviada exitosamente!
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    Gracias por tu interés en apadrinar. Te contactaremos pronto 
                    para los siguientes pasos. Serás redirigido en unos segundos...
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nombre Completo */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="Nombres y apellidos"
                    disabled={isLoadingForm}
                    required
                  />
                </div>

                {/* Correo Electrónico */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="tu@email.com"
                    disabled={isLoadingForm}
                    required
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="+57 300 123 4567"
                    disabled={isLoadingForm}
                    required
                  />
                </div>

                {/* País de Residencia */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    País de Residencia *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900"
                    disabled={isLoadingForm}
                    required
                  >
                    <option value="">Selecciona un país</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Italia">Italia</option>
                    <option value="España">España</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="México">México</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Chile">Chile</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                {/* Cédula de Ciudadanía */}
                <div>
                  <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Cédula de Ciudadanía / Documento de Identidad *
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="Número de documento"
                    disabled={isLoadingForm}
                    required
                  />
                </div>

                {/* Nota sobre documento */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Nota:</strong> Después de enviar esta solicitud, te contactaremos 
                    para solicitar una copia de tu documento de identidad.
                  </p>
                </div>

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={isLoadingForm || success}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#FDD835] to-[#FBC02D] text-[#1E3A5F] font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoadingForm ? 'Enviando...' : 'Comenzar Apadrinamiento'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  * Campos obligatorios
                </p>
              </form>
            </div>

            {/* Información Adicional */}
            <div className="space-y-6">
              {/* Preguntas Frecuentes */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-[#1E3A5F] mb-4">
                  Preguntas Frecuentes
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-[#1E3A5F] mb-2 flex items-start gap-2">
                      <span className="text-[#FDD835] mt-0.5">▸</span>
                      ¿Cómo funciona el apadrinamiento integral?
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed pl-5">
                      El dinero se maneja mediante un fondo común que garantiza la igualdad entre 
                      todos los niños beneficiarios, cubriendo educación, salud, alimentación y más.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1E3A5F] mb-2 flex items-start gap-2">
                      <span className="text-[#FDD835] mt-0.5">▸</span>
                      ¿Puedo conocer al niño que apadrino?
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed pl-5">
                      Sí, organizamos encuentros periódicos donde los padrinos pueden conocer a 
                      los niños y participar en actividades especiales de integración.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1E3A5F] mb-2 flex items-start gap-2">
                      <span className="text-[#FDD835] mt-0.5">▸</span>
                      ¿Cuál es el compromiso económico?
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed pl-5">
                      El apadrinamiento es una colaboración económica anual. Te contactaremos 
                      con los detalles específicos según las necesidades actuales del programa.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1E3A5F] mb-2 flex items-start gap-2">
                      <span className="text-[#FDD835] mt-0.5">▸</span>
                      ¿Cómo garantizan la transparencia?
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed pl-5">
                      Realizamos rendición de cuentas anual y hacemos uso transparente de 
                      todos los recursos económicos recibidos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ayudas Ocasionales */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/70 rounded-2xl p-6 border border-yellow-200">
                <h3 className="font-bold text-[#1E3A5F] mb-3 text-lg">
                  ¿Prefieres hacer ayudas ocasionales?
                </h3>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  También puedes colaborar con necesidades específicas (matrícula, uniforme, 
                  medicamentos, calzado) sin un compromiso a largo plazo. Esto te permite 
                  hacer un acto de bondad con quienes más lo necesitan.
                </p>
                <Link
                  href="/donaciones"
                  className="inline-block px-6 py-2 bg-white text-[#1E3A5F] rounded-lg font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                >
                  Ver Donaciones
                </Link>
              </div>

              {/* Contacto */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-[#1E3A5F] mb-3 text-lg">
                  ¿Necesitas más información?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Estamos aquí para resolver todas tus dudas sobre el proceso de apadrinamiento 
                  y los programas de la fundación.
                </p>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-[#1E3A5F] text-white rounded-lg font-semibold hover:bg-[#152a45] hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contactar
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}