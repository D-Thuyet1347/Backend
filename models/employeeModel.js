import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    BranchID: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    Position: { type: String, required: true },
    Status: { type: String, required: true },
}, { timestamps: true });

const EmployeeModel = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default EmployeeModel;