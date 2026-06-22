import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    method: {
      type: String,
      enum: ['easypaisa', 'jazzcash', 'bank_transfer'],
      required: true,
    },
    transactionId: { type: String, default: '' },
    screenshotUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verifiedAt: { type: Date, default: null },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
