import ProductModel from "../models/productModel.js"; 
import fs from 'fs';

// Thêm sản phẩm
const addProduct = async (req, res) => {
  try{
    const newProduct = new ProductModel(req.body);
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  }catch (error) {
    res.status(500).json({ success: false, message: 'Error adding product' });
  }
};

const listProduct = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json({ success: true, data: products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error retrieving products' });
  }
};

// Xóa sản phẩm
const removeProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.body.id);
    fs.unlink(`uploads/${product.ImagePD}`, (err) => {
      if (err) console.log(err);  
    });
    await ProductModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: 'Product Removed' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error removing product' });
  }
};
// code da chinh sua
const updateProduct = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error updating product' });
  }
};

const getProductById = async (req, res) => {
  const productId = req.params.id;


  try {
      const product = await ProductModel.findById(productId);
      
      if (!product) {
          return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
      }

      res.status(200).json({ success: true,data: product });
  } catch (error) {
      console.error('Lỗi khi tìm sản phẩm:', error);
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
};
const searchProduct = async (req, res) => {
  console.log('Request received with query:', req.query);
  const { q } = req.query;
  try {
    const products = await ProductModel.find({
      name: { $regex: q, $options: 'i' }
    });
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi tìm kiếm sản phẩm' });
  }
};
export { addProduct, listProduct, removeProduct ,updateProduct, getProductById, searchProduct};
