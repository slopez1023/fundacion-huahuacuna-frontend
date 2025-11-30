"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Footer from "@/components/ui/Footer";

export default function ImpactoPage() {
  const impactHighlights = [
    { 
      title: "Apoyo Integral", 
      description: "Educación, salud y desarrollo personal",
      icon: <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    },
    { 
      title: "Transformación Real", 
      description: "Niños que logran sus sueños profesionales",
      icon: <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
    { 
      title: "Compromiso Continuo", 
      description: "Acompañamiento desde la niñez hasta la profesionalización",
      icon: <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    { 
      title: "Atención Psicológica", 
      description: "Seguimiento del bienestar emocional de cada niño",
      icon: <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
    }
  ];

  const testimonial = {
    name: "Soldado Profesional",
    age: 29,
    profession: "Ejército Nacional - Brigada de Minado Humanitario",
    location: "Departamento del Caquetá",
    image: "/testimonials/soldier.jpg", // Reemplazar con imagen real
    quote: "Gracias a la Fundación Huahuacuna tuve la oportunidad de continuar con mis estudios. Ellos nos colaboraron con muchísimas oportunidades y nos dieron principalmente la posibilidad de seguir adelante.",
    fullStory: `El día de hoy les voy a hablar sobre una fundación en la ciudad de Armenia que se dedica a ayudarle a las personas de escasos recursos, a los niños en todo lo que tiene que ver con la educación.

Yo soy soldado profesional, tengo 29 años, actualmente trabajo en el ejército nacional, la brigada de minado humanitario aquí en el departamento del Caquetá. En mi niñez tuve la gran fortuna junto a mis dos hermanos menores de ser apadrinados por la Fundación Huahuacuna.

Gracias a ellos nos colaboraron con muchísimas oportunidades, nos dieron principalmente la oportunidad de poder continuar con el estudio. Nos ayudaron con todo lo que tiene que ver con el estudio: útiles escolares, uniformes, y también con la salud, porque mantenían pendientes de nosotros desde lo psicológico.

Es una fundación que nos sirvió muchísimo. A todas las personas, a todos los niños que han tenido la oportunidad de pasar por ahí, es una fundación que les ha servido muchísimo en el desarrollo de sus vidas.

La importancia de compartir esto es darle a conocer a las personas y a la sociedad en general que hay fundaciones como ésta que le brindan esa esperanza a los niños de bajos recursos, a las familias que desafortunadamente no cuentan con recursos económicos para la realización escolar.

La Fundación Huahuacuna ya van a cumplir 20 años, han pasado muchísimas personas por ahí. Espero que todos hayan sabido aprovechar esas oportunidades que les ha brindado la Fundación y se hayan desarrollado como seres humanos, hayan crecido intelectualmente, sean hoy en día profesionales.

De mi parte siempre voy a estar agradecido con Lina, con Clarena, con Mayra, con Ángela. Siempre van a tener mi agradecimiento, porque realmente ellas en mí hicieron un trabajo excepcional.

No solamente le ayudan a uno con todo lo que tiene que ver con el estudio, sino que aparte de eso lo premian: lo llevan a una integración, a conocer un zoológico, un parque. En diciembre, si uno ganaba el año, le daban el estreno de ropa. Es una motivación muy bonita que espero que se conserve.

Gracias por esa entrega, por esa acción de ayudar a los que lo necesitan.`,
    highlights: [
      "3 hermanos apadrinados",
      "Apoyo educativo completo",
      "Atención psicológica",
      "Actividades recreativas",
      "Desarrollo profesional exitoso"
    ]
  };

  const impactAreas = [
    {
      title: "Educación Integral",
      description: "Proveemos útiles escolares, uniformes y apoyo académico continuo para garantizar que ningún niño abandone sus estudios por falta de recursos.",
      icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      title: "Salud y Bienestar",
      description: "Ofrecemos atención psicológica y seguimiento constante del bienestar físico y emocional de cada niño apadrinado.",
      icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
      gradient: "from-green-400 to-emerald-500"
    },
    {
      title: "Desarrollo Personal",
      description: "Organizamos actividades recreativas, paseos educativos y programas de motivación que enriquecen la experiencia de nuestros niños.",
      icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      gradient: "from-purple-400 to-pink-500"
    },
    {
      title: "Construcción de Futuro",
      description: "Acompañamos a los niños en su camino hacia la profesionalización y el desarrollo de una vida plena y productiva.",
      icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      gradient: "from-yellow-400 to-orange-500"
    }
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] font-['Poppins']">
      <Navbar />
      
      {/* Hero Section Premium */}
      <section className="relative bg-gradient-to-br from-[#1E3A5F] via-[#2C5F7F] to-[#1E3A5F] pt-32 pb-20 overflow-hidden">
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
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Nuestro Impacto en 
              <span className="block text-[#FDD835] mt-2">Vidas Reales</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Cada niño apadrinado es una historia de transformación. Conoce cómo la Fundación Huahuacuna ha cambiado vidas durante más de dos décadas.
            </p>
          </div>

          {/* Highlights de la Fundación */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactHighlights.map((highlight, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    {highlight.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#1E3A5F] mb-2">{highlight.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{highlight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Separador visual */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16"></div>

        {/* Video de Testimonio */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E3A5F] mb-4">
              Historia de Transformación
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Escucha el testimonio real de un soldado profesional que fue apadrinado y hoy sirve a Colombia
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/50">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/opaxBp5UG3M?si=tm49Aa2MJAGHp8uQ"
                title="Testimonio Fundación Huahuacuna"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* Separador visual */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16"></div>
      </div>

      {/* Testimonio Principal */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="md:flex">
            {/* Imagen */}
            <div className="md:w-2/5 relative h-96 md:h-auto bg-gradient-to-br from-[#1E3A5F] via-[#2C5F7F] to-[#1E3A5F] flex items-center justify-center">
              <div className="text-center text-white p-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FDD835] to-[#FBC02D] flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <svg className="w-16 h-16 text-[#1E3A5F]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">{testimonial.name}</h3>
                <p className="text-gray-300 text-sm mb-2">{testimonial.age} años</p>
                <p className="text-[#FDD835] font-bold text-sm mb-3">{testimonial.profession}</p>
                <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{testimonial.location}</span>
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div className="md:w-3/5 p-8 md:p-10">
              <div className="mb-6">
                <svg className="w-12 h-12 text-[#FDD835] mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-xl text-gray-700 italic leading-relaxed">
                  {testimonial.quote}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-bold text-[#1E3A5F] mb-4">Aspectos Clave del Apoyo Recibido:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {testimonial.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-[#FDD835] text-xl">✓</span>
                      <span className="text-gray-700 text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link 
                href="#historia-completa"
                className="inline-block mt-6 text-[#1E3A5F] font-semibold hover:text-[#FDD835] transition-colors"
              >
                Leer historia completa →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Separador visual */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-16"></div>
      </div>

      {/* Áreas de Impacto */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E3A5F] mb-4">Cómo Generamos Impacto</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nuestro enfoque integral abarca todos los aspectos del desarrollo de un niño
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {impactAreas.map((area, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="flex items-start gap-5">
                  <div className={`w-16 h-16 bg-gradient-to-br ${area.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg text-white group-hover:scale-110 transition-transform`}>
                    {area.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1E3A5F] mb-3 group-hover:text-[#2C5F7F] transition-colors">{area.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{area.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Final Premium */}
      <section className="relative bg-gradient-to-br from-[#1E3A5F] via-[#2C5F7F] to-[#1E3A5F] py-20 overflow-hidden">
        {/* Decoraciones de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
          <svg className="absolute top-10 left-20 w-20 h-20 text-yellow-400" fill="currentColor" viewBox="0 0 100 100">
            <polygon points="50,15 61,35 84,41 67,58 70,81 50,70 30,81 33,58 16,41 39,35" />
          </svg>
          <svg className="absolute bottom-16 right-24 w-16 h-16 text-yellow-400" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sé Parte de Más Historias de Éxito
          </h2>
          <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            Tu apoyo puede cambiar la vida de un niño y crear historias de transformación como esta. Cada contribución construye un futuro mejor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apadrinar"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-[#FDD835] to-[#FBC02D] text-[#1E3A5F] font-bold text-lg rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10">Apadrinar un Niño</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <Link
              href="/donaciones"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 border-2 border-[#FDD835] text-[#FDD835] font-bold text-lg rounded-2xl hover:bg-[#FDD835] hover:text-[#1E3A5F] transition-all duration-300"
            >
              Hacer una Donación
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}