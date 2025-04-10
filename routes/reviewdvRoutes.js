import express from 'express';
import { addReviewSV, getReviewsByService, removeReviewSV } from '../controllers/reviewdvController.js';

const reviewRouter = express.Router();
reviewRouter.post('/add', addReviewSV);
reviewRouter.get('/:serviceId', getReviewsByService);
reviewRouter.delete('/remove/:id', removeReviewSV);

export default reviewRouter;
