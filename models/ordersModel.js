import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      items: { type: Array, required: true },
      totalAmount: { type: Number, required: true }, // Thêm trường này
      shippingAddress: { type: Object, required: true },
      orderStatus: { type: String, default: "Đang xử lý" },
      orderDate: { type: Date, default: Date.now },
      paymentMethod: { type: String, required: true },
      paymentStatus: { type: String, default: "Đang xử lý" },
      note: { type: String },
    },
    { timestamps: true }
  );

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;