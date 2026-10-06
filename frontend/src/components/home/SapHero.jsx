// src/components/home/SapHero.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Award, Truck, IndianRupee, Pencil } from 'lucide-react';
import heroProductsImg from '../../assets/hero/hero_products.png';
import { heroSlidesData } from '../../data/homeData';
import './SapHero.css';

export default function SapHero({ onExploreServices }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const activeSlide = heroSlidesData[currentSlideIndex] || heroSlidesData[0];

  // Map icon name string to Lucide component
  const renderBadgeIcon = (iconName) => {
    const props = { size: 22, color: '#ffffff', strokeWidth: 2.2 };
    switch (iconName) {
      case 'Award':
        return <Award {...props} />;
      case 'Truck':
        return <Truck {...props} />;
      case 'IndianRupee':
        return <IndianRupee {...props} />;
      case 'Pencil':
        return <Pencil {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % heroSlidesData.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + heroSlidesData.length) % heroSlidesData.length);
  };

  // Autoplay 5 seconds
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [isPaused, currentSlideIndex]);

  const handleCtaClick = () => {
    if (onExploreServices) {
      onExploreServices();
    } else {
      const el = document.getElementById('services-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="sap-hero-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero Carousel"
    >
      <div className="sap-hero-banner">
        {/* Left Arrow */}
        <button
          type="button"
          className="sap-hero-nav-arrow left"
          aria-label="Previous Slide"
          onClick={prevSlide}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Right Arrow */}
        <button
          type="button"
          className="sap-hero-nav-arrow right"
          aria-label="Next Slide"
          onClick={nextSlide}
        >
          <ChevronRight size={24} />
        </button>

        {/* Hero Grid */}
        <div className="sap-hero-grid">
          {/* Left Text & Badges */}
          <div className="sap-hero-left">
            <h1 className="sap-hero-heading">
              <span className="sap-hero-heading-line1">{activeSlide.titleLine1}</span>
              <span className="sap-hero-heading-line2">
                <span className="sap-hero-gradient-our">{activeSlide.titleLine2Our}</span>
                <span className="sap-hero-gradient-prints">{activeSlide.titleLine2Prints}</span>
              </span>
            </h1>

            <p className="sap-hero-subheading">{activeSlide.subtitle}</p>

            {/* 4 Feature Badges */}
            <div className="sap-hero-badges-row">
              {activeSlide.badges.map((badge) => (
                <div key={badge.id} className="sap-hero-badge-item">
                  <div
                    className="sap-hero-badge-icon-circle"
                    style={{ backgroundColor: badge.color }}
                  >
                    {renderBadgeIcon(badge.icon)}
                  </div>
                  <span className="sap-hero-badge-label">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Primary CTA */}
            <button
              type="button"
              className="sap-hero-cta-btn"
              onClick={handleCtaClick}
            >
              {activeSlide.ctaText}
            </button>
          </div>

          {/* Right Hero Product Composition */}
          <div className="sap-hero-right">
            <div className="sap-hero-mockup-wrapper">
              <img
                src={heroProductsImg}
                alt="Custom Printing & Visiting Cards Showcase"
                className="sap-hero-products-img"
              />
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="sap-hero-dots">
          {heroSlidesData.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`sap-hero-dot ${idx === currentSlideIndex ? 'active' : ''}`}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentSlideIndex(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
