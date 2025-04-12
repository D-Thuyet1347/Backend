import express from "express"
import authMiddleware from "../middleware/auth.js"
import {placeOrder, userOrders, verifyOrder,listOrders, updateStatus, deleteOrder} from "../controllers/ordersController.js"

const orderRoute=express.Router();
orderRoute.post("/place",authMiddleware,placeOrder);
orderRoute.post("/verify",verifyOrder);
orderRoute.get("/userorders",authMiddleware,userOrders);
orderRoute.get("/list",listOrders);
orderRoute.put("/status",updateStatus);
orderRoute.delete("/delete-order", deleteOrder);
export default orderRoute;