export function formatPrice(amount) {
  return `PKR ${Number(amount).toLocaleString('en-PK')}`;
}

export function getImageUrl(path) {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  const base = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
  return `${base}${path}`;
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function truncate(str, len = 80) {
  if (!str) return '';
  return str.length > len ? `${str.slice(0, len)}...` : str;
}

export const ORDER_STATUS_MAP = {
  pending_payment: { label: 'Pending Payment', color: 'text-amber-600 bg-amber-50', step: 0 },
  payment_submitted: { label: 'Payment Submitted', color: 'text-blue-600 bg-blue-50', step: 1 },
  under_verification: { label: 'Under Verification', color: 'text-indigo-600 bg-indigo-50', step: 2 },
  paid_processing: { label: 'Processing', color: 'text-purple-600 bg-purple-50', step: 3 },
  completed: { label: 'Completed', color: 'text-green-600 bg-green-50', step: 4 },
  rejected: { label: 'Rejected', color: 'text-red-600 bg-red-50', step: -1 },
  cancelled: { label: 'Cancelled', color: 'text-gray-600 bg-gray-50', step: -1 },
  refunded: { label: 'Refunded', color: 'text-orange-600 bg-orange-50', step: -1 },
};

export const ORDER_STATUS_STEPS = [
  'pending_payment',
  'payment_submitted',
  'under_verification',
  'paid_processing',
  'completed',
];
