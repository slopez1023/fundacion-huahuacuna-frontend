/**
 * Footer Component
 * 
 * Footer profesional para módulos públicos de la aplicación.
 * Incluye información de contacto, redes sociales y ubicación.
 * 
 * @author Fundación Huahuacuna
 * @version 1.0
 */

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#1E3A5F] to-[#152D47] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="Fundación Huahuacuna" 
                width={56} 
                height={56}
                className="rounded-full bg-white p-1"
              />
              <div>
                <h3 className="font-bold text-lg">Fundación Huahuacuna</h3>
                <p className="text-sm text-gray-300">Conectando corazones</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Transformando vidas a través del apadrinamiento y apoyo integral a niños en situación de vulnerabilidad.
            </p>
          </div>

          {/* Contáctenos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-[#FDD835] mb-4">Contáctenos</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#FDD835] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-300">Barrio Uribe</p>
                  <p className="text-sm text-gray-300">Carrera 13 27-34</p>
                  <p className="text-sm text-gray-300">Armenia, Quindío</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#FDD835]" />
                <a 
                  href="tel:+573122570141" 
                  className="text-sm text-gray-300 hover:text-[#FDD835] transition-colors"
                >
                  +57 312 257 01 41
                </a>
              </div>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-[#FDD835] mb-4">Enlaces Rápidos</h3>
            <nav className="flex flex-col gap-2">
              <Link 
                href="/apadrinar" 
                className="text-sm text-gray-300 hover:text-[#FDD835] transition-colors"
              >
                → Apadrinar un niño
              </Link>
              <Link 
                href="/voluntariado" 
                className="text-sm text-gray-300 hover:text-[#FDD835] transition-colors"
              >
                → Ser voluntario
              </Link>
              <Link 
                href="/proyectos" 
                className="text-sm text-gray-300 hover:text-[#FDD835] transition-colors"
              >
                → Nuestros proyectos
              </Link>
              <Link 
                href="/donaciones" 
                className="text-sm text-gray-300 hover:text-[#FDD835] transition-colors"
              >
                → Hacer una donación
              </Link>
            </nav>
          </div>

          {/* Nuestras redes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-[#FDD835] mb-4">Nuestras Redes</h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.facebook.com/FundacionHuahuacuna"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-300 hover:text-[#FDD835] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FDD835] transition-colors">
                  <Facebook className="w-5 h-5" />
                </div>
                <span>Facebook</span>
              </a>
              
              <a
                href="https://www.instagram.com/huahuacuna?igsh=b3AyNXlrZDl1dGwy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-300 hover:text-[#FDD835] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FDD835] transition-colors">
                  <Instagram className="w-5 h-5" />
                </div>
                <span>Instagram</span>
              </a>
              
              <a
                href="https://vm.tiktok.com/ZSH7KvNDdX7NY-SDTsk/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-300 hover:text-[#FDD835] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FDD835] transition-colors">
                  <svg 
                    className="w-5 h-5" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </div>
                <span>TikTok</span>
              </a>
            </div>

            {/* Botón de ubicación */}
            <a
              href="https://maps.app.goo.gl/Lz5w59j3ghVNCkX27"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-[#FDD835] text-[#1E3A5F] font-semibold text-sm hover:bg-[#FBC02D] transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Ver ubicación
            </a>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Fundación Huahuacuna. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/politicas" className="hover:text-[#FDD835] transition-colors">
                Políticas de privacidad
              </Link>
              <Link href="/terminos" className="hover:text-[#FDD835] transition-colors">
                Términos de uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}