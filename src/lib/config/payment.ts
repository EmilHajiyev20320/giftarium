/**
 * Payment configuration - WhatsApp payment flow
 * Payments are processed through WhatsApp conversations
 */

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentProvider {
  WHATSAPP = 'WHATSAPP',
}
