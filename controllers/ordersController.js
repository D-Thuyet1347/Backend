import orderModel from "../models/ordersModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// tra the
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    const { userId, items, totalAmount, shippingAddress, paymentMethod, note } = req.body; // Lấy thông tin note

    if (!userId || !items || !totalAmount || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newOrder = new orderModel({
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "card" ? "Pending" : "Cash on Delivery",
      note, // Lưu ghi chú vào đơn hàng
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    if (paymentMethod === "cod") {
      return res.json({ success: true, message: "Order placed successfully with COD" });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "vnd", 
        product_data: { name: item.name },
        unit_amount: item.price * 100, // Convert price to VND cent
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "vnd",
        product_data: { name: "Delivery Charges" },
        unit_amount: 30000 * 100, // Convert to VND cent
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontend_url}/order-failed`,
    });

    res.json({ success: true, sessionId: session.id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Order placement failed" });
  }
};
  //kiêm tra thanh toán ok ko
  const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
      if (!orderId) {
        return res.status(400).json({ success: false, message: "Order ID is required" });
      }
  
      if (success) {
        await orderModel.findByIdAndUpdate(orderId, { paymentStatus: "Paid" });
        return res.json({ success: true, message: "Payment successful" });
      } else {
        await orderModel.findByIdAndUpdate(orderId, { paymentStatus: "Failed" });
        return res.json({ success: false, message: "Payment failed" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

   // tim dơn người dùng
  const userOrders=async(req,res)=>{
    try {
       const orders =await orderModel.find({userId:req.body.userId})
       res.json({success:true,data:orders})
    } catch (error) {
     console.log(error);
     res.json({ success: false, message: "Error " });
    }
   }
   //ds 
   const listOrders=async(req,res)=>{
     try {
       const orders =await orderModel.find({});
       res.json({success:true,data:orders})
    } catch (error) {
     console.log(error);
     res.json({ success: false, message: "Error " });
    }
   }
   // Cập nhật trạng thái đơn hàng và trạng thái thanh toán
   const updateStatus = async (req, res) => {
    try {
      const { orderId, status, paymentStatus } = req.body;
      
      if (!orderId || !status || !paymentStatus) {
        return res.status(400).json({ success: false, message: "Order ID, status and payment status are required" });
      }      
      await orderModel.findByIdAndUpdate(orderId, { 
        orderStatus: status, 
        paymentStatus: paymentStatus 
      });
      res.json({ success: true, message: "Order status and payment status updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  

export { placeOrder,verifyOrder,userOrders,listOrders,updateStatus };