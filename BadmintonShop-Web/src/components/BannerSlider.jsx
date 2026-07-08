import React, { useState, useEffect } from 'react';
import './Componentstyles/BannerSlider.css';

import banner1 from '../assets/banners/banner1.webp';
import banner2 from '../assets/banners/banner2.webp';
import banner3 from '../assets/banners/banner3.webp';
import banner4 from '../assets/banners/banner4.webp';
import banner5 from '../assets/banners/banner5.webp';
import banner6 from '../assets/banners/banner6.webp';
import banner7 from '../assets/banners/banner7.webp';

import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

const bannerImages = [
  banner1,
  banner2,
  banner3,
  banner4,
  banner5,
  banner6,
  banner7,
];

export default function BannerSlider({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1));
  };

  return (
    <div className="banner-slider-container">
      <div 
        className="banner-slider-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {bannerImages.map((banner, index) => (
          <div className="banner-slide" key={index}>
            <img src={banner} alt={`Banner ${index + 1}`} className="banner-img" />
          </div>
        ))}
      </div>

      <button className="banner-arrow banner-arrow-left" onClick={prevSlide}>
        <HiOutlineChevronLeft />
      </button>
      <button className="banner-arrow banner-arrow-right" onClick={nextSlide}>
        <HiOutlineChevronRight />
      </button>

      <div className="banner-dots">
        {bannerImages.map((_, index) => (
          <div
            key={index}
            className={`banner-dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {children && (
        <div className="banner-overlay-content">
          {children}
        </div>
      )}
    </div>
  );
}
