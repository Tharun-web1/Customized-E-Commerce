# ASAP Visiting Cards - React Native Mobile Application

This is the standalone React Native mobile application for the Customized E-Commerce platform (ASAP Visiting Cards), built to consume the existing Python Django REST API backend without modifying any existing backend or React.js web code.

---

## Architecture Overview

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

## Mobile Features

1. **Product Catalog & Collections**:
   - Filter by Shape, Texture, Special (Gold Foil, Spot UV), and Card Holders.
   - Live search by keywords.
   - Comprehensive product detail pages with GSM, finish, and dimension specifications.
   - Volume discount pricing tiers (up to 25% savings).
   - Real-time PIN code delivery checker.

2. **Mobile Card Design Studio**:
   - Interactive 3D photorealistic card canvas with Front & Back side flip.
   - Real-time text customization (Full Name, Job Title, Company, Phone, Email, Office Address, QR code URL).
   - Executive color palettes and metallic gold foil themes.
   - Vector badges & contact icon placement (Call, WhatsApp, Email, Globe, Map Pin, Trust Shield).
   - Paper finish & corner styles selection (Square 90° vs. Rounded 6mm corners).

3. **Print-Ready Artwork Upload Flow**:
   - Camera snap & Gallery image picker integration with `expo-image-picker`.
   - Bleed & safety zone overlay inspection.
   - Front and back artwork upload to `/api/upload/`.

4. **Shopping Cart & Checkout**:
   - Cart item list with front/back mockup rendering.
   - Coupon verification (`PROMO15`, `SAVE10`, `FREESHIP`) via `/api/promos/validate/`.
   - Free shipping threshold detection.
   - Shipping address and customer profile form.
   - Delivery speeds: Priority Air Express (24–48h) vs. Standard Surface Delivery.
   - Payment methods: UPI / QR Code, Credit/Debit Cards, Net Banking, and Cash on Delivery (COD).

5. **Order Tracking & Management**:
   - Order confirmation with `#ASAP-XXXXXX` reference generation.
   - Live 4-stage timetable tracker (Order Placed → Pre-Flight Bleed Check → Digital Print → Air Express Dispatch).
   - Customer support shortcuts for WhatsApp and phone.

6. **Admin Portal**:
   - Superuser/staff login via `/api/admin/login/`.
   - Real-time metrics overview (total cards, templates, orders, revenue).
   - Customer orders search and deletion via `/api/admin/orders/`.

---

## Running the Application

1. **Install dependencies**:
   ```bash
   cd mobile-app
   npm install
   ```

2. **Start the Expo development server**:
   ```bash
   npx expo start
   ```

3. **Running on Target Platforms**:
   - **Android**: Press `a` in the terminal (or run `npx expo start --android`).
   - **iOS**: Press `i` in the terminal (or run `npx expo start --ios`).
   - **Web Preview**: Press `w` in the terminal (or run `npx expo start --web`).
   - **Physical Device**: Scan the QR code using the **Expo Go** app on your phone.

---

## Configuration

Update `src/constants/config.js` or `.env` to point to your backend API:
- **Android Emulator**: `http://10.0.2.2:8000/api`
- **iOS Simulator / Web**: `http://localhost:8000/api`
- **Physical Phone**: `http://<YOUR_COMPUTER_LOCAL_IP>:8000/api` (e.g. `http://192.168.1.5:8000/api`)
- **Production Server**: `https://asapnow.in/api`
