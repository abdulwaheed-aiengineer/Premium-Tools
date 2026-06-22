import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      enum: ['about', 'faqs', 'privacy', 'terms', 'refund', 'contact'],
    },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Page', pageSchema);
