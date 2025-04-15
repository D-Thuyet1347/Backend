import orderModel from "../models/ordersModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const placeOrder = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy thông tin người dùng",
      });
    }
    const { items, totalAmount, shippingAddress, paymentMethod, note } = req.body;
    const formattedItems = items.map(item => {
      if (!item._id || !item.name || !item.price || !item.quantity) {
        throw new Error("Mỗi sản phẩm cần có _id, name, price và quantity");
      }
      return {
        productId: item._id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image || "",
      };
    });
    // Tạo đơn hàng mới
    const newOrder = new orderModel({
      userId,
      items: formattedItems,
      totalAmount: Number(totalAmount),
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "card" ? "Pending" : "Cash on Delivery",
      note,
      orderStatus: "Processing",
    });

    // Lưu đơn hàng vào database
    const savedOrder = await newOrder.save();
    
    // Xóa giỏ hàng
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    if (paymentMethod === "Thanh toán khi nhận hàng") {
      return res.json({
        success: true,
        message: "Đặt hàng thành công với COD",
        orderId: savedOrder._id,
      });
    }
    const line_items = [
      ...formattedItems.map(item => ({
        price_data: {
          currency: "vnd",
          product_data: { name: item.name },
          unit_amount: item.price * 100, // Chuyển sang VND cent
        },
        quantity: item.quantity,
      })),
      {
        price_data: {
          currency: "vnd",
          product_data: { name: "Phí vận chuyển" },
          unit_amount: 30000 * 100, // 30,000 VND
        },
        quantity: 1,
      },
    ];

    // Tạo Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${process.env.ClIENT_URL||"http://localhost:3000"}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.ClIENT_URL||"http://localhost:3000"}/verify?success=false&orderId=${newOrder._id}`,
    });
    res.json({
    success: true, session_url: session.url
    });
  } catch (error) {
    console.error("Lỗi khi xử lý đơn hàng:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống khi xử lý đơn hàng",
    });
  }
};

// Kiểm tra thanh toán
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
        console.error('Error in verifyOrder:', error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
const userOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is missing from req.user" });
    }

    const orders = await orderModel.find({ userId });
    // Định dạng lại dữ liệu cho frontend
    const formattedOrders = orders.map(order => ({
      orderId: order._id.toString(),
      orderDate: order.orderDate.toLocaleDateString('vi-VN'), // Định dạng ngày
      products: order.items, // Đổi tên từ items thành products
      total: order.totalAmount, // Đổi tên từ totalAmount thành total
      status: order.orderStatus.toLowerCase() // Chuẩn hóa trạng thái
    }));

    res.json({ success: true, data: formattedOrders });
  } catch (error) {
    console.error('Error in userOrders:', error);
    res.json({ success: false, message: "Error fetching orders", error: error.message });
  }
};

// Lấy danh sách tất cả đơn hàng
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        console.log('All orders:', orders);
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error in listOrders:', error);
        res.json({ success: false, message: "Error fetching orders", error: error.message });
    }
};

// Cập nhật trạng thái đơn hàng và trạng thái thanh toán
const updateStatus = async (req, res) => {
  try {
      const { orderId, orderStatus } = req.body; // Destructure only needed fields

      if (!orderId || !orderStatus) {
          return res.status(400).json({ 
              success: false, 
              message: "Order ID and status are required" 
          });
      }

      const updatedOrder = await orderModel.findByIdAndUpdate(
          orderId,
          { orderStatus }, // Only update orderStatus
          { new: true, runValidators: true } // Return updated doc and run schema validations
      );

      if (!updatedOrder) {
          return res.status(404).json({ 
              success: false, 
              message: "Order not found" 
          });
      }

      console.log('Successfully updated order status:', updatedOrder);
      res.json({ 
          success: true, 
          message: "Order status updated successfully",
          data: updatedOrder 
      });
  } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ 
          success: false, 
          message: "Failed to update order status",
          error: error.message 
      });
  }
};
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    const deletedOrder = await orderModel.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, deleteOrder };