// src/data/homeData.js
// Structured data for @SAP PRINTS homepage

import visitingCardsImg from '../assets/services/visiting_cards.png';
import rubberStampsImg from '../assets/services/rubber_stamps.png';
import letterHeadsImg from '../assets/services/letter_heads.png';
import idCardsImg from '../assets/services/id_cards.png';
import printing3dImg from '../assets/services/3d_printing.png';
import postersImg from '../assets/services/posters.png';
import brochuresImg from '../assets/services/brochures.png';
import menuCardsImg from '../assets/services/menu_cards.png';
import stickersLabelsImg from '../assets/services/stickers_labels.png';
import bannersFlexImg from '../assets/services/banners_flex.png';
import tshirtPrintingImg from '../assets/services/tshirt_printing.png';
import canvasPrintingImg from '../assets/services/canvas_printing.png';
import customPrintingImg from '../assets/services/custom_printing.png';
import flyersLeafletsImg from '../assets/services/flyers_leaflets.png';
import cataloguesImg from '../assets/services/catalogues.png';
import booksPrintingImg from '../assets/services/books_printing.png';

import work1 from '../assets/gallery/work_1.png';
import work2 from '../assets/gallery/work_2.png';
import work3 from '../assets/gallery/work_3.png';
import work4 from '../assets/gallery/work_4.png';
import work5 from '../assets/gallery/work_5.png';
import work6 from '../assets/gallery/work_6.png';
import work7 from '../assets/gallery/work_7.png';
import work8 from '../assets/gallery/work_8.png';
import work9 from '../assets/gallery/work_9.png';
import work10 from '../assets/gallery/work_10.png';

export const servicesData = [
  {
    id: 1,
    name: 'Visiting Cards',
    slug: 'visiting-cards',
    route: '#visiting-cards',
    image: visitingCardsImg,
    badge: 'Popular',
    description: 'High-definition single & double sided visiting cards on 350 GSM premium cardstock.'
  },
  {
    id: 2,
    name: 'Rubber Stamps',
    slug: 'rubber-stamps',
    route: '#services/rubber-stamps',
    image: rubberStampsImg,
    description: 'Self-inking durable rubber stamps for office & business approvals.'
  },
  {
    id: 3,
    name: 'Letter Heads',
    slug: 'letter-heads',
    route: '#services/letter-heads',
    image: letterHeadsImg,
    description: 'Official corporate letterheads on bond and executive paper.'
  },
  {
    id: 4,
    name: 'ID Cards',
    slug: 'id-cards',
    route: '#services/id-cards',
    image: idCardsImg,
    description: 'PVC ID cards with custom printed lanyards and holders.'
  },
  {
    id: 5,
    name: '3D Printing',
    slug: '3d-printing',
    route: '#services/3d-printing',
    image: printing3dImg,
    badge: 'New',
    description: 'Precision rapid prototyping, miniature idols, corporate gifts & models.'
  },
  {
    id: 6,
    name: 'Posters',
    slug: 'posters',
    route: '#services/posters',
    image: postersImg,
    description: 'Glossy and matte display posters in A3, A2, A1 and custom sizes.'
  },
  {
    id: 7,
    name: 'Brochures',
    slug: 'brochures',
    route: '#services/brochures',
    image: brochuresImg,
    description: 'Bi-fold & tri-fold premium marketing brochures with rich color finish.'
  },
  {
    id: 8,
    name: 'Menu Cards',
    slug: 'menu-cards',
    route: '#services/menu-cards',
    image: menuCardsImg,
    description: 'Waterproof and laminated restaurant & cafe menu cards.'
  },
  {
    id: 9,
    name: 'Stickers & Labels',
    slug: 'stickers-labels',
    route: '#services/stickers-labels',
    image: stickersLabelsImg,
    description: 'Die-cut vinyl, transparent and waterproof product packaging stickers.'
  },
  {
    id: 10,
    name: 'Banners & Flex',
    slug: 'banners-flex',
    route: '#services/banners-flex',
    image: bannersFlexImg,
    description: 'Outdoor flex banners, star flex and rollup standees for exhibitions.'
  },
  {
    id: 11,
    name: 'T-Shirt Printing',
    slug: 't-shirt-printing',
    route: '#services/t-shirt-printing',
    image: tshirtPrintingImg,
    description: 'Screen printed and DTF cotton T-shirts for teams and events.'
  },
  {
    id: 12,
    name: 'Canvas Printing',
    slug: 'canvas-printing',
    route: '#services/canvas-printing',
    image: canvasPrintingImg,
    description: 'Museum-grade stretched canvas photo prints with wooden frames.'
  },
  {
    id: 13,
    name: 'Custom Printing',
    slug: 'custom-printing',
    route: '#services/custom-printing',
    image: customPrintingImg,
    description: 'Customized coffee mugs, metal water bottles, tote bags and caps.'
  },
  {
    id: 14,
    name: 'Flyers & Leaflets',
    slug: 'flyers-leaflets',
    route: '#services/flyers-leaflets',
    image: flyersLeafletsImg,
    description: 'Cost-effective promotional pamphlets and advertising inserts.'
  },
  {
    id: 15,
    name: 'Catalogues',
    slug: 'catalogues',
    route: '#services/catalogues',
    image: cataloguesImg,
    description: 'Multi-page saddle-stitched and perfect-bound product catalogs.'
  },
  {
    id: 16,
    name: 'Books Printing',
    slug: 'books-printing',
    route: '#services/books-printing',
    image: booksPrintingImg,
    description: 'Custom book publishing, notebooks, spiral diaries & binding.'
  }
];

export const heroSlidesData = [
  {
    id: 1,
    titleLine1: 'Your Ideas',
    titleLine2Our: 'Our',
    titleLine2Prints: 'Prints',
    subtitle: 'Designing & Printing',
    badges: [
      { id: 1, label: 'Premium Quality', color: '#F43F5E', icon: 'Award' },
      { id: 2, label: 'Fast Delivery', color: '#0EA5E9', icon: 'Truck' },
      { id: 3, label: 'Best Prices', color: '#F59E0B', icon: 'IndianRupee' },
      { id: 4, label: 'Custom Designs', color: '#10B981', icon: 'Pencil' },
    ],
    ctaText: 'Explore Our Services →',
    ctaLink: '#services-section',
  },
  {
    id: 2,
    titleLine1: 'Next-Gen',
    titleLine2Our: '3D',
    titleLine2Prints: 'Creations',
    subtitle: 'Custom Models & Prototyping',
    badges: [
      { id: 1, label: 'High Precision', color: '#F43F5E', icon: 'Award' },
      { id: 2, label: 'Rapid Turnaround', color: '#0EA5E9', icon: 'Truck' },
      { id: 3, label: 'Affordable Rates', color: '#F59E0B', icon: 'IndianRupee' },
      { id: 4, label: 'Custom CAD/STL', color: '#10B981', icon: 'Pencil' },
    ],
    ctaText: 'Explore 3D Printing →',
    ctaLink: '#3d-printing-section',
  },
  {
    id: 3,
    titleLine1: 'Corporate Branding',
    titleLine2Our: 'Custom',
    titleLine2Prints: 'Merchandise',
    subtitle: 'Mugs, T-Shirts, ID Cards & Gifts',
    badges: [
      { id: 1, label: 'Vibrant Colors', color: '#F43F5E', icon: 'Award' },
      { id: 2, label: 'Hyderabad Delivery', color: '#0EA5E9', icon: 'Truck' },
      { id: 3, label: 'Bulk Discounts', color: '#F59E0B', icon: 'IndianRupee' },
      { id: 4, label: 'Free Mockups', color: '#10B981', icon: 'Pencil' },
    ],
    ctaText: 'Start Customizing →',
    ctaLink: '#custom-printing-section',
  }
];

export const featureStripData = [
  {
    id: 1,
    title: 'Fast & Reliable Delivery',
    subtitle: 'Across Hyderabad',
    icon: 'Truck',
    bgColor: '#1E293B',
    iconColor: '#FFFFFF',
  },
  {
    id: 2,
    title: 'Premium Quality Prints',
    subtitle: 'For Every Business',
    icon: 'Award',
    bgColor: '#0284C7',
    iconColor: '#FFFFFF',
  },
  {
    id: 3,
    title: 'Expert Support',
    subtitle: 'Design to Delivery',
    icon: 'Headphones',
    bgColor: '#0F172A',
    iconColor: '#FFFFFF',
  },
  {
    id: 4,
    title: 'Best Prices',
    subtitle: 'Value for Money',
    icon: 'IndianRupee',
    bgColor: '#0284C7',
    iconColor: '#FFFFFF',
  },
  {
    id: 5,
    title: 'Easy Customization',
    subtitle: 'As Per Your Needs',
    icon: 'Settings',
    bgColor: '#0F172A',
    iconColor: '#FFFFFF',
  },
];

export const howItWorksSteps = [
  {
    step: 1,
    title: 'Choose a Product',
    desc: 'Browse our wide range of printing services',
    color: '#D946EF',
  },
  {
    step: 2,
    title: 'Customize Design',
    desc: 'Upload your design or use our templates',
    color: '#A855F7',
  },
  {
    step: 3,
    title: 'Place Order',
    desc: 'Confirm and make payment',
    color: '#6366F1',
  },
  {
    step: 4,
    title: 'We Print & Deliver',
    desc: 'High quality printing with fast delivery',
    color: '#9333EA',
  },
];

export const weServeData = [
  { id: 1, title: 'Businesses', icon: 'Building2' },
  { id: 2, title: 'Restaurants & Cafes', icon: 'UtensilsCrossed' },
  { id: 3, title: 'Schools & Colleges', icon: 'GraduationCap' },
  { id: 4, title: 'Events & Exhibitions', icon: 'Ticket' },
  { id: 5, title: 'Startups', icon: 'Rocket' },
  { id: 6, title: 'Personal Use', icon: 'Heart' },
];

export const galleryData = [
  { id: 1, title: 'Visiting Cards Box', image: work1, category: 'Stationery' },
  { id: 2, title: 'Rollup Banner Standee', image: work2, category: 'Large Format' },
  { id: 3, title: 'Employee ID Cards & Lanyards', image: work3, category: 'Corporate' },
  { id: 4, title: 'Restaurant Food Menus', image: work4, category: 'Hospitality' },
  { id: 5, title: 'Custom Roll Stickers', image: work5, category: 'Packaging' },
  { id: 6, title: 'Printed Cotton T-Shirts', image: work6, category: 'Apparel' },
  { id: 7, title: 'Hyderabad Charminar Canvas', image: work7, category: 'Art & Decor' },
  { id: 8, title: 'Tri-Fold Marketing Brochures', image: work8, category: 'Marketing' },
  { id: 9, title: 'Hardcover Bound Books', image: work9, category: 'Publishing' },
  { id: 10, title: 'Srinivas Acrylic Wooden Nameplate', image: work10, category: '3D & Signage' },
];

export const testimonialsData = [
  {
    id: 1,
    name: 'Ramesh K.',
    initial: 'R',
    avatarBg: '#EEF2FF',
    avatarColor: '#4F46E5',
    rating: 5,
    review: 'Excellent print quality and on-time delivery. Highly recommended for visiting cards and brochures!',
  },
  {
    id: 2,
    name: 'Sneha P.',
    initial: 'S',
    avatarBg: '#FDF2F8',
    avatarColor: '#DB2777',
    rating: 5,
    review: 'Great designs and very professional service. Our cafe menu cards look premium and waterproof. Will definitely order again.',
  },
  {
    id: 3,
    name: 'Arjun M.',
    initial: 'A',
    avatarBg: '#F0FDF4',
    avatarColor: '#16A34A',
    rating: 5,
    review: 'Best place for all printing needs in Hyderabad. Quick WhatsApp support, best prices and reliable delivery.',
  },
];

export const whyChooseUsPoints = [
  'High Quality Printing',
  'Fast Delivery in Hyderabad',
  'Wide Range of Products',
  'Affordable Prices',
  'Custom Designs',
  'Dedicated Support',
];

export const navDropdowns = {
  products: [
    { title: 'Visiting Cards', path: '#visiting-cards' },
    { title: 'Letter Heads', path: '#services/letter-heads' },
    { title: 'ID Cards & Lanyards', path: '#services/id-cards' },
    { title: 'Posters & Wall Art', path: '#services/posters' },
    { title: 'Brochures & Flyers', path: '#services/brochures' },
    { title: 'Stickers & Labels', path: '#services/stickers-labels' },
    { title: 'T-Shirts & Caps', path: '#services/t-shirt-printing' },
    { title: 'Catalogues & Books', path: '#services/catalogues' },
  ],
  services: [
    { title: 'Offset Printing', path: '#services/offset' },
    { title: 'Digital High-Speed Printing', path: '#services/digital' },
    { title: 'Flex & Large Format Printing', path: '#services/banners-flex' },
    { title: 'Graphic Designing Services', path: '#services/designing' },
    { title: 'Screen Printing & Merch', path: '#services/screen' },
    { title: 'Lamination & Binding', path: '#services/binding' },
  ],
  printing3d: [
    { title: 'Custom 3D Models', path: '#services/3d-printing' },
    { title: 'Personalized Keychains', path: '#services/3d-printing' },
    { title: 'Acrylic & 3D Nameplates', path: '#services/3d-printing' },
    { title: 'Corporate 3D Gifts', path: '#services/3d-printing' },
  ],
};
