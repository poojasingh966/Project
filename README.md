# 🥦 Dilip Grocery Store – Professional E-Commerce Website

A modern, production-ready, full-stack Grocery E-Commerce website engineered for **Dilip Grocery Store (Jodhpur, Rajasthan)**. Built with a 100% **Free-First** architecture: no paid APIs, no paid templates, and zero monthly hosting fees.

Customers can browse farm-fresh vegetables (Aloo ₹20/kg, Nashik Onion, Desi Garlic), fruits, dairy, and spices, choose fractional grocery quantities (250g, 500g, 1kg, 2kg, 5kg) with live price recalculation, scan product QR codes, and place orders directly on WhatsApp with itemized summaries and live tracking links.

The store owner manages all products, prices, stock, image uploads, categories, orders, QR placards, and WhatsApp group promotional flyers via a dedicated, secure Admin Dashboard.

---

## 🌟 Key Features

### 🛍️ Customer Experience
- **Mandi Fresh Catalog**: Farm-fresh Desi Aloo, Nashik Onion, Desi Garlic, Tomatoes, Dairy & Spices with authentic Mandi pricing.
- **Dynamic Quantity & Price Calculator**:
  - Supports `250g`, `500g`, `750g`, `1kg`, `2kg`, `5kg`, `dozen`, and `litre`.
  - Automatic price calculations (e.g., Aloo at ₹20/kg: 500g = ₹10, 2kg = ₹40).
- **Frictionless Shopping Cart & Drawer**: Slide-over drawer, quantity adjustments, item removal, and persistent storage in `localStorage`.
- **Zero-Friction Checkout**: No account or password creation required. Customer enters full name, 10-digit mobile number, delivery address in Jodhpur, landmark, and special instructions.
- **WhatsApp Click-to-Chat Ordering**:
  - Automatically records the order in the store database with status `Awaiting WhatsApp Confirmation`.
  - Opens WhatsApp (`wa.me`) with a pre-formatted, itemized order message including total amount and actual website order link.
- **Built-in QR Code Camera Scanner**: Built with `html5-qrcode` to scan store or product QR codes with camera flip, privacy protection, and fallback manual entry.
- **Individual Product Pages**: Dedicated URL for every product (`/product/:id`) with WhatsApp share and unique product QR codes.

### 🛡️ Store Admin Dashboard (`/admin`)
- **Protected Authentication**: Supabase Authentication + Store Admin credentials (`goutamdas8562001@gmail.com` / `gautam123@G`).
- **Overview Analytics**: Real-time sales metrics, total orders, pending/confirmed/delivered breakdown, and low-stock alerts (< 10 units).
- **Product Management**: Add, edit, delete, adjust prices, stock count, mark featured or Mandi fresh, and toggle availability.
- **Device Image Upload**: Upload product photos from mobile gallery or computer desktop with instant preview and auto-compression.
- **Category Management**: Create, edit, and organize categories with images and Hindi names.
- **Order Management & Fulfillment**:
  - Track statuses: *Pending*, *Awaiting WhatsApp Confirmation*, *Confirmed*, *Preparing*, *Out for Delivery*, *Delivered*, *Cancelled*.
  - Direct 1-tap WhatsApp chat button with the customer.
  - Printable delivery slip and invoice receipt.
- **QR Code Studio**: Generate and download Store, Category, and Product QR codes in high-resolution **PNG** or vector **SVG**, plus printable counter placards.
- **WhatsApp Group Promotional Banner Studio**: Generate high-definition promotional flyers containing store logo, Mandi vegetables collage, phone number, and QR code ready to download and share on WhatsApp status and groups.
- **Store Settings**: Real-time configuration for store name, WhatsApp number, Jodhpur address, store timings (8 AM – 9 PM), and free delivery thresholds.

---

## 🛠️ Technology Stack (100% Free First)

| Layer | Technology | Free Tier Capability |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Fast HMR, lightweight bundle |
| **Styling** | Tailwind CSS + Lucide Icons | Fresh grocery branding (Emerald, Cream, White) |
| **Database** | Supabase PostgreSQL | 500 MB free storage, up to 500,000 requests/month |
| **Authentication** | Supabase Auth + Admin Store Session | 50,000 monthly active users free |
| **Storage** | Supabase Storage (`product-images`) | 1 GB free file storage + local fallback |
| **Hosting** | Cloudflare Pages | Unlimited bandwidth, 500 builds/month, free SSL |
| **WhatsApp** | WhatsApp Click-to-Chat (`wa.me`) | 100% Free (no WhatsApp Business API fees) |
| **QR Code** | `qrcode.react` & `html5-qrcode` | Open-source client-side generator & scanner |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 2. Installation
```bash
# Clone or navigate to the project directory
cd "c:\Users\Kusum\Desktop\New folder"

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser at `http://localhost:5173`.

> **Note**: The app includes an **Offline-First Data Layer**. It works out of the box with the complete Dilip Grocery Store catalog even before you connect live Supabase credentials!

---

## 🗄️ Supabase Free Tier Setup

Follow these simple steps to connect your live PostgreSQL database and storage:

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign up for a free account.
2. Click **New Project** and name it `dilip-grocery-store`.
3. Choose your database password and select a region close to your customers (e.g., `South Asia (Mumbai)`).

### Step 2: Run Database Schema SQL
1. In your Supabase project dashboard, open the **SQL Editor** from the left navigation.
2. Click **New Query**.
3. Open `supabase-schema.sql` from this repository, copy the entire SQL script, and paste it into the editor.
4. Click **Run**.
   *This automatically creates all tables (`store_settings`, `profiles`, `categories`, `products`, `orders`, `order_items`), sets up Row Level Security (RLS) policies, configures the `product-images` storage bucket, and seeds initial Mandi products.*

### Step 3: Create the Admin User in Supabase Auth
1. Go to **Authentication -> Users** in the Supabase dashboard.
2. Click **Add User -> Create User**.
3. Enter:
   - **Email**: `goutamdas8562001@gmail.com`
   - **Password**: `gsi`
   - Check **Auto Confirm User**.
4. Click **Create User**.

### Step 4: Configure Environment Variables
1. In your Supabase dashboard, go to **Project Settings -> API**.
2. Copy the **Project URL** and the **anon public API key**.
3. Create a `.env` file in the root of your project:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
   VITE_STORE_NAME=Dilip Grocery Store
   VITE_WHATSAPP_NUMBER=919024782721
   VITE_STORE_CITY=Jodhpur
   VITE_STORE_STATE=Rajasthan
   ```

---

## 🌐 Free Cloudflare Pages Deployment

Deploy your website globally with Cloudflare Pages free tier (unlimited bandwidth & fast edge caching):

### Method A: Via Cloudflare Dashboard (Recommended)
1. Push your repository to **GitHub**.
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Workers & Pages -> Create Application -> Pages -> Connect to Git**.
3. Select your repository.
4. Set the Build Configuration:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. In **Environment variables**, add:
   - `VITE_SUPABASE_URL`: *(your Supabase URL)*
   - `VITE_SUPABASE_ANON_KEY`: *(your Supabase anon key)*
6. Click **Save and Deploy**.

> **SPA Client-Side Routing**: The repository already includes `public/_redirects` (`/*  /index.html  200`), ensuring page refreshes on `/products`, `/cart`, `/checkout`, and `/admin` resolve seamlessly on Cloudflare Pages without 404 errors.

---

## 📱 WhatsApp Ordering Workflow

1. Customer browses products (e.g. Aloo, Onion, Garlic) and selects desired weights.
2. Customer clicks **Add to Cart** or **Buy Now**.
3. On the checkout page, the customer enters their delivery address in Jodhpur and clicks **Place Order on WhatsApp**.
4. The website saves the order with status `Awaiting WhatsApp Confirmation`.
5. The customer's device opens WhatsApp with the pre-filled message:
   ```text
   🛒 DILIP GROCERY STORE – NEW ORDER
   ━━━━━━━━━━━━━━━━━━━━━
   Order ID: #ORD-94812
   Customer Name: Rahul Sharma
   Mobile: 9876543210
   Delivery Address: House 24, Near Clock Tower, Jodhpur
   Landmark: Behind City Post Office
   Special Instructions: Deliver before 5 PM

   ORDER DETAILS:
   • Desi Aloo (Fresh Potatoes) – 2KG – ₹40
   • Nashik Red Onion (Pyaaz) – 1KG – ₹35
   • Desi Garlic (Lahsun) – 250G – ₹30
   ━━━━━━━━━━━━━━━━━━━━━
   Subtotal: ₹105
   Delivery Charges: ₹0 (FREE DELIVERY)
   TOTAL AMOUNT: ₹105
   ━━━━━━━━━━━━━━━━━━━━━
   Website Order Link: https://dilipgrocerystore.pages.dev/order/ORD-94812

   Thank you for ordering from Dilip Grocery Store.
   Please confirm my order and send estimated delivery time! 🙏
   ```
6. The customer sends the message. The store owner sees the order in the Admin Dashboard, packs the fresh produce, and updates the status to *Confirmed* or *Out for Delivery*.

---

## 🔒 Security & Privacy

- **Row Level Security (RLS)**: Protects all database operations. Public visitors can only read products and create new orders; only authenticated admins can edit products, delete categories, or modify order statuses.
- **No Service Role Keys**: Only the public `anon` key is used on the frontend. Private keys are never committed or exposed.
- **Camera Privacy**: The QR scanner accesses the camera strictly within the user's browser; video footage is never recorded or uploaded.

---

## 📋 Store Details Reference
- **Store Name**: Dilip Grocery Store
- **Location**: Jodhpur, Rajasthan
- **WhatsApp**: +91 90247 82721
- **Store Timings**: 8:00 AM – 9:00 PM
- **Admin Email**: `goutamdas8562001@gmail.com`
- **Admin Password**: `gautam123@G`

---

© 2026 Dilip Grocery Store. All rights reserved.
