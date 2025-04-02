import express from "express";
import { getAllBlogs, createBlog, updateBlog, deleteBlog, getBlogById } from "../controllers/blogcontroller.js";

const blogRouter = express.Router();
import multer from "multer";


const storage =multer.diskStorage({ //dis.. tai file len diskStorage()luu tr va dat ten
    destination:'uploads',
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`) // ko baoloi-
    }
})
const upload=multer({storage:storage})
blogRouter.get("/", getAllBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.post("/add",upload.single("image"), createBlog);
blogRouter.put("/update/:id", updateBlog);
blogRouter.delete("/delete/:id", deleteBlog);
export default blogRouter