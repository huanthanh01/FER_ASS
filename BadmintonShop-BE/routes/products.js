const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const productController = require('../controllers/productController');

const productUploadDir = path.join(__dirname, '..', 'uploads', 'products');

const ensureProductUploadDir = () => {
  fs.mkdirSync(productUploadDir, { recursive: true });
};

ensureProductUploadDir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      ensureProductUploadDir();
      cb(null, productUploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 8
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});

const handleUpload = (req, res, next) => {
  upload.array('images', 8)(req, res, (err) => {
    if (!err) return next();

    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'Each image must be 5MB or smaller'
      : err.message || 'Failed to upload product images';

    return res.status(400).json({ success: false, error: message });
  });
};

// Get products (all or featured, with pagination, filtering, searching, sorting)
router.get('/', productController.getProducts);

// Get all unique categories
router.get('/categories', productController.getCategories);

// Upload product images
router.post('/upload-images', handleUpload, productController.uploadProductImages);

// Get single product by ID
router.get('/:id', productController.getProductById);

// Create a new product
router.post('/', productController.createProduct);

// Update a product
router.put('/:id', productController.updateProduct);

// Delete a product
router.delete('/:id', productController.deleteProduct);

// Create or update a review
router.post('/:id/reviews', productController.createProductReview);

// Get product reviews
router.get('/:id/reviews', productController.getProductReviews);

module.exports = router;
