/**
 * API Route: Confirmación de PayU (Webhook)
 * Ruta: /api/payu/confirmation
 * Método: POST
 * 
 * Este endpoint recibe la confirmación automática de PayU (server-to-server)
 * cuando una transacción se completa. Es importante validar la firma.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getPayUConfig,
  validateResponseSignature,
  getTransactionStatus,
  logTransaction,
  logError,
  type PayUResponse,
} from '@/lib/payu';

export async function POST(request: NextRequest) {
  try {
    // ========================================================================
    // PASO 1: Extraer datos de la confirmación
    // ========================================================================
    
    const body = await request.formData();
    
    // PayU envía los datos como form-data, no JSON
    const statePol = body.get('state_pol') as string;
    const payuResponse: Partial<PayUResponse> = {
      merchant_id: body.get('merchant_id') as string,
      state_pol: (statePol === '4' || statePol === '5' || statePol === '6' || statePol === '7' || statePol === '104') ? statePol : undefined,
      risk: body.get('risk') as string || undefined,
      response_code_pol: body.get('response_code_pol') as string,
      reference_sale: body.get('reference_sale') as string,
      reference_pol: body.get('reference_pol') as string,
      sign: body.get('sign') as string,
      extra1: body.get('extra1') as string || undefined,
      extra2: body.get('extra2') as string || undefined,
      extra3: body.get('extra3') as string || undefined,
      payment_method: body.get('payment_method') as string,
      payment_method_type: body.get('payment_method_type') as string,
      installments_number: body.get('installments_number') as string || undefined,
      value: body.get('value') as string,
      tax: body.get('tax') as string || undefined,
      transaction_date: body.get('transaction_date') as string,
      currency: body.get('currency') as string,
      email_buyer: body.get('email_buyer') as string,
      cus: body.get('cus') as string || undefined,
      pse_bank: body.get('pse_bank') as string || undefined,
      test: body.get('test') as string || undefined,
      description: body.get('description') as string,
      billing_address: body.get('billing_address') as string || undefined,
      shipping_address: body.get('shipping_address') as string || undefined,
      phone: body.get('phone') as string || undefined,
      office_phone: body.get('office_phone') as string || undefined,
      transaction_id: body.get('transaction_id') as string,
      authorization_code: body.get('authorization_code') as string || undefined,
      response_message_pol: body.get('response_message_pol') as string || undefined,
    };

    logTransaction('Confirmación recibida de PayU', { payuResponse });

    // ========================================================================
    // PASO 2: Validar que los datos esenciales estén presentes
    // ========================================================================
    
    if (!payuResponse.reference_sale || !payuResponse.sign || !payuResponse.state_pol) {
      logError('Datos incompletos en confirmación de PayU');
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // ========================================================================
    // PASO 3: Validar firma de seguridad
    // ========================================================================
    
    const config = getPayUConfig();
    
    // ⚠️ En modo prueba, permitir firmas de simulación
    const isSimulation = payuResponse.sign === 'test_signature_for_development';
    const skipValidation = config.testMode && isSimulation;
    
    if (!skipValidation) {
      const isValidSignature = validateResponseSignature(
        payuResponse as PayUResponse,
        config.apiKey
      );

      if (!isValidSignature) {
        logError('Firma inválida en confirmación de PayU', {
          received: payuResponse.sign,
          referenceCode: payuResponse.reference_sale,
        });
        
        return NextResponse.json(
          { error: 'Firma inválida' },
          { status: 403 }
        );
      }

      logTransaction('Firma validada correctamente');
    } else {
      logTransaction('⚠️ Modo simulación - Firma omitida (solo desarrollo)');
    }

    // ========================================================================
    // PASO 4: Obtener información del estado
    // ========================================================================
    
    const statusInfo = getTransactionStatus(payuResponse.state_pol!);

    logTransaction('Estado de transacción', {
      statePol: payuResponse.state_pol,
      status: statusInfo.status,
      referenceCode: payuResponse.reference_sale,
    });

    // ========================================================================
    // PASO 5: Actualizar transacción en base de datos
    // ========================================================================
    
    // Aquí actualizarías tu base de datos con el resultado
    // Ejemplo:
    // await db.transaction.update({
    //   where: { referenceCode: payuResponse.reference_sale },
    //   data: {
    //     status: statusInfo.status,
    //     transactionId: payuResponse.transaction_id,
    //     paymentMethod: payuResponse.payment_method,
    //     authorizationCode: payuResponse.authorization_code,
    //     responseCode: payuResponse.response_code_pol,
    //     completedAt: new Date(),
    //   },
    // });

    // ========================================================================
    // PASO 6: Procesar según el estado
    // ========================================================================
    
    switch (statusInfo.status) {
      case 'approved':
        // Pago aprobado - activar servicio, enviar email de confirmación, etc.
        logTransaction('Pago aprobado', {
          referenceCode: payuResponse.reference_sale,
          amount: payuResponse.value,
          email: payuResponse.email_buyer,
        });
        
        // Registrar la donación en el backend para crear notificación
        try {
          // Extraer información del extra1 (formato: "nombre|telefono")
          const extra1Parts = payuResponse.extra1?.split('|') || ['Donante PayU', ''];
          const donorName = extra1Parts[0] || 'Donante PayU';
          const donorPhone = extra1Parts[1] || '';
          
          logTransaction('🔍 Datos extraídos de PayU', {
            donorName,
            donorPhone,
            email: payuResponse.email_buyer,
            amount: payuResponse.value,
            extra1: payuResponse.extra1,
          });
          
          const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
          
          // Crear objeto de donación según el formato del backend (DonationRequest)
          const donationPayload = {
            fullName: donorName,  // ✅ El backend espera 'fullName'
            email: payuResponse.email_buyer,
            phone: donorPhone,
            amount: parseFloat(payuResponse.value || '0'),
            donationType: 'MONETARY',  // ✅ Backend espera 'MONETARY'
            paymentMethod: 'ONLINE_PAYU',  // Método de pago PayU
            description: `Pago en línea - Ref: ${payuResponse.reference_sale}`,
          };

          logTransaction('📤 Enviando donación al backend', donationPayload);
          
          const backendResponse = await fetch(`${backendUrl}/donations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(donationPayload),
          });

          logTransaction('📥 Respuesta del backend', {
            status: backendResponse.status,
            statusText: backendResponse.statusText,
            ok: backendResponse.ok,
          });

          if (!backendResponse.ok) {
            const errorText = await backendResponse.text();
            logError('❌ Error del backend al registrar donación de PayU', {
              status: backendResponse.status,
              error: errorText,
            });
          } else {
            const responseData = await backendResponse.json();
            logTransaction('✅ Donación de PayU registrada exitosamente', {
              donationId: responseData.id,
              donorName: responseData.donorName,
            });
            logTransaction('🔔 Notificación creada para el administrador');
          }
        } catch (backendError) {
          logError('❌ Excepción al registrar donación de PayU', backendError);
        }
        
        break;

      case 'declined':
        // Pago rechazado - notificar al usuario
        logTransaction('Pago rechazado', {
          referenceCode: payuResponse.reference_sale,
          responseCode: payuResponse.response_code_pol,
        });
        break;

      case 'pending':
        // Pago pendiente - mantener en espera
        logTransaction('Pago pendiente', {
          referenceCode: payuResponse.reference_sale,
        });
        break;

      case 'expired':
        // Transacción expirada
        logTransaction('Transacción expirada', {
          referenceCode: payuResponse.reference_sale,
        });
        break;

      default:
        logError('Estado no reconocido', { statePol: payuResponse.state_pol });
    }

    // ========================================================================
    // PASO 7: Responder a PayU
    // ========================================================================
    
    // PayU espera una respuesta HTTP 200 para confirmar que recibimos la notificación
    return NextResponse.json(
      { 
        success: true,
        message: 'Confirmación procesada',
      },
      { status: 200 }
    );

  } catch (error) {
    logError('Error procesando confirmación de PayU', error);
    
    // Incluso en caso de error, respondemos 200 para que PayU no reintente
    // Pero guardamos el error en logs para investigar
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno',
      },
      { status: 200 }
    );
  }
}

/**
 * Método GET para testing
 */
export async function GET() {
  return NextResponse.json({
    message: 'PayU Confirmation Webhook',
    method: 'POST',
    note: 'Este endpoint debe ser configurado en el panel de PayU como URL de confirmación',
  });
}