/**
 * Script de prueba para el sistema de certificados
 * Ejecutar con: npm run test:certificates
 */

async function testCertificateSystem() {
  console.log('🧪 Iniciando prueba del sistema de certificados...\n');
  
  // 1. Crear una donación de prueba
  console.log('📝 Paso 1: Creando donación de prueba...');
  try {
    const donationResponse = await fetch('http://localhost:3000/api/donations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        donorName: 'Juan Pérez (Prueba)',
        donorEmail: 'test@example.com', // Cambiar por un email real para pruebas
        donorPhone: '3001234567',
        donationType: 'monetaria',
        amount: 50000,
      }),
    });
    
    const donationData = await donationResponse.json();
    console.log('✅ Donación creada:', donationData);
    console.log('');
  } catch (error) {
    console.error('❌ Error creando donación:', error);
    return;
  }
  
  // 2. Verificar certificados pendientes
  console.log('📋 Paso 2: Verificando certificados pendientes...');
  try {
    const pendingResponse = await fetch('http://localhost:3000/api/certificates/send', {
      method: 'GET',
    });
    
    const pendingData = await pendingResponse.json();
    console.log('📊 Certificados pendientes:', pendingData.pendingCertificates);
    console.log('');
  } catch (error) {
    console.error('❌ Error verificando certificados pendientes:', error);
    return;
  }
  
  // 3. Enviar certificados (solo si hay pendientes del año anterior)
  console.log('📧 Paso 3: Enviando certificados...');
  console.log('ℹ️  Nota: Solo se enviarán certificados de donaciones del año anterior');
  try {
    const sendResponse = await fetch('http://localhost:3000/api/certificates/send', {
      method: 'POST',
    });
    
    const sendData = await sendResponse.json();
    console.log('✅ Resultado:', sendData);
    console.log('');
  } catch (error) {
    console.error('❌ Error enviando certificados:', error);
    return;
  }
  
  console.log('✨ Prueba completada\n');
  console.log('📌 Notas importantes:');
  console.log('   - Los certificados solo se envían para donaciones del año anterior');
  console.log('   - Para probar el envío, modifica manualmente la fecha en data/donations.json');
  console.log('   - Asegúrate de configurar las variables SMTP en .env.local');
}

// Ejecutar el test
testCertificateSystem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error en el test:', error);
    process.exit(1);
  });