/**
 * MapSection Component
 * 
 * Sección de ubicación con mapa embebido de Google Maps
 * e información de contacto.
 * 
 * @author Fundación Huahuacuna
 * @version 1.1 (CORREGIDO - Armenia, Quindío)
 */

import { MapPin, Phone, Clock } from "lucide-react";

export default function MapSection() {
  return (
    <section className="mt-16 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* Información de contacto */}
        <div className="p-8 lg:p-12 bg-gradient-to-br from-[#1E3A5F] to-[#152D47] text-white">
          <h2 className="text-3xl font-bold mb-6">Visítanos</h2>
          <p className="text-gray-300 mb-8">
            Te esperamos en nuestra sede para conocer más sobre nuestros programas y cómo puedes ser parte del cambio.
          </p>

          <div className="space-y-6">
            {/* Dirección */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FDD835] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#1E3A5F]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Dirección</h3>
                <p className="text-gray-300">Cra. 13 #27-34</p>
                <p className="text-gray-300">Armenia, Quindío</p>
                <p className="text-gray-300">Colombia</p>
              </div>
            </div>

            {/* Teléfono */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FDD835] flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-[#1E3A5F]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Teléfono</h3>
                <a 
                  href="tel:+573122570141" 
                  className="text-gray-300 hover:text-[#FDD835] transition-colors"
                >
                  +57 312 257 01 41
                </a>
              </div>
            </div>

            {/* Horario */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FDD835] flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-[#1E3A5F]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Horario de atención</h3>
                <p className="text-gray-300">Lunes a Viernes: 8:00 AM - 5:00 PM</p>
                <p className="text-gray-300">Sábados: 9:00 AM - 1:00 PM</p>
              </div>
            </div>
          </div>

          {/* Botón de Google Maps */}
          <a
            href="https://www.google.com/maps/search/?api=1&query=Cra.+13+%2327-34,+Armenia,+Quindío,+Colombia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-[#FDD835] text-[#1E3A5F] font-semibold hover:bg-[#FBC02D] transition-colors shadow-md hover:shadow-lg transition-all"
          >
            <MapPin className="w-5 h-5" />
            Abrir en Google Maps
          </a>
        </div>

        {/* Mapa embebido */}
        <div className="h-[400px] lg:h-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.6789012345678!2d-75.67890123456789!3d4.533333333333333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38f5c1b1234567%3A0x1234567890abcdef!2sCra.%2013%20%2327-34%2C%20Armenia%2C%20Quind%C3%ADo!5e0!3m2!1ses!2sco!4v1234567890123!5m2!1ses!2sco"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Fundación Huahuacuna - Armenia, Quindío"
            className="grayscale hover:grayscale-0 transition-all duration-300"
          />
        </div>
      </div>
    </section>
  );
}