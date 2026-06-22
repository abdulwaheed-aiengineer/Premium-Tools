/**
 * Provider-agnostic payment service interface.
 * v1: Manual screenshot-based flow only.
 * Future providers (Easypaisa API, JazzCash API, Safepay, PayFast, etc.)
 * can be plugged in by adding a new case to the factory without restructuring orders.
 */

export const PAYMENT_METHODS = {
  EASYPAISA: 'easypaisa',
  JAZZCASH: 'jazzcash',
  BANK_TRANSFER: 'bank_transfer',
};

export const PAYMENT_INSTRUCTIONS = {
  easypaisa: {
    accountName: 'Premium Tools Store',
    accountNumber: '03001234567',
    instructions: 'Send payment to Easypaisa number and upload screenshot.',
  },
  jazzcash: {
    accountName: 'Premium Tools Store',
    accountNumber: '03117654321',
    instructions: 'Send payment to JazzCash number and upload screenshot.',
  },
  bank_transfer: {
    bankName: 'Meezan Bank',
    accountName: 'Premium Tools Store',
    accountNumber: 'PK12MEZN0001234567890123',
    iban: 'PK12MEZN0001234567890123',
    instructions: 'Transfer to bank account and upload receipt screenshot.',
  },
};

/**
 * Initiate a payment for an order.
 * For manual flow, this returns instructions. For API-based gateways it would
 * return a redirect URL or payment token.
 */
export async function initiatePayment({ order, method }) {
  const provider = getProvider(method);
  return provider.initiate({ order });
}

/**
 * Verify a payment record.
 * For manual flow, this is done by admin review.
 * For API gateways, this would call the provider's verification endpoint.
 */
export async function verifyPayment({ paymentId, orderId, method }) {
  const provider = getProvider(method);
  return provider.verify({ paymentId, orderId });
}

function getProvider(method) {
  switch (method) {
    case PAYMENT_METHODS.EASYPAISA:
    case PAYMENT_METHODS.JAZZCASH:
    case PAYMENT_METHODS.BANK_TRANSFER:
    default:
      return manualProvider;
  }
}

const manualProvider = {
  async initiate({ order }) {
    return {
      provider: 'manual',
      method: order.paymentMethod,
      instructions: PAYMENT_INSTRUCTIONS[order.paymentMethod] || {},
      requiresScreenshot: true,
    };
  },
  async verify({ paymentId }) {
    return {
      provider: 'manual',
      paymentId,
      status: 'pending_admin_review',
    };
  },
};
