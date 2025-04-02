import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true }, 
    items: { type: Array, required: true }, 
    shippingAddress: { type: Object, required: true }, 
    orderStatus: { type: String, default: "Processing" }, 
    orderDate: { type: Date, default: Date.now }, 
    PaymentMethod: { type: String, required: true }, 
    paymentStatus: { type: String, default: "Pending" }, 
}, { timestamps: true }); 

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;
