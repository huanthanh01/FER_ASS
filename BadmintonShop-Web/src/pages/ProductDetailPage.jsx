import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getProducts } from "../api/productApi";
import { fetchReviews, submitReview } from "../api/reviewApi";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import {
  HiOutlineShoppingCart,
  HiOutlineMinus,
  HiOutlinePlus,
  HiStar,
  HiOutlineCheck,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import "../styles/ProductDetailPage.css";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, currentUser, isLoggedIn } = useAppContext();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const thumbnailListRef = useRef(null);

  const scrollThumbnails = (direction) => {
    if (thumbnailListRef.current) {
      const scrollAmount = 200;
      thumbnailListRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const res = await getProductById(id);
        if (res.success && res.product) {
          setProduct(res.product);

          // Fetch related products from same category
          if (res.product.category) {
            const relatedRes = await getProducts(
              false,
              1,
              4,
              res.product.category,
            );
            if (relatedRes.success) {
              setRelatedProducts(
                relatedRes.products
                  .filter((p) => p._id !== id && p.id !== id)
                  .slice(0, 4),
              );
            }
          }

          // Fetch reviews
          const reviewsRes = await fetchReviews(id);
          if (reviewsRes.success) {
            setReviews(reviewsRes.reviews || []);
            
            // Check if current user already reviewed, pre-fill form
            if (currentUser && reviewsRes.reviews) {
               const myReview = reviewsRes.reviews.find(r => r.user?._id === currentUser.id);
               if (myReview) {
                 setUserRating(myReview.rating);
                 setUserComment(myReview.comment || "");
               }
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
    setSelectedImageIdx(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || !currentUser) {
      toast.warning("Please login to submit a review.");
      return;
    }
    setIsSubmittingReview(true);
    const res = await submitReview(id, currentUser.id, userRating, userComment);
    if (res.success) {
      toast.success(res.message || "Review submitted!");
      // Refresh product to get updated overall rating & reviews
      const updatedProductRes = await getProductById(id);
      if (updatedProductRes.success && updatedProductRes.product) {
        setProduct(updatedProductRes.product);
      }
      const reviewsRes = await fetchReviews(id);
      if (reviewsRes.success) {
        setReviews(reviewsRes.reviews || []);
      }
    } else {
      toast.error(res.error || "Failed to submit review.");
    }
    setIsSubmittingReview(false);
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
        <button
          className="btn btn-primary mt-4"
          onClick={() => navigate("/shop")}
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const fallbackImage =
    product.imageUrl || "https://via.placeholder.com/600x600?text=No+Image";
  const hasImagesArray = product.images && product.images.length > 0;
  const imageUrl = hasImagesArray
    ? product.images[selectedImageIdx]
    : fallbackImage;
  const allImages = hasImagesArray ? product.images : [fallbackImage];

  const discountedPrice =
    product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;

  const getWeightText = (category) => {
    if (!category) return "4U (Avg. 84g)";
    const cat = category.toLowerCase();
    if (cat.includes("racket")) return "4U (Avg. 84g)";
    if (cat.includes("shoes")) return "190g";
    if (cat.includes("shirt") || cat.includes("skirt") || cat.includes("short"))
      return "Light";
    if (cat.includes("bag") || cat.includes("backpack"))
      return "Super waterproof";
    if (cat.includes("accessories")) return "Substantial";
    return "4U (Avg. 84g)";
  };

  return (
    <div className="product-detail-page page-container">
      {/* Back Button */}
      <div style={{ marginBottom: "20px", marginTop: "20px" }}>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <div className="product-detail-layout">
        {/* Left: Images */}
        <div className="product-gallery">
          <div className="main-image-container">
            <img src={imageUrl} alt={product.name} className="main-image" />
            {product.discount > 0 && (
              <span className="product-badge discount">
                -{product.discount}% OFF
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="product-badge warning">Low Stock</span>
            )}
          </div>
          <div className="thumbnail-container">
            {allImages.length > 5 && (
              <button 
                onClick={() => scrollThumbnails('left')} 
                className="thumbnail-scroll-btn"
                aria-label="Scroll left"
              >
                <HiOutlineChevronLeft size={20} />
              </button>
            )}
            <div className="thumbnail-list" ref={thumbnailListRef}>
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`thumbnail ${selectedImageIdx === idx ? "active" : ""}`}
                  onClick={() => setSelectedImageIdx(idx)}
                >
                  <img src={img} alt={`${product.name} Thumbnail ${idx + 1}`} />
                </div>
              ))}
            </div>
            {allImages.length > 5 && (
              <button 
                onClick={() => scrollThumbnails('right')} 
                className="thumbnail-scroll-btn"
                aria-label="Scroll right"
              >
                <HiOutlineChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="product-info-panel">
          <div className="product-category-label">{product.category}</div>
          <h1 className="product-detail-title">{product.name}</h1>

          <div className="product-meta">
            <div className="product-rating">
              <HiStar className="star-icon" style={{ color: product.rating > 0 ? '#ffc107' : '#e4e5e9' }} />
              <span>{product.rating > 0 ? product.rating.toFixed(1) : 'No ratings'}</span>
              <span className="review-count">
                ({product.numReviews || 0} reviews)
              </span>
            </div>
            <div className="product-stock">
              {product.stock > 0 ? (
                <span className="in-stock">
                  <HiOutlineCheck /> In Stock ({product.stock})
                </span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>
          </div>

          <div className="product-price-section">
            {product.discount > 0 ? (
              <>
                <span className="price-current">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="price-old">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="price-current">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="product-short-desc">
            {product.description ||
              "Experience the perfect blend of power and control with this premium badminton gear. Designed for players who demand the best performance on the court."}
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
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          {/* Features/Guarantees list */}
          <ul className="product-features-list">
            <li>
              <HiOutlineCheck className="text-success" /> Free shipping on
              orders over $100
            </li>
            <li>
              <HiOutlineCheck className="text-success" /> 30-day return policy
            </li>
            <li>
              <HiOutlineCheck className="text-success" /> 100% authentic product
              guarantee
            </li>
          </ul>
        </div>
      </div>

      {/* Tabs */}
      <div className="product-tabs-section">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`tab-btn ${activeTab === "specifications" ? "active" : ""}`}
            onClick={() => setActiveTab("specifications")}
          >
            Specifications
          </button>
          <button
            className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "description" && (
            <div className="tab-pane">
              <h3>Product Description</h3>
              <p>
                {product.description || "No detailed description provided."}
              </p>
              <p>
                Enhance your game with our state-of-the-art badminton equipment.
                Engineered with advanced materials for superior durability and
                performance, giving you the edge in every match.
              </p>
            </div>
          )}
          {activeTab === "specifications" && (
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
                    <td>Characteristics</td>
                    <td>{getWeightText(product.category)}</td>
                  </tr>
                  <tr>
                    <td>Flex</td>
                    <td>{product.flex || "Medium"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="tab-pane reviews-tab">
              <h3>Customer Reviews ({product.numReviews || 0})</h3>
              
              {isLoggedIn ? (
                <div className="review-form-container">
                  <h4>Write a Review</h4>
                  <form onSubmit={handleReviewSubmit} className="review-form">
                    <div className="form-group">
                      <label>Rating:</label>
                      <div className="star-rating-select">
                        {[1, 2, 3, 4, 5].map(num => (
                          <HiStar 
                            key={num} 
                            size={24} 
                            style={{ cursor: 'pointer', color: num <= userRating ? '#ffc107' : '#e4e5e9' }}
                            onClick={() => setUserRating(num)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Comment:</label>
                      <textarea 
                        className="form-control" 
                        rows="3"
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        placeholder="Share your thoughts about this product..."
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isSubmittingReview}>
                      {isSubmittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="review-login-prompt">
                  <p>Please <a href="/login">login</a> to write a review.</p>
                </div>
              )}

              <div className="reviews-list">
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <div className="review-author">{review.user?.fullname || 'Anonymous'}</div>
                        <div className="review-date">{new Date(review.updatedAt || review.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="review-stars">
                        {[1, 2, 3, 4, 5].map(num => (
                          <HiStar key={num} size={16} color={num <= review.rating ? '#ffc107' : '#e4e5e9'} />
                        ))}
                      </div>
                      {review.comment && <p className="review-comment">{review.comment}</p>}
                    </div>
                  ))
                ) : (
                  <p>No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2>You May Also Like</h2>
          <div className="products-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
