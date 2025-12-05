# 🔧 Solución: Notificaciones de PayU no llegan

## 🎯 Problema Identificado

Las notificaciones de donaciones por **PayU NO llegan al panel administrativo** porque:

1. ✅ Transferencia bancaria → **FUNCIONA** (llama directamente al backend)
2. ✅ Donación en especie → **FUNCIONA** (llama directamente al backend)
3. ❌ Pago en línea PayU → **NO FUNCIONA** (webhook no llega en desarrollo local)

## 🚫 Por qué NO funciona PayU en localhost

PayU necesita enviar una confirmación a tu servidor cuando el pago se completa. Esta es la **URL de confirmación**:

```
http://localhost:3000/api/payu/confirmation
```

**El problema:** PayU está en internet, pero `localhost:3000` NO es accesible desde internet. PayU no puede llamar a tu servidor local.

---

## ✅ Soluciones

### Opción 1: Usar ngrok (Recomendado para desarrollo) 🌐

Ngrok crea un túnel público a tu servidor local.

#### Paso 1: Instalar ngrok

```bash
# Con npm
npm install -g ngrok

# O descarga desde https://ngrok.com/download
```

#### Paso 2: Exponer tu puerto 3000

```bash
ngrok http 3000
```

Verás algo como:

```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

#### Paso 3: Configurar variables de entorno

Edita `.env.local`:

```env
# URL pública de ngrok (cámbiala cada vez que reinicies ngrok)
NEXT_PUBLIC_BASE_URL=https://abc123.ngrok.io

# PayU
PAYU_CONFIRMATION_URL=https://abc123.ngrok.io/api/payu/confirmation
PAYU_RESPONSE_URL=https://abc123.ngrok.io/payu/response
```

#### Paso 4: Reiniciar el servidor de Next.js

```bash
# Detén el servidor (Ctrl+C)
npm run dev
```

#### Paso 5: Hacer una prueba de pago

1. Ve a `http://localhost:3000/donaciones` (o `https://abc123.ngrok.io/donaciones`)
2. Haz una donación con PayU
3. Completa el pago en PayU
4. **PayU ahora SÍ podrá llamar al webhook**
5. Verifica las notificaciones en el dashboard

---

### Opción 2: Simular la confirmación de PayU manualmente 🧪

Si no quieres usar ngrok, puedes simular la confirmación de PayU:

#### Crear archivo: `scripts/simulate-payu-confirmation.ts`

```typescript
/**
 * Simula una confirmación de PayU para probar el webhook localmente
 */

async function simulatePayUConfirmation() {
  console.log('🧪 Simulando confirmación de PayU...\n');

  const confirmationUrl = 'http://localhost:3000/api/payu/confirmation';

  // Datos de ejemplo de una confirmación de PayU
  const formData = new FormData();
  
  // Datos básicos
  formData.append('merchant_id', '508029');
  formData.append('state_pol', '4'); // 4 = Aprobado
  formData.append('risk', '1');
  formData.append('response_code_pol', '1');
  formData.append('reference_sale', `TEST_${Date.now()}`);
  formData.append('reference_pol', '123456789');
  formData.append('sign', 'test_signature'); // En producción debe ser válida
  formData.append('extra1', 'Juan Pérez Test|3001234567'); // nombre|telefono
  formData.append('extra2', 'CC|123456789');
  formData.append('payment_method', 'VISA');
  formData.append('payment_method_type', '2');
  formData.append('value', '50000');
  formData.append('tax', '0');
  formData.append('transaction_date', new Date().toISOString());
  formData.append('currency', 'COP');
  formData.append('email_buyer', 'test@example.com');
  formData.append('test', '1'); // Modo prueba
  formData.append('description', 'Donación de prueba');
  formData.append('transaction_id', `TXN_${Date.now()}`);
  formData.append('phone', '3001234567');

  console.log('📤 Enviando confirmación simulada...');

  try {
    const response = await fetch(confirmationUrl, {
      method: 'POST',
      body: formData,
    });

    console.log('📥 Respuesta:', response.status, response.statusText);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Confirmación procesada:', result);
      console.log('\n🔔 Ahora verifica el dashboard de notificaciones');
      console.log('   → http://localhost:3000/dashboard/notifications\n');
    } else {
      const error = await response.text();
      console.log('❌ Error:', error);
    }
  } catch (error) {
    console.log('❌ Error en la petición:', error);
  }
}

simulatePayUConfirmation();
```

#### Ejecutar:

```bash
npx tsx scripts/simulate-payu-confirmation.ts
```

---

### Opción 3: Desactivar validación de firma (Solo desarrollo) ⚠️

**ADVERTENCIA:** Solo para pruebas locales. NUNCA en producción.

Edita `src/app/api/payu/confirmation/route.ts` y comenta temporalmente la validación de firma:

```typescript
// ========================================================================
// PASO 3: Validar firma de seguridad
// ========================================================================

const config = getPayUConfig();

// ⚠️ SOLO PARA DESARROLLO - Comentar esta validación
/*
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
*/

logTransaction('Firma validada correctamente (DESARROLLO)');
```

---

## 🔍 Cómo Verificar si el Webhook está Funcionando

### Ver logs del webhook

Los logs se guardan en la consola del servidor Next.js. Busca:

```
🔍 Datos extraídos de PayU: { donorName: '...', ... }
📤 Enviando donación al backend: { fullName: '...', ... }
📥 Respuesta del backend: { status: 200, ... }
✅ Donación de PayU registrada exitosamente
🔔 Notificación creada para el administrador
```

### Verificar en el backend

En los logs de Spring Boot deberías ver:

```
📝 Creando donación para: Juan Pérez
✅ Donación guardada con ID: 123
📧 Email de confirmación enviado
🔔 Notificaciones creadas para todos los administradores sobre la donación 123
```

---

## 🎯 Recomendación Final

**Para desarrollo:**
- Usa **ngrok** (Opción 1)
- O simula las confirmaciones (Opción 2)

**Para producción:**
- Tu servidor estará en un dominio público (ej: `https://fundacion.com`)
- PayU SÍ podrá llamar al webhook
- Todo funcionará automáticamente

---

## 🧪 Script de Prueba Rápido

Crea este archivo para probar el webhook:

**`scripts/test-payu-webhook.ts`**

```typescript
async function testPayUWebhook() {
  const webhookUrl = 'http://localhost:3000/api/payu/confirmation';
  
  console.log('🧪 Probando webhook de PayU...\n');
  console.log('📍 URL:', webhookUrl);
  
  // Simular POST de PayU
  const formData = new URLSearchParams();
  formData.append('state_pol', '4');
  formData.append('merchant_id', '508029');
  formData.append('reference_sale', `TEST_${Date.now()}`);
  formData.append('value', '50000');
  formData.append('currency', 'COP');
  formData.append('email_buyer', 'test@example.com');
  formData.append('extra1', 'Test User|3001234567');
  formData.append('transaction_id', `TXN_${Date.now()}`);
  formData.append('sign', 'test');
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    
    console.log('✅ Status:', response.status);
    console.log('📄 Response:', await response.text());
  } catch (error) {
    console.log('❌ Error:', error);
  }
}

testPayUWebhook();
```

Ejecutar: `npx tsx scripts/test-payu-webhook.ts`

---

## ✅ Checklist de Verificación

- [ ] ¿Estás usando ngrok o un dominio público?
- [ ] ¿La variable `PAYU_CONFIRMATION_URL` apunta a una URL pública?
- [ ] ¿Reiniciaste el servidor de Next.js después de cambiar `.env.local`?
- [ ] ¿Verificaste los logs del servidor Next.js?
- [ ] ¿Verificaste los logs del backend de Spring Boot?
- [ ] ¿Estás logueado como ADMIN en el dashboard?

---

**Si sigues estos pasos, las notificaciones de PayU empezarán a funcionar.** 🎉
