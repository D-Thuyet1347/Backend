import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: false,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service", // Tham chiếu đến collection Service
    required: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch", // Tham chiếu đến collection Branch
    required: true,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: String, // Đổi từ Date thành String để khớp với dữ liệu từ frontend
    required: true,
  },
  time: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // Định dạng HH:MM (24h)
  },
  phone: {
    type: String,
    required: false, // Bỏ required
    trim: true,
    match: /^[0-9]{10,11}$/, // Validation cho số điện thoại VN
  },
  email: {
    type: String,
    required: false, // Bỏ required
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validation email cơ bản
  },
  status: {type: String, default: "Đang xử lý"},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  },
});

bookingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const BookingModel = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default BookingModel;
