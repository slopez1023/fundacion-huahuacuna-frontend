/**
 * API Route: Procesar Pago con PayU
 * Ruta: /api/payu/process
 * Método: POST
 * 
 * Este endpoint prepara los datos para enviar a PayU y puede simular
 * el procesamiento en modo de desarrollo.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getPayUConfig,
  preparePayUFormData,
  generateReferenceCode,
  validateBuyerInfo,
  validateAmount,
  logTransaction,
  logError,
  type PaymentData,
} from '@/lib/payu';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    logTransaction('Iniciando proceso de pago', { body });

    // ========================================================================
    // PASO 1: Extraer y validar datos del request
    // ========================================================================
    
    const {
      fullName,
      email,
      phone,
      documentType,
      documentNumber,
      amount,
      description,
      currency = 'COP',
    } = body;

    // Validar que todos los campos requeridos estén presentes
    if (!fullName || !email || !phone || !documentType || !documentNumber || !amount || !description) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Faltan campos requeridos',
          required: ['fullName', 'email', 'phone', 'documentType', 'documentNumber', 'amount', 'description'],
        },
        { status: 400 }
      );
    }

    // ========================================================================
    // PASO 2: Validar datos del comprador
    // ========================================================================
    
    const buyerValidation = validateBuyerInfo({
      fullName,
      email,
      phone,
      documentType,
      documentNumber,
    });

    if (!buyerValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos del comprador inválidos',
          details: buyerValidation.errors,
        },
        { status: 400 }
      );
    }

    // ========================================================================
    // PASO 3: Validar monto
    // ========================================================================
    
    const amountValidation = validateAmount(parseFloat(amount), 1000);
    
    if (!amountValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: amountValidation.error,
        },
        { status: 400 }
      );
    }

    // ========================================================================
    // PASO 4: Generar código de referencia único
    // ========================================================================
    
    const referenceCode = generateReferenceCode('PAY');
    
    logTransaction('Código de referencia generado', { referenceCode });

    // ========================================================================
    // PASO 5: Preparar datos de pago
    // ========================================================================
    
    const paymentData: PaymentData = {
      referenceCode,
      description: description || 'Pago en línea',
      amount: parseFloat(amount),
      currency,
      tax: 0, // Opcional: calcular IVA si aplica
      taxReturnBase: 0,
      buyer: {
        fullName,
        email,
        phone,
        documentType,
        documentNumber,
      },
    };

    // ========================================================================
    // PASO 6: Obtener configuración de PayU y preparar formulario
    // ========================================================================
    
    const config = getPayUConfig();
    const formData = preparePayUFormData(paymentData, config);

    logTransaction('Datos del formulario preparados', { formData });

    // ========================================================================
    // PASO 7: Guardar transacción en base de datos (opcional)
    // ========================================================================
    
    // Aquí podrías guardar la transacción pendiente en tu base de datos
    // Ejemplo:
    // await db.transaction.create({
    //   referenceCode,
    //   amount: paymentData.amount,
    //   status: 'pending',
    //   buyerEmail: email,
    //   createdAt: new Date(),
    // });

    // ========================================================================
    // PASO 8: Retornar datos para el frontend
    // ========================================================================
    
    return NextResponse.json({
      success: true,
      referenceCode,
      payuUrl: config.apiUrl,
      formData,
      testMode: config.testMode,
      message: 'Datos preparados para PayU',
    });

  } catch (error) {
    logError('Error procesando pago', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

/**
 * Método GET para verificar que la API está funcionando
 */
export async function GET() {
  const config = getPayUConfig();
  
  return NextResponse.json({
    status: 'active',
    testMode: config.testMode,
    message: 'PayU Payment Processing API',
    endpoints: {
      process: 'POST /api/payu/process',
      confirmation: 'POST /api/payu/confirmation',
    },
  });
}