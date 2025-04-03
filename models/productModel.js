import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    ProductName: { type: String, required: true }, 
    DescriptionPD: { type: String, required: true }, 
    ImagePD: { type: String, required: false }, 
    PricePD: { type: String, required: true }, 
    StockQuantity: { type: Number, required: true }, 
    Category: { type: String, required: true }, 
});


const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);

export default ProductModel;
