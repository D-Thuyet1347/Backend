import express from 'express';
import { addVoucher, getVouchers, getVoucherByCode, deleteVoucher, redeemVoucher, updateVoucher } from '../controllers/voucherController.js';

const voucherRouter = express.Router();
voucherRouter.post('/vouchers', addVoucher);
voucherRouter.get('/vouchers', getVouchers);
voucherRouter.get('/vouchers/code/:voucherCode', getVoucherByCode);
voucherRouter.delete('/vouchers/:id', deleteVoucher);
voucherRouter.post('/vouchers/redeem/:voucherCode', redeemVoucher);
voucherRouter.put('/vouchers/:id', updateVoucher);

export default voucherRouter;
