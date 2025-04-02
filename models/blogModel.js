import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        image: { type: String, default: false },
        isPublished: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },

    },
);

const blogModel = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default blogModel; 