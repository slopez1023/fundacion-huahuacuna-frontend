import cron from 'node-cron';

// Función para ejecutar el envío de certificados
async function sendCertificatesJob() {
  try {
    console.log('Iniciando envío automático de certificados...');
    
    const response = await fetch('http://localhost:3000/api/certificates/send', {
      method: 'POST',
    });
    
    const result = await response.json();
    console.log('Resultado del envío de certificados:', result);
    
  } catch (error) {
    console.error('Error en el cron job de certificados:', error);
  }
}

// Programar el cron job para ejecutarse el 1 de enero a las 9:00 AM
// Formato: segundo minuto hora día mes día-de-la-semana
// '0 9 1 1 *' = A las 9:00 AM del 1 de enero de cada año
export function initializeCertificateCronJob() {
  // Ejecutar el 1 de enero a las 9:00 AM
  cron.schedule('0 9 1 1 *', sendCertificatesJob, {
    scheduled: true,
    timezone: 'America/Bogota' // Zona horaria de Colombia
  });
  
  console.log('Cron job de certificados programado para el 1 de enero a las 9:00 AM');
  
  // También se puede ejecutar manualmente llamando a la API:
  // POST /api/certificates/send
}

// Para desarrollo y pruebas: ejecutar cada minuto
export function initializeCertificateCronJobDev() {
  cron.schedule('* * * * *', sendCertificatesJob, {
    scheduled: true,
    timezone: 'America/Bogota'
  });
  
  console.log('Cron job de certificados (DEV) programado para ejecutarse cada minuto');
}