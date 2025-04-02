import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    
    if (!token) {
        return res.status(401).json({ success: false, message: "Không có token, vui lòng đăng nhập lại" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

export default authMiddleware;
