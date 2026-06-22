import mongoose from 'mongoose';

const digitalCredentialsSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    credentials: { type: String, required: true },
    revealedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('DigitalCredentials', digitalCredentialsSchema);
