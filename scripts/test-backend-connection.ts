/**
 * Script de Diagnóstico - Conexión con Backend
 * 
 * Este script prueba directamente la conexión con el backend
 * y verifica que las donaciones se registren correctamente.
 * 
 * Uso: npx tsx scripts/test-backend-connection.ts
 */

async function testBackendConnection() {
  console.log('🔍 Probando conexión con el backend...\n');
  
  const backendUrl = 'http://localhost:8080/api';

  // ============================================================================
  // Test 1: Verificar que el backend esté corriendo
  // ============================================================================
  console.log('📡 Test 1: Verificando que el backend esté activo...');
  try {
    const healthCheck = await fetch(`${backendUrl}/donations`, {
      method: 'OPTIONS',
    });
    
    if (healthCheck.ok || healthCheck.status === 200 || healthCheck.status === 204) {
      console.log('   ✅ Backend está activo y responde a peticiones OPTIONS (CORS)');
    } else {
      console.log('   ⚠️  Backend responde pero con status:', healthCheck.status);
    }
  } catch (error) {
    console.log('   ❌ ERROR: No se puede conectar al backend');
    console.log('   ℹ️  Asegúrate de que el backend esté corriendo en http://localhost:8080');
    console.log('   ℹ️  Error:', error);
    return;
  }

  console.log('');

  // ============================================================================
  // Test 2: Enviar donación monetaria directamente al backend
  // ============================================================================
  console.log('💰 Test 2: Enviando donación monetaria al backend...');
  try {
    const monetaryPayload = {
      fullName: 'Test Usuario (Directo)',
      email: 'test@example.com',
      phone: '3001234567',
      donationType: 'MONETARY',
      amount: 50000,
      paymentMethod: 'BANK_TRANSFER',
    };

    console.log('   📤 Enviando payload:', JSON.stringify(monetaryPayload, null, 2));

    const response = await fetch(`${backendUrl}/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(monetaryPayload),
    });

    console.log('   📥 Status:', response.status, response.statusText);

    if (response.ok) {
      const result = await response.json();
      console.log('   ✅ ¡Donación registrada exitosamente!');
      console.log('   📋 ID de donación:', result.id);
      console.log('   💰 Monto:', result.amount);
      console.log('   👤 Donante:', result.donorName);
      console.log('   📊 Estado:', result.status);
    } else {
      const errorText = await response.text();
      console.log('   ❌ Error al registrar donación');
      console.log('   📄 Respuesta:', errorText);
    }
  } catch (error) {
    console.log('   ❌ Error en la petición:', error);
  }

  console.log('');

  // ============================================================================
  // Test 3: Enviar donación en especie directamente al backend
  // ============================================================================
  console.log('📦 Test 3: Enviando donación en especie al backend...');
  try {
    const inKindPayload = {
      fullName: 'María García (Directo)',
      email: 'test2@example.com',
      phone: '3007654321',
      donationType: 'IN_KIND',
      itemType: 'ropa',
      description: 'Ropa de niños en buen estado (5 prendas)',
      paymentMethod: 'IN_KIND',
    };

    console.log('   📤 Enviando payload:', JSON.stringify(inKindPayload, null, 2));

    const response = await fetch(`${backendUrl}/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inKindPayload),
    });

    console.log('   📥 Status:', response.status, response.statusText);

    if (response.ok) {
      const result = await response.json();
      console.log('   ✅ ¡Donación registrada exitosamente!');
      console.log('   📋 ID de donación:', result.id);
      console.log('   📦 Tipo de artículo:', result.itemType);
      console.log('   👤 Donante:', result.donorName);
      console.log('   📊 Estado:', result.status);
    } else {
      const errorText = await response.text();
      console.log('   ❌ Error al registrar donación');
      console.log('   📄 Respuesta:', errorText);
    }
  } catch (error) {
    console.log('   ❌ Error en la petición:', error);
  }

  console.log('');

  // ============================================================================
  // Test 4: Verificar logs del backend
  // ============================================================================
  console.log('📋 Test 4: Verificando logs del backend');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('⚠️  IMPORTANTE: Ve a la consola de tu backend de Spring Boot');
  console.log('');
  console.log('Deberías ver estos logs:');
  console.log('');
  console.log('  📝 Creando donación para: Test Usuario (Directo)');
  console.log('  ✅ Donación guardada con ID: 123');
  console.log('  📧 Email de confirmación enviado a: test@example.com');
  console.log('  🔔 Notificaciones creadas para todos los administradores');
  console.log('');
  console.log('Si NO ves estos logs, el problema está en:');
  console.log('  1. El backend no está recibiendo la petición (CORS?)');
  console.log('  2. El DonationService tiene algún error');
  console.log('  3. El NotificationService no se está ejecutando');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  // ============================================================================
  // Resumen
  // ============================================================================
  console.log('📊 RESUMEN');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('Si los Tests 2 y 3 fueron exitosos (✅), entonces:');
  console.log('');
  console.log('  ✅ El backend está funcionando correctamente');
  console.log('  ✅ El endpoint /api/donations está accesible');
  console.log('  ✅ Las donaciones se están guardando en la base de datos');
  console.log('');
  console.log('Siguiente paso:');
  console.log('  1. Ve a http://localhost:3000/donaciones');
  console.log('  2. Crea una donación desde la interfaz');
  console.log('  3. Abre la consola del navegador (F12)');
  console.log('  4. Deberías ver: "Donación registrada en el backend exitosamente"');
  console.log('  5. Ve a http://localhost:3000/dashboard/notifications');
  console.log('  6. Deberías ver la notificación de la donación');
  console.log('');
  console.log('Si NO ves la notificación:');
  console.log('  - Revisa los logs del backend');
  console.log('  - Verifica que NotificationService esté creando las notificaciones');
  console.log('  - Asegúrate de estar logueado como ADMIN');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
}

// Ejecutar las pruebas
testBackendConnection().catch(console.error);
