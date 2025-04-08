import mongoose from "mongoose";

const slideSchema = new mongoose.Schema({
    title: { type: String, default: "" },
    image: { type: String, required: true },
    link: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

const slideModel = mongoose.models.Slide || mongoose.model("Slide", slideSchema);
export default slideModel;
