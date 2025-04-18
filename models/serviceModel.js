import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, },
    description: { type: String, required: true, trim: true, },
    price: { type: String, required: true, min: 0, },
    duration: {
        type: Number, // Duration in minutes
        required: true,
    },
    category: { type: String, required: true, trim: true },
    image: {
        type: String, // URL to the service image
        required: false
    },
    createdAt: { type: Date, default: Date.now, },
    updatedAt: {
        type: Date, default: Date.now,
    },
});


//middleware to update the updatedAt field before saving
// This middleware will run before every save operation
serviceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const ServiceModel = mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default ServiceModel;