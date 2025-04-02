import express from 'express'
import {registerUser,loginUser,quenmk,verifyCodeAndResetPassword,changePassword,listUser,removeUser,updateUser,getUserInfo,updateUserRole} from '../controllers/userController.js'
import authMiddleware from '../middleware/auth.js'
import multer from "multer";


const storage =multer.diskStorage({ //dis.. tai file len diskStorage()luu tr va dat ten
    destination:'uploads',
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`) // ko baoloi-
    }
})
const upload=multer({storage:storage})

const userRouter=express.Router()
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/quenmk', quenmk);
userRouter.post('/verify-code-and-reset-password', verifyCodeAndResetPassword);
userRouter.post('/changepassword',authMiddleware, changePassword);
userRouter.get('/list',listUser)
userRouter.post('/remove',removeUser)
userRouter.get('/:id', getUserInfo);
userRouter.put('/update/:id', authMiddleware, (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error("Multer Error:", err);
            return res.status(400).json({ success: false, message: `Lỗi tải ảnh: ${err.message}` });
        } else if (err) {
             console.error("Upload Error:", err);
            return res.status(400).json({ success: false, message: err.message || "Lỗi không xác định khi tải ảnh." });
        }
        next();
    });
}, updateUser);
userRouter.post('/:id/role', updateUserRole);

export default userRouter;