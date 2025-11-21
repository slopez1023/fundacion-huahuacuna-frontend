/**
 * Script de inicialización del servidor
 * Ejecuta los cron jobs al iniciar la aplicación
 */

import { initializeCertificateCronJob } from './lib/cronJobs';

// Inicializar cron jobs
console.log('🚀 Inicializando sistema de certificados...');
initializeCertificateCronJob();
console.log('✅ Sistema de certificados inicializado correctamente');

// Para desarrollo, descomenta la siguiente línea para ejecutar cada minuto:
// import { initializeCertificateCronJobDev } from './lib/cronJobs';
// initializeCertificateCronJobDev();