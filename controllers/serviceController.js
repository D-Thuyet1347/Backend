import Service from '../models/serviceModel.js'

// Create a new service
const createService = async (req, res) => {
    try{
       const newService = new Service(req.body);
       await newService.save();
       res.status(201).json({success:true,message:'Thêm dịch vụ thành công',data:newService}) 
    }catch(error){
        res.status(500).json({success:false,message:'Thêm dịch vụ thất bại',error:error.message})
    }
};

const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json({success:true,data:services})
    } catch (error) {
        res.status(500).json({ message: 'Lỗi load dịch vụ', error: error.message });
    }
};

const getServiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ success: false,message: 'Không tìm thấy dịch vụ' });
        }
        res.status(200).json({success: true, message: 'Lấy dịch vụ thành công', data: service });
    } catch (error) {
        res.status(500).json({success: false, message: 'Lỗi load dịch vụ', error: error.message });
    }
};

// Update a service
const updateService = async (req, res) => {
    try {
      const { id, ...updateData } = req.body; 
      const updatedService = await Service.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!updatedService) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }
      
      res.status(200).json({ success: true, data: updatedService });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Error updating service' });
    }
  };
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
const searchServices = async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;
    try {
      const query = {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
        ],
      };
      const services = await Service.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit);
      const total = await Service.countDocuments(query);
      res.json({
        success: true,
        data: services,
        total,
        page,
        pages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error('Error searching services:', error);
      res.status(500).json({ success: false, message: 'Lỗi khi tìm kiếm dịch vụ' });
    }
  };
export {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
    searchServices
};