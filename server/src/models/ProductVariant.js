import mongoose from 'mongoose';

const productVariantSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    label: { type: String, required: true, trim: true },
    duration: { type: String, default: '' },
    type: { type: String, enum: ['shared', 'private'], default: 'shared' },
    users: { type: Number, default: 1 },
    screens: { type: Number, default: 1 },
    region: { type: String, default: '' },
    planType: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    stock: { type: Number, default: -1 },
  },
  { timestamps: true }
);

export default mongoose.model('ProductVariant', productVariantSchema);
