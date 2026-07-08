const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get products (all or featured, with pagination, filtering, searching, sorting)
router.get('/', productController.getProducts);

// Get all unique categories
router.get('/categories', productController.getCategories);

// Get single product by ID
router.get('/:id', productController.getProductById);

// Create a new product
router.post('/', productController.createProduct);

// Update a product
router.put('/:id', productController.updateProduct);

// Delete a product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
