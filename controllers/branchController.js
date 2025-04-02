import BranchModel from "../models/branchModel.js";

const getAllBranches = async (req, res) => {
    try {
        const branches = await BranchModel.find();
        res.json({success:true,data:branches});
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách chi nhánh", error });
    }
};

const getBranchById = async (req, res) => {
    try {   
        const branch = await BranchModel.findById(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: "Không tìm thấy chi nhánh" });
        }
        res.status(200).json(branch);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy chi nhánh", error });
    }
};

const createBranch = async (req, res) => {
    try {
        const newBranch = new BranchModel(req.body);
        await newBranch.save();
        res.status(201).json(newBranch);
    } catch (error) {
        res.status(400).json({ message: "Lỗi khi tạo chi nhánh", error });
    }
};

const updateBranch = async (req, res) => {
    try {
        const updatedBranch = await BranchModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBranch) {
            return res.status(404).json({ message: "Không tìm thấy chi nhánh để cập nhật" });
        }
        res.status(200).json(updatedBranch);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật chi nhánh", error });
    }
};

const deleteBranch = async (req, res) => {
    try {
        const deletedBranch = await BranchModel.findByIdAndDelete(req.params.id);
        if (!deletedBranch) {
            return res.status(404).json({ message: "Không tìm thấy chi nhánh để xóa" });
        }
        res.status(200).json({ message: "Xóa chi nhánh thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa chi nhánh", error });
    }
};

export  { getAllBranches, createBranch, updateBranch, deleteBranch,getBranchById };
