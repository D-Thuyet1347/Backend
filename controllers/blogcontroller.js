import blogModel from "../models/blogModel.js";

// Lấy tất cả bài viết
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await blogModel.find(); 
        res.json({ success: true, data: blogs });
    } catch (error) {
        res.status(500).json({ message: "Lỗi tải bài viết", error });
    }
};

// Lấy bài viết theo ID
const getBlogById = async (req, res) => {
    try {
        const blog = await blogModel.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Không tìm thấy bài viết" });
        }
        res.json({ success: true, data: blog });
    } catch (error) {
        res.status(500).json({ message: "Lỗi tải bài viết", error });
    }
};

// Tạo bài viết mới
const createBlog = async (req, res) => {
    try {
        const newBlog = new blogModel(req.body);
        await newBlog.save();
        res.status(201).json({ success: true, data: newBlog });
    } catch (error) {
        res.status(400).json({ message: "Lỗi tạo bài viết", error });
    }
};

const updateBlog = async (req, res) => {
    try {
        const updatedBlog = await blogModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBlog) {
            return res.status(404).json({ message: "Không tìm thấy bài viết để cập nhật" });
        }
        res.json({ success: true, data: updatedBlog }); // ✅ Phản hồi sau khi cập nhật
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật bài viết", error });
    }
};

// Xóa bài viết theo ID
const deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await blogModel.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ message: "Không tìm thấy bài viết để xóa" });
        }
        res.json({ success: true, message: "Xóa bài viết thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa bài viết", error });
    }
};

export { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
