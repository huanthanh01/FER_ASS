import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getProducts } from '../api/productApi';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { HiOutlineShoppingCart, HiOutlineMinus, HiOutlinePlus, HiStar, HiOutlineCheck } from 'react-icons/hi';
import '../styles/ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useAppContext();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const res = await getProductById(id);
        if (res.success && res.product) {
          setProduct(res.product);
          
          // Fetch related products from same category
          if (res.product.category) {
            const relatedRes = await getProducts(false, 1, 4, res.product.category);
            if (relatedRes.success) {
              setRelatedProducts(relatedRes.products.filter(p => p._id !== id && p.id !== id).slice(0, 4));
            }
          }
        } else {
          // Handle not found
          setProduct(null);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && (!product.stock || newQty <= product.stock)) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product._id || product.id, quantity);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container empty-state">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/shop')}>
          Back to Shop
        </button>
      </div>
    );
  }

  const imageUrl = product.imageUrl || 'https://via.placeholder.com/600x600?text=No+Image';
  const discountedPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  return (
    <div className="product-detail-page page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate('/')}>Home</span> / 
        <span onClick={() => navigate('/shop')}>Shop</span> / 
        <span onClick={() => navigate(`/shop?category=${product.category}`)}>{product.category}</span> / 
        <span className="current">{product.name}</span>
      </div>

      <div className="product-detail-layout">
        {/* Left: Images */}
        <div className="product-gallery">
          <div className="main-image-container">
            <img src={imageUrl} alt={product.name} className="main-image" />
            {product.discount > 0 && (
              <span className="product-badge discount">-{product.discount}% OFF</span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="product-badge warning">Low Stock</span>
            )}
          </div>
          {/* Note: If backend supports multiple images, render thumbnails here */}
          <div className="thumbnail-list">
            <div className="thumbnail active">
              <img src={imageUrl} alt="Thumbnail 1" />
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="product-info-panel">
          <div className="product-category-label">{product.category}</div>
          <h1 className="product-detail-title">{product.name}</h1>
          
          <div className="product-meta">
            <div className="product-rating">
              <HiStar className="star-icon" />
              <span>{product.rating || 4.5}</span>
              <span className="review-count">({product.reviews || Math.floor(Math.random() * 100) + 10} reviews)</span>
            </div>
            <div className="product-stock">
              {product.stock > 0 ? (
                <span className="in-stock"><HiOutlineCheck /> In Stock ({product.stock})</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>
          </div>

          <div className="product-price-section">
            {product.discount > 0 ? (
              <>
                <span className="price-current">${discountedPrice.toFixed(2)}</span>
                <span className="price-old">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="price-current">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="product-short-desc">
            {product.description || "Experience the perfect blend of power and control with this premium badminton gear. Designed for players who demand the best performance on the court."}
          </p>

          <hr className="divider" />

          {/* Quantity and Add to Cart */}
          <div className="add-to-cart-section">
            <div className="quantity-selector">
              <button 
                type="button" 
                className="qty-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <HiOutlineMinus />
              </button>
              <input 
                type="number" 
                className="qty-input" 
                value={quantity} 
                readOnly
              />
              <button 
                type="button" 
                className="qty-btn"
                onClick={() => handleQuantityChange(1)}
                disabled={product.stock && quantity >= product.stock}
              >
                <HiOutlinePlus />
              </button>
            </div>
            
            <button 
              className="btn btn-primary btn-lg add-btn"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <HiOutlineShoppingCart size={20} />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
          
          {/* Features/Guarantees list */}
          <ul className="product-features-list">
            <li><HiOutlineCheck className="text-success" /> Free shipping on orders over $100</li>
            <li><HiOutlineCheck className="text-success" /> 30-day return policy</li>
            <li><HiOutlineCheck className="text-success" /> 100% authentic product guarantee</li>
          </ul>
        </div>
      </div>

      {/* Tabs */}
      <div className="product-tabs-section">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="tab-pane">
              <h3>Product Description</h3>
              <p>{product.description || "No detailed description provided."}</p>
              <p>Enhance your game with our state-of-the-art badminton equipment. Engineered with advanced materials for superior durability and performance, giving you the edge in every match.</p>
            </div>
          )}
          {activeTab === 'specifications' && (
            <div className="tab-pane">
              <h3>Technical Specifications</h3>
              <table className="specs-table">
                <tbody>
                  <tr>
                    <td>Brand</td>
                    <td>{product.brand || "Yonex"}</td>
                  </tr>
                  <tr>
                    <td>Category</td>
                    <td>{product.category}</td>
                  </tr>
                  <tr>
                    <td>Weight</td>
                    <td>{product.weight || "4U (Avg. 83g)"}</td>
                  </tr>
                  <tr>
                    <td>Flex</td>
                    <td>{product.flex || "Medium"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="tab-pane">
              <h3>Customer Reviews</h3>
              <p>Reviews will be displayed here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2>You May Also Like</h2>
          <div className="products-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
