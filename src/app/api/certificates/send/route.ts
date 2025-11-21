import { NextResponse } from 'next/server';
import { getDonationsForCertificates, updateDonation } from '@/lib/donationStorage';
import { sendDonationCertificate } from '@/lib/emailService';
import { generateCertificateNumber } from '@/lib/certificateGenerator';
import { Donation } from '@/types/donation';

export async function POST() {
  try {
    // Obtener donaciones del año anterior sin certificado
    const donations = await getDonationsForCertificates();
    
    if (donations.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No hay certificados pendientes por enviar',
        certificatesSent: 0
      });
    }
    
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    
    // Procesar cada donación
    for (const donation of donations) {
      try {
        // Generar número de certificado
        const certificateNumber = generateCertificateNumber(donation.donationDate);
        
        // Enviar certificado por email
        await sendDonationCertificate(
          donation.donorEmail,
          donation.donorName,
          {
            donorName: donation.donorName,
            donationAmount: donation.amount,
            donationType: donation.donationType,
            inKindDescription: donation.inKindDescription,
            donationDate: new Date(donation.donationDate),
            certificateNumber,
          }
        );
        
        // Marcar como enviado
        await updateDonation(donation.id, {
          certificateSent: true,
          certificateSentDate: new Date(),
        });
        
        successCount++;
        console.log(`Certificado enviado exitosamente a ${donation.donorEmail}`);
        
      } catch (error) {
        errorCount++;
        const errorMsg = `Error enviando certificado a ${donation.donorEmail}: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Proceso completado: ${successCount} certificados enviados, ${errorCount} errores`,
      certificatesSent: successCount,
      errors: errorCount > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('Error en el proceso de envío de certificados:', error);
    return NextResponse.json(
      { error: 'Error procesando el envío de certificados' },
      { status: 500 }
    );
  }
}

// Endpoint GET para verificar certificados pendientes
export async function GET() {
  try {
    const donations = await getDonationsForCertificates();
    
    return NextResponse.json({
      pendingCertificates: donations.length,
      donations: donations.map((d: Donation) => ({
        id: d.id,
        donorName: d.donorName,
        donorEmail: d.donorEmail,
        donationType: d.donationType,
        donationDate: d.donationDate,
      }))
    });
    
  } catch (error) {
    console.error('Error obteniendo certificados pendientes:', error);
    return NextResponse.json(
      { error: 'Error obteniendo información de certificados' },
      { status: 500 }
    );
  }
}