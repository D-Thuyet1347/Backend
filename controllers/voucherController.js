
import Voucher from '../models/voucherModel.js';

// API thêm voucher mới
const addVoucher = async (req, res) => {
  const { code, discount, maximumDiscount, minimumAmount, startDate, endDate, usageLimit, applicableTo } = req.body;
  try {
    const existingVoucher = await Voucher.findOne({ code });
    if (existingVoucher) {
      return res.status(400).json({ message: 'Voucher đã tồn tại.' });
    }

    const newVoucher = new Voucher({
      code,
      discount,
      maximumDiscount,
      minimumAmount,
      startDate,
      endDate,
      usageLimit,
      usageLeft: 0,
      applicableTo, // Thêm trường mới
    });

    await newVoucher.save();
    res.status(201).json({ message: 'Voucher đã được lưu thành công.', voucher: newVoucher });
  } catch (error) {
    console.error('Lỗi khi tạo voucher:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lưu voucher.' });
  }
};
const getVouchers = async (req, res) => {
  try {
    const { applicableTo } = req.query; // Lấy tham số lọc từ query
    let query = {};

    // Nếu có tham số applicableTo, thêm vào query
    if (applicableTo && ['products', 'services', 'all'].includes(applicableTo)) {
      query.applicableTo = applicableTo;
    }

    const vouchers = await Voucher.find(query);
    res.json(vouchers);
  } catch (error) {
    console.error('Lỗi khi lấy voucher:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách voucher.' });
  }
};

// API lấy voucher theo mã
const getVoucherByCode = async (req, res) => {
  try {
    const { voucherCode } = req.params;
    const voucher = await Voucher.findOne({ code: voucherCode });

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher không tồn tại.' });
    }
;
    res.status(200).json({success: true, data: voucher });
  } catch (error) {
    console.error('Lỗi khi tìm voucher:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi.' });
  }
};

// API xóa voucher
const deleteVoucher = async (req, res) => {
  try {
    const voucherId = req.params.id;
    const deletedVoucher = await Voucher.findByIdAndDelete(voucherId);

    if (!deletedVoucher) {
      return res.status(404).json({ message: 'Voucher không tìm thấy.' });
    }

    res.status(200).json({ message: 'Voucher đã được xóa thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa voucher:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa voucher.' });
  }
};

// API tăng số lượng sử dụng của voucher
const redeemVoucher = async (req, res) => {
  try {
    const { voucherCode } = req.params;
    const voucher = await Voucher.findOne({ code: voucherCode });

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher không tồn tại.' });
    }

    if (voucher.usageLeft >= voucher.usageLimit) {
      return res.status(400).json({ message: 'Voucher đã hết lượt sử dụng.' });
    }

    voucher.usageLeft += 1;
    await voucher.save();

    res.status(200).json({ message: 'Voucher đã được áp dụng thành công.', voucher });
  } catch (error) {
    console.error('Lỗi khi áp dụng voucher:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi áp dụng voucher.' });
  }
};

// API chỉnh sửa voucher
const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVoucher = await Voucher.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedVoucher) {
      return res.status(404).json({ message: 'Voucher không tìm thấy.' });
    }
    res.status(200).json(updatedVoucher);
  } catch (error) {
    console.error('Lỗi khi cập nhật voucher:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật voucher.' });
  }
};


export { addVoucher, getVouchers, getVoucherByCode, deleteVoucher, redeemVoucher, updateVoucher };