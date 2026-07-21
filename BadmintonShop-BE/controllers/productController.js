const Product = require('../models/Product');
const Review = require('../models/Review');

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
  },

  // Create or update a product review
  createProductReview: async (req, res) => {
    try {
      const { rating, comment, userId } = req.body;
      const productId = req.params.id;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      // Check if user already reviewed
      const existingReview = await Review.findOne({ product: productId, user: userId });

      if (existingReview) {
        // Update existing review
        existingReview.rating = Number(rating);
        existingReview.comment = comment;
        await existingReview.save();
      } else {
        // Create new review
        const review = new Review({
          user: userId,
          product: productId,
          rating: Number(rating),
          comment
        });
        await review.save();
      }

      // Recalculate product rating
      const reviews = await Review.find({ product: productId });
      product.numReviews = reviews.length;
      product.rating = reviews.length > 0
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
        : 0;

      await product.save();
      res.status(201).json({ success: true, message: 'Review added/updated' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to submit review' });
    }
  },

  // Get product reviews
  getProductReviews: async (req, res) => {
    try {
      const productId = req.params.id;
      const reviews = await Review.find({ product: productId })
        .populate('user', 'fullname')
        .sort({ updatedAt: -1 });

      res.json({ success: true, reviews });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
    }
  }
};

module.exports = productController;
