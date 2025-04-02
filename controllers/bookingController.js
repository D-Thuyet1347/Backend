import BookingModel from "../models/bookingModel.js"; // Fixed capitalization
import ServiceModel from "../models/serviceModel.js"; // Fixed capitalization
import UserModel from "../models/userModel.js"; // Fixed capitalization
import BranchModel from "../models/branchModel.js"; // Fixed capitalization
import EmployeeModel from "../models/employeeModel.js"; // Fixed capitalization
import Stripe from "stripe";
import mongoose from "mongoose";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const { userId, serviceId, branchId, employeeId, date, time, notes } = req.body;

        // Validate user
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID người dùng không hợp lệ" });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            // Validate service
            if (!mongoose.Types.ObjectId.isValid(serviceId)) {
                return res.status(400).json({ message: "ID dịch vụ không hợp lệ" });
            }
            const service = await ServiceModel.findById(serviceId);
            if (!service) {
                // Validate branch
                if (!mongoose.Types.ObjectId.isValid(branchId)) {
                    return res.status(400).json({ message: "ID chi nhánh không hợp lệ" });
                }
                const branch = await BranchModel.findById(branchId);
                if (!branch) {
                    // Validate employee
                    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
                        return res.status(400).json({ message: "ID nhân viên không hợp lệ" });
                    }
                    const employee = await EmployeeModel.findById(employeeId);
                    if (!employee) {
                        return res.status(404).json({ message: "Không tìm thấy nhân viên" });
                    }
                    if (!branch) {
                        return res.status(404).json({ message: "Không tìm thấy chi nhánh" });
                    }
                }
                // Validate employee
                const employee = await EmployeeModel.findById(employeeId);
                if (!employee) {
                    return res.status(404).json({ message: "Không tìm thấy nhân viên" });
                }

                // Create a payment intent
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: service.price * 100, // Assuming price is in VND, converting to smallest unit (stripe uses cents or equivalent)
                    currency: "vnd",
                    payment_method_types: ["card"],
                });

                // Create booking
                const booking = new BookingModel({
                    user: userId,
                    service: serviceId,
                    branch: branchId,
                    employee: employeeId,
                    date,
                    time,
                    notes,
                    paymentIntentId: paymentIntent.id, // Attach payment intent ID
                });

                await booking.save();

                // Return success response with client secret for frontend payment confirmation
                res.status(201).json({
                    message: "Đặt lịch thành công",
                    booking,
                    clientSecret: paymentIntent.client_secret,
                });
            }

        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });

    }
}


// Get all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await BookingModel.find()
            .populate("user")
            .populate("service");
            res.json({success:true,data:bookings})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

// Get booking by ID
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await BookingModel.findById(id)
            .populate("user")
            .populate("service");

        if (!booking) {
            return res.status(404).json({ message: "Không tìm thấy lịch đặt" });
        }

        await booking.populate("branch").populate("employee");
        res.json({success:true,data:booking})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

// Update booking
const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time, notes } = req.body;

        const booking = await BookingModel.findByIdAndUpdate(
            id,
            { date, time, notes },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: "Không tìm thấy lịch đặt" });
        }

        res.status(200).json({ message: "Cập nhật lịch đặt thành công", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });
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

        res.status(200).json({ message: "Xóa đặt lịch thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ", error });
    }
};

export { createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking };