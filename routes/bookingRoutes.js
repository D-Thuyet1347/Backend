import express from "express";
import { createBooking, getAllBookings, updateBooking, deleteBooking, getBookingUser, updateStatus, checkEmployeeAvailability } from "../controllers/bookingController.js";
import authMiddleware from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.get("/list", getAllBookings);
bookingRouter.put("/update/:id", updateBooking);
bookingRouter.delete("/delete/:id", deleteBooking);
bookingRouter.post("/add",authMiddleware, createBooking);
bookingRouter.get("/bookings/user",authMiddleware, getBookingUser);
bookingRouter.put("/status",updateStatus);
bookingRouter.get("/check-availability", checkEmployeeAvailability);


export default bookingRouter;