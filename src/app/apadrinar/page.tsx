/**
 * Página de Apadrinamiento
 * Formulario público para que visitantes se postulen como padrinos
 * 
 * @author Fundación Huahuacuna
 * @version 1.0
 */

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/src/components/ui/Navbar";
import Breadcrumb from "@/src/components/ui/Breadcrumb";
import { createSponsorApplication } from '@/src/lib/api/applicationApi';
import type { SponsorApplicationDTO } from '@/src/types/application';
import Footer from "@/src/components/ui/Footer";


export default function ApadrinarPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estado del formulario
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
      icon: (
        <svg className="w-10 h-10 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: "Salud",
      description: "Control odontológico, médico anual y cubrimiento de tratamientos especializados.",
      icon: (
        <svg className="w-10 h-10 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      title: "Alimentación",
      description: "Complementos alimenticios según prescripción médica para niños con bajo peso.",
      icon: (
        <svg className="w-10 h-10 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Vestido y Calzado",
      description: "Conjunto completo de ropa y calzado para fin de año.",
      icon: (
        <svg className="w-10 h-10 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      title: "Implementos de Aseo",
      description: "Campaña semestral con jabón, crema dental, champú y más productos de higiene.",
      icon: (
        <svg className="w-10 h-10 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: "Actividades de Esparcimiento",
      description: "Integración grupal y celebración de fechas especiales para desarrollo social.",
      icon: (
        <svg className="w-10 h-10 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const reasons = [
    "Los niños necesitados en Colombia y especialmente en nuestra región son bastantes.",
    "Tenemos una trayectoria de veintiún años al servicio de la niñez y adolescencia en el Quindío.",
    "Uso transparente de recursos con rendición de cuentas anual.",
    "Hoy por ti mañana por mí... nadie tiene su bienestar comprado.",
    "Las donaciones son reconocidas como deducciones de la declaración de renta (Art. 125 E.T.).",
    "La niñez es el momento más oportuno para romper el ciclo de la pobreza."
  ];

  /**
   * Maneja cambios en los inputs
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] font-['Poppins']">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Breadcrumb items={[{ label: "Apadrinar" }]} />

        {/* Hero Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold text-[#1E3A5F] mb-4">
                Conviértete en Padrino o Madrina
              </h1>
              <p className="text-gray-600 mb-6">
                Tu apadrinamiento hace posible que niños en situación vulnerable reciban educación, 
                alimentación y apoyo integral para su desarrollo. Contamos con 21 años de experiencia 
                al servicio de la niñez y adolescencia en el Quindío.
              </p>
              <div className="bg-yellow-50 border-l-4 border-[#FDD835] p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Beneficio tributario:</strong> Las donaciones son reconocidas como deducciones 
                  de la declaración de renta según el Artículo 125 del Estatuto Tributario.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/apadrinamiento.jpg"
                alt="Programa de Apadrinamiento"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#1E3A5F] mb-4 text-center">
            Apadrinamiento Integral
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-3xl mx-auto">
            Los niños cuentan con la colaboración económica anual de un padrino, el dinero es manejado 
            mediante un fondo común que garantiza la igualdad entre todos los beneficiarios del programa.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-yellow-50">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-[#1E3A5F] mb-2 text-lg">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Reasons Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-[#1E3A5F] mb-6">
              Razones para Apadrinar Mediante Nuestra Fundación
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FDD835] flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-[#1E3A5F]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Formulario de Inscripción */}
        <section id="inscription-form" className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 scroll-mt-24">
          <div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold text-[#1E3A5F] mb-2">
                Formulario de Inscripción
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Completa tus datos para iniciar el proceso de apadrinamiento
              </p>

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
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="Nombres y apellidos"
                    disabled={isLoading}
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
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"

                    placeholder="tu@email.com"
                    disabled={isLoading}
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
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"

                    placeholder="+57 300 123 4567"
                    disabled={isLoading}
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
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"

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
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="Número de documento"
                    disabled={isLoading}
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
                  disabled={isLoading || success}
                  className="w-full px-6 py-3 bg-[#FDD835] text-[#1E3A5F] font-semibold rounded-lg hover:bg-[#FBC02D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Enviando...' : 'Comenzar Apadrinamiento'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  * Campos obligatorios
                </p>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            {/* Preguntas Frecuentes */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-[#1E3A5F] mb-4 text-lg">
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
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100/70 p-6 rounded-xl border border-yellow-200">
              <h3 className="font-semibold text-[#1E3A5F] mb-3">
                ¿Prefieres hacer ayudas ocasionales?
              </h3>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                También puedes colaborar con necesidades específicas (matrícula, uniforme, 
                medicamentos, calzado) sin un compromiso a largo plazo. Esto te permite 
                hacer un acto de bondad con quienes más lo necesitan.
              </p>
              <Link
                href="/donaciones"
                className="inline-block px-6 py-2 bg-white text-[#1E3A5F] rounded-lg font-semibold shadow-sm hover:bg-gray-50 transition-colors"
              >
                Ver Donaciones
              </Link>
            </div>

            {/* Contacto */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-[#1E3A5F] mb-3">
                ¿Necesitas más información?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Estamos aquí para resolver todas tus dudas sobre el proceso de apadrinamiento 
                y los programas de la fundación.
              </p>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 px-6 py-2 bg-[#1E3A5F] text-white rounded-lg font-semibold hover:bg-[#152a45] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contactar
              </Link>
            </div>
          </div>
        </section>
      </div>
      {/* Footer Profesional */}
            <Footer />
    </main>
  );
}