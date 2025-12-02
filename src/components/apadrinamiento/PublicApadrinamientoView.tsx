/**
 * PublicApadrinamientoView - Vista pública de apadrinamiento
 * Para visitantes no logueados que desean postularse como padrinos
 * @author Fundación Huahuacuna
 */

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { createSponsorApplication } from '@/lib/api/applicationApi';
import type { SponsorApplicationDTO } from '@/types/application';
import Footer from "@/components/ui/Footer";

export default function PublicApadrinamientoView() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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

  const benefits = [
    {
      title: "Educación",
      description: "Matrícula, uniforme, útiles escolares, transporte y comedor escolar.",
      iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    },
    {
      title: "Salud",
      description: "Control odontológico, médico anual y cubrimiento de tratamientos especializados.",
      iconPath: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    },
    {
      title: "Alimentación",
      description: "Complementos alimenticios según prescripción médica para niños con bajo peso.",
      iconPath: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    },
    {
      title: "Vestido y Calzado",
      description: "Conjunto completo de ropa y calzado para fin de año.",
      iconPath: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    },
    {
      title: "Implementos de Aseo",
      description: "Campaña semestral con jabón, crema dental, champú y más productos de higiene.",
      iconPath: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    },
    {
      title: "Actividades de Esparcimiento",
      description: "Integración grupal y celebración de fechas especiales para desarrollo social.",
      iconPath: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    }
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: SponsorApplicationDTO) => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await createSponsorApplication(formData);

      if (response.success) {
        setSuccess(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          country: '',
          idNumber: '',
          idDocumentPath: ''
        });

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
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] font-['Poppins']">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#2C5F7F] to-[#1E3A5F] text-white pt-32 pb-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FDD835] rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FDD835] rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <svg className="w-4 h-4 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium">Programa de Alto Impacto Social</span>
              </div>

              <div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                  Conviértete en Padrino o
                  <span className="block text-[#FDD835] mt-2">Madrina</span>
                </h1>
                <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                  Tu apadrinamiento hace posible que niños en situación vulnerable reciban educación, 
                  alimentación y apoyo integral para su desarrollo. Contamos con 
                  <span className="font-bold text-[#FDD835]"> 21 años de experiencia</span> al servicio 
                  de la niñez y adolescencia en el Quindío.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-[#FDD835] mb-1">542</div>
                  <div className="text-sm text-white/80">Niños Beneficiados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-[#FDD835] mb-1">21+</div>
                  <div className="text-sm text-white/80">Años de Trayectoria</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-[#FDD835] mb-1">80+</div>
                  <div className="text-sm text-white/80">Padrinos Activos</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#inscription-form"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FDD835] text-[#1E3A5F] rounded-full font-bold hover:bg-[#FBC02D] transition-all hover:scale-105 shadow-xl"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Apadrinar Ahora
                </a>
                <a
                  href="#benefits"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold hover:bg-white/20 transition-all border border-white/20"
                >
                  Ver Beneficios
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>

              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl">
                <svg className="w-6 h-6 text-[#FDD835] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Beneficio Tributario</p>
                  <p className="text-xs text-white/80">
                    Las donaciones son reconocidas como deducciones de la declaración de renta según el 
                    <span className="font-semibold"> Artículo 125 del Estatuto Tributario</span>.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FDD835] rounded-3xl transform rotate-6 opacity-20"></div>
                
                <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/Home.jpg"
                    alt="Programa de Apadrinamiento"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F]/60 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#FDD835] flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-[#1E3A5F]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1E3A5F]">Apadrinamiento Integral</p>
                        <p className="text-xs text-gray-600">Educación, salud, alimentación y más</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios Section */}
      <section id="benefits" className="py-20 max-w-6xl mx-auto px-6 scroll-mt-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FDD835]/10 px-4 py-2 rounded-full border border-[#FDD835]/20 mb-4">
            <svg className="w-5 h-5 text-[#FDD835]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <span className="text-sm font-semibold text-[#1E3A5F]">Cobertura Integral</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1E3A5F] mb-4">
            Apadrinamiento Integral
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Los niños cuentan con la colaboración económica anual de un padrino, el dinero es manejado 
            mediante un <span className="font-semibold text-[#1E3A5F]">fondo común</span> que garantiza la 
            igualdad entre todos los beneficiarios del programa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const colors = [
              { bg: 'from-[#1E3A5F] to-[#2C5F7F]', iconColor: 'text-[#FDD835]' },
              { bg: 'from-[#FDD835] to-[#FBC02D]', iconColor: 'text-[#1E3A5F]' },
              { bg: 'from-[#1E3A5F] to-[#2C5F7F]', iconColor: 'text-[#FDD835]' },
              { bg: 'from-[#FDD835] to-[#FBC02D]', iconColor: 'text-[#1E3A5F]' },
              { bg: 'from-[#1E3A5F] to-[#2C5F7F]', iconColor: 'text-[#FDD835]' },
              { bg: 'from-[#FDD835] to-[#FBC02D]', iconColor: 'text-[#1E3A5F]' }
            ];
            const color = colors[index % colors.length];
            
            return (
              <div 
                key={index} 
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#FDD835]/30 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FDD835]/10 to-transparent rounded-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="relative">
                  <div className={`mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${color.bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <svg className={`w-10 h-10 ${color.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={benefit.iconPath} />
                    </svg>
                  </div>
                  
                  <h3 className="font-bold text-[#1E3A5F] mb-3 text-xl group-hover:text-[#2C5F7F] transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#FDD835]">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Incluido en el programa
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Formulario de Inscripción */}
      <section id="inscription-form" className="py-20 max-w-3xl mx-auto px-6 scroll-mt-24">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FDD835] to-[#FBC02D] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1E3A5F]">
                  Formulario de Inscripción
                </h2>
                <p className="text-gray-600 text-sm">
                  Completa tus datos para iniciar el proceso
                </p>
              </div>
            </div>
          </div>

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
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="Nombres y apellidos"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="tu@email.com"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="+57 300 123 4567"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                País de Residencia *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0110.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 appearance-none bg-white"
                  disabled={isLoading}
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
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Cédula de Ciudadanía / Documento de Identidad *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="Número de documento"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Nota:</strong> Después de enviar esta solicitud, te contactaremos 
                para solicitar una copia de tu documento de identidad.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#FDD835] to-[#FBC02D] text-[#1E3A5F] font-bold rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  Comenzar Apadrinamiento
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              * Campos obligatorios
            </p>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
