/**
 * Página de Donaciones - Completa
 * @author Fundación Huahuacuna
 * @version 5.0
 */

"use client";

import { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function DonacionesPage() {
  const [activeTab, setActiveTab] = useState<'monetary' | 'in-kind'>('monetary');
  const [isLoading, setIsLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [donationDetails, setDonationDetails] = useState<any>(null);
  
  const [monetaryForm, setMonetaryForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    amount: '',
    paymentMethod: 'online',
  });

  const [inKindForm, setInKindForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    itemType: '',
    description: '',
  });

  const handleMonetarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorName: monetaryForm.fullName,
          donorEmail: monetaryForm.email,
          donorPhone: monetaryForm.phone,
          amount: parseFloat(monetaryForm.amount),
          donationType: 'monetaria',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setDonationDetails({
          name: monetaryForm.fullName,
          type: 'monetary',
          amount: monetaryForm.amount,
          id: data.donation?.id,
          certificateNumber: data.donation?.certificateNumber,
          certificateInfo: data.donation?.certificateInfo,
        });
        
        setShowThankYou(true);
        
        setMonetaryForm({
          fullName: '',
          email: '',
          phone: '',
          amount: '',
          paymentMethod: 'online',
        });
      } else {
        alert(data.error || 'Error al procesar la donación');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInKindSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorName: inKindForm.fullName,
          donorEmail: inKindForm.email,
          donorPhone: inKindForm.phone,
          donationType: 'especie',
          inKindType: inKindForm.itemType,
          inKindDescription: inKindForm.description,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setDonationDetails({
          name: inKindForm.fullName,
          type: 'in-kind',
          itemType: inKindForm.itemType,
          id: data.donation?.id,
          certificateNumber: data.donation?.certificateNumber,
          certificateInfo: data.donation?.certificateInfo,
        });
        
        setShowThankYou(true);
        
        setInKindForm({
          fullName: '',
          email: '',
          phone: '',
          itemType: '',
          description: '',
        });
      } else {
        alert(data.error || 'Error al procesar la donación');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseThankYou = () => {
    setShowThankYou(false);
    setDonationDetails(null);
  };

  // Modal de agradecimiento
  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gray-50 font-['Poppins'] flex flex-col">
        <Navbar />
        
        <div className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-[#1E3A5F] via-[#2C5F7F] to-[#1E3A5F] p-8 text-center">
              <div className="mb-4">
                <div className="w-24 h-24 bg-[#FDD835] rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-12 h-12 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                ¡Gracias por tu Generosidad!
              </h1>
              <p className="text-xl text-white/90">
                {donationDetails?.name}
              </p>
            </div>

            {/* Contenido */}
            <div className="p-8 md:p-12">
              <div className="text-center mb-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  En nombre de todos los niños, niñas y familias que apoyamos en la 
                  <strong className="text-[#1E3A5F]"> Fundación Huahuacuna</strong>, 
                  queremos expresar nuestro más sincero agradecimiento por tu {' '}
                  {donationDetails?.type === 'monetary' ? 'donación monetaria' : 'donación en especie'}.
                </p>

                {donationDetails?.type === 'monetary' && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
                    <p className="text-sm text-gray-600 mb-2">Monto donado</p>
                    <p className="text-4xl font-bold text-green-600">
                      ${parseFloat(donationDetails.amount).toLocaleString('es-CO')} COP
                    </p>
                  </div>
                )}

                {donationDetails?.type === 'in-kind' && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 mb-6">
                    <p className="text-sm text-gray-600 mb-2">Tipo de donación</p>
                    <p className="text-2xl font-bold text-purple-600 capitalize">
                      {donationDetails.itemType}
                    </p>
                  </div>
                )}

                <div className="bg-yellow-50 border-l-4 border-[#FDD835] p-6 rounded-lg mb-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-[#FDD835] flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Confirmación enviada
                      </p>
                      <p className="text-sm text-gray-700">
                        Hemos enviado un correo electrónico con el comprobante de tu donación 
                        y los detalles de la transacción. Por favor revisa tu bandeja de entrada.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información del certificado */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-blue-900 mb-2">
                        📜 Certificado de Donación
                      </p>
                      {donationDetails?.certificateNumber && (
                        <p className="text-xs text-blue-700 mb-2">
                          Número de certificado: <span className="font-mono font-semibold">{donationDetails.certificateNumber}</span>
                        </p>
                      )}
                      <p className="text-sm text-blue-800 leading-relaxed">
                        <strong>Importante:</strong> Tu certificado de donación será enviado por correo electrónico 
                        el <strong>1 de enero del año {new Date().getFullYear() + 1}</strong>. Este documento es válido 
                        para efectos tributarios y contiene todos los detalles de tu contribución.
                      </p>
                      <p className="text-xs text-blue-600 mt-2">
                        El certificado será enviado automáticamente a: <strong>{donationDetails?.name}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-xs font-semibold text-gray-700">Educación de calidad</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <p className="text-xs font-semibold text-gray-700">Alimentación nutritiva</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 text-center">
                    <svg className="w-8 h-8 text-red-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="text-xs font-semibold text-gray-700">Bienestar familiar</p>
                  </div>
                </div>

                <p className="text-base text-gray-700 mb-8">
                  Tu aporte nos permite seguir trabajando día a día para construir 
                  un futuro mejor. Cada contribución, sin importar su tamaño, 
                  hace una diferencia real en la vida de nuestra comunidad.
                </p>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleCloseThankYou}
                  className="px-8 py-3 bg-[#FDD835] text-[#1E3A5F] font-bold rounded-lg hover:bg-[#FDD835]/90 transition-all shadow-lg hover:shadow-xl"
                >
                  Hacer otra donación
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                >
                  Volver al inicio
                </button>
              </div>

              {/* ID de referencia */}
              {donationDetails?.id && (
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500">
                    ID de referencia: <span className="font-mono font-semibold">#{donationDetails.id}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Redes sociales */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Síguenos en nuestras redes sociales y conoce más sobre nuestro trabajo
            </p>
            <div className="flex justify-center gap-4">
              <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all">
                <svg className="w-5 h-5 text-[#1E3A5F]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all">
                <svg className="w-5 h-5 text-[#1E3A5F]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Formulario normal
  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins'] flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E3A5F] mb-4">
            Tu donación transforma vidas
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Puedes realizar una donación monetaria de forma segura y contribuir a brindar
            servicios para apoyar el desarrollo de nuestros programas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda: Formularios con Tabs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Tabs Header */}
              <div className="flex border-b-2 border-gray-200">
                <button
                  onClick={() => setActiveTab('monetary')}
                  disabled={isLoading}
                  className={`flex-1 px-6 py-4 font-semibold text-base transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                    activeTab === 'monetary'
                      ? 'bg-[#FDD835] text-[#1E3A5F]'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Donación monetaria
                </button>
                <button
                  onClick={() => setActiveTab('in-kind')}
                  disabled={isLoading}
                  className={`flex-1 px-6 py-4 font-semibold text-base transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                    activeTab === 'in-kind'
                      ? 'bg-[#FDD835] text-[#1E3A5F]'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  Donación en especie
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {/* Donación Monetaria */}
                {activeTab === 'monetary' && (
                  <form onSubmit={handleMonetarySubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#1E3A5F] mb-6">
                      Formulario de Donación
                    </h2>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre completo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isLoading}
                        value={monetaryForm.fullName}
                        onChange={(e) => setMonetaryForm({...monetaryForm, fullName: e.target.value})}
                        placeholder="Juan Pérez"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent text-gray-900 disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Correo electrónico <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        disabled={isLoading}
                        value={monetaryForm.email}
                        onChange={(e) => setMonetaryForm({...monetaryForm, email: e.target.value})}
                        placeholder="correo@ejemplo.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent text-gray-900 disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Teléfono <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        disabled={isLoading}
                        value={monetaryForm.phone}
                        onChange={(e) => setMonetaryForm({...monetaryForm, phone: e.target.value})}
                        placeholder="+57 300 123 4567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent text-gray-900 disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Monto a donar <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                          $
                        </span>
                        <input
                          type="number"
                          required
                          disabled={isLoading}
                          min="1000"
                          value={monetaryForm.amount}
                          onChange={(e) => setMonetaryForm({...monetaryForm, amount: e.target.value})}
                          placeholder="50.000"
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent text-gray-900 disabled:bg-gray-100"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Monto mínimo: $1.000 COP</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Método de pago <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-3">
                        <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          monetaryForm.paymentMethod === 'online' 
                            ? 'border-[#FDD835] bg-yellow-50' 
                            : 'border-gray-200 hover:border-[#FDD835]'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="online"
                            disabled={isLoading}
                            checked={monetaryForm.paymentMethod === 'online'}
                            onChange={(e) => setMonetaryForm({...monetaryForm, paymentMethod: e.target.value})}
                            className="w-4 h-4 text-[#FDD835] focus:ring-[#FDD835]"
                          />
                          <div className="ml-3 flex items-center gap-3 flex-1">
                            <svg className="w-6 h-6 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <div>
                              <span className="font-semibold text-gray-900 block">Pago en línea</span>
                              <p className="text-sm text-gray-600">Tarjeta de crédito o débito</p>
                            </div>
                          </div>
                        </label>

                        <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          monetaryForm.paymentMethod === 'transfer' 
                            ? 'border-[#FDD835] bg-yellow-50' 
                            : 'border-gray-200 hover:border-[#FDD835]'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="transfer"
                            disabled={isLoading}
                            checked={monetaryForm.paymentMethod === 'transfer'}
                            onChange={(e) => setMonetaryForm({...monetaryForm, paymentMethod: e.target.value})}
                            className="w-4 h-4 text-[#FDD835] focus:ring-[#FDD835]"
                          />
                          <div className="ml-3 flex items-center gap-3 flex-1">
                            <svg className="w-6 h-6 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                            </svg>
                            <div>
                              <span className="font-semibold text-gray-900 block">Transferencia bancaria</span>
                              <p className="text-sm text-gray-600">Ver datos bancarios en el panel derecho</p>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#FDD835] text-[#1E3A5F] font-bold py-4 rounded-lg hover:bg-[#FDD835]/90 transition-all shadow-lg hover:shadow-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Procesando...
                        </>
                      ) : (
                        'REALIZAR DONACIÓN'
                      )}
                    </button>
                  </form>
                )}

                {/* Donación en Especie */}
                {activeTab === 'in-kind' && (
                  <form onSubmit={handleInKindSubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#1E3A5F] mb-6">
                      Formulario de Donación en Especie
                    </h2>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre completo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isLoading}
                        value={inKindForm.fullName}
                        onChange={(e) => setInKindForm({...inKindForm, fullName: e.target.value})}
                        placeholder="Juan Pérez"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent text-gray-900 disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Correo electrónico <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        disabled={isLoading}
                        value={inKindForm.email}
                        onChange={(e) => setInKindForm({...inKindForm, email: e.target.value})}
                        placeholder="correo@ejemplo.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent text-gray-900 disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Teléfono <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        disabled={isLoading}
                        value={inKindForm.phone}
                        onChange={(e) => setInKindForm({...inKindForm, phone: e.target.value})}
                        placeholder="+57 300 123 4567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent text-gray-900 disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tipo de artículo <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        disabled={isLoading}
                        value={inKindForm.itemType}
                        onChange={(e) => setInKindForm({...inKindForm, itemType: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent text-gray-900 disabled:bg-gray-100"
                      >
                        <option value="">Selecciona un tipo</option>
                        <option value="ropa">Ropa y calzado</option>
                        <option value="alimentos">Alimentos no perecederos</option>
                        <option value="juguetes">Juguetes</option>
                        <option value="libros">Libros y útiles escolares</option>
                        <option value="electrodomesticos">Electrodomésticos</option>
                        <option value="muebles">Muebles</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descripción detallada <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        disabled={isLoading}
                        rows={4}
                        value={inKindForm.description}
                        onChange={(e) => setInKindForm({...inKindForm, description: e.target.value})}
                        placeholder="Describe los artículos que deseas donar, cantidad, estado, etc."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent resize-none text-gray-900 disabled:bg-gray-100"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#FDD835] text-[#1E3A5F] font-bold py-4 rounded-lg hover:bg-[#FDD835]/90 transition-all shadow-lg hover:shadow-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        'ENVIAR SOLICITUD'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Info Cards Dinámicas */}
          <div className="space-y-6">
            {activeTab === 'monetary' ? (
              <>
                {/* Card: Datos Bancarios */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#1E3A5F]">
                      Datos Bancarios
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    También puedes realizar tu donación por transferencia bancaria
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-sm font-semibold text-gray-700">Banco:</span>
                      <span className="text-sm text-gray-900 font-medium">Bancolombia</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-sm font-semibold text-gray-700">Tipo de cuenta:</span>
                      <span className="text-sm text-gray-900 font-medium">Ahorros</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-sm font-semibold text-gray-700">Número de cuenta:</span>
                      <span className="text-sm text-gray-900 font-mono font-bold">555-5000-47-55</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm font-semibold text-gray-700">Titular:</span>
                      <span className="text-sm text-gray-900 font-medium">Fundación Huahuacuna</span>
                    </div>
                  </div>
                  
                  <div className="mt-5 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex gap-2">
                      <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">Importante</p>
                        <p className="text-xs text-gray-700">
                          Envía el comprobante de pago a{' '}
                          <a href="mailto:donaciones@huahuacuna.org" className="text-blue-600 underline font-medium">
                            donaciones@huahuacuna.org
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card: Seguridad */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-green-900">
                      Donación Segura
                    </h3>
                  </div>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700">Transacciones encriptadas y seguras</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700">Certificado de donación por email</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700">Transparencia en el uso de fondos</span>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                {/* Card: ¿Qué es una donación en especie? */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#1E3A5F]">
                      ¿Qué es una donación en especie?
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    Son contribuciones de bienes materiales o artículos que pueden ser utilizados 
                    directamente por nuestra fundación para apoyar a las familias y comunidades 
                    que atendemos.
                  </p>
                  
                  <p className="text-sm text-gray-700 leading-relaxed">
                    A diferencia de las donaciones monetarias, estas donaciones nos permiten 
                    entregar directamente los artículos a quienes más los necesitan.
                  </p>
                </div>

                {/* Card: Artículos que aceptamos */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-purple-900">
                      Artículos que Aceptamos
                    </h3>
                  </div>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <span className="text-sm font-semibold text-gray-900 block">Ropa y calzado</span>
                        <span className="text-xs text-gray-600">En buen estado y limpios</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <span className="text-sm font-semibold text-gray-900 block">Alimentos no perecederos</span>
                        <span className="text-xs text-gray-600">Con fecha de vencimiento vigente</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <span className="text-sm font-semibold text-gray-900 block">Útiles escolares y libros</span>
                        <span className="text-xs text-gray-600">Nuevos o en excelente estado</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <span className="text-sm font-semibold text-gray-900 block">Juguetes</span>
                        <span className="text-xs text-gray-600">Limpios y en buen estado</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <span className="text-sm font-semibold text-gray-900 block">Electrodomésticos y muebles</span>
                        <span className="text-xs text-gray-600">Funcionales y en buen estado</span>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Card: Proceso de donación */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-[#1E3A5F]">
                      Proceso de Donación
                    </h3>
                  </div>
                  
                  <ol className="space-y-3">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#FDD835] rounded-full flex items-center justify-center text-xs font-bold text-[#1E3A5F]">
                        1
                      </span>
                      <span className="text-sm text-gray-700">Completa el formulario con los detalles</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#FDD835] rounded-full flex items-center justify-center text-xs font-bold text-[#1E3A5F]">
                        2
                      </span>
                      <span className="text-sm text-gray-700">Nuestro equipo te contactará en 24-48 horas</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#FDD835] rounded-full flex items-center justify-center text-xs font-bold text-[#1E3A5F]">
                        3
                      </span>
                      <span className="text-sm text-gray-700">Coordinaremos la recolección o entrega</span>
                    </li>
                  </ol>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer Profesional */}
      <Footer />
    </div>
  );
}