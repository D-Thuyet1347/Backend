import express from 'express'
import { addToCart,removeFromCart,getCart,decreaseTocart, clearCart} from '../controllers/cartController.js'
import authMiddleware from '../middleware/auth.js';

const cartRouter=express.Router();
cartRouter.post("/add",authMiddleware,addToCart)
cartRouter.post("/decrease",authMiddleware,decreaseTocart)
cartRouter.post("/remove",authMiddleware,removeFromCart)
cartRouter.get("/get",authMiddleware,getCart)
cartRouter.post("/clear",authMiddleware,clearCart)

export default cartRouter;