import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { HiOutlineTrash, HiOutlineMinus, HiOutlinePlus, HiOutlineShoppingBag, HiOutlineArrowRight } from 'react-icons/hi';
import { toast } from 'react-toastify';
import '../styles/CartPage.css';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, updateCartQuantity, removeFromCart, checkoutCart, currentUser, isGlobalLoading } = useAppContext();
  
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.discount > 0 
      ? item.product.price * (1 - item.product.discount / 100)
      : item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15;
  const total = subtotal + shipping - discount;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    
    // Mock promo code logic
    if (promoCode.toUpperCase() === 'SMASH20') {
      setDiscount(subtotal * 0.2);
      toast.success('Promo code applied! 20% discount.');
    } else {
      toast.error('Invalid promo code.');
      setDiscount(0);
    }
  };

  const handleCheckout = () => {
    if (!currentUser) {
      toast.warning('Please login to checkout.');
      navigate('/login');
      return;
    }
    if (!currentUser.phoneNumber) {
      toast.warning('Please update your phone number in your profile first.');
      navigate('/profile');
      return;
    }
    
    checkoutCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page page-container empty-cart">
        <div className="empty-cart-icon">
          <HiOutlineShoppingBag size={64} />
        </div>
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <button className="btn btn-primary btn-lg mt-4" onClick={() => navigate('/shop')}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page page-container">
      <h1 className="cart-title">Shopping Cart</h1>
      
      <div className="cart-layout">
        {/* Left: Cart Items */}
        <div className="cart-items-section">
          <div className="cart-items-header">
            <span>Product</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>
          
          <div className="cart-items-list">
            {cartItems.map((item) => {
              const product = item.product;
              const price = product.discount > 0 
                ? product.price * (1 - product.discount / 100)
                : product.price;
              const itemTotal = price * item.quantity;
              const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : (product.imageUrl || 'https://via.placeholder.com/150x150?text=No+Image');

              return (
                <div key={item.id || product._id} className="cart-item">
                  <div className="cart-item-product">
                    <img 
                      src={imageUrl} 
                      alt={product.name} 
                      className="cart-item-img"
                      onClick={() => navigate(`/product/${product._id || product.id}`)}
                    />
                    <div className="cart-item-info">
                      <div className="cart-item-category">{product.category}</div>
                      <h3 
                        className="cart-item-name"
                        onClick={() => navigate(`/product/${product._id || product.id}`)}
                      >
                        {product.name}
                      </h3>
                      <div className="cart-item-price">${price.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="cart-item-qty">
                    <div className="quantity-selector small">
                      <button 
                        type="button" 
                        className="qty-btn"
                        onClick={() => updateCartQuantity(product._id || product.id, -1)}
                        disabled={item.quantity <= 1 || isGlobalLoading}
                      >
                        <HiOutlineMinus size={14} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button 
                        type="button" 
                        className="qty-btn"
                        onClick={() => updateCartQuantity(product._id || product.id, 1)}
                        disabled={product.stock && item.quantity >= product.stock || isGlobalLoading}
                      >
                        <HiOutlinePlus size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="cart-item-total">
                    <span className="item-total-price">${itemTotal.toFixed(2)}</span>
                    <button 
                      className="remove-btn"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove ${product.name} from your cart?`)) {
                          removeFromCart(product._id || product.id);
                        }
                      }}
                      disabled={isGlobalLoading}
                      title="Remove Item"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="cart-summary-section">
          <div className="summary-card glass">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping estimate</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            
            {discount > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            
            <hr className="summary-divider" />
            
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <form className="promo-form" onSubmit={handleApplyPromo}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Promo code (e.g. SMASH20)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary">Apply</button>
            </form>
            
            <button 
              className="btn btn-primary btn-lg checkout-btn"
              onClick={handleCheckout}
              disabled={isGlobalLoading}
            >
              {isGlobalLoading ? 'Processing...' : 'Proceed to Checkout'} <HiOutlineArrowRight />
            </button>
            
            <div className="secure-checkout">
              <span className="lock-icon">🔒</span> Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
