import express from "express";
import { addProduct, listProduct, removeProduct } from "../controllers/productController.js"; 
import multer from "multer";
import path from "path";



const productRouter = express.Router();

const storage =multer.diskStorage({ //dis.. tai file len diskStorage()luu tr va dat ten
    destination:'uploads',
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`) // ko baoloi-
    }
})
const upload=multer({storage:storage})

// productRouter.post("/add", upload.single("ImagePD"), addProduct);
productRouter.post("/add", upload.single("ImagePD"), addProduct);
productRouter.post("/update", upload.single("ImagePD"), addProduct);
productRouter.get('/list', listProduct); 
productRouter.post("/remove", removeProduct);

export default productRouter;
