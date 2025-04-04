import express from 'express'
import {registerUser,loginUser,quenmk,verifyCodeAndResetPassword,changePassword,listUser,removeUser,updateUser,getUserInfo,updateUserRole, getCurrentUser} from '../controllers/userController.js'
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
userRouter.put('/update/:id', authMiddleware, upload.single('avatar'), updateUser)
userRouter.post('/:id/role', updateUserRole)
// Thêm endpoint mới
userRouter.get('/me/info', authMiddleware, getCurrentUser)

export default userRouter