import orderModel from "../models/ordersModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Đặt hàng
// ordersController.js
const placeOrder = async (req, res) => {
  try {
    // Kiểm tra user ID
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "Không tìm thấy thông tin người dùng" 
      });
    }

    // Validate dữ liệu đầu vào
    const { items, totalAmount, shippingAddress, paymentMethod, note } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0 || !totalAmount || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ 
        success: false, 
        message: "Vui lòng điền đầy đủ thông tin đơn hàng (items, totalAmount, shippingAddress, paymentMethod)" 
      });
    }

    // Kiểm tra từng item trong mảng items
    const formattedItems = items.map(item => {
      if (!item._id || !item.name || !item.price || !item.quantity) {
        throw new Error("Mỗi sản phẩm cần có _id, name, price và quantity");
      }
      return {
        productId: item._id,
        name: item.name,
        price: Number(item.price), // Chuyển sang số để đảm bảo
        quantity: Number(item.quantity),
        image: item.image || "" // Nếu không có image thì để rỗng
      };
    });

    // Tạo đơn hàng mới
    const newOrder = new orderModel({
      userId,
      items: formattedItems,
      totalAmount: Number(totalAmount), // Thêm totalAmount
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "card" ? "Pending" : "Cash on Delivery",
      note,
      orderStatus: "Processing"
    });

    // Lưu vào database
    const savedOrder = await newOrder.save();
    console.log('Đã lưu đơn hàng:', savedOrder);

    // Xóa giỏ hàng
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Xử lý thanh toán nếu là thẻ (giữ nguyên phần comment)
    if (paymentMethod === "card") {
      // Xử lý Stripe ở đây nếu cần
    }

    return res.json({
      success: true,
      message: "Đặt hàng thành công",
      orderId: savedOrder._id
    });

  } catch (error) {
    console.error('Lỗi khi lưu đơn hàng:', error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi lưu đơn hàng",
      error: error.message
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

// Lấy danh sách đơn hàng của người dùng
const userOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is missing from req.user" });
    }

    console.log('Fetching orders for userId:', userId.toString());
    const orders = await orderModel.find({ userId });
    console.log('Orders found:', orders);

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
