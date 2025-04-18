import BookingModel from "../models/bookingModel.js";
import userModel from "../models/userModel.js"; // Thêm import userModel
import nodemailer from "nodemailer"; // Thêm import nodemailer

// Hàm gửi email xác nhận lịch đặt
const sendBookingConfirmationEmail = async (userEmail, bookingDetails) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Xác nhận đặt lịch thành công",
    html: `
      <h2>Xác nhận đặt lịch</h2>
      <p>Chào bạn,</p>
      <p>Cảm ơn bạn đã đặt lịch với chúng tôi. Dưới đây là chi tiết lịch đặt của bạn:</p>
      <ul>
        <li><strong>Dịch vụ</strong>: ${bookingDetails.service.name}</li>
        <li><strong>Chi nhánh</strong>: ${bookingDetails.branch.BranchName}</li>
        <li><strong>Nhân viên</strong>: ${bookingDetails.employee.UserID.firstName} ${bookingDetails.employee.UserID.lastName}</li>
        <li><strong>Ngày</strong>: ${bookingDetails.date}</li>
        <li><strong>Giờ</strong>: ${bookingDetails.time}</li>
        <li><strong>Thời lượng</strong>: ${bookingDetails.duration} phút</li>
        <li><strong>Ghi chú</strong>: ${bookingDetails.notes || "Không có"}</li>
        <li><strong>Trạng thái</strong>: ${bookingDetails.status}</li>
      </ul>
      <p>Vui lòng kiểm tra thông tin và liên hệ với chúng tôi nếu cần thay đổi.</p>
      <p>Chúc bạn một ngày tốt lành!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const createBooking = async (req, res) => {
  try {
    console.log('Request body:', req.body);

    const { service, branch, employee, date, time, duration } = req.body;

    // Validate required fields
    if (!service || !branch || !employee || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc"
      });
    }

    // Convert time to minutes for comparison
    const convertToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const newStart = convertToMinutes(time);
    const newEnd = newStart + (parseInt(duration) || 60);

    // Check for overlapping bookings
    const existingBookings = await BookingModel.find({
      employee,
      date
    });

    for (const booking of existingBookings) {
      const bookingStart = convertToMinutes(booking.time);
      const bookingEnd = bookingStart + (booking.duration || 60);

      if (newStart < bookingEnd && newEnd > bookingStart) {
        return res.status(400).json({
          success: false,
          message: `Nhân viên đã có lịch từ ${booking.time} đến ${formatEndTime(booking.time, booking.duration || 60)}`
        });
      }
    }

    // Create new booking
    const newBooking = new BookingModel({
      user: req.user._id,
      service,
      branch,
      employee,
      date,
      time,
      duration: duration || 60,
      notes: req.body.notes || '',
      status: "Đang xử lý"
    });

    // Lưu booking và populate thông tin liên quan
    const savedBooking = await newBooking.save();
    const populatedBooking = await BookingModel.findById(savedBooking._id)
      .populate("user", "email")
      .populate("service", "name")
      .populate("branch", "BranchName")
      .populate({
        path: "employee",
        populate: { path: "UserID", select: "firstName lastName" },
      });

    // Gửi email xác nhận
    try {
      await sendBookingConfirmationEmail(populatedBooking.user.email, populatedBooking);
    } catch (emailError) {
      console.error('Lỗi khi gửi email xác nhận:', emailError);
      // Không trả về lỗi cho client, chỉ ghi log vì booking đã thành công
    }

    res.status(201).json({
      success: true,
      message: "Đặt lịch thành công",
      data: populatedBooking
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

function formatEndTime(startTime, duration) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}

function calculateEndTime(startTime, duration) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + (duration || 60);
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}

const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find()
      .populate("user", "firstName lastName")
      .populate("service", "name price")
      .populate("branch", "BranchName")
      .populate({
        path: "employee",
        populate: { path: "UserID", select: "firstName lastName" },
      });

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ", error });
  }
};

const getBookingById = async (req, res) => {
  try {
    const userID = req.user._id;
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
        populate: { path: "UserID", select: "firstName lastName" },
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
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({
        success: false,
        message: "Booking ID và trạng thái là bắt buộc",
      });
    }

    const updatedBooking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { status, updatedAt: Date.now() },
      {
        new: true,              // Trả về document đã update
        runValidators: true,    // Chạy validator của schema
      }
    );

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy booking",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái booking:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ, không thể cập nhật trạng thái booking",
      error: error.message,
    });
  }
};

// Thêm hàm này vào bookingController.js
const checkEmployeeAvailability = async (req, res) => {
  try {
    const { employeeId, date, time, duration } = req.query;

    if (!employeeId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc (employeeId, date, time)"
      });
    }

    const bookings = await BookingModel.find({
      employee: employeeId,
      date: date
    });

    const requestedStart = convertTimeToMinutes(time);
    const requestedEnd = requestedStart + (parseInt(duration) || 60); // Mặc định 60 phút nếu không có duration

    for (const booking of bookings) {
      const bookingStart = convertTimeToMinutes(booking.time);
      const bookingEnd = bookingStart + (booking.duration || 60);

      if (requestedStart < bookingEnd && requestedEnd > bookingStart) {
        return res.json({
          available: false,
          message: `Nhân viên đã có lịch từ ${booking.time} đến ${formatMinutesToTime(bookingEnd)}`
        });
      }
    }

    res.json({ available: true });
  } catch (error) {
    console.error('Lỗi khi kiểm tra lịch nhân viên:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi kiểm tra lịch nhân viên"
    });
  }
};

// Hàm hỗ trợ chuyển đổi thời gian
function convertTimeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatMinutesToTime(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}
export {
  createBooking,
  getAllBookings,
  updateBooking,
  deleteBooking,
  getBookingUser,
  getBookingById,
  updateStatus,
  checkEmployeeAvailability,
};

