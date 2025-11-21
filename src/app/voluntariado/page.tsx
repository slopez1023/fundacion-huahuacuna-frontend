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
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Breadcrumb items={[{ label: "Voluntariado" }]} />

        {/* Hero Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold text-[#1E3A5F] mb-4">
                Sé Parte del Cambio como Voluntario
              </h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Tu tiempo y habilidades pueden hacer una diferencia real en la vida de nuestros niños. 
                Únete a nuestro programa de voluntariado y contribuye a crear un futuro mejor.
              </p>
              <Link
                href="#inscription-form"
                className="inline-block px-8 py-3 bg-[#FDD835] text-[#1E3A5F] font-semibold rounded-lg hover:bg-[#FBC02D] transition-colors shadow-sm"
              >
                Postularme como Voluntario
              </Link>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/Voluntariado.jpg"
                alt="Voluntarios en acción"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Opportunities Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#1E3A5F] mb-8 text-center">
            Oportunidades de Voluntariado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((opportunity, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-yellow-50">
                    {opportunity.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1E3A5F] mb-2 text-lg">
                      {opportunity.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {opportunity.description}
                    </p>
                    <div className="flex items-center gap-3 text-sm flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium">
                        {opportunity.commitment}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                        {opportunity.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Registration Form */}
        <section id="inscription-form" className="mb-16 scroll-mt-24">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#1E3A5F] mb-2">
              Formulario de Inscripción
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Completa el formulario y nos pondremos en contacto contigo pronto
            </p>

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

                {/* Área de Interés */}
                <div>
                  <label htmlFor="interestArea" className="block text-sm font-medium text-gray-700 mb-1">
                    Área de Interés *
                  </label>
                  <select
                    id="interestArea"
                    name="interestArea"
                    value={formData.interestArea}
                    onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"

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
                </div>
              </div>

              <div className="space-y-6">
                {/* Disponibilidad Horaria */}
                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                    Disponibilidad Horaria
                  </label>
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

                {/* Experiencia Previa */}
                <div>
                  <label htmlFor="previousExperience" className="block text-sm font-medium text-gray-700 mb-1">
                    Experiencia Previa
                  </label>
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
                  className="w-full px-6 py-3 bg-[#FDD835] text-[#1E3A5F] font-semibold rounded-lg hover:bg-[#FBC02D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    'Enviar Postulación'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  * Campos obligatorios
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* Additional Information */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100/70 p-6 rounded-xl border border-yellow-200">
            <h3 className="font-semibold text-[#1E3A5F] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              ¿Tienes dudas?
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Contáctanos para resolver todas tus preguntas sobre el programa de voluntariado.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-6 py-2 bg-white text-[#1E3A5F] rounded-lg font-semibold shadow-sm hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contactar
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#1E3A5F] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#FDD835]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
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
                <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FDD835] text-[#1E3A5F] font-semibold flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      {/* Footer Profesional */}
                  <Footer />
    </main>
  );
}