import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ success: false, message: 'Không có token, ủy quyền bị từ chối' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Lỗi trong middleware xác thực:', error);
        return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
    }
};

 
export default authMiddleware;