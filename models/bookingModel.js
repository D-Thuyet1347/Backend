import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // Tham chiếu đến collection User
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service", // Tham chiếu đến collection Service
        required: true
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch", // Tham chiếu đến collection Branch (nếu có)
        required: true
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee", // Tham chiếu đến collection Employee (nếu có)
        required: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    bookingTime: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // Định dạng HH:MM (24h)
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: /^[0-9]{10,11}$/ // Validation cho số điện thoại VN
    },
    email: {
        type: String,
        required: true, // Đặt required để gửi xác nhận
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Validation email cơ bản
    },
    status: {
        type: String,
        enum: ["Đang xử lý", "Đã xác nhận", "Đã hoàn thành", "Đã hủy"],
        default: "Đang xử lý"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        trim: true
    },

});

bookingSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const BookingModel = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default BookingModel;