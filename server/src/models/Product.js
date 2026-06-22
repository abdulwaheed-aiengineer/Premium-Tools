import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    longDescription: { type: String, default: '' },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    basePrice: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    inStock: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isTopSelling: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual('variants', {
  ref: 'ProductVariant',
  localField: '_id',
  foreignField: 'product',
});

export default mongoose.model('Product', productSchema);
