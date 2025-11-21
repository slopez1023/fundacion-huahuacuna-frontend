import { Donation } from '@/src/types/donation';
import fs from 'fs/promises';
import path from 'path';

// Archivo JSON para almacenar las donaciones (temporal, se recomienda usar una base de datos)
const DONATIONS_FILE = path.join(process.cwd(), 'data', 'donations.json');

// Asegurar que el directorio de datos existe
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Leer todas las donaciones
export async function getAllDonations(): Promise<Donation[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(DONATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Si el archivo no existe, retornar array vacío
    return [];
  }
}

// Guardar una donación
export async function saveDonation(donation: Donation): Promise<void> {
  try {
    await ensureDataDirectory();
    const donations = await getAllDonations();
    donations.push(donation);
    await fs.writeFile(DONATIONS_FILE, JSON.stringify(donations, null, 2));
  } catch (error) {
    console.error('Error guardando donación:', error);
    throw new Error('No se pudo guardar la donación');
  }
}

// Actualizar una donación
export async function updateDonation(id: string, updates: Partial<Donation>): Promise<void> {
  try {
    const donations = await getAllDonations();
    const index = donations.findIndex(d => d.id === id);
    
    if (index === -1) {
      throw new Error('Donación no encontrada');
    }
    
    donations[index] = { ...donations[index], ...updates };
    await fs.writeFile(DONATIONS_FILE, JSON.stringify(donations, null, 2));
  } catch (error) {
    console.error('Error actualizando donación:', error);
    throw error;
  }
}

// Obtener donaciones del año anterior sin certificado enviado
export async function getDonationsForCertificates(): Promise<Donation[]> {
  try {
    const donations = await getAllDonations();
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    
    return donations.filter(donation => {
      const donationDate = new Date(donation.donationDate);
      const donationYear = donationDate.getFullYear();
      
      // Donaciones del año anterior que no tienen certificado enviado
      return donationYear === lastYear && !donation.certificateSent;
    });
  } catch (error) {
    console.error('Error obteniendo donaciones para certificados:', error);
    return [];
  }
}