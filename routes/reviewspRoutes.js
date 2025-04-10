import express from 'express';
import { addReviewSP, getReviewsByProduct, removeReviewSP } from '../controllers/reviewspController.js';
import authMiddleware from '../middleware/auth.js';

const reviewRouter = express.Router();

reviewRouter.post('/add',addReviewSP);
reviewRouter.get('/:productId', getReviewsByProduct);
reviewRouter.delete('/remove/:id', removeReviewSP);

export default reviewRouter;
