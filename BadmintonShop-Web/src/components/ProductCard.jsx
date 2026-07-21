import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineShoppingCart, HiStar } from 'react-icons/hi';
import { useAppContext } from '../context/AppContext';
import './Componentstyles/ProductCard.css';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useAppContext();

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product._id || product.id, 1);
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id || product.id}`);
  };

  // Fallback image if none provided
  const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : (product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image');

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        <img src={imageUrl} alt={product.name} className="product-image" />
        {product.discount > 0 && (
          <span className="product-badge discount">-{product.discount}%</span>
        )}
        {product.isFeatured && (
          <span className="product-badge featured">Hot</span>
        )}
      </div>
      
      <div className="product-info">
        <div className="product-category">{product.category || 'Gear'}</div>
        <h3 className="product-title" title={product.name}>{product.name}</h3>
        
        <div className="product-rating">
          <HiStar className="star-icon" />
          <span>{product.rating || 4.5}</span>
          <span className="review-count">({product.reviews || Math.floor(Math.random() * 100) + 10} reviews)</span>
        </div>
        
        <div className="product-footer">
          <div className="product-price-container">
            <span className="product-price">${product.price?.toFixed(2) || '0.00'}</span>
            {product.discount > 0 && (
              <span className="product-price-old">
                ${(product.price / (1 - product.discount / 100)).toFixed(2)}
              </span>
            )}
          </div>
          <button 
            className="btn btn-primary add-to-cart-btn"
            onClick={handleAddToCart}
            title="Add to Cart"
          >
            <HiOutlineShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
