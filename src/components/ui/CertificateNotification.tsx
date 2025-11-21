import { CheckIcon } from '@heroicons/react/24/outline';

interface CertificateNotificationProps {
  certificateNumber?: string;
  year?: number;
}

export default function CertificateNotification({ certificateNumber, year }: CertificateNotificationProps) {
  const nextYear = year || new Date().getFullYear() + 1;
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            📜 Certificado de Donación
          </h3>
          
          {certificateNumber && (
            <div className="bg-white/50 rounded-lg p-3 mb-3">
              <p className="text-xs text-blue-700 mb-1">Número de certificado asignado:</p>
              <p className="text-sm font-mono font-bold text-blue-900">{certificateNumber}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>¿Cuándo recibirás tu certificado?</strong>
            </p>
            <p className="text-sm text-blue-700">
              Tu certificado de donación será enviado automáticamente por correo electrónico 
              el <strong>1 de enero de {nextYear}</strong>.
            </p>
          </div>
          
          <div className="mt-4 bg-white/50 rounded-lg p-4">
            <p className="text-xs font-semibold text-blue-900 mb-2">¿Qué incluye el certificado?</p>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2 text-xs text-blue-700">
                <CheckIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Datos completos de tu donación</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-blue-700">
                <CheckIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Número de certificado único</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-blue-700">
                <CheckIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Documento válido para efectos tributarios</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-blue-700">
                <CheckIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Formato PDF oficial</span>
              </li>
            </ul>
          </div>
          
          <p className="text-xs text-blue-600 mt-3 italic">
            💡 Guarda este número de certificado para futuras referencias.
          </p>
        </div>
      </div>
    </div>
  );
}