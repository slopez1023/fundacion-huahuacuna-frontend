# 🚀 Inicio Rápido - Sistema de Certificados

## ⚡ Configuración Inicial (5 minutos)

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Edita `.env.local` y configura tu email SMTP:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-contraseña-de-aplicacion
```

**Para Gmail:**
1. Ve a tu cuenta de Google → Seguridad
2. Activa verificación en 2 pasos
3. Genera una "Contraseña de aplicación"
4. Usa esa contraseña en `SMTP_PASSWORD`

### 3. Iniciar servidor
```bash
npm run dev
```

## 🎯 Probar el Sistema

### Opción 1: Desde la interfaz
1. Ve a `http://localhost:3000/donaciones`
2. Completa el formulario de donación
3. Verifica que recibiste el email de confirmación
4. Nota el número de certificado asignado

### Opción 2: Con la API directamente
```bash
# Crear una donación
curl -X POST http://localhost:3000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "donorName": "Test User",
    "donorEmail": "test@example.com",
    "donorPhone": "1234567890",
    "donationType": "monetaria",
    "amount": 50000
  }'
```

### Ver donaciones guardadas
```bash
cat data/donations.json
```

## 📧 Envío de Certificados

### Producción (automático)
- Los certificados se envían automáticamente el 1 de enero a las 9:00 AM
- No requiere intervención manual

### Desarrollo (manual)
```bash
# Ver certificados pendientes
curl http://localhost:3000/api/certificates/send

# Enviar certificados manualmente
curl -X POST http://localhost:3000/api/certificates/send
```

## 🧪 Probar con Fecha del Año Pasado

Para probar el envío de certificados, edita `data/donations.json` y cambia el año:

```json
{
  "donationDate": "2024-06-15T10:30:00.000Z"  // Año pasado
}
```

Luego ejecuta:
```bash
curl -X POST http://localhost:3000/api/certificates/send
```

## 📁 Archivos Principales

```
src/
├── app/
│   ├── api/
│   │   ├── donations/route.ts          # Registrar donaciones
│   │   └── certificates/send/route.ts  # Enviar certificados
│   └── donaciones/page.tsx             # Formulario de donaciones
├── lib/
│   ├── certificateGenerator.ts         # Generar PDFs
│   ├── emailService.ts                 # Enviar emails
│   ├── donationStorage.ts              # Guardar donaciones
│   └── cronJobs.ts                     # Tareas programadas
└── types/
    └── donation.ts                     # Tipos TypeScript
```

## 🔧 Solución de Problemas

### El email no se envía
- ✅ Verifica las credenciales SMTP en `.env.local`
- ✅ Para Gmail, usa contraseña de aplicación, no tu contraseña normal
- ✅ Revisa los logs del servidor para ver errores

### El certificado no tiene datos
- ✅ Asegúrate que existe el archivo `public/Cert_Donacion_Huahuacuna.pdf`
- ✅ Verifica que las posiciones del texto en `certificateGenerator.ts` son correctas

### No se guardan las donaciones
- ✅ Verifica permisos de escritura en la carpeta `data/`
- ✅ Crea manualmente la carpeta si no existe: `mkdir data`

## 📊 Flujo Completo

1. **Usuario dona** → Formulario en `/donaciones`
2. **Sistema registra** → Guarda en `data/donations.json`
3. **Email confirmación** → Se envía inmediatamente
4. **Espera** → Hasta 1 de enero del año siguiente
5. **Cron job** → Se ejecuta automáticamente
6. **Certificado** → Se genera PDF y se envía por email
7. **Marca enviado** → Actualiza el registro

## ⚙️ Personalización

### Cambiar horario de envío
Edita `src/lib/cronJobs.ts`:
```typescript
// Cambiar '0 9 1 1 *' por tu horario deseado
// Formato: minuto hora día mes día-semana
cron.schedule('0 9 1 1 *', sendCertificatesJob);
```

### Personalizar email
Edita `src/lib/emailService.ts` → función `sendDonationCertificate`

### Personalizar PDF
Edita `src/lib/certificateGenerator.ts` → función `generateDonationCertificate`

## 🚀 Deploy a Producción

### Consideraciones:
1. **Migrar a base de datos**: Reemplazar JSON por PostgreSQL/MongoDB
2. **Cron jobs externos**: Vercel no soporta cron jobs, usar:
   - Vercel Cron Jobs
   - AWS EventBridge
   - Servicios como cron-job.org
3. **Seguridad**: Agregar autenticación a las APIs
4. **Backups**: Respaldar las donaciones regularmente

## 📝 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start

# Ver logs en tiempo real
npm run dev | grep "Certificado"

# Probar envío de certificados
npm run send:certificates
```

## 🆘 Soporte

Consulta `CERTIFICADOS_README.md` para documentación completa.