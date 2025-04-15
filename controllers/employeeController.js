import EmployeeModel from "../models/employeeModel.js";
import UserModel from "../models/userModel.js"; 
import BranchModel from "../models/branchModel.js"; 
import BookingModel from "../models/bookingModel.js";


// Thêm mới nhân viên
const addEmployee = async (req, res) => {
    try {
        const { BranchID, UserID, Position, Status } = req.body;
        const user = await UserModel.findById(UserID);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        const branch = await BranchModel.findById(BranchID);
        if (!branch) {
            return res.status(404).json({ message: "Chi nhánh không tồn tại" });
        }
        const newEmployee = new EmployeeModel({
            BranchID,
            UserID,
            Position,
            Status
        });
        await newEmployee.save();
        res.status(201).json({ message: "Nhân viên đã được thêm thành công", employee: newEmployee });
    } catch (error) {
        console.error("Lỗi khi thêm nhân viên:", error);
        res.status(500).json({ message: "Lỗi khi thêm nhân viên", error });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;  // Nhận toàn bộ dữ liệu từ req.body

        // Cập nhật nhân viên với toàn bộ dữ liệu từ updateData
        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Không tìm thấy nhân viên để cập nhật" });
        }

        res.status(200).json({ message: "Nhân viên được cập nhật thành công", employee: updatedEmployee });
    } catch (error) {
        console.error("Lỗi khi cập nhật nhân viên:", error);
        res.status(500).json({ message: "Lỗi khi cập nhật nhân viên", error });
    }
};


const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the employee by ID
        const employee = await EmployeeModel.findById(id);
        if (!employee) {
            return res.status(404).json({ message: "Không tìm thấy nhân viên" });
        }

        // Check if the employee is active (if the status is not "active", allow deletion)
        if (employee.Status !== "active") {
            // Proceed to delete the employee if they are not "active"
            await EmployeeModel.findByIdAndDelete(id);
            return res.status(200).json({ message: "Nhân viên đã được xóa thành công" });
        } else {
            // Prevent deletion if the employee is currently "active"
            return res.status(400).json({ message: "Không thể xóa nhân viên đang làm việc" });
        }
    } catch (error) {
        console.error("Lỗi khi xóa nhân viên:", error);
        return res.status(500).json({ message: "Lỗi khi xóa nhân viên", error: error.message });
    }
};


// Lấy danh sách nhân viên
const getAllEmployees = async (req, res) => {
    try {
        const employees = await EmployeeModel.aggregate([
            {
                $lookup: {
                    from: 'branches',         
                    localField: 'BranchID',     
                    foreignField: '_id',    
                    as: 'Branch'            
                }
            },
            {
                $lookup: {
                    from: 'users',             // Collection người dùng
                    localField: 'UserID',      // Trường trong EmployeeModel
                    foreignField: '_id',       // Trường trong collection users
                    as: 'User'                 // Tên trường mới để chứa dữ liệu người dùng
                }
            },
            {
                $unwind: '$Branch'             
            },
            {
                $unwind: '$User'               
            }
        ]);

        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách nhân viên", error });
    }
};
// Thêm hàm này vào employeeController.js
const getEmployeeBookings = async (req, res) => {
    try {
      const { id } = req.params;
      const { date } = req.query;
      
      if (!date) {
        return res.status(400).json({
          success: false,
          message: "Thiếu tham số ngày (date)"
        });
      }
  
      const bookings = await BookingModel.find({
        employee: id,
        date: date
      }).select('time duration');
  
      res.json({
        success: true,
        data: bookings
      });
    } catch (error) {
      console.error('Lỗi khi lấy lịch nhân viên:', error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy lịch nhân viên"
      });
    }
  };


export { addEmployee, updateEmployee, deleteEmployee, getAllEmployees,getEmployeeBookings };