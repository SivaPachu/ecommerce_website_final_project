# 🚀 NexusGear | Pro-Grade Gaming & Audio E-Commerce Platform

**NexusGear** is a fully responsive, production-ready full-stack MERN (MongoDB, Express.js, React, Node.js) e-commerce web application specializing in high-end electronics, audiophile IEMs, mechanical keyboards, and gaming peripherals. Built with a sophisticated slate grey UI foundation, crimson coral highlights, and cobalt blue accents, it delivers an immersive e-commerce experience modeled after top-tier platforms like Amazon, Flipkart, and Meesho.

---

## 🎨 Design & Color Palette
* **UI Foundation:** Dark Slate Grey (`#0f172a`, `#1e293b`)
* **Primary Accents:** Cobalt Blue (`#2563eb`, `#38bdf8`)
* **Highlights & Badges:** Crimson Coral / Sale Red (`#e11d48`)

---

## ✨ Features

- 🏠 Home Page with promotional banners & flash sale carousels
- ⚡ Scroll-triggered responsive search bar in the sticky navbar
- 🎧 Curated Electronics Catalog across 7 dedicated categories (Keyboards, Mice, Headphones, Controllers, IEMs, TWS, Powerbanks)
- 🔍 Real-Time Product Search by name, brand, or category ID
- 🎯 Category ID Aggregation to explore similar items instantly
- 👁️ Inline Detailed Product View with specs, pricing, and savings badges
- ♥ Wishlist functionality with heart toggle animations
- 🛒 Shopping Cart with multiple item quantity adjustments and recommendations
- 📱 Responsive Mobile Side Navigation Drawer with clean left-aligned links
- 🖥️ Persistent Desktop Navigation Bar & Footer across all pages
- 👤 User Registration & Secure Sign-In
- 🔐 Strict Regex Validation for names, 10-digit mobile numbers, approved email domains (`@gmail`, `@outlook`, `@icloud`, `@yahoo`), and complex passwords
- 💳 Advanced Checkout with UPI/QR Google Pay redirect, Credit/Debit card validation, and dynamic delivery rules ($\ge$ ₹599 Free, $<$ ₹599 random under ₹80; +₹10 COD fee)
- 🧾 Unique Random Order ID generation (e.g., `ORD-XXXX-XXXXX`)
- 📞 Contact Us Page with form validation

---

## 🛠️ Technologies Used

- **Frontend:** React (Vite), JavaScript, Vanilla CSS, Responsive Media Queries
- **Backend:** Node.js, Express.js, RESTful APIs
- **Database:** MongoDB Atlas, Mongoose
- **Deployment:** Vercel (Frontend) & Render (Backend)

---

## 📄 Website Features Breakdown

### 🏠 Home Page
- Promotional electronics festival banner
- Search container with smooth scroll-to-navbar transition
- Amazon/Flipkart-style horizontal scrolling category rows
- Featured product cards with direct Add-to-Cart and Buy-Now actions
- Responsive multi-column footer

### 👕 Products Catalog & Aggregation
- Full product grid with instant search filtering
- Category chip filter bar
- Toggled detailed view panel showing rich product descriptions
- Horizontal sub-row showing similar products aggregated by category ID

### 📱 Responsive Navigation
- Desktop navigation bar with instant page switching
- Mobile hamburger menu button pinned cleanly to the top-right corner
- Mobile side drawer with badge counters for cart items and saved wishlist products

### 👤 User Authentication & Profile
- Registration and login views
- Strict Regex validation preventing invalid form submissions
- Persistent user profile displaying saved delivery details, wishlist items, and past order history synced with MongoDB Atlas

### 💳 Checkout & Payment Options
- **UPI / QR Instant Pay:** Renders a scannable QR code linking to the Google Pay home page (`pay.google.com`)
- **Credit / Debit Card:** Enforces strict 16-digit card number, MM/YY expiry, and 3-digit CVV inputs
- **Dynamic Delivery Charges:** Automatically applies **FREE** shipping for orders $\ge$ ₹599, and a random charge ($<$ ₹80) for smaller orders
- **Cash on Delivery (COD):** Adds a transparent ₹10 handling fee

---

## 🚀 Live Demo & Repository

🔗 **Live Website:** 

https://frontend-pvbd.vercel.app/ 

💻 **GitHub Repository:** 

https://github.com/SivaPachu/ecommerce_website_final_project

---

## ⚙️ Local Setup & Installation Instructions

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/SivaPachu/nexusgear-ecommerce.git](https://github.com/SivaPachu/nexusgear-ecommerce.git)
   cd ecommerce-electronics

2. **Set Up & Run the Backend:**
   ```bash
   cd backend
   npm install

   Create a .env file inside backend/:
   
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=super_secret_jwt_key_123456!

4. **Start the server:**
   ```bash
   npm run dev

5. **Set Up & Run the Frontend:**
   ```bash
   cd ../frontend
   npm install
   
    Create a .env file inside frontend/:
   
    VITE_API_BASE_URL=http://localhost:5000
   
6. **Start the Vite development server:**
   ```bash
   npm run dev

---

## 🎯 Future Improvements

- 🛒 Add live Stripe/Razorpay payment gateway integration
- 🗄️ Expand admin inventory management dashboard for adding/deleting products
- ⭐ Add user product reviews and star ratings
- 📧 Implement real email notifications for order placements
- 📱 Develop a dedicated mobile progressive web app (PWA) wrapper

---

## 👨‍💻 Author

**Pachaiyappan S**

"Pro-Grade Tech. Seamless Experience." 🎧⚡
