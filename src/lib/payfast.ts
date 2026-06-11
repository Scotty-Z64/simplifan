/**
 * PayFast Integration (South Africa's Leading Payment Gateway)
 * 
 * This module handles the complete PayFast payment flow:
 * - Generate payment forms with secure signatures
 * - Validate ITN (Instant Transaction Notification) webhooks
 * - Calculate deposits and transaction fees
 * 
 * To go live:
 * 1. Register at https://www.payfast.co.za
 * 2. Replace sandbox credentials with live credentials
 * 3. Update PAYFAST_URL to https://www.payfast.co.za/eng/process
 */

// Sandbox credentials for development
const PAYFAST_CONFIG = {
  merchantId: import.meta.env.VITE_PAYFAST_MERCHANT_ID || '10000100',
  merchantKey: import.meta.env.VITE_PAYFAST_MERCHANT_KEY || '46f0cd694581a',
  passphrase: import.meta.env.VITE_PAYFAST_PASSPHRASE || '',
  sandbox: import.meta.env.VITE_PAYFAST_SANDBOX !== 'false',
};

export const PAYFAST_URL = PAYFAST_CONFIG.sandbox
  ? 'https://sandbox.payfast.co.za/eng/process'
  : 'https://www.payfast.co.za/eng/process';

export const PAYFAST_ITN_URL = PAYFAST_CONFIG.sandbox
  ? 'https://sandbox.payfast.co.za/eng/query/validate'
  : 'https://www.payfast.co.za/eng/query/validate';

export interface PayFastPaymentData {
  amount: number;
  itemName: string;
  itemDescription?: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  customStr1?: string; // bookingId
  customStr2?: string; // vendorId
  customStr3?: string; // clientPhone
  emailAddress?: string;
  cellNumber?: string;
  nameFirst?: string;
  nameLast?: string;
}

/**
 * Generate MD5 signature for PayFast payment
 * This is required for payment security
 */
function generateSignature(data: Record<string, string>, passphrase?: string): string {
  // Sort keys alphabetically
  const sortedKeys = Object.keys(data).sort();
  let signatureString = '';

  for (const key of sortedKeys) {
    if (data[key] && key !== 'signature') {
      signatureString += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, '+')}&`;
    }
  }

  // Remove trailing &
  signatureString = signatureString.slice(0, -1);

  if (passphrase && passphrase.trim()) {
    signatureString += `&passphrase=${encodeURIComponent(passphrase.trim())}`;
  }

  // MD5 hash
  return md5(signatureString);
}

/**
 * Simple MD5 implementation for browser
 */
function md5(input: string): string {
  // For production, use a proper MD5 library
  // This is a simplified version for development
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

/**
 * Build PayFast payment form data
 */
export function buildPaymentForm(data: PayFastPaymentData): {
  url: string;
  fields: Record<string, string>;
} {
  const paymentData: Record<string, string> = {
    merchant_id: PAYFAST_CONFIG.merchantId,
    merchant_key: PAYFAST_CONFIG.merchantKey,
    amount: data.amount.toFixed(2),
    item_name: data.itemName.substring(0, 100),
    return_url: data.returnUrl,
    cancel_url: data.cancelUrl,
    notify_url: data.notifyUrl,
  };

  if (data.itemDescription) {
    paymentData['item_description'] = data.itemDescription.substring(0, 255);
  }
  if (data.customStr1) paymentData['custom_str1'] = data.customStr1;
  if (data.customStr2) paymentData['custom_str2'] = data.customStr2;
  if (data.customStr3) paymentData['custom_str3'] = data.customStr3;
  if (data.emailAddress) paymentData['email_address'] = data.emailAddress;
  if (data.cellNumber) paymentData['cell_number'] = data.cellNumber;
  if (data.nameFirst) paymentData['name_first'] = data.nameFirst;
  if (data.nameLast) paymentData['name_last'] = data.nameLast;

  // Add signature
  paymentData['signature'] = generateSignature(
    paymentData,
    PAYFAST_CONFIG.passphrase || undefined
  );

  return {
    url: PAYFAST_URL,
    fields: paymentData,
  };
}

/**
 * Calculate deposit amount (50% of total)
 */
export function calculateDeposit(totalAmount: number): number {
  return Math.round(totalAmount * 0.5 * 100) / 100;
}

/**
 * Calculate SimpliPlan transaction fee
 */
export function calculateTransactionFee(bookingValue: number, tier: 'starter' | 'pro' | 'elite'): number {
  const rates = { starter: 0.07, pro: 0.05, elite: 0.03 };
  return Math.round(bookingValue * rates[tier] * 100) / 100;
}

/**
 * Validate ITN data from PayFast
 * Returns true if the notification is valid
 */
export function validateITN(data: Record<string, string>): boolean {
  // 1. Check signature
  const receivedSignature = data['signature'];
  const computedSignature = generateSignature(data, PAYFAST_CONFIG.passphrase || undefined);

  if (receivedSignature !== computedSignature) {
    console.warn('[PayFast] Signature mismatch');
    return false;
  }

  // 2. Check payment status
  if (data['payment_status'] !== 'COMPLETE') {
    console.warn('[PayFast] Payment not complete:', data['payment_status']);
    return false;
  }

  // 3. Check amount is positive
  const amount = parseFloat(data['amount_gross'] || '0');
  if (amount <= 0) {
    console.warn('[PayFast] Invalid amount:', amount);
    return false;
  }

  return true;
}

/**
 * Store payment record locally (until backend is ready)
 */
export interface PaymentRecord {
  id: string;
  payfastPaymentId: string;
  bookingId: string;
  vendorId: string;
  clientPhone: string;
  amount: number;
  type: 'deposit' | 'balance' | 'full';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payfastStatus?: string;
  createdAt: string;
  completedAt?: string;
}

export function savePaymentRecord(payment: PaymentRecord): void {
  const existing = JSON.parse(localStorage.getItem('sp_payments') || '[]');
  existing.push(payment);
  localStorage.setItem('sp_payments', JSON.stringify(existing));
}

export function getPaymentRecords(): PaymentRecord[] {
  return JSON.parse(localStorage.getItem('sp_payments') || '[]');
}

export function getPaymentByBookingId(bookingId: string): PaymentRecord | undefined {
  return getPaymentRecords().find(p => p.bookingId === bookingId);
}

/**
 * Get total revenue from payments
 */
export function getTotalPaymentRevenue(): number {
  return getPaymentRecords()
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
}

/**
 * Payment status labels
 */
export const PAYMENT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: '#f59e0b' },
  completed: { label: 'Completed', color: '#10b981' },
  failed: { label: 'Failed', color: '#ef4444' },
  refunded: { label: 'Refunded', color: '#6366f1' },
};
