import express from 'express'
import { addTocart,removeFromCart,getCart,decreaseTocart } from '../controllers/cartController.js'
import authMiddleware from '../middleware/auth.js';

const cartRouter=express.Router();
cartRouter.post("/add",authMiddleware,addTocart)
cartRouter.post("/decrease",authMiddleware,decreaseTocart)
cartRouter.post("/remove",authMiddleware,removeFromCart)
cartRouter.post("/get",authMiddleware,getCart)

export default cartRouter;