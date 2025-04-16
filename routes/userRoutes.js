import express from 'express'
import {registerUser,loginUser,quenmk,confirmEmail ,verifyCodeAndResetPassword,changePassword,listUser,removeUser,updateUser,getUserInfo,updateUserRole, getCurrentUser, saveVoucher, removeSavedVoucher, getSavedVouchers} from '../controllers/userController.js'
import authMiddleware from '../middleware/auth.js'
import multer from "multer";

const storage = multer.diskStorage({
    destination:'uploads',
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})
const upload = multer({storage:storage})

const userRouter = express.Router()
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/quenmk', quenmk)
userRouter.post('/verify-code-and-reset-password', verifyCodeAndResetPassword)
userRouter.post('/changepassword', authMiddleware, changePassword)
userRouter.get('/list', listUser)
userRouter.post('/remove', removeUser)
userRouter.get('/:id', getUserInfo)
userRouter.get("/confirm/:verificationCode", confirmEmail);
userRouter.put('/update/:id', authMiddleware, upload.single('avatar'), updateUser)
userRouter.post('/:id/role', updateUserRole)
userRouter.post('/save-voucher', authMiddleware, saveVoucher);           // Route mới
userRouter.post('/remove-saved-voucher', authMiddleware, removeSavedVoucher); // Route mới
userRouter.get('/saved-vouchers', authMiddleware, getSavedVouchers);     // Route mới
// Thêm endpoint mới
userRouter.get('/me/info', authMiddleware, getCurrentUser)

export default userRouter
