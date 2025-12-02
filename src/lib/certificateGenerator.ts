import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

export interface CertificateData {
  donorName: string;
  donationAmount?: number;
  donationType: 'monetaria' | 'especie';
  inKindDescription?: string;
  donationDate: Date;
  certificateNumber: string;
}

export async function generateDonationCertificate(data: CertificateData): Promise<Buffer> {
  try {
    // Cargar el PDF base
    const templatePath = path.join(process.cwd(), 'public', 'Cert_Donacion_Huahuacuna.pdf');
    const existingPdfBytes = await fs.readFile(templatePath);
    
    // Cargar el PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    
    // Obtener fuente
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const { width, height } = firstPage.getSize();
    
    // Nombre del donante
    firstPage.drawText(data.donorName.toUpperCase(), {
      x: 150,
      y: height - 280,
      size: 16,
      font: fontBold,
      color: rgb(0.11, 0.22, 0.37), // #1E3A5F
    });
    
    // Tipo de donación y monto/descripción
    let donationText = '';
    if (data.donationType === 'monetaria' && data.donationAmount) {
      donationText = `Donación monetaria de $${data.donationAmount.toLocaleString('es-CO')} COP`;
    } else if (data.donationType === 'especie' && data.inKindDescription) {
      donationText = `Donación en especie: ${data.inKindDescription}`;
    }
    
    firstPage.drawText(donationText, {
      x: 150,
      y: height - 320,
      size: 12,
      font: font,
      color: rgb(0.42, 0.45, 0.50),
    });
    
    // Fecha de donación
    const donationDateText = `Fecha de donación: ${data.donationDate.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`;
    
    firstPage.drawText(donationDateText, {
      x: 150,
      y: height - 360,
      size: 10,
      font: font,
      color: rgb(0.42, 0.45, 0.50),
    });
    
    // Número de certificado
    firstPage.drawText(`Certificado No. ${data.certificateNumber}`, {
      x: 150,
      y: height - 400,
      size: 10,
      font: font,
      color: rgb(0.42, 0.45, 0.50),
    });
    
    // Fecha de emisión (año siguiente)
    const issueDate = new Date(data.donationDate);
    issueDate.setFullYear(issueDate.getFullYear() + 1);
    issueDate.setMonth(0); // Enero
    issueDate.setDate(1); // Día 1
    
    const issueDateText = `Fecha de emisión: ${issueDate.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`;
    
    firstPage.drawText(issueDateText, {
      x: 150,
      y: height - 440,
      size: 10,
      font: font,
      color: rgb(0.42, 0.45, 0.50),
    });
    
    // Guardar el PDF modificado
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
    
  } catch (error) {
    console.error('Error generando certificado:', error);
    throw new Error('No se pudo generar el certificado de donación');
  }
}

export function generateCertificateNumber(donationDate: Date): string {
  const year = donationDate.getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CERT-${year}-${random}`;
}