import express from 'express';
import {
  addVoucher,
  getVouchers,
  getVoucherByCode,
  deleteVoucher,
  redeemVoucher,
  updateVoucher,
  getUserVouchers,
  saveUserVoucher,
  removeUserVoucher,
} from '../controllers/voucherController.js';
import authMiddleware from '../middleware/auth.js';

const voucherRouter = express.Router();

voucherRouter.post('/', authMiddleware, addVoucher);
voucherRouter.get('/', getVouchers);
voucherRouter.get('/code/:voucherCode', getVoucherByCode);
voucherRouter.delete('/:id', authMiddleware, deleteVoucher);
voucherRouter.post('/redeem/:voucherCode', authMiddleware, redeemVoucher);
voucherRouter.put('/:id', authMiddleware, updateVoucher);
voucherRouter.get('/user', authMiddleware, getUserVouchers);
voucherRouter.post('/user', authMiddleware, saveUserVoucher);
voucherRouter.delete('/user/:voucherId', authMiddleware, removeUserVoucher);

export default voucherRouter;