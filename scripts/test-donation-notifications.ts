/**
 * Script de Prueba - Sistema de Notificaciones de Donaciones
 * 
 * Este script prueba que las donaciones se registren correctamente
 * y que se creen notificaciones para el administrador.
 * 
 * Uso:
 * 1. Asegúrate de que el frontend esté corriendo: npm run dev
 * 2. Asegúrate de que el backend esté corriendo en http://localhost:8080
 * 3. Ejecuta: npx tsx scripts/test-donation-notifications.ts
 */

async function testDonationNotifications() {
  console.log('🧪 Iniciando prueba del sistema de notificaciones de donaciones...\n');

  const baseUrl = 'http://localhost:3000';
  const backendUrl = 'http://localhost:8080/api';

  // ============================================================================
  // Test 1: Donación Monetaria
  // ============================================================================
  console.log('📝 Test 1: Donación Monetaria (Transferencia)');
  try {
    const monetaryDonation = {
      donorName: 'Juan Pérez (Test)',
      donorEmail: 'test@example.com',
      donorPhone: '3001234567',
      donationType: 'monetaria',
      amount: 50000,
    };

    console.log('   Enviando donación monetaria...');
    const response1 = await fetch(`${baseUrl}/api/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(monetaryDonation),
    });

    const result1 = await response1.json();
    
    if (response1.ok && result1.success) {
      console.log('   ✅ Donación monetaria registrada exitosamente');
      console.log('   📋 ID:', result1.donation?.id);
      console.log('   📜 Certificado:', result1.donation?.certificateNumber);
    } else {
      console.log('   ❌ Error:', result1.error);
    }

    // Esperar un poco para que el backend procese
    await new Promise(resolve => setTimeout(resolve, 1000));

  } catch (error) {
    console.log('   ❌ Error en Test 1:', error);
  }

  console.log('');

  // ============================================================================
  // Test 2: Donación en Especie
  // ============================================================================
  console.log('📝 Test 2: Donación en Especie');
  try {
    const inKindDonation = {
      donorName: 'María García (Test)',
      donorEmail: 'test2@example.com',
      donorPhone: '3007654321',
      donationType: 'especie',
      inKindType: 'ropa',
      inKindDescription: 'Ropa de niños en buen estado (5 prendas)',
    };

    console.log('   Enviando donación en especie...');
    const response2 = await fetch(`${baseUrl}/api/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inKindDonation),
    });

    const result2 = await response2.json();
    
    if (response2.ok && result2.success) {
      console.log('   ✅ Donación en especie registrada exitosamente');
      console.log('   📋 ID:', result2.donation?.id);
      console.log('   📜 Certificado:', result2.donation?.certificateNumber);
    } else {
      console.log('   ❌ Error:', result2.error);
    }

    // Esperar un poco para que el backend procese
    await new Promise(resolve => setTimeout(resolve, 1000));

  } catch (error) {
    console.log('   ❌ Error en Test 2:', error);
  }

  console.log('');

  // ============================================================================
  // Test 3: Verificar Notificaciones en el Backend
  // ============================================================================
  console.log('📝 Test 3: Verificar Notificaciones en el Backend');
  try {
    console.log('   Consultando notificaciones...');
    const response3 = await fetch(`${backendUrl}/notifications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response3.ok) {
      const notifications = await response3.json();
      console.log('   ✅ Notificaciones obtenidas del backend');
      console.log('   📊 Total de notificaciones:', notifications.data?.length || 0);
      
      // Filtrar notificaciones de tipo DONATION
      const donationNotifs = (notifications.data || []).filter(
        (n: any) => n.type === 'DONATION'
      );
      console.log('   💰 Notificaciones de donaciones:', donationNotifs.length);
      
      if (donationNotifs.length > 0) {
        console.log('\n   📋 Últimas notificaciones de donaciones:');
        donationNotifs.slice(0, 3).forEach((n: any, i: number) => {
          console.log(`      ${i + 1}. ${n.title} - ${n.message}`);
          console.log(`         Leída: ${n.isRead ? 'Sí' : 'No'} | Fecha: ${new Date(n.createdAt).toLocaleString()}`);
        });
      }
    } else {
      console.log('   ⚠️  No se pudieron obtener las notificaciones');
      console.log('   ℹ️  Esto puede ser porque:');
      console.log('      - El backend no está corriendo');
      console.log('      - El endpoint /api/notifications no existe');
      console.log('      - Se requiere autenticación');
    }

  } catch (error) {
    console.log('   ❌ Error al consultar notificaciones:', error);
    console.log('   ℹ️  Verifica que el backend esté corriendo en', backendUrl);
  }

  console.log('');

  // ============================================================================
  // Resumen
  // ============================================================================
  console.log('📊 Resumen de Pruebas');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ Si viste mensajes "✅ Donación ... registrada exitosamente"');
  console.log('   entonces el frontend está funcionando correctamente.');
  console.log('');
  console.log('✅ Si viste notificaciones de donaciones en el Test 3,');
  console.log('   entonces el backend está creando notificaciones correctamente.');
  console.log('');
  console.log('📋 Siguiente paso:');
  console.log('   1. Ve a http://localhost:3000/dashboard/notifications');
  console.log('   2. Inicia sesión como administrador');
  console.log('   3. Verifica que aparezcan las nuevas notificaciones');
  console.log('');
  console.log('⚠️  Si NO ves las notificaciones en el dashboard:');
  console.log('   - Verifica que el backend esté creando notificaciones');
  console.log('   - Revisa el archivo CORRECCION_NOTIFICACIONES.md');
  console.log('   - Verifica los logs del backend');
  console.log('═══════════════════════════════════════════════════════════');
}

// Ejecutar las pruebas
testDonationNotifications().catch(console.error);
