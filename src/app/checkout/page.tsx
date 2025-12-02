/**
 * Página de Checkout con PayU
 * Ruta: /checkout
 * 
 * Formulario completo para procesar pagos con PayU Latam
 */

"use client";

import { useState, FormEvent } from 'react';
import { getTestCards } from '@/lib/payu';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  documentType: 'CC' | 'CE' | 'NIT' | 'TI' | 'PP' | 'DNI';
  documentNumber: string;
  amount: string;
  description: string;
  currency: 'COP' | 'USD';
}

// interface PayUFormData {
//   merchantId: string;
//   accountId: string;
//   description: string;
//   referenceCode: string;
//   amount: string;
//   tax: string;
//   taxReturnBase: string;
//   currency: string;
//   signature: string;
//   test: string;
//   buyerEmail: string;
//   buyerFullName: string;
//   telephone: string;
//   responseUrl: string;
//   confirmationUrl: string;
//   extra1?: string;
//   extra2?: string;
// }

export default function CheckoutPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    documentType: 'CC',
    documentNumber: '',
    amount: '',
    description: 'Donación a Fundación Huahuacuna',
    currency: 'COP',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTestCards, setShowTestCards] = useState(false);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  // Manejar submit del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validaciones básicas
      if (!formData.fullName || !formData.email || !formData.phone || !formData.documentNumber) {
        throw new Error('Por favor completa todos los campos requeridos');
      }

      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount < 1000) {
        throw new Error('El monto mínimo es $1.000 COP');
      }

      // Llamar a la API para preparar el pago
      const response = await fetch('/api/payu/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error al procesar el pago');
      }

      // Crear formulario oculto para enviar a PayU
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.payuUrl;
      form.style.display = 'none';

      // Agregar todos los campos necesarios
      Object.entries(data.formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      // Agregar form al documento y enviarlo
      document.body.appendChild(form);
      form.submit();

      // El usuario será redirigido a PayU...

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setIsLoading(false);
    }
  };

  // Auto-completar con datos de prueba
  const fillTestData = () => {
    setFormData({
      fullName: 'Juan Pérez González',
      email: 'test@ejemplo.com',
      phone: '3001234567',
      documentType: 'CC',
      documentNumber: '1234567890',
      amount: '50000',
      description: 'Donación de prueba',
      currency: 'COP',
    });
  };

  const testCards = getTestCards();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 font-['Poppins'] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1E3A5F] mb-2">
            Checkout - PayU
          </h1>
          <p className="text-gray-600">
            Completa el formulario para procesar tu pago de forma segura
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <form onSubmit={handleSubmit}>
                {/* Sección: Datos Personales */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#1E3A5F] mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Datos Personales
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nombre Completo */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre Completo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Juan Pérez González"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent text-gray-900"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Correo Electrónico <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="correo@ejemplo.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent text-gray-900"
                      />
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Teléfono <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="3001234567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent text-gray-900"
                      />
                    </div>

                    {/* Tipo de Documento */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tipo de Documento <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="documentType"
                        required
                        value={formData.documentType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent text-gray-900"
                      >
                        <option value="CC">Cédula de Ciudadanía (CC)</option>
                        <option value="CE">Cédula de Extranjería (CE)</option>
                        <option value="NIT">NIT</option>
                        <option value="TI">Tarjeta de Identidad (TI)</option>
                        <option value="PP">Pasaporte (PP)</option>
                        <option value="DNI">DNI</option>
                      </select>
                    </div>

                    {/* Número de Documento */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Número de Documento <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="documentNumber"
                        required
                        value={formData.documentNumber}
                        onChange={handleChange}
                        placeholder="1234567890"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Sección: Datos del Pago */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#1E3A5F] mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Información del Pago
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Monto */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Monto <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                          $
                        </span>
                        <input
                          type="number"
                          name="amount"
                          required
                          min="1000"
                          step="100"
                          value={formData.amount}
                          onChange={handleChange}
                          placeholder="50000"
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent text-gray-900"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Monto mínimo: $1.000 COP</p>
                    </div>

                    {/* Moneda */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Moneda <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="currency"
                        required
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent text-gray-900"
                      >
                        <option value="COP">COP - Peso Colombiano</option>
                        <option value="USD">USD - Dólar Americano</option>
                      </select>
                    </div>

                    {/* Descripción */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descripción del Pago
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Describe el concepto del pago..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent resize-none text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Botones de Acción */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-linear-to-r from-[#FDD835] to-[#FBC02D] text-[#1E3A5F] font-bold py-4 px-8 rounded-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>PAGAR CON PAYU</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={fillTestData}
                    className="sm:w-auto px-6 py-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Llenar Datos de Prueba
                  </button>
                </div>

                {/* Indicador de Seguridad */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="font-medium">Pago 100% seguro</span>
                  <span className="text-gray-400">|</span>
                  <span>Encriptación SSL 256 bits</span>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar con Información */}
          <div className="space-y-6">
            {/* Resumen del Pago */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-4">
                Resumen del Pago
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Monto:</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${formData.amount ? parseFloat(formData.amount).toLocaleString('es-CO') : '0'} {formData.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">IVA (0%):</span>
                  <span className="text-lg font-semibold text-gray-900">$0</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-bold text-gray-700">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${formData.amount ? parseFloat(formData.amount).toLocaleString('es-CO') : '0'} {formData.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Métodos de Pago Aceptados */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4">
                Métodos de Pago
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-xl">💳</span>
                  <span>Tarjetas de crédito/débito</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-xl">🏦</span>
                  <span>PSE (Débito bancario)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-xl">💵</span>
                  <span>Efectivo (Baloto, Efecty)</span>
                </div>
              </div>
            </div>

            {/* Tarjetas de Prueba */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <button
                onClick={() => setShowTestCards(!showTestCards)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-bold text-[#1E3A5F]">
                  🧪 Tarjetas de Prueba
                </h3>
                <svg 
                  className={`w-5 h-5 transition-transform ${showTestCards ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showTestCards && (
                <div className="mt-4 space-y-3">
                  {testCards.slice(0, 3).map((card, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg text-xs">
                      <div className="font-semibold text-gray-900 mb-1">{card.brand}</div>
                      <div className="font-mono text-gray-700">{card.number}</div>
                      <div className="text-gray-600 mt-1">CVV: {card.cvv} | Exp: {card.expiryDate}</div>
                      <div className={`mt-1 text-xs font-medium ${
                        card.expectedResult === 'approved' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {card.expectedResult === 'approved' ? '✅ Aprobada' : '❌ Rechazada'}
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-gray-500 mt-2">
                    * Estas tarjetas solo funcionan en modo de prueba de PayU
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}