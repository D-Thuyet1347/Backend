import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  password: { type: String, required: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  address: { type: String, required: false },
  dateOfBirth: { type: Date, required: false },
  phoneNumber: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: false },
  role: { type: String, enum: ['user', 'admin', 'manager', 'employee'], default: 'user' },
  cartData: { type: Object, default: {} },
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  isEmailVerified: { type: Boolean, default: false },
  vouchers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' }], // Thay savedVouchers thành vouchers để đồng bộ
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model('User', userSchema);
export default userModel; 