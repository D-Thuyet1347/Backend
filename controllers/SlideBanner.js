import slideModel from "../models/SlideBanner.js";

export const getAllSlides = async (req, res) => {
    try {
        const slides = await slideModel.find();
        res.json({ success: true, data: slides });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi tải slide", error });
    }
};

export const createSlide = async (req, res) => {
    try {
        const newSlide = new slideModel(req.body);
        await newSlide.save();
        res.status(201).json({ success: true, data: newSlide });
    } catch (error) {
        res.status(400).json({ success: false, message: "Lỗi tạo slide", error });
    }
};

export const deleteSlide = async (req, res) => {
    try {
        const deleted = await slideModel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Không tìm thấy slide" });
        res.json({ success: true, message: "Đã xóa slide" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa slide", error });
    }
};

export const updateSlide = async (req, res) => {
    try {
        const updateSlide = await slideModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateSlide) {
            return res.status(404).json({ message: "Không tìm thấy bài viết để cập nhật" });
        }
        res.json({ success: true, data: updateSlide }); // ✅ Phản hồi sau khi cập nhật
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật bài viết", error });
    }
};