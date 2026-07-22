import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, getCategories } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import BannerSlider from "../components/BannerSlider";
import {
  HiOutlineArrowRight,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineSupport,
} from "react-icons/hi";
import "../styles/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const categories = [
    {
      id: 1,
      title: "BADMINTON RACKET",
      subtitle: "PRO SERIES",
      image:
        "https://yonexshop.tw/photo/BDRC/AX100ZVAYX/zz-AX100ZVAYX_452-1.jpg?1757005401",
      tag: "RACKET",
    },
    {
      id: 2,
      title: "BADMINTON SHOES",
      subtitle: "NON-MARKING",
      image:
        "https://cdn.shopvnb.com/uploads/gallery/3giay-cau-long-yonex-subaxia-gt-men-pale-green-chinh-hang_1782241434.webp",
      tag: "SHOES",
    },
    {
      id: 3,
      title: "BADMINTON SHIRTS",
      subtitle: "DRY-FIT TECH",
      image:
        "https://www.directbadminton.co.uk/images/extralarge/Yon_16556JA-WH.jpg",
      tag: "SHIRTS",
    },
    {
      id: 4,
      title: "BADMINTON SHORTS",
      subtitle: "FLEXIBLE",
      image:
        "https://tse2.mm.bing.net/th/id/OIP.5ffN7UV2b5O43loIJ1JXQAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      tag: "SHORTS",
    },
    {
      id: 5,
      title: "BADMINTON SKIRTS",
      subtitle: "COMFORT",
      image:
        "https://tse3.mm.bing.net/th/id/OIP.1IHb7Y6FmBoVdsmX-Sc7SwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      tag: "SKIRTS",
    },
    {
      id: 6,
      title: "BADMINTON BAGS",
      subtitle: "THERMAL GUARD",
      image:
        "https://www.tgsports.co.nz/media/commerce_products/1497/92226EX-MIST-PURPLE.jpg",
      tag: "BAGS",
    },
    {
      id: 7,
      title: "BADMINTON BACKPACKS",
      subtitle: "SPACIOUS",
      image:
        "https://ae01.alicdn.com/kf/S916cbcacee344c41ba8f534053690f7b4/YONEX-Mochila-deportiva-de-gran-capacidad-bolso-de-b-dminton-doble-hombro.jpg",
      tag: "BACKPACKS",
    },
    {
      id: 8,
      title: "BADMINTON ACCESSORIES",
      subtitle: "GRIPS & SHUTTLES",
      image:
        "https://th.bing.com/th/id/R.ffd21d0eb9c382131cfc90b1b2cd7c67?rik=WqVx7vHV%2bLaSBQ&riu=http%3a%2f%2fcdn.sweatband.com%2fYonex_Accessory_Pack.jpg&ehk=4F1SeVLOwc6OYWESm0wypAwZs%2fiUD38wB3qCQe08vdw%3d&risl=&pid=ImgRaw&r=0",
      tag: "ACCESSORIES",
    },
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        // Fetch featured products
        const featuredRes = await getProducts(true, 1, 4);
        if (featuredRes.success) {
          setFeaturedProducts(featuredRes.products);
        }

        // Fetch regular products for "New Arrivals" (just first page)
        const regularRes = await getProducts(false, 1, 8);
        if (regularRes.success) {
          setNewArrivals(regularRes.products);
        }
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero / Banner Section */}
      <BannerSlider>
        <div className="hero-content glass-hero">
          <span className="hero-badge">New Collection 2024</span>
          <h1 className="hero-title">
            Elevate Your
            <br />
            <span className="text-primary">Badminton Game</span>
          </h1>
          <p className="hero-subtitle">
            Premium rackets, shoes, and gear for professional and amateur
            players.
          </p>
          <div className="hero-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/shop")}
            >
              Shop Now <HiOutlineArrowRight />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() =>
                document
                  .getElementById("featured")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              View Offers
            </button>
          </div>
        </div>
      </BannerSlider>

      {/* Features */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <HiOutlineLightningBolt className="feature-icon" />
          </div>
          <div>
            <h3 className="feature-title">Fast Delivery</h3>
            <p className="feature-desc">Within 24-48 hours</p>
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <HiOutlineShieldCheck className="feature-icon" />
          </div>
          <div>
            <h3 className="feature-title">100% Authentic</h3>
            <p className="feature-desc">Genuine brand products</p>
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <HiOutlineTruck className="feature-icon" />
          </div>
          <div>
            <h3 className="feature-title">Free Shipping</h3>
            <p className="feature-desc">Orders over $100</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header-centered">
          <h2 className="section-title-large">BROWSE CATEGORIES</h2>
          <p className="section-subtitle">
            Find the perfect gear for your game.
          </p>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => navigate(`/shop?category=${cat.tag}`)}
            >
              <img src={cat.image} alt={cat.title} className="category-img" />
              <div className="category-overlay">
                <h3 className="category-title">{cat.title}</h3>
                <span className="category-subtitle">{cat.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="products-section">
        <div className="section-header">
          <h2 className="section-title">Featured Gear</h2>
          <button className="view-all-btn" onClick={() => navigate("/shop")}>
            View All <HiOutlineArrowRight />
          </button>
        </div>

        {isLoading ? (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="products-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))
            ) : (
              <div className="empty-state">No featured products available.</div>
            )}
          </div>
        )}
      </section>

      {/* New Arrivals */}
      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">New Arrivals</h2>
          <button className="view-all-btn" onClick={() => navigate("/shop")}>
            View All <HiOutlineArrowRight />
          </button>
        </div>

        {isLoading ? (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="products-grid">
            {newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))
            ) : (
              <div className="empty-state">No products available.</div>
            )}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="promo-banner">
        <div className="promo-content">
          <h2>Get 20% Off on Yonex Astrox Series</h2>
          <p>Limited time offer. Upgrade your smash power today.</p>
          <button className="promo-banner-btn" onClick={() => navigate("/shop")}>
            Shop Sale
          </button>
        </div>
      </section>
    </div>
  );
}
