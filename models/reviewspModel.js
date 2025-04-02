import mongoose from 'mongoose';

const reviewSPSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, 
  comment: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },
});

const ReviewSP = mongoose.model('ReviewSP', reviewSPSchema);

export default ReviewSP;
