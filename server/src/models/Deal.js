import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    discountPercent: { type: Number, required: true, min: 0, max: 100 },
    dealLabel: { type: String, default: 'Deal' },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Deal', dealSchema);
