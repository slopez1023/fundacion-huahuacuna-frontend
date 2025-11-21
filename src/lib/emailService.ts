import nodemailer from 'nodemailer';
import { CertificateData, generateDonationCertificate } from './certificateGenerator';

// Configurar el transportador de correo
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"Fundación Huahuacuna" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });
    console.log('Email enviado exitosamente a:', options.to);
  } catch (error) {
    console.error('Error enviando email:', error);
    throw new Error('No se pudo enviar el correo electrónico');
  }
}

export async function sendDonationCertificate(
  donorEmail: string,
  donorName: string,
  certificateData: CertificateData
): Promise<void> {
  try {
    // Generar el PDF del certificado
    const certificatePdf = await generateDonationCertificate(certificateData);
    
    // HTML del email
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #FDD835 0%, #F9A825 100%);
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .header h1 {
            color: #1E3A5F;
            margin: 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e0e0e0;
          }
          .footer {
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 10px 10px;
            font-size: 12px;
            color: #666;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #FDD835;
            color: #1E3A5F;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Certificado de Donación</h1>
          </div>
          <div class="content">
            <p>Estimado/a <strong>${donorName}</strong>,</p>
            
            <p>Es un placer para nosotros en la <strong>Fundación Huahuacuna</strong> hacerte llegar tu certificado de donación correspondiente al año ${certificateData.donationDate.getFullYear()}.</p>
            
            <p>Tu generosa contribución ha hecho posible que continuemos transformando vidas y brindando apoyo integral a niños en situación de vulnerabilidad.</p>
            
            <p><strong>Detalles de tu donación:</strong></p>
            <ul>
              <li>Tipo: ${certificateData.donationType === 'monetaria' ? 'Donación Monetaria' : 'Donación en Especie'}</li>
              ${certificateData.donationAmount ? `<li>Monto: $${certificateData.donationAmount.toLocaleString('es-CO')} COP</li>` : ''}
              ${certificateData.inKindDescription ? `<li>Descripción: ${certificateData.inKindDescription}</li>` : ''}
              <li>Fecha: ${certificateData.donationDate.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</li>
              <li>Certificado No.: ${certificateData.certificateNumber}</li>
            </ul>
            
            <p>Adjunto a este correo encontrarás tu certificado en formato PDF. Este documento es válido para fines tributarios según la normativa vigente.</p>
            
            <p><strong>¡Gracias por ser parte del cambio!</strong></p>
            
            <p>Tu apoyo hace la diferencia en la vida de muchos niños y sus familias. Si deseas continuar apoyando nuestra causa o conocer más sobre nuestros proyectos, visita nuestro sitio web.</p>
            
            <p>Con gratitud,<br>
            <strong>Fundación Huahuacuna</strong></p>
          </div>
          <div class="footer">
            <p>Fundación Huahuacuna - Conectando Corazones, Transformando Vidas</p>
            <p>📧 info@huahuacuna.org | 📞 123-456-7890</p>
            <p>📍 Calle 123 #45-67, Armenia, Quindío</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Enviar el email con el certificado adjunto
    await sendEmail({
      to: donorEmail,
      subject: `Certificado de Donación ${certificateData.donationDate.getFullYear()} - Fundación Huahuacuna`,
      html: emailHtml,
      attachments: [
        {
          filename: `Certificado_Donacion_${certificateData.certificateNumber}.pdf`,
          content: certificatePdf,
          contentType: 'application/pdf',
        },
      ],
    });
    
    console.log(`Certificado enviado exitosamente a ${donorEmail}`);
  } catch (error) {
    console.error('Error enviando certificado de donación:', error);
    throw error;
  }
}