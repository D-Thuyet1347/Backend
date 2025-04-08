import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
    try {
      const { itemId, quantity } = req.body; 
      const user = await userModel.findById(req.user.id); 
      let cartData = user.cartData || {};  // Lấy giỏ hàng của người dùng
  
      // Nếu sản phẩm đã có trong giỏ, tăng số lượng
      cartData[itemId] = (cartData[itemId] || 0) + quantity;
  
      // Cập nhật giỏ hàng trong DB
      await userModel.findByIdAndUpdate(user.id, { cartData });
  
      return res.status(200).json({ success: true, message: "Item added to cart successfully!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Internal server error." });
    }
  };
const decreaseTocart = async (req, res) => {
    try {
        const { itemId } = req.body;
        const user = await userModel.findById(req.user.id);
        let cartData = user.cartData || {};
        
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] <= 0) {
                delete cartData[itemId];
            }
        }
        
        await userModel.findByIdAndUpdate(user.id, { cartData });
        
        return res.status(200).json({ success: true, message: "Item quantity decreased in cart." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error decreasing item quantity in cart." });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.body;
        const user = await userModel.findById(req.user.id);
        let cartData = user.cartData || {};
        if(cartData[itemId]>0)
            {
                delete cartData[itemId];
            }   
        await userModel.findByIdAndUpdate(user.id, { cartData });
        return res.status(200).json({ success: true, message: "Item removed from cart." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error removing item from cart." });
    }
};
// Xóa tất cả sản phẩm trong giỏ hàng
const clearCart = async (req, res) => {
    try {
      const user = await userModel.findById(req.user.id);
      user.cartData = {};
      await user.save();
      
      return res.status(200).json({
        success: true,
        message: "Cart cleared successfully.",
        data: user.cartData,  // Trả về cartData đã được xóa
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Error clearing cart.",
      });
    }
  };
  

const getCart = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        let cartData = user.cartData || {};
        
        return res.status(200).json({ success: true, data: cartData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error retrieving cart data." });
    }
};

export { addToCart, decreaseTocart, removeFromCart, getCart,clearCart };
