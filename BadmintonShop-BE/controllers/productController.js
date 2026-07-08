const Product = require('../models/Product');

const productController = {
  // Get all unique categories
  getCategories: async (req, res) => {
    try {
      const categories = await Product.distinct('category');
      res.json({ success: true, categories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  },

  // Get products (all or featured, with pagination, filtering, searching, sorting)
  getProducts: async (req, res) => {
    try {
      const { isFeatured, page = 1, limit = 10, category, search, sortOrder } = req.query;
      let query = {};
      
      if (isFeatured === 'true') {
        query.isFeatured = true;
      }
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }
      
      let sortObj = { createdAt: -1 }; // newest by default
      if (sortOrder === 'asc') {
        sortObj = { price: 1 };
      } else if (sortOrder === 'desc') {
        sortObj = { price: -1 };
      }
      
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      const products = await Product.find(query).sort(sortObj).skip(skip).limit(limitNum);
      const totalProducts = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalProducts / limitNum);

      res.json({ 
        success: true, 
        products, 
        currentPage: pageNum, 
        totalPages, 
        totalProducts 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to fetch products' });
    }
  },

  // Get single product by ID
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json({ success: true, product });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to fetch product details' });
    }
  },

  // Create a new product
  createProduct: async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      const savedProduct = await newProduct.save();
      res.json({ success: true, product: savedProduct });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to create product' });
    }
  },

  // Update a product
  updateProduct: async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: 'after', runValidators: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json({ success: true, product: updatedProduct });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to update product' });
    }
  },

  // Delete a product
  deleteProduct: async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to delete product' });
    }
  }
};

module.exports = productController;
