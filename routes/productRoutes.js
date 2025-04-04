import express from "express";
import { addProduct, getProductById, listProduct, removeProduct, updateProduct } from "../controllers/productController.js"; 
import multer from "multer";

const productRouter = express.Router();

const storage =multer.diskStorage({ //dis.. tai file len diskStorage()luu tr va dat ten
    destination:'uploads',
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`) // ko baoloi-
    }
})
const upload=multer({storage:storage})
productRouter.post("/add", upload.single("ImagePD"), addProduct);
productRouter.put("/update", updateProduct);
productRouter.get('/list', listProduct); 
productRouter.post("/remove", removeProduct);
productRouter.get('/:id', getProductById); 


export default productRouter;
