/**
 * Script de Simulación - Webhook de PayU
 * 
 * Este script simula una confirmación de PayU para probar
 * el webhook localmente sin necesidad de ngrok.
 * 
 * Uso: npx tsx scripts/simulate-payu-webhook.ts
 */

async function simulatePayUWebhook() {
  console.log('🧪 Simulando confirmación de PayU (Webhook)...\n');

  const webhookUrl = 'http://localhost:3000/api/payu/confirmation';
  
  console.log('📍 URL del webhook:', webhookUrl);
  console.log('');

  // ============================================================================
  // Preparar datos de la confirmación de PayU
  // ============================================================================
  
  const referenceCode = `SIMULADO_${Date.now()}`;
  const transactionId = `TXN_${Date.now()}`;
  
  console.log('📋 Datos de la simulación:');
  console.log('   Referencia:', referenceCode);
  console.log('   Transacción:', transactionId);
  console.log('   Monto: $50,000 COP');
  console.log('   Estado: Aprobado (4)');
  console.log('');

  // Crear FormData como lo envía PayU
  const formData = new URLSearchParams();
  
  // Datos requeridos
  formData.append('merchant_id', '508029');
  formData.append('state_pol', '4'); // 4 = Aprobado
  formData.append('response_code_pol', '1');
  formData.append('reference_sale', referenceCode);
  formData.append('reference_pol', Math.floor(Math.random() * 1000000000).toString());
  formData.append('sign', 'test_signature_for_development');
  
  // Información del pago
  formData.append('value', '50000');
  formData.append('tax', '0');
  formData.append('currency', 'COP');
  formData.append('transaction_date', new Date().toISOString());
  formData.append('transaction_id', transactionId);
  
  // Información del comprador
  formData.append('email_buyer', 'test@example.com');
  formData.append('phone', '3001234567');
  formData.append('description', 'Donación de prueba - Simulación local');
  
  // Método de pago
  formData.append('payment_method', 'VISA');
  formData.append('payment_method_type', '2');
  
  // ⭐ IMPORTANTE: Extra fields con nombre y teléfono
  formData.append('extra1', 'Juan Pérez (Simulado)|3001234567'); // nombre|telefono
  formData.append('extra2', 'CC|123456789');
  
  // Modo prueba
  formData.append('test', '1');

  // ============================================================================
  // Enviar al webhook
  // ============================================================================
  
  console.log('📤 Enviando confirmación al webhook...');
  console.log('');

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    console.log('📥 Respuesta del webhook:');
    console.log('   Status:', response.status, response.statusText);

    if (response.ok) {
      const result = await response.json();
      console.log('   ✅ Éxito:', result.message);
      console.log('');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('🎉 ¡Webhook procesado exitosamente!');
      console.log('');
      console.log('Siguiente paso:');
      console.log('  1. Ve a tu consola del servidor Next.js');
      console.log('  2. Busca los logs que empiezan con:');
      console.log('     🔍 Datos extraídos de PayU');
      console.log('     📤 Enviando donación al backend');
      console.log('     ✅ Donación de PayU registrada exitosamente');
      console.log('');
      console.log('  3. Ve al dashboard de notificaciones:');
      console.log('     → http://localhost:3000/dashboard/notifications');
      console.log('');
      console.log('  4. Deberías ver una notificación como:');
      console.log('     "Nueva Donación Recibida"');
      console.log('     "Se ha recibido una donación monetaria de $50,000 COP"');
      console.log('     "por Juan Pérez (Simulado)"');
      console.log('═══════════════════════════════════════════════════════════');
    } else {
      const errorText = await response.text();
      console.log('   ❌ Error:', errorText);
      console.log('');
      console.log('⚠️  Posibles causas:');
      console.log('   - El servidor Next.js no está corriendo (npm run dev)');
      console.log('   - La ruta del webhook no existe');
      console.log('   - Hay un error en el código del webhook');
    }
  } catch (error) {
    console.log('❌ Error al conectar con el webhook:', error);
    console.log('');
    console.log('⚠️  Verifica que:');
    console.log('   1. El servidor Next.js esté corriendo: npm run dev');
    console.log('   2. El puerto sea 3000: http://localhost:3000');
  }

  console.log('');
}

// Ejecutar la simulación
simulatePayUWebhook().catch(console.error);
