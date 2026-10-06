# SAP Prints – React Native Mobile Application

This is the standalone, customer-facing React Native mobile application for **SAP Prints – Designing & Printing**, built to consume the existing Python Django REST API backend without modifying any existing backend or React.js web code.

---

## System Architecture

```text
                     Existing Python Django Backend
                           (Django REST API)
                                  │
                                  │ REST APIs / X-Session-ID
                                  │
            ┌─────────────────────┴─────────────────────┐
            │                                           │
            ▼                                           ▼
      Existing React.js Web                     React Native Mobile App
      (Vite / React 18)                         (Expo SDK / React Native)
```

---

## Implemented Workflows & Features

1. **Authentication & Onboarding**:
   - **Splash Screen**: Auto-verifies customer session and routes to Home or Login.
   - **Official Login Screen**: Exact 1-to-1 UI match with SAP Prints branding, social auth (Google, Apple), and show/hide password toggle.
   - **Registration Flow**: Complete customer sign-up with validations.
   - **Forgot Password**: 2-step OTP verification and password reset.

2. **Official Home Screen**:
   - **Top Header**: SAP Prints logo, dynamic Location dropdown (`📍 KPHB Colony, Hyderabad ⌄`), and Notification bell with unread badge (`2`).
   - **Search & QR Scanner**: Real-time product/template search and physical print proof QR inspection.
   - **Promotional Carousel**: High-definition visiting cards hero banner with CTA (`"Order Now →"`) and pagination indicators.
   - **3-Column Category Grid**: All 15 official printing categories with custom pastel cards, product artwork, and circular arrow buttons.
   - **Quick Benefits Bar**: Quick Order / Fast Delivery in Hyderabad, Premium Quality, and 24/7 Customer Support.

3. **5-Tab Navigation**:
   - **Home**: Main storefront.
   - **Templates**: 4,000+ industry design templates filterable by industry and orientation.
   - **Orders**: Live customer order history and 6-stage status tracking timeline.
   - **Offers**: Exclusive discounts & promo codes (`SAPFIRST`, `BULK30`).
   - **Profile**: Customer details, addresses, GSTIN invoicing, and support.

4. **Product Catalog & Customization Studio**:
   - Product detail specifications (GSM, paper finishes, corner styles, volume discounts).
   - Real-time Interactive Design Studio with live text editing, color palettes, and front/back card flip.
   - Camera snap and gallery upload for custom print-ready artwork with bleed inspection.

5. **Shopping Cart & Checkout**:
   - Backend session cart integration (`/api/cart/`).
   - Real-time promo code validation (`/api/promos/validate/`).
   - Shipping address management, payment method selection (UPI, Cards, NetBanking, COD), and order confirmation with tracking ID.

---

## Running the Application

1. **Navigate to the mobile app directory**:
   ```bash
   cd mobile-app
   ```

2. **Start the development server**:
   ```bash
   npx expo start
   ```

3. **Run on target platforms**:
   - **Android**: Press `a` in the terminal (or run `npx expo start --android`).
   - **iOS**: Press `i` in the terminal (or run `npx expo start --ios`).
   - **Web Preview**: Press `w` in the terminal (or run `npx expo start --web`).
   - **Physical Device**: Scan the QR code using the **Expo Go** app on your phone.
