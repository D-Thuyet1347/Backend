import express from 'express';
import { addVoucher, getVouchers, getVoucherByCode, deleteVoucher, redeemVoucher, updateVoucher } from '../controllers/voucherController.js';

const voucherRouter = express.Router();
voucherRouter.post('/add', addVoucher);
voucherRouter.get('/list', getVouchers);
voucherRouter.get('/code/:voucherCode', getVoucherByCode);
voucherRouter.delete('/:id', deleteVoucher);
voucherRouter.post('/redeem/:voucherCode', redeemVoucher);
voucherRouter.put('/:id', updateVoucher);

export default voucherRouter;