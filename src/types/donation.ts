// Tipos para las donaciones
export interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount?: number;
  donationType: 'monetaria' | 'especie';
  inKindDescription?: string;
  inKindType?: string;
  donationDate: Date;
  certificateSent: boolean;
  certificateSentDate?: Date;
}

export interface DonationFormData {
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount?: number;
  donationType: 'monetaria' | 'especie';
  inKindDescription?: string;
  inKindType?: string;
}