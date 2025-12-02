"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import MapSection from "@/components/ui/MapSection";

export default function DashboardPage() {
  // Estado para el carrusel
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const carouselImages = [
    {
      src: "/Educación_amor.jpg",
      title: "Educación con Amor",
      description: "Transformando vidas a través del aprendizaje y el desarrollo integral"
    },
    {
      src: "/Momentos_Alegria.jpg",
      title: "Momentos de Alegría",
      description: "Creando experiencias memorables que fortalecen el espíritu"
    },
    {
      src: "/ComunidadUnida.jpg",
      title: "Comunidad Unida",
      description: "Construyendo lazos que perduran y fortalecen nuestro propósito"
    },
    {
      src: "/SaludNutricion.jpg",
      title: "Salud y Nutrición",
      description: "Garantizando el bienestar físico y emocional de cada niño"
    },
    {
      src: "/FormacionIntegrada.jpg",
      title: "Formación Integral",
      description: "Desarrollando habilidades para la vida y el futuro"
    }
  ];

  // Auto-avance del carrusel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] font-['Poppins']">
      <Navbar />

      {/* Hero Section - Mejorado con impacto visual */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#2C5F7F] to-[#1E3A5F] text-white pt-24">
        {/* Patron decorativo de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#FDD835] rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FDD835] rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero left - Contenido */}
            <div className="space-y-8 z-10">
              {/* Badge superior */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <div className="w-2 h-2 bg-[#FDD835] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Desde 2004 transformando vidas</span>
              </div>

              {/* Título principal más grande */}
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                  Conectando Corazones,
                  <span className="block text-[#FDD835] mt-2">Transformando Vidas</span>
                </h1>
                <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-xl">
                  Apadrina un niño y sé parte del cambio. Brindamos apoyo integral en educación, salud, nutrición y bienestar a niños en edad escolar.
                </p>
              </div>

              {/* CTAs mejorados */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link 
                  href="/apadrinar" 
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FDD835] text-[#1E3A5F] font-bold shadow-xl hover:bg-[#FBC02D] hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Apadrinar un Niño
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link 
                  href="/donaciones" 
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Hacer una Donación
                </Link>
              </div>

              {/* Estadísticas inline */}
              <div className="flex flex-wrap gap-8 pt-6 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FDD835]/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#FDD835]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">20+</p>
                    <p className="text-sm text-white/70">Años de experiencia</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FDD835]/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#FDD835]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-sm text-white/70">Niños beneficiados</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FDD835]/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#FDD835]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">80+</p>
                    <p className="text-sm text-white/70">Padrinos activos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero right - Imagen mejorada */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              {/* Círculo decorativo de fondo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500px] h-[500px] rounded-full bg-[#FDD835]/10 backdrop-blur-3xl"></div>
              </div>

              {/* Imagen principal con marco */}
              <div className="relative z-10 w-full max-w-lg">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white/10">
                  <Image 
                    src="/Home.jpg" 
                    alt="Niños de la Fundación Huahuacuna" 
                    width={600} 
                    height={700} 
                    className="object-cover w-full h-[500px]" 
                    priority
                  />
                  {/* Overlay sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F]/60 via-transparent to-transparent"></div>
                </div>

                {/* Badge flotante */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl max-w-xs">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#FDD835] flex items-center justify-center flex-shrink-0">
                      <Image src="/logo.png" alt="logo" width={40} height={40} className="rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1E3A5F] mb-1">Fundación Huahuacuna</p>
                      <p className="text-xs text-gray-600 leading-relaxed">Comprometidos con el bienestar integral de la niñez vulnerable</p>
                    </div>
                  </div>
                </div>

                {/* Elemento decorativo flotante */}
                <div className="absolute -top-8 -right-8 bg-[#FDD835] rounded-2xl p-4 shadow-xl transform rotate-12 hover:rotate-6 transition-transform">
                  <svg className="w-8 h-8 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Onda decorativa inferior */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 lg:h-20 fill-[var(--background)]" viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,32L60,29.3C120,27,240,21,360,21.3C480,21,600,27,720,26.7C840,27,960,21,1080,18.7C1200,16,1320,16,1380,16L1440,16L1440,48L1380,48C1320,48,1200,48,1080,48C960,48,840,48,720,48C600,48,480,48,360,48C240,48,120,48,60,48L0,48Z"></path>
          </svg>
        </div>
      </section>

      {/* Sección de Impacto - Nueva */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FDD835]/10 px-4 py-2 rounded-full border border-[#FDD835]/20 mb-4">
            <svg className="w-4 h-4 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-[#1E3A5F]">Nuestro Impacto</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1E3A5F] mb-4">
            Más de 20 Años de Compromiso
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cada número representa historias de superación, sueños cumplidos y familias transformadas
          </p>
        </div>

        {/* Estadísticas en grid con iconos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Estadística 1 */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#FDD835]/30 hover:-translate-y-2">
            <div className="absolute -top-6 left-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-5xl font-bold text-[#1E3A5F] mb-2">500+</p>
              <p className="text-gray-600 font-medium mb-2">Niños Beneficiados</p>
              <p className="text-sm text-gray-500">Con apoyo integral en educación y salud</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FDD835] to-[#FBC02D] rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          </div>

          {/* Estadística 2 */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#FDD835]/30 hover:-translate-y-2">
            <div className="absolute -top-6 left-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FDD835] to-[#FBC02D] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-5xl font-bold text-[#1E3A5F] mb-2">2000+</p>
              <p className="text-gray-600 font-medium mb-2">Familias Impactadas</p>
              <p className="text-sm text-gray-500">Comunidades fortalecidas y empoderadas</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FDD835] to-[#FBC02D] rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          </div>

          {/* Estadística 3 */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#FDD835]/30 hover:-translate-y-2">
            <div className="absolute -top-6 left-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-5xl font-bold text-[#1E3A5F] mb-2">15</p>
              <p className="text-gray-600 font-medium mb-2">Programas Activos</p>
              <p className="text-sm text-gray-500">Educación, salud, nutrición y más</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FDD835] to-[#FBC02D] rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          </div>

          {/* Estadística 4 */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#FDD835]/30 hover:-translate-y-2">
            <div className="absolute -top-6 left-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FDD835] to-[#FBC02D] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-5xl font-bold text-[#1E3A5F] mb-2">20+</p>
              <p className="text-gray-600 font-medium mb-2">Años de Experiencia</p>
              <p className="text-sm text-gray-500">Desde 2004 cambiando vidas</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FDD835] to-[#FBC02D] rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          </div>
        </div>

        {/* CTA secundario con fondo */}
        <div className="mt-20 relative bg-gradient-to-r from-[#1E3A5F] to-[#2C5F7F] rounded-3xl p-12 lg:p-16 overflow-hidden">
          {/* Patrón decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FDD835] rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FDD835] rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                ¿Listo para hacer la diferencia?
              </h3>
              <p className="text-white/90 text-lg mb-6">
                Tu aporte puede cambiar la vida de un niño. Únete a nuestra comunidad de padrinos y donantes comprometidos con el futuro de nuestra niñez.
              </p>
              <div className="flex items-center gap-3 text-white/80 text-sm">
                <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Proceso 100% transparente y seguro
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Link 
                href="/apadrinar"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#FDD835] text-[#1E3A5F] font-bold shadow-xl hover:bg-[#FBC02D] hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Apadrinar Ahora
              </Link>
              <Link 
                href="/donaciones"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-[#1E3A5F] transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                Donar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Puedes Ayudar - Cards Rediseñadas */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FDD835]/10 px-4 py-2 rounded-full border border-[#FDD835]/20 mb-4">
            <svg className="w-4 h-4 text-[#FDD835]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-semibold text-[#1E3A5F]">Únete a Nosotros</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1E3A5F] mb-4">
            Cómo Puedes Ayudar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Existen múltiples formas de ser parte del cambio y marcar la diferencia en la vida de un niño
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 - Apadrinamiento */}
          <Link href="/apadrinar" className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#FDD835]/30 hover:-translate-y-2 overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDD835]/5 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
            
            {/* Ícono - AZUL */}
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <svg className="w-8 h-8 text-[#FDD835]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>

            {/* Contenido */}
            <h3 className="text-xl font-bold text-[#1E3A5F] mb-3 group-hover:text-[#2C5F7F] transition-colors">
              Apadrinamiento
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Conoce cómo apadrinar y transformar una vida. Crea un vínculo duradero con un niño.
            </p>

            {/* CTA */}
            <div className="flex items-center gap-2 text-[#FDD835] font-semibold text-sm group-hover:gap-3 transition-all">
              <span>Apadrinar ahora</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Barra inferior animada */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1E3A5F] to-[#2C5F7F] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </Link>

          {/* Card 2 - Voluntariado */}
          <Link href="/voluntariado" className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#FDD835]/30 hover:-translate-y-2 overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDD835]/5 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
            
            {/* Ícono - AMARILLO */}
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FDD835] to-[#FBC02D] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <svg className="w-8 h-8 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            {/* Contenido */}
            <h3 className="text-xl font-bold text-[#1E3A5F] mb-3 group-hover:text-[#2C5F7F] transition-colors">
              Voluntariado
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Únete como voluntario y apoya proyectos locales con tu tiempo y talento.
            </p>

            {/* CTA */}
            <div className="flex items-center gap-2 text-[#FDD835] font-semibold text-sm group-hover:gap-3 transition-all">
              <span>Ser voluntario</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Barra inferior animada */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FDD835] to-[#FBC02D] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </Link>

          {/* Card 3 - Proyectos */}
          <Link href="/proyectos" className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#1E3A5F]/30 hover:-translate-y-2 overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E3A5F]/5 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
            
            {/* Ícono - AZUL */}
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <svg className="w-8 h-8 text-[#FDD835]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>

            {/* Contenido */}
            <h3 className="text-xl font-bold text-[#1E3A5F] mb-3 group-hover:text-[#2C5F7F] transition-colors">
              Proyectos
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Descubre nuestros proyectos en curso y el impacto que generan en las comunidades.
            </p>

            {/* CTA */}
            <div className="flex items-center gap-2 text-[#FDD835] font-semibold text-sm group-hover:gap-3 transition-all">
              <span>Ver proyectos</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Barra inferior animada */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1E3A5F] to-[#2C5F7F] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </Link>

          {/* Card 4 - Donaciones */}
          <Link href="/donaciones" className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#FDD835]/30 hover:-translate-y-2 overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDD835]/5 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
            
            {/* Ícono - AMARILLO */}
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FDD835] to-[#FBC02D] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <svg className="w-8 h-8 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
            </div>

            {/* Contenido */}
            <h3 className="text-xl font-bold text-[#1E3A5F] mb-3 group-hover:text-[#2C5F7F] transition-colors">
              Donaciones
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Aporta recursos para el bienestar de los niños. Cada contribución cuenta.
            </p>

            {/* CTA */}
            <div className="flex items-center gap-2 text-[#FDD835] font-semibold text-sm group-hover:gap-3 transition-all">
              <span>Donar ahora</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Barra inferior animada */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FDD835] to-[#FBC02D] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">

        {/* Nuestra Esencia - Información Oficial */}
        <section className="mt-24 relative overflow-hidden">
          {/* Fondo con patrón decorativo */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FDD835]/5 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1E3A5F]/5 rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-[#FDD835]/10 px-4 py-2 rounded-full border border-[#FDD835]/20 mb-4">
                <svg className="w-4 h-4 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                <span className="text-sm font-semibold text-[#1E3A5F]">Nuestra Esencia</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1E3A5F] mb-6">
                Huahuacuna: Amor de Madre <br className="hidden sm:block" />por Cada Niño
              </h2>
            </div>

            {/* Card principal con el significado */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 mb-12 border border-gray-100">
              <div className="flex items-start gap-6 mb-8">
                <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] flex-shrink-0 items-center justify-center">
                  <svg className="w-8 h-8 text-[#FDD835]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    El nombre de nuestra fundación, <span className="font-bold text-[#1E3A5F]">"Huahuacuna"</span>, tiene sus raíces en el quechua, donde{' '}
                    <span className="font-semibold text-[#1E3A5F]">"Huahua"</span> significa <span className="italic">"el hijo de la madre"</span>, y{' '}
                    <span className="font-semibold text-[#1E3A5F]">"cuna"</span> denota el plural.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Así, <span className="font-bold text-[#1E3A5F]">"Huahuacuna"</span> se traduce como{' '}
                    <span className="font-bold text-[#FDD835] bg-[#FDD835]/10 px-2 py-1 rounded">"los niños"</span>, reflejando nuestro profundo compromiso y amor incondicional por cada uno de ellos. Es una institución que guarda, en lo más profundo de su ser, un amor tan grande por los niños que solo puede compararse con el amor que una madre tiene para sus hijos.
                  </p>
                </div>
              </div>

              {/* Elementos decorativos */}
              <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 bg-[#FDD835]/10 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  <span className="text-sm font-semibold text-[#1E3A5F]">Origen Quechua</span>
                </div>
                <div className="flex items-center gap-2 bg-[#1E3A5F]/10 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 text-[#1E3A5F]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                  <span className="text-sm font-semibold text-[#1E3A5F]">Amor Incondicional</span>
                </div>
                <div className="flex items-center gap-2 bg-[#FDD835]/10 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="text-sm font-semibold text-[#1E3A5F]">Compromiso Total</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* El Impacto de Su Apoyo - Estadísticas Reales */}
        <section className="mt-20 bg-gradient-to-br from-gray-50 to-white py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1E3A5F] mb-4">
                El Impacto de Su Apoyo: Transformando Vidas
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Cada donación, cada hora de voluntariado, se traduce en oportunidades reales para los niños y sus familias. Su apoyo es el motor que impulsa nuestro trabajo.
              </p>
            </div>

            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Stat 1 */}
              <div className="text-center group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#FDD835]/30">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-[#FDD835]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-6xl font-bold text-[#1E3A5F] mb-3">542</div>
                  <div className="text-xl font-semibold text-gray-800 mb-2">Niños Apadrinados en todos estos años</div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Niños que reciben apoyo integral en educación, salud y bienestar.
                  </p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="text-center group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#FDD835]/30">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FDD835] to-[#FBC02D] mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-6xl font-bold text-[#1E3A5F] mb-3">6+</div>
                  <div className="text-xl font-semibold text-gray-800 mb-2">Municipios Impactados</div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Extensión de nuestra labor a las zonas más vulnerables del Quindío.
                  </p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="text-center group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#FDD835]/30">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-[#FDD835]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-6xl font-bold text-[#1E3A5F] mb-3">21</div>
                  <div className="text-xl font-semibold text-gray-800 mb-2">Años de Experiencia</div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Desde 2003, construyendo un legado de esperanza y desarrollo.
                  </p>
                </div>
              </div>
            </div>

            {/* Mensaje motivador */}
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto border border-gray-100">
              <svg className="w-12 h-12 text-[#FDD835] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <p className="text-xl text-gray-700 font-medium italic">
                "Juntos, podemos seguir construyendo un futuro donde cada niño tenga la oportunidad de alcanzar su máximo potencial."
              </p>
            </div>
          </div>
        </section>

        {/* Misión y Visión - Mejorada */}
        <section className="mt-24 relative overflow-hidden">
          {/* Fondo decorativo */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F]/5 via-transparent to-[#FDD835]/5"></div>
          
          <div className="relative max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-[#FDD835]/10 px-4 py-2 rounded-full border border-[#FDD835]/20 mb-4">
                <svg className="w-4 h-4 text-[#FDD835]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-[#1E3A5F]">Nuestro Propósito</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1E3A5F] mb-4">
                Misión y Visión
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                El camino que nos guía y el futuro que construimos juntos
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Card Misión */}
              <div className="group relative bg-white rounded-3xl p-10 lg:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#FDD835]/30 overflow-hidden">
                {/* Fondo decorativo animado */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#1E3A5F]/5 to-[#FDD835]/5 rounded-full transform translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-700"></div>
                
                {/* Ícono flotante */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#FDD835] to-[#FBC02D] rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                
                <div className="relative">
                  {/* Header con ícono */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-[#FDD835]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#1E3A5F]">Nuestra Misión</h3>
                      <p className="text-sm text-[#FDD835] font-semibold">Lo que hacemos</p>
                    </div>
                  </div>

                  {/* Contenido */}
                  <p className="text-gray-700 leading-relaxed text-lg mb-6">
                    Apoyar a la niñez vulnerable mediante apadrinamientos y ayudas ocasionales para mejorar su calidad de vida a través de procesos educativos que incluyan a la familia.
                  </p>

                  {/* Puntos clave */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#FDD835] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-600 text-sm"><span className="font-semibold text-gray-800">Apadrinamientos:</span> Vínculos duraderos que transforman vidas</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#FDD835] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-600 text-sm"><span className="font-semibold text-gray-800">Educación integral:</span> Procesos que incluyen a toda la familia</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#FDD835] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-600 text-sm"><span className="font-semibold text-gray-800">Colaboración global:</span> Personas y entidades comprometidas</p>
                    </div>
                  </div>
                </div>

                {/* Barra inferior */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1E3A5F] to-[#2C5F7F] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-b-3xl"></div>
              </div>

              {/* Card Visión */}
              <div className="group relative bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] rounded-3xl p-10 lg:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 text-white overflow-hidden">
                {/* Patrón decorativo */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#FDD835] rounded-full transform translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FDD835] rounded-full transform -translate-x-10 translate-y-10"></div>
                </div>
                
                <div className="relative">
                  {/* Header con ícono */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#FDD835] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Nuestra Visión</h3>
                      <p className="text-sm text-[#FDD835] font-semibold">A dónde vamos</p>
                    </div>
                  </div>

                  {/* Contenido */}
                  <p className="text-white/95 leading-relaxed text-lg mb-6">
                    Ser una institución que gestione permanentemente recursos para aumentar el número de niños beneficiados y programas que respondan a necesidades concretas.
                  </p>

                  {/* Puntos clave */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#FDD835] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <p className="text-white/90 text-sm"><span className="font-semibold text-white">Crecimiento sostenible:</span> Más niños y programas cada año</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#FDD835] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <p className="text-white/90 text-sm"><span className="font-semibold text-white">Equipo interdisciplinario:</span> Profesionales especializados</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#FDD835] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <p className="text-white/90 text-sm"><span className="font-semibold text-white">Familias fuertes:</span> Cohesionadas, pacíficas y autogestionadoras</p>
                    </div>
                  </div>
                </div>

                {/* Badge flotante */}
                <div className="absolute top-6 right-6 bg-[#FDD835]/20 backdrop-blur-sm px-4 py-2 rounded-full border border-[#FDD835]/30">
                  <span className="text-xs font-bold text-white">Nuestro Norte</span>
                </div>
              </div>
            </div>

            {/* Frase motivacional inferior */}
            <div className="mt-12 text-center bg-gradient-to-r from-[#FDD835]/10 via-[#FDD835]/5 to-[#FDD835]/10 rounded-2xl p-8 border border-[#FDD835]/20">
              <svg className="w-12 h-12 text-[#FDD835] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <p className="text-xl lg:text-2xl font-bold text-[#1E3A5F] mb-2">
                "Ciudadanos responsables y propositivos para el futuro"
              </p>
              <p className="text-gray-600">
                Este es el legado que construimos con cada niño que apoyamos
              </p>
            </div>
          </div>
        </section>

        {/* Historia - Storytelling Visual Mejorado */}
        <section className="mt-24 relative overflow-hidden">
          {/* Fondo decorativo */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white"></div>
          
          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-[#FDD835]/10 px-4 py-2 rounded-full border border-[#FDD835]/20 mb-4">
                <svg className="w-4 h-4 text-[#FDD835]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-[#1E3A5F]">Nuestra Historia</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1E3A5F] mb-4">
                Un Viaje de Solidaridad y Crecimiento
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Más de dos décadas construyendo esperanza y transformando vidas en el Quindío
              </p>
            </div>

            {/* Timeline con imagen */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
              {/* Columna izquierda - Timeline */}
              <div className="space-y-8">
                {/* Milestone 1 - 2003 */}
                <div className="relative pl-8 border-l-4 border-[#FDD835]">
                  <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-[#FDD835] border-4 border-white shadow-lg"></div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl font-bold text-[#1E3A5F]">2003</span>
                      <span className="px-3 py-1 bg-[#FDD835]/20 text-[#1E3A5F] text-xs font-semibold rounded-full">Inicio</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1E3A5F] mb-2">Nace "Sonrisa Italiana"</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      En junio de 2003, inicia nuestra labor social como <span className="font-semibold">"Sonrisa Italiana"</span>, gracias a la visión de <span className="font-semibold">Mayra Alejandra López Osorio</span> y <span className="font-semibold">Lina María Guapacha</span>, con el apoyo del <span className="font-semibold">Padre Agostino Abate</span>. Apadrinamos a <span className="font-bold text-[#1E3A5F]">17 niños</span> inicialmente.
                    </p>
                  </div>
                </div>

                {/* Milestone 2 - 2004 */}
                <div className="relative pl-8 border-l-4 border-[#1E3A5F]">
                  <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-[#1E3A5F] border-4 border-white shadow-lg"></div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl font-bold text-[#1E3A5F]">2004</span>
                      <span className="px-3 py-1 bg-[#1E3A5F]/20 text-[#1E3A5F] text-xs font-semibold rounded-full">Constitución</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1E3A5F] mb-2">Fundación Huahuacuna</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      El <span className="font-semibold">31 de mayo de 2004</span>, nos constituimos legalmente como <span className="font-bold text-[#FDD835]">Fundación Huahuacuna</span>. Con la adhesión de <span className="font-semibold">Ángela Patricia Menza Astudillo</span> y <span className="font-semibold">María Clarena Castaño Bedoya</span>, expandimos nuestro alcance a más de <span className="font-bold text-[#1E3A5F]">140 niños</span> apadrinados por <span className="font-semibold">Cáritas de Acqui Terme, Italia</span>.
                    </p>
                  </div>
                </div>

                {/* Milestone 3 - Hoy */}
                <div className="relative pl-8 border-l-4 border-[#FDD835]">
                  <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#FDD835] to-[#FBC02D] border-4 border-white shadow-lg animate-pulse"></div>
                  <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2C5F7F] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl font-bold">2025</span>
                      <span className="px-3 py-1 bg-[#FDD835]/30 text-white text-xs font-semibold rounded-full">Actualidad</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Impacto Continuo</h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      Hoy, con <span className="font-bold text-[#FDD835]">21 años de experiencia</span>, hemos beneficiado a más de <span className="font-bold text-[#FDD835]">542 niños</span> en <span className="font-bold text-[#FDD835]">6+ municipios</span> del Quindío, consolidándonos como una institución referente en el apoyo integral a la niñez vulnerable.
                    </p>
                  </div>
                </div>
              </div>

              {/* Columna derecha - Imagen y Programa */}
              <div className="space-y-8">
                {/* Imagen principal */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F]/20 to-[#FDD835]/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform"></div>
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    <Image 
                      src="/Historia.jpg" 
                      alt="Actividades del programa Fundación Huahuacuna" 
                      width={600} 
                      height={500} 
                      className="object-cover w-full h-[400px] group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F]/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-white font-semibold text-lg drop-shadow-lg">
                        Niños participando en nuestros programas educativos
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card de Nuestro Programa */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FDD835] to-[#FBC02D] flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#1E3A5F]">Nuestro Programa</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Nos centramos en el <span className="font-semibold text-[#1E3A5F]">apadrinamiento de niños en edad escolar</span>, brindándoles apoyo integral en:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", label: "Educación formal y no formal" },
                      { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", label: "Salud y nutrición" },
                      { icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", label: "Vestido y calzado" },
                      { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "Complementos alimenticios" },
                      { icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "Actividades de esparcimiento" },
                      { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", label: "Educación a la familia" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <svg className="w-5 h-5 text-[#FDD835] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Carrusel de Impacto Visual - Profesional */}
        <section className="mt-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#FDD835]/10 px-4 py-2 rounded-full border border-[#FDD835]/20 mb-4">
              <svg className="w-4 h-4 text-[#FDD835]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-semibold text-[#1E3A5F]">Momentos que Inspiran</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1E3A5F] mb-4">
              Nuestro Impacto en Imágenes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cada fotografía cuenta una historia de esperanza, alegría y transformación
            </p>
          </div>

          {/* Carrusel Principal */}
          <div className="relative max-w-6xl mx-auto">
            {/* Container del carrusel */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl" style={{ height: '600px' }}>
              {/* Slides */}
              {carouselImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentSlide 
                      ? 'opacity-100 translate-x-0 z-10' 
                      : index < currentSlide 
                        ? 'opacity-0 -translate-x-full z-0' 
                        : 'opacity-0 translate-x-full z-0'
                  }`}
                >
                  {/* Imagen */}
                  <Image 
                    src={image.src}
                    alt={image.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  
                  {/* Overlay gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F]/90 via-[#1E3A5F]/40 to-transparent"></div>
                  
                  {/* Contenido */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 z-20">
                    <div className="max-w-4xl mx-auto">
                      {/* Badge con número de slide */}
                      <div className="inline-flex items-center gap-2 bg-[#FDD835]/20 backdrop-blur-sm px-4 py-2 rounded-full border border-[#FDD835]/30 mb-4">
                        <span className="text-xs font-bold text-white">{index + 1} / {carouselImages.length}</span>
                      </div>
                      
                      <h3 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                        {image.title}
                      </h3>
                      <p className="text-lg lg:text-xl text-white/90 max-w-2xl">
                        {image.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Botones de navegación */}
              <button
                onClick={prevSlide}
                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
                aria-label="Anterior"
              >
                <svg className="w-6 h-6 lg:w-7 lg:h-7 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
                aria-label="Siguiente"
              >
                <svg className="w-6 h-6 lg:w-7 lg:h-7 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Indicadores de puntos */}
            <div className="flex justify-center gap-3 mt-8">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide 
                      ? 'w-12 h-3 bg-[#FDD835]' 
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>

            {/* Miniaturas navegables */}
            <div className="mt-8 grid grid-cols-5 gap-4">
              {carouselImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative aspect-video rounded-xl overflow-hidden transition-all duration-300 ${
                    index === currentSlide 
                      ? 'ring-4 ring-[#FDD835] shadow-lg scale-105' 
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <Image 
                    src={image.src}
                    alt={image.title}
                    fill
                    className="object-cover"
                  />
                  <div className={`absolute inset-0 bg-[#1E3A5F]/40 ${index === currentSlide ? 'opacity-0' : 'opacity-100'}`}></div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Ubicación y Contacto */}
        <MapSection />

        {/* CTA Final Mejorado */}
        <div className="mt-24 relative overflow-hidden rounded-3xl">
          {/* Fondo con gradiente y patrón */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F] via-[#2C5F7F] to-[#1E3A5F]"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FDD835] rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FDD835] rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative px-8 py-16 lg:py-20 text-center">
            {/* Badge superior */}
            <div className="inline-flex items-center gap-2 bg-[#FDD835]/20 backdrop-blur-sm px-4 py-2 rounded-full border border-[#FDD835]/30 mb-6">
              <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold text-white">Tu Apoyo Marca la Diferencia</span>
            </div>

            <h3 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Sé Parte del Cambio Hoy
            </h3>
            <p className="text-white/90 text-lg lg:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
              Cada aporte cuenta. Ya sea apadrinando un niño, haciendo una donación o ofreciendo tu tiempo como voluntario, tu contribución transforma vidas y construye futuros llenos de esperanza.
            </p>

            {/* Botones mejorados */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              <Link 
                href="/apadrinar" 
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-[#FDD835] text-[#1E3A5F] font-bold text-lg shadow-2xl hover:bg-[#FBC02D] hover:scale-105 transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Apadrinar un Niño
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                href="/donaciones" 
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full border-2 border-white text-white font-bold text-lg hover:bg-white hover:text-[#1E3A5F] transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                Hacer una Donación
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Indicadores de confianza */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-white/20">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="text-left">
                  <p className="text-white font-semibold">100% Transparente</p>
                  <p className="text-white/70 text-sm">Certificados oficiales</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <div className="text-left">
                  <p className="text-white font-semibold">21 Años de Confianza</p>
                  <p className="text-white/70 text-sm">Miles de familias beneficiadas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <div className="text-left">
                  <p className="text-white font-semibold">Impacto Real</p>
                  <p className="text-white/70 text-sm">542 niños transformados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Profesional */}
      <Footer />
    </main>
  );
}