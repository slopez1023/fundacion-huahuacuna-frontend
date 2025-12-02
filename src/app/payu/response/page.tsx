/**
 * Página de Respuesta de PayU
 * Ruta: /payu/response
 * 
 * Esta página recibe la respuesta de PayU después del pago
 * y muestra el resultado al usuario
 */


"use client";

import * as React from 'react';

import { useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  getPayUConfig,
  validateResponseSignature,
  getTransactionStatus,
  type PayUResponse,
} from '@/lib/payu';

function PayUResponseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Calcular todos los datos derivados usando useMemo
  const { transactionData, status, isValidSignature } = useMemo(() => {
    // Extraer todos los parámetros de la URL
    const statePol = (searchParams.get('polTransactionState') || searchParams.get('transactionState') || '') as string;
    const response: Partial<PayUResponse> = {
      merchant_id: searchParams.get('merchantId') || '',
      state_pol: (statePol === '4' || statePol === '5' || statePol === '6' || statePol === '7' || statePol === '104') ? statePol : undefined,
      response_code_pol: searchParams.get('polResponseCode') || '',
      reference_sale: searchParams.get('referenceCode') || '',
      reference_pol: searchParams.get('reference_pol') || searchParams.get('transactionId') || '',
      sign: searchParams.get('signature') || '',
      extra1: searchParams.get('extra1') || undefined,
      extra2: searchParams.get('extra2') || undefined,
      extra3: searchParams.get('extra3') || undefined,
      payment_method: searchParams.get('lapPaymentMethod') || searchParams.get('paymentMethod') || '',
      payment_method_type: searchParams.get('lapPaymentMethodType') || '',
      value: searchParams.get('TX_VALUE') || '',
      tax: searchParams.get('TX_TAX') || undefined,
      transaction_date: searchParams.get('processingDate') || new Date().toISOString(),
      currency: searchParams.get('currency') || 'COP',
      email_buyer: searchParams.get('buyerEmail') || '',
      description: searchParams.get('description') || '',
      transaction_id: searchParams.get('transactionId') || '',
      authorization_code: searchParams.get('authorizationCode') || undefined,
      response_message_pol: searchParams.get('message') || undefined,
    };

    // Validar firma de seguridad
    let valid = false;
    if (response.merchant_id && response.sign && response.state_pol) {
      try {
        const config = getPayUConfig();
        valid = validateResponseSignature(response as PayUResponse, config.apiKey);
        
        if (!valid) {
          console.warn('⚠️ Firma inválida detectada');
        }
      } catch (error) {
        console.error('Error validando firma:', error);
      }
    }

    // Obtener información del estado
    const statusInfo = response.state_pol ? getTransactionStatus(response.state_pol) : null;

    return {
      transactionData: response,
      status: statusInfo,
      isValidSignature: valid,
    };
  }, [searchParams]);

  // No hay datos de transacción
  if (!transactionData || !status) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No se encontró información
          </h2>
          <p className="text-gray-600 mb-6">
            No pudimos obtener los detalles de la transacción.
          </p>
          <button
            onClick={() => router.push('/checkout')}
            className="px-6 py-3 bg-[#FDD835] text-[#1E3A5F] font-bold rounded-lg hover:bg-[#FDD835]/90 transition-all"
          >
            Volver al Checkout
          </button>
        </div>
      </div>
    );
  }

  // Colores según el estado
  const colorMap: Record<string, string> = {
    green: 'from-green-600 to-green-500',
    red: 'from-red-600 to-red-500',
    yellow: 'from-yellow-500 to-yellow-400',
    blue: 'from-blue-600 to-blue-500',
    gray: 'from-gray-600 to-gray-500',
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 font-['Poppins'] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header con Estado */}
        <div className={`bg-linear-to-r ${colorMap[status.color]} rounded-t-3xl p-8 text-center text-white`}>
          <div className="text-6xl mb-4">{status.icon}</div>
          <h1 className="text-4xl font-bold mb-2">{status.title}</h1>
          <p className="text-xl opacity-90">{status.message}</p>
        </div>

        {/* Contenido Principal */}
        <div className="bg-white rounded-b-3xl shadow-2xl p-8">
          {/* Alerta de Seguridad */}
          {!isValidSignature && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-semibold text-red-800 mb-1">Advertencia de Seguridad</p>
                  <p className="text-sm text-red-700">
                    La firma de esta transacción no pudo ser validada. Por favor contacta con soporte.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Detalles de la Transacción */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Detalles de la Transacción
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Referencia de Pago */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Código de Referencia</p>
                <p className="text-lg font-mono font-bold text-gray-900">
                  {transactionData.reference_sale}
                </p>
              </div>

              {/* ID de Transacción */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">ID de Transacción</p>
                <p className="text-lg font-mono font-bold text-gray-900">
                  {transactionData.transaction_id || transactionData.reference_pol}
                </p>
              </div>

              {/* Monto */}
              <div className="p-4 bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Monto Pagado</p>
                <p className="text-3xl font-bold text-green-600">
                  ${parseFloat(transactionData.value || '0').toLocaleString('es-CO')} {transactionData.currency}
                </p>
              </div>

              {/* Método de Pago */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Método de Pago</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {transactionData.payment_method?.replace(/_/g, ' ').toLowerCase() || 'No especificado'}
                </p>
              </div>

              {/* Fecha */}
              {transactionData.transaction_date && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Fecha de Transacción</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(transactionData.transaction_date).toLocaleString('es-CO', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              )}

              {/* Código de Autorización */}
              {transactionData.authorization_code && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Código de Autorización</p>
                  <p className="text-lg font-mono font-bold text-gray-900">
                    {transactionData.authorization_code}
                  </p>
                </div>
              )}

              {/* Email del Comprador */}
              {transactionData.email_buyer && (
                <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Email de Confirmación</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {transactionData.email_buyer}
                  </p>
                </div>
              )}

              {/* Descripción */}
              {transactionData.description && (
                <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Descripción</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {transactionData.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Mensaje Adicional según Estado */}
          {status.status === 'approved' && (
            <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-semibold text-green-900 mb-1">📧 Confirmación Enviada</p>
                  <p className="text-sm text-green-800">
                    Hemos enviado un comprobante de pago a tu correo electrónico con todos los detalles de la transacción.
                  </p>
                </div>
              </div>
            </div>
          )}

          {status.status === 'pending' && (
            <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-blue-900 mb-1">⏰ Pago en Proceso</p>
                  <p className="text-sm text-blue-800">
                    Tu pago está siendo verificado por el banco. Recibirás una notificación cuando se complete el proceso, 
                    lo cual puede tomar entre 1 y 3 días hábiles.
                  </p>
                </div>
              </div>
            </div>
          )}

          {status.status === 'declined' && (
            <div className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-red-900 mb-2">Posibles Razones del Rechazo:</p>
                  <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                    <li>Fondos insuficientes en la cuenta</li>
                    <li>Datos de la tarjeta incorrectos</li>
                    <li>Límite de transacciones excedido</li>
                    <li>Tarjeta bloqueada o vencida</li>
                    <li>Rechazo del banco emisor</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {(status.status === 'declined' || status.status === 'expired' || status.status === 'error') && (
              <button
                onClick={() => router.push('/checkout')}
                className="px-8 py-3 bg-[#FDD835] text-[#1E3A5F] font-bold rounded-lg hover:bg-[#FDD835]/90 transition-all shadow-lg hover:shadow-xl"
              >
                Intentar Nuevamente
              </button>
            )}
            
            <button
              onClick={() => router.push('/donaciones')}
              className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
            >
              Volver al Inicio
            </button>

            <button
              onClick={() => window.print()}
              className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all flex items-center gap-2 justify-center"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir Comprobante
            </button>
          </div>

          {/* Footer con información de soporte */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>¿Tienes preguntas sobre tu transacción?</p>
            <p className="mt-1">
              Contacta con soporte: 
              <a href="mailto:soporte@fundacionhuahuacuna.org" className="text-blue-600 hover:underline ml-1">
                soporte@fundacionhuahuacuna.org
              </a>
            </p>
            <p className="mt-4 text-xs text-gray-500">
              Código de Referencia: <span className="font-mono">{transactionData.reference_sale}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal con Suspense
export default function PayUResponsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FDD835]"></div>
      </div>
    }>
      <PayUResponseContent />
    </Suspense>
  );
}