const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

const cartController = {
  // Get cart for user
  getCart: async (req, res) => {
    try {
      const { userId } = req.params;
      let cart = await Cart.findOne({ user: userId }).populate('items.product');
      
      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
        await cart.save();
      }
      
      res.json({ success: true, cart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to fetch cart' });
    }
  },

  // Add item to cart
  addToCart: async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
      
      // Check stock
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
      }

      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      let newQuantity = quantity;
      if (itemIndex > -1) {
        newQuantity = cart.items[itemIndex].quantity + quantity;
      }
      
      if (newQuantity > product.stock) {
        return res.status(400).json({ success: false, error: `Sản phẩm chỉ còn tối đa ${product.stock} mặt hàng` });
      }

      if (itemIndex > -1) {
        // If product exists, update quantity
        cart.items[itemIndex].quantity = newQuantity;
      } else {
        // If product does not exist, add it
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
      const updatedCart = await Cart.findById(cart._id).populate('items.product');
      res.json({ success: true, cart: updatedCart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to add to cart' });
    }
  },

  // Update item quantity in cart
  updateCart: async (req, res) => {
    try {
      const { userId, productId, delta } = req.body;
      
      // Check stock
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      const cart = await Cart.findOne({ user: userId });

      if (!cart) {
        return res.status(404).json({ success: false, error: 'Cart not found' });
      }

      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        const newQuantity = cart.items[itemIndex].quantity + delta;
        
        if (newQuantity > product.stock) {
          return res.status(400).json({ success: false, error: `Sản phẩm chỉ còn tối đa ${product.stock} mặt hàng` });
        }

        cart.items[itemIndex].quantity = newQuantity;
        
        // Allow item to stay in cart with quantity 0
        if (cart.items[itemIndex].quantity < 0) {
          cart.items[itemIndex].quantity = 0;
        }
        
        await cart.save();
        const updatedCart = await Cart.findById(cart._id).populate('items.product');
        res.json({ success: true, cart: updatedCart });
      } else {
        res.status(404).json({ success: false, error: 'Item not found in cart' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to update cart' });
    }
  },

  // Remove item from cart
  removeFromCart: async (req, res) => {
    try {
      const { userId, productId } = req.body;
      const cart = await Cart.findOne({ user: userId });
      
      if (!cart) {
        return res.status(404).json({ success: false, error: 'Cart not found' });
      }

      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items.splice(itemIndex, 1);
        await cart.save();
      }
      
      const updatedCart = await Cart.findById(cart._id).populate('items.product');
      res.json({ success: true, cart: updatedCart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to remove item from cart' });
    }
  },

  // Checkout cart
  checkout: async (req, res) => {
    try {
      const { userId } = req.body;
      const cart = await Cart.findOne({ user: userId }).populate('items.product');

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, error: 'Cart is empty' });
      }

      let totalAmount = 0;
      const orderItems = [];
      const processedProducts = []; // To track for rollback

      // Deduct stock for each product atomically
      for (const item of cart.items) {
        if (item.product && item.quantity > 0) {
          // Atomic update: only decrement if stock >= quantity
          const updatedProduct = await Product.findOneAndUpdate(
            { _id: item.product._id, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } },
            { returnDocument: 'after' }
          );

          if (!updatedProduct) {
            // Rollback previously updated products
            for (const rollbackItem of processedProducts) {
              await Product.findByIdAndUpdate(rollbackItem.id, { $inc: { stock: rollbackItem.quantity } });
            }
            return res.status(400).json({ 
              success: false, 
              error: `Sản phẩm "${item.product.name}" đã hết hàng hoặc không đủ số lượng trong quá trình thanh toán.` 
            });
          }

          // Track for potential rollback
          processedProducts.push({ id: item.product._id, quantity: item.quantity });
          
          // Accumulate total amount
          const itemTotal = item.product.price * item.quantity;
          totalAmount += itemTotal;
          
          // Push to order items
          orderItems.push({
            product: item.product._id,
            quantity: item.quantity,
            priceAtPurchase: item.product.price
          });
        }
      }

      // Create Order
      const newOrder = new Order({
        user: userId,
        items: orderItems,
        totalAmount: totalAmount
      });
      await newOrder.save();

      // Clear cart
      cart.items = [];
      await cart.save();

      res.json({ success: true, message: 'Checkout successful', cart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to checkout' });
    }
  }
};

module.exports = cartController;
