/**
 * PayU Integration Library
 * Utilidades para integración con PayU Latam
 * Modo: Simulación + Real (Configurable)
 */

import crypto from 'crypto';

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

export interface PayUConfig {
  merchantId: string;
  apiKey: string;
  accountId: string;
  apiUrl: string;
  responseUrl: string;
  confirmationUrl: string;
  testMode: boolean;
}

export interface BuyerInfo {
  fullName: string;
  email: string;
  phone: string;
  documentType: 'CC' | 'CE' | 'NIT' | 'TI' | 'PP' | 'DNI';
  documentNumber: string;
}

export interface PaymentData {
  referenceCode: string;
  description: string;
  amount: number;
  currency: 'COP' | 'USD' | 'MXN' | 'ARS' | 'BRL' | 'PEN' | 'CLP';
  tax?: number;
  taxReturnBase?: number;
  buyer: BuyerInfo;
}

export interface PayUFormData {
  merchantId: string;
  accountId: string;
  description: string;
  referenceCode: string;
  amount: string;
  tax: string;
  taxReturnBase: string;
  currency: string;
  signature: string;
  test: string;
  buyerEmail: string;
  buyerFullName: string;
  telephone: string;
  responseUrl: string;
  confirmationUrl: string;
  extra1?: string;
  extra2?: string;
  extra3?: string;
}

export interface PayUResponse {
  merchant_id: string;
  state_pol: '4' | '5' | '6' | '7' | '104'; // 4=Approved, 5=Expired, 6=Declined, 7=Pending, 104=Error
  risk?: string;
  response_code_pol: string;
  reference_sale: string;
  reference_pol: string;
  sign: string;
  extra1?: string;
  extra2?: string;
  extra3?: string;
  payment_method: string;
  payment_method_type: string;
  installments_number?: string;
  value: string;
  tax?: string;
  transaction_date: string;
  currency: string;
  email_buyer: string;
  cus?: string;
  pse_bank?: string;
  test?: string;
  description: string;
  billing_address?: string;
  shipping_address?: string;
  phone?: string;
  office_phone?: string;
  account_number_ach?: string;
  account_type_ach?: string;
  administrative_fee?: string;
  administrative_fee_base?: string;
  administrative_fee_tax?: string;
  airline_code?: string;
  attempts?: string;
  authorization_code?: string;
  bank_id?: string;
  billing_city?: string;
  billing_country?: string;
  commision_pol?: string;
  commision_pol_currency?: string;
  customer_number?: string;
  date?: string;
  error_code_bank?: string;
  error_message_bank?: string;
  exchange_rate?: string;
  ip?: string;
  nickname_buyer?: string;
  nickname_seller?: string;
  payment_method_id?: string;
  payment_request_state?: string;
  pseReference1?: string;
  pseReference2?: string;
  pseReference3?: string;
  response_message_pol?: string;
  shipping_city?: string;
  shipping_country?: string;
  transaction_bank_id?: string;
  transaction_id: string;
  transaction_type?: string;
}

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

/**
 * Obtener configuración de PayU desde variables de entorno
 */
export function getPayUConfig(): PayUConfig {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  
  return {
    merchantId: process.env.PAYU_MERCHANT_ID || '508029',
    apiKey: process.env.PAYU_API_KEY || '4Vj8eK4rloUd272L48hsrarnUA',
    accountId: process.env.PAYU_ACCOUNT_ID || '512321',
    apiUrl: process.env.PAYU_API_URL || 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/',
    responseUrl: process.env.PAYU_RESPONSE_URL || `${baseUrl}/payu/response`,
    confirmationUrl: process.env.PAYU_CONFIRMATION_URL || `${baseUrl}/api/payu/confirmation`,
    testMode: process.env.PAYU_TEST_MODE === 'true' || process.env.NODE_ENV === 'development',
  };
}

// ============================================================================
// GENERACIÓN DE FIRMA
// ============================================================================

/**
 * Generar firma MD5 para PayU (Página de Pagos)
 * Formato: ApiKey~merchantId~referenceCode~amount~currency
 * 
 * @param apiKey - API Key de PayU
 * @param merchantId - ID del comercio
 * @param referenceCode - Código único de referencia
 * @param amount - Monto del pago
 * @param currency - Moneda (COP, USD, etc.)
 * @returns Firma MD5 en hexadecimal
 */
export function generatePaymentSignature(
  apiKey: string,
  merchantId: string,
  referenceCode: string,
  amount: number,
  currency: string
): string {
  // Formatear el monto con 1 decimal
  const formattedAmount = amount.toFixed(1);
  
  // Crear string para firma
  const signatureString = `${apiKey}~${merchantId}~${referenceCode}~${formattedAmount}~${currency}`;
  
  // Generar MD5
  return crypto.createHash('md5').update(signatureString).digest('hex');
}

/**
 * Generar firma MD5 para validar respuesta de PayU
 * Formato: ApiKey~merchantId~referenceCode~value~currency~state_pol
 * 
 * @param apiKey - API Key de PayU
 * @param merchantId - ID del comercio
 * @param referenceCode - Código de referencia
 * @param value - Valor de la transacción
 * @param currency - Moneda
 * @param statePol - Estado de la transacción
 * @returns Firma MD5 en hexadecimal
 */
export function generateResponseSignature(
  apiKey: string,
  merchantId: string,
  referenceCode: string,
  value: string,
  currency: string,
  statePol: string
): string {
  // Redondear el valor a 1 decimal
  const numValue = parseFloat(value);
  const formattedValue = numValue.toFixed(1);
  
  // Crear string para firma
  const signatureString = `${apiKey}~${merchantId}~${referenceCode}~${formattedValue}~${currency}~${statePol}`;
  
  // Generar MD5
  return crypto.createHash('md5').update(signatureString).digest('hex');
}

/**
 * Validar firma de respuesta de PayU
 * 
 * @param response - Respuesta de PayU
 * @param apiKey - API Key de PayU
 * @returns true si la firma es válida
 */
export function validateResponseSignature(response: PayUResponse, apiKey: string): boolean {
  const expectedSignature = generateResponseSignature(
    apiKey,
    response.merchant_id,
    response.reference_sale,
    response.value,
    response.currency,
    response.state_pol
  );
  
  return expectedSignature.toLowerCase() === response.sign.toLowerCase();
}

// ============================================================================
// PREPARACIÓN DE DATOS PARA PAYU
// ============================================================================

/**
 * Preparar datos de formulario para enviar a PayU
 * 
 * @param paymentData - Datos del pago
 * @param config - Configuración de PayU
 * @returns Objeto con todos los parámetros necesarios para el formulario
 */
export function preparePayUFormData(
  paymentData: PaymentData,
  config: PayUConfig
): PayUFormData {
  const signature = generatePaymentSignature(
    config.apiKey,
    config.merchantId,
    paymentData.referenceCode,
    paymentData.amount,
    paymentData.currency
  );

  return {
    merchantId: config.merchantId,
    accountId: config.accountId,
    description: paymentData.description,
    referenceCode: paymentData.referenceCode,
    amount: paymentData.amount.toFixed(1),
    tax: (paymentData.tax || 0).toFixed(1),
    taxReturnBase: (paymentData.taxReturnBase || 0).toFixed(1),
    currency: paymentData.currency,
    signature,
    test: config.testMode ? '1' : '0',
    buyerEmail: paymentData.buyer.email,
    buyerFullName: paymentData.buyer.fullName,
    telephone: paymentData.buyer.phone,
    responseUrl: config.responseUrl,
    confirmationUrl: config.confirmationUrl,
    // Extras opcionales para pasar información adicional
    extra1: paymentData.buyer.documentType,
    extra2: paymentData.buyer.documentNumber,
  };
}

// ============================================================================
// GENERACIÓN DE REFERENCIA ÚNICA
// ============================================================================

/**
 * Generar código de referencia único para la transacción
 * Formato: DONACION_TIMESTAMP_RANDOM
 * 
 * @param prefix - Prefijo para la referencia (default: 'DONACION')
 * @returns Código de referencia único
 */
export function generateReferenceCode(prefix: string = 'DONACION'): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
}

// ============================================================================
// INTERPRETACIÓN DE ESTADOS
// ============================================================================

export type TransactionStatus = 'approved' | 'declined' | 'expired' | 'pending' | 'error';

export interface TransactionStatusInfo {
  status: TransactionStatus;
  title: string;
  message: string;
  color: 'green' | 'red' | 'yellow' | 'blue' | 'gray';
  icon: string;
}

/**
 * Interpretar el estado de la transacción de PayU
 * 
 * @param statePol - Estado de PayU (4=Aprobada, 6=Rechazada, 7=Pendiente, etc.)
 * @returns Información interpretada del estado
 */
export function getTransactionStatus(statePol: string): TransactionStatusInfo {
  const statusMap: Record<string, TransactionStatusInfo> = {
    '4': {
      status: 'approved',
      title: '¡Pago Aprobado!',
      message: 'Tu transacción ha sido procesada exitosamente.',
      color: 'green',
      icon: '✅',
    },
    '5': {
      status: 'expired',
      title: 'Transacción Expirada',
      message: 'El tiempo para completar la transacción ha expirado.',
      color: 'yellow',
      icon: '⏰',
    },
    '6': {
      status: 'declined',
      title: 'Pago Rechazado',
      message: 'Tu transacción fue rechazada. Por favor verifica tus datos e intenta nuevamente.',
      color: 'red',
      icon: '❌',
    },
    '7': {
      status: 'pending',
      title: 'Pago Pendiente',
      message: 'Tu transacción está siendo procesada. Te notificaremos cuando esté completa.',
      color: 'blue',
      icon: '🕐',
    },
    '104': {
      status: 'error',
      title: 'Error en la Transacción',
      message: 'Ocurrió un error al procesar tu pago. Por favor intenta nuevamente.',
      color: 'gray',
      icon: '⚠️',
    },
  };

  return statusMap[statePol] || {
    status: 'error',
    title: 'Estado Desconocido',
    message: 'No pudimos determinar el estado de tu transacción. Contacta con soporte.',
    color: 'gray',
    icon: '❓',
  };
}

// ============================================================================
// MÉTODOS DE PAGO
// ============================================================================

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'CARD' | 'PSE' | 'CASH' | 'BANK_TRANSFER';
  icon: string;
  available: boolean;
}

/**
 * Obtener métodos de pago disponibles para Colombia
 */
export function getAvailablePaymentMethods(): PaymentMethod[] {
  return [
    {
      id: 'VISA',
      name: 'Visa',
      type: 'CARD',
      icon: '💳',
      available: true,
    },
    {
      id: 'MASTERCARD',
      name: 'Mastercard',
      type: 'CARD',
      icon: '💳',
      available: true,
    },
    {
      id: 'AMEX',
      name: 'American Express',
      type: 'CARD',
      icon: '💳',
      available: true,
    },
    {
      id: 'PSE',
      name: 'PSE (Débito bancario)',
      type: 'PSE',
      icon: '🏦',
      available: true,
    },
    {
      id: 'EFECTY',
      name: 'Efecty',
      type: 'CASH',
      icon: '💵',
      available: true,
    },
    {
      id: 'BALOTO',
      name: 'Baloto',
      type: 'CASH',
      icon: '💵',
      available: true,
    },
  ];
}

// ============================================================================
// TARJETAS DE PRUEBA
// ============================================================================

export interface TestCard {
  brand: string;
  number: string;
  cvv: string;
  expiryDate: string;
  expectedResult: 'approved' | 'declined' | 'pending';
}

/**
 * Obtener tarjetas de prueba de PayU
 */
export function getTestCards(): TestCard[] {
  return [
    {
      brand: 'Visa',
      number: '4097440000000004',
      cvv: '123',
      expiryDate: '12/29',
      expectedResult: 'approved',
    },
    {
      brand: 'Visa',
      number: '4111111111111111',
      cvv: '123',
      expiryDate: '12/29',
      expectedResult: 'declined',
    },
    {
      brand: 'Mastercard',
      number: '5500000000000004',
      cvv: '123',
      expiryDate: '12/29',
      expectedResult: 'approved',
    },
    {
      brand: 'Mastercard',
      number: '5424000000000015',
      cvv: '123',
      expiryDate: '12/29',
      expectedResult: 'approved',
    },
    {
      brand: 'American Express',
      number: '377813000000004',
      cvv: '1234',
      expiryDate: '12/29',
      expectedResult: 'approved',
    },
  ];
}

// ============================================================================
// SIMULACIÓN DE RESPUESTA DE PAYU (PARA DESARROLLO)
// ============================================================================

/**
 * Simular respuesta de PayU para testing
 * NOTA: Esto solo se debe usar en desarrollo/testing
 * 
 * @param referenceCode - Código de referencia del pago
 * @param amount - Monto del pago
 * @param currency - Moneda
 * @param approved - Si la transacción debe ser aprobada
 * @returns Objeto simulando respuesta de PayU
 */
export function simulatePayUResponse(
  referenceCode: string,
  amount: number,
  currency: string,
  approved: boolean = true
): Partial<PayUResponse> {
  const config = getPayUConfig();
  const statePol = approved ? '4' : '6'; // 4 = Aprobada, 6 = Rechazada
  const transactionId = `TXN_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const referencePolId = `POL_${Date.now()}`;
  
  const value = amount.toFixed(1);
  
  const signature = generateResponseSignature(
    config.apiKey,
    config.merchantId,
    referenceCode,
    value,
    currency,
    statePol
  );

  return {
    merchant_id: config.merchantId,
    state_pol: statePol,
    response_code_pol: approved ? '1' : '5',
    reference_sale: referenceCode,
    reference_pol: referencePolId,
    sign: signature,
    payment_method: approved ? 'VISA' : 'MASTERCARD',
    payment_method_type: '2', // 2 = Tarjeta de crédito
    value,
    tax: '0.0',
    transaction_date: new Date().toISOString(),
    currency,
    email_buyer: 'test@example.com',
    test: config.testMode ? '1' : '0',
    description: 'Transacción simulada',
    transaction_id: transactionId,
    authorization_code: approved ? `AUTH_${Date.now()}` : undefined,
    response_message_pol: approved ? 'APPROVED' : 'DECLINED',
  };
}

// ============================================================================
// UTILIDADES DE VALIDACIÓN
// ============================================================================

/**
 * Validar datos del comprador
 */
export function validateBuyerInfo(buyer: BuyerInfo): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!buyer.fullName || buyer.fullName.trim().length < 3) {
    errors.push('El nombre completo debe tener al menos 3 caracteres');
  }

  if (!buyer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email)) {
    errors.push('El email no es válido');
  }

  if (!buyer.phone || buyer.phone.length < 7) {
    errors.push('El teléfono debe tener al menos 7 dígitos');
  }

  if (!buyer.documentNumber || buyer.documentNumber.trim().length < 5) {
    errors.push('El número de documento no es válido');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validar monto de pago
 */
export function validateAmount(amount: number, minAmount: number = 1000): { valid: boolean; error?: string } {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: 'El monto debe ser mayor a 0' };
  }

  if (amount < minAmount) {
    return { valid: false, error: `El monto mínimo es ${minAmount}` };
  }

  return { valid: true };
}

// ============================================================================
// LOGGING Y DEBUG
// ============================================================================

/**
 * Log de transacción (solo en desarrollo)
 */
export function logTransaction(message: string, data?: unknown) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[PayU Transaction] ${message}`, data || '');
  }
}

/**
 * Log de error
 */
export function logError(message: string, error?: unknown) {
  console.error(`[PayU Error] ${message}`, error || '');
}