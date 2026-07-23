import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineShoppingCart, HiStar, HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { useAppContext } from '../context/AppContext';
import './styles/ProductCard.css';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, favoriteIds, toggleFavorite } = useAppContext();

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product._id || product.id, 1);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(product._id || product.id);
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id || product.id}`);
  };

  // Fallback image if none provided
  const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : (product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image');

  const isFav = favoriteIds && favoriteIds.includes(product._id || product.id);

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        <img src={imageUrl} alt={product.name} className="product-image" />
        
        <button 
          className={`product-favorite-btn ${isFav ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          title={isFav ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isFav ? <HiHeart size={18} /> : <HiOutlineHeart size={18} />}
        </button>

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
          <HiStar className="star-icon" style={{ color: product.rating > 0 ? '#ffc107' : '#e4e5e9' }} />
          <span>{product.rating > 0 ? product.rating.toFixed(1) : 'No ratings'}</span>
          <span className="review-count">({product.numReviews || 0} reviews)</span>
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
