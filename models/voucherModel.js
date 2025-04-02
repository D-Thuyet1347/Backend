import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, trim: true, uppercase: true },
  discount: { type: Number, required: true, min: 1 },
  maximumDiscount: { type: Number, required: true, min: 0 },
  minimumAmount: { type: Number, required: true, min: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  usageLimit: { type: Number, required: true, min: 1 },
  usageLeft: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }, // Thêm createdAt giống mẫu của bạn
});

const Voucher = mongoose.model('Voucher', voucherSchema);

export default Voucher;
