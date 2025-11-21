"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/src/components/ui/Navbar";
import Breadcrumb from "@/src/components/ui/Breadcrumb";
import Footer from "@/src/components/ui/Footer";

export default function ProjectsPage() {
  const projects = [
    {
      title: "Escuela de Música",
      description: "Hace más de tres años iniciamos este proyecto con la visión de que los niños, niñas y adolescentes tengan un uso positivo del tiempo libre. Pensamos en la música como una oportunidad de aprender habilidades nuevas, pero también como un arte u oficio con el cual puedan ganarse su sustento.",
      image: "/projects/music-english.jpg",
      status: "En curso",
      duration: "+3 años"
    },
    {
      title: "Escuela de Inglés",
      description: "Nace de la necesidad de que en Colombia se trabaje ardua y constantemente por la enseñanza-aprendizaje de un segundo idioma. Buscamos que cada niño o niña sea reconocido por hablar y entender el inglés en situaciones diarias con lenguaje correcto.",
      image: "/projects/music-english.jpg",
      status: "En curso",
      duration: "Permanente"
    },
    {
      title: "Refuerzo Académico",
      description: "Brindamos clases extras a los niños que por diversas situaciones no aprenden de igual manera a sus compañeros o se quedan atrasados. Nos enfocamos especialmente en matemáticas, español y ciencias, áreas donde presentan mayor dificultad.",
      image: "/projects/technical-education.jpg",
      status: "En curso",
      duration: "Permanente"
    },
    {
      title: "Talleres de Lectura Crítica",
      description: "Con la intención de que a los niños, niñas y adolescentes les guste leer y entrar en nuevos conocimientos. Los libros les ayudan a mejorar en español, capacidad de análisis, ortografía, memoria, redacción, además de nutrir su intelecto y ampliar su cultura.",
      image: "/projects/reading-workshop.jpg",
      status: "En curso",
      duration: "Permanente"
    },
    {
      title: "Talleres de Manejo de Emociones",
      description: "Estas charlas nacen de la necesidad de que los niños aprendan a ser más libres al reaccionar. Buscamos que puedan nombrar sus emociones y expresarlas sin dañar a otros, mejorando la situación o inconveniente que desató el conflicto.",
      image: "/projects/reading-workshop.jpg",
      status: "En curso",
      duration: "Permanente"
    }
  ];


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
    <main className="min-h-screen bg-[var(--background)] font-['Poppins']">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6">
        <Breadcrumb items={[{ label: "Proyectos" }]} />
      </div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-yellow-50 to-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#1E3A5F] mb-4">
              Transformando Vidas a Través de Proyectos Comunitarios
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Para seguir expandiendo nuestro impacto y alcanzar a más niños, la Fundación Huahuacuna desarrolla proyectos educativos y formativos que les permiten descubrir sus talentos, aprender nuevas habilidades y construir un futuro mejor.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-6 shadow-sm min-w-[200px]">
                <div className="text-4xl font-bold text-[#1E3A5F] mb-2">{stat.value}+</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestros Proyectos */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1E3A5F] mb-4">Proyectos y Actividades Representativos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conoce los programas que hacemos posibles para nuestros niños, niñas y adolescentes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-56">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 font-semibold">
                    {project.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-semibold">
                    {project.duration}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">{project.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Impacto de Nuestros Proyectos */}
      <section className="py-16 bg-gradient-to-br from-[#1E3A5F] to-[#152D47] text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">El Impacto de Nuestros Proyectos</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Cada proyecto está diseñado con un propósito claro: transformar vidas a través de la educación, el arte y el desarrollo personal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#FDD835] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Educación Integral</h3>
              <p className="text-gray-300 text-sm">
                Fortalecemos las habilidades académicas y cognitivas de cada niño
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#FDD835] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Desarrollo de Talentos</h3>
              <p className="text-gray-300 text-sm">
                Descubrimos y potenciamos las habilidades artísticas y creativas
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#FDD835] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Bienestar Emocional</h3>
              <p className="text-gray-300 text-sm">
                Promovemos la salud mental y el manejo adecuado de las emociones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Actividades */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1E3A5F] mb-4">Actividades Diarias</h2>
          <p className="text-gray-600">Nuestro compromiso constante con el desarrollo integral</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-56">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-[#1E3A5F] mb-3 text-lg">{activity.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-50 to-yellow-100/70">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#1E3A5F] mb-4">¿Quieres Apoyar Nuestros Proyectos?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Únete a nosotros en nuestra misión de transformar vidas. Tu apoyo hace la diferencia en la educación, el desarrollo artístico y el bienestar emocional de nuestros niños.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apadrinar"
              className="inline-block px-8 py-3 rounded-full bg-[#FDD835] text-[#1E3A5F] font-semibold hover:bg-[#FBC02D] transition-colors shadow-md hover:shadow-lg"
            >
              Apadrinar un Niño
            </Link>
            <Link
              href="/voluntariado"
              className="inline-block px-8 py-3 rounded-full border-2 border-[#1E3A5F] text-[#1E3A5F] font-semibold hover:bg-[#1E3A5F] hover:text-white transition-colors"
            >
              Ser Voluntario
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}