import { NextRequest, NextResponse } from 'next/server';
import { saveDonation } from '@/src/lib/donationStorage';
import { Donation } from '@/src/types/donation';
import { generateCertificateNumber } from '@/src/lib/certificateGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos requeridos
    if (!body.donorName || !body.donorEmail || !body.donationType) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }
    
    // Validar tipo de donación
    if (body.donationType === 'monetaria' && !body.amount) {
      return NextResponse.json(
        { error: 'El monto es requerido para donaciones monetarias' },
        { status: 400 }
      );
    }
    
    if (body.donationType === 'especie' && !body.inKindDescription) {
      return NextResponse.json(
        { error: 'La descripción es requerida para donaciones en especie' },
        { status: 400 }
      );
    }
    
    // Crear la donación
    const donationDate = new Date();
    const donation: Donation = {
      id: `DON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      donorName: body.donorName,
      donorEmail: body.donorEmail,
      donorPhone: body.donorPhone,
      donationType: body.donationType,
      amount: body.amount,
      inKindDescription: body.inKindDescription,
      inKindType: body.inKindType,
      donationDate,
      certificateSent: false,
    };
    
    // Guardar la donación
    await saveDonation(donation);
    
    // Enviar confirmación por email (sin certificado)
    // El certificado se enviará el 1 de enero del año siguiente
    
    return NextResponse.json({
      success: true,
      message: 'Donación registrada exitosamente',
      donation: {
        id: donation.id,
        certificateNumber: generateCertificateNumber(donationDate),
        certificateInfo: 'Tu certificado de donación será enviado el 1 de enero del año siguiente.'
      }
    });
    
  } catch (error) {
    console.error('Error procesando donación:', error);
    return NextResponse.json(
      { error: 'Error procesando la donación' },
      { status: 500 }
    );
  }
}