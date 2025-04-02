import Service from '../models/serviceModel.js'

// Create a new service
const createService = async (req, res) => {
    try {
        const { name, description, price, duration, category, image } = req.body;

        const newService = new Service({
            name,
            description,
            price,
            duration,
            category,
            image // Optional, sẽ undefined nếu không gửi
        });

        await newService.save();
        res.status(201).json({ message: 'Tạo dịch vụ thành công', service: newService });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khởi tạo dịch vụ', error: error.message });
    }
};

// Get all services
const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json({success:true,data:services})
    } catch (error) {
        res.status(500).json({ message: 'Lỗi load dịch vụ', error: error.message });
    }
};

// Get a single service by ID
const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
        }

        res.json({success:true,data:service})
    } catch (error) {
        res.status(500).json({ message: 'Lỗi load dịch vụ', error: error.message });
    }
};

// Update a service
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, duration } = req.body;

        const updatedService = await Service.findByIdAndUpdate(
            id,
            { name, description, price, duration },
            { new: true }
        );

        if (!updatedService) {
            return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
        }

        res.status(200).json({ message: 'Cập nhật dịch vụ thành công', service: updatedService });
    } catch (error) {
        res.status(500).json({ message: 'Cập nhật dịch vụ thất bại', error: error.message });
    }
};

// Delete a service
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) {
            return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
        }

        res.status(200).json({ message: 'Xóa dịch vụ thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Xóa dịch vụ thất bại', error: error.message });
    }
};
export {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
};