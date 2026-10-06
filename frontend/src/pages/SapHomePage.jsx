// src/pages/SapHomePage.jsx
import React from 'react';
import SapHero from '../components/home/SapHero';
import SapServices from '../components/home/SapServices';
import SapSpecialOffers from '../components/home/SapSpecialOffers';
import SapFeatureStrip from '../components/home/SapFeatureStrip';
import SapPromoBanners from '../components/home/SapPromoBanners';
import SapHowItWorks from '../components/home/SapHowItWorks';
import SapWeServe from '../components/home/SapWeServe';
import SapGallery from '../components/home/SapGallery';
import SapReviewsAndWhyUs from '../components/home/SapReviewsAndWhyUs';
import '../components/home/SapHowItWorks.css';

export default function SapHomePage({
  cards = [],
  onSelectService,
  onViewAllServices,
  onExploreServices,
  onExploreOffers,
  onExplore3d,
  onExploreCustom,
  onViewGallery,
}) {
  return (
    <main className="sap-homepage-main">
      {/* 1. Hero Section with Carousel */}
      <SapHero onExploreServices={onExploreServices} />

      {/* 2. Our Services Grid (16 cards) */}
      <SapServices
        onSelectService={onSelectService}
        onViewAllServices={onViewAllServices}
      />

      {/* 3. Special Offers Banner */}
      <SapSpecialOffers onExploreOffers={onExploreOffers} />

      {/* 4. Feature / USP Strip */}
      <SapFeatureStrip />

      {/* 5. 3D Printing & Custom Printing Dual Promotional Banners */}
      <SapPromoBanners
        onExplore3d={onExplore3d}
        onExploreCustom={onExploreCustom}
      />

      {/* 6 & 7. How It Works (Left) + We Serve (Right) */}
      <div className="sap-dual-strip-section">
        <SapHowItWorks />
        <SapWeServe
          onSelectSector={() => {
            if (onViewAllServices) onViewAllServices();
            else window.location.hash = '#visiting-cards';
          }}
        />
      </div>

      {/* 8. Our Work Gallery */}
      <SapGallery onViewGallery={onViewGallery} />

      {/* 9. Customer Testimonials + Why Choose @SAP PRINTS */}
      <SapReviewsAndWhyUs />
    </main>
  );
}
