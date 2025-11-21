"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/src/components/ui/Navbar";
import Breadcrumb from "@/src/components/ui/Breadcrumb";
import Footer from "@/src/components/ui/Footer";

export default function ImpactoPage() {
  const impactStats = [
    { value: "542", label: "Niños Apadrinados", icon: "👦" },
    { value: "21", label: "Años de Impacto", icon: "📅" },
    { value: "8", label: "Municipios", icon: "🏘️" },
    { value: "95%", label: "Tasa de Éxito", icon: "✨" }
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
      icon: "📚"
    },
    {
      title: "Salud y Bienestar",
      description: "Ofrecemos atención psicológica y seguimiento constante del bienestar físico y emocional de cada niño apadrinado.",
      icon: "💚"
    },
    {
      title: "Desarrollo Personal",
      description: "Organizamos actividades recreativas, paseos educativos y programas de motivación que enriquecen la experiencia de nuestros niños.",
      icon: "🎯"
    },
    {
      title: "Construcción de Futuro",
      description: "Acompañamos a los niños en su camino hacia la profesionalización y el desarrollo de una vida plena y productiva.",
      icon: "🌟"
    }
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] font-['Poppins']">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6">
        <Breadcrumb items={[{ label: "Impacto" }]} />
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-yellow-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1E3A5F] mb-4">
              Nuestro Impacto en Vidas Reales
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Cada niño apadrinado es una historia de transformación. Conoce cómo la Fundación Huahuacuna ha cambiado vidas durante más de dos décadas.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-6 shadow-sm min-w-[180px] hover:shadow-md transition-shadow">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-4xl font-bold text-[#1E3A5F] mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonio Principal */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1E3A5F] mb-4">Historia de Transformación</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Un testimonio real de alguien que fue apadrinado y hoy es un profesional sirviendo a Colombia
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Imagen */}
            <div className="md:w-2/5 relative h-96 md:h-auto bg-gradient-to-br from-[#1E3A5F] to-[#152D47] flex items-center justify-center">
              <div className="text-center text-white p-8">
                <div className="w-32 h-32 rounded-full bg-[#FDD835] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-16 h-16 text-[#1E3A5F]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">{testimonial.name}</h3>
                <p className="text-gray-300 text-sm mb-1">{testimonial.age} años</p>
                <p className="text-[#FDD835] font-semibold text-sm">{testimonial.profession}</p>
                <p className="text-gray-300 text-sm mt-2">📍 {testimonial.location}</p>
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

      {/* Áreas de Impacto */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1E3A5F] mb-4">Cómo Generamos Impacto</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestro enfoque integral abarca todos los aspectos del desarrollo de un niño
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {impactAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{area.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">{area.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{area.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia Completa */}
      <section id="historia-completa" className="py-16 max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-[#1E3A5F] mb-6 text-center">
            Historia Completa de Transformación
          </h2>
          
          <div className="prose prose-lg max-w-none">
            {testimonial.fullStory.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 p-6 bg-yellow-50 rounded-xl border-l-4 border-[#FDD835]">
            <p className="text-gray-700 italic">
              "Siempre voy a estar agradecido con Lina, con Clarena, con Mayra, con Ángela. La forma en la que nos trataron, la forma en la que nos ayudaron... realmente hicieron un trabajo excepcional."
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-br from-[#1E3A5F] to-[#152D47] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sé Parte de Más Historias de Éxito
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Tu apoyo puede cambiar la vida de un niño y crear historias de transformación como esta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apadrinar"
              className="inline-block px-8 py-4 rounded-full bg-[#FDD835] text-[#1E3A5F] font-semibold hover:bg-[#FBC02D] transition-colors shadow-lg hover:shadow-xl"
            >
              Apadrinar un Niño
            </Link>
            <Link
              href="/donaciones"
              className="inline-block px-8 py-4 rounded-full border-2 border-[#FDD835] text-[#FDD835] font-semibold hover:bg-[#FDD835] hover:text-[#1E3A5F] transition-colors"
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