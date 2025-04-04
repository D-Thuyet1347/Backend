import express from 'express'
import { addToCart,removeFromCart,getCart,decreaseTocart } from '../controllers/cartController.js'
import authMiddleware from '../middleware/auth.js';

const cartRouter=express.Router();
cartRouter.post("/add",authMiddleware,addToCart)
cartRouter.post("/decrease",authMiddleware,decreaseTocart)
cartRouter.delete("/remove",authMiddleware,removeFromCart)
cartRouter.get("/get",authMiddleware,getCart)

export default cartRouter;