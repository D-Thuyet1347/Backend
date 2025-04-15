import BookingModel from "../models/bookingModel.js";

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { service, branch, employee, date, time, notes } = req.body;
    if (!service || !branch || !employee || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc"
      });
    }
    const userId = req.user._id;
    const newBooking = new BookingModel({
      user: userId,
      service,
      branch,
      employee,
      date,
      time,
      notes: notes || '',
      status: "Đang xử lý"
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Đặt lịch thành công",
      data: newBooking
    });
  } catch (error) {
    console.error('Lỗi khi tạo booking:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi tạo booking",
      error: error.message
    });
  }
};


const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find()
    .populate("user", "name email")
    .populate("service", "name price")
    .populate("branch", "BranchName")
    .populate({
      path: "employee",
      populate: { path: "UserID", select: "firstName" },
      
    });

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ", error });
  }
};
const getBookingById = async (req, res) => {
  try {
    const userID= req.user._id;
    const { employeeId } = req.params;
    const bookings = await BookingModel.find({ employee: employeeId })
    .populate("service", "name price")
    .populate("branch", "BranchName")
    .populate({
      path: "employee",
      populate: { path: "UserID", select: "firstName" },
    });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error('Lỗi lấy lịch theo nhân viên:', error);
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const getBookingUser = async (req, res) => {
  try {
    const booking = await BookingModel.find({ user: req.user._id })
    .populate("user", "name email")
    .populate("service", "name price")
    .populate("branch", "BranchName")
    .populate({
      path: "employee",
      populate: { path: "UserID", select: "firstName" },
    });

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy lịch đặt" });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ", error });
  }
};

// Update booking
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, notes, status } = req.body;

    const booking = await BookingModel.findByIdAndUpdate(
      id,
      { date, time, notes, status },
      { new: true }
    ).populate("user service branch employee");

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy lịch đặt" });
    }

    res.status(200).json({ message: "Cập nhật lịch đặt thành công", success: true, data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ", error });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await BookingModel.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy lịch đặt" });
    }

    res.status(200).json({ message: "Xóa đặt lịch thành công", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ", error });
  }
};
const updateStatus = async (req, res) => {
  try {
      const { bookingId, bookingStatus } = req.body; // Destructure only needed fields

      if (!bookingId || !orderStatus) {
          return res.status(400).json({ 
              success: false, 
              message: "Order ID and status are required" 
          });
      }

      const updatedBooking = await BookingModel.findByIdAndUpdate(
        bookingId,
          { bookingStatus }, // Only update orderStatus
          { new: true, runValidators: true } // Return updated doc and run schema validations
      );

      if (!updatedBooking) {
          return res.status(404).json({ 
              success: false, 
              message: "Order not found" 
          });
      }
      res.json({ 
          success: true, 
          message: "Order status updated successfully",
          data: updatedBooking 
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

export { createBooking, getAllBookings, updateBooking, deleteBooking,getBookingUser,getBookingById,updateStatus };
