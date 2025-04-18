import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: false,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service", 
    required: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch", 
    required: true,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  },
  phone: {
    type: String,
    required: false,
    trim: true,
    match: /^[0-9]{10,11}$/,
  },
  email: {
    type: String,
    required: false, 
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validation email cơ bản
  },
 status: {
  type: String,
  default: "Đang xử lý"
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
