import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
    BranchName: { type: String, required: true },
    Address: { type: String, required: true },
    PhoneNumber: { type: String, required: true },
});


const BranchModel = mongoose.models.Branch || mongoose.model("Branch", branchSchema);

export default BranchModel;