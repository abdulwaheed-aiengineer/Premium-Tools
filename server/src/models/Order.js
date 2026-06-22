import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true },
    productSlug: { type: String },
    productImage: { type: String, default: '' },
    variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', default: null },
    variantLabel: { type: String, default: '' },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      notes: { type: String, default: '' },
    },
    paymentMethod: {
      type: String,
      enum: ['easypaisa', 'jazzcash', 'bank_transfer'],
      required: true,
    },
    status: {
      type: String,
      enum: [
        'pending_payment',
        'payment_submitted',
        'under_verification',
        'paid_processing',
        'completed',
        'rejected',
        'cancelled',
        'refunded',
      ],
      default: 'pending_payment',
    },
    paymentScreenshot: { type: String, default: '' },
    transactionId: { type: String, default: '' },
    credentialsDelivered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `PT-${timestamp}-${random}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
