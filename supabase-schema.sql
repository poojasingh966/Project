-- ====================================================================
-- DILIP GROCERY STORE – PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Location: Jodhpur, Rajasthan
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.store_settings (
    id INT PRIMARY KEY DEFAULT 1,
    store_name TEXT NOT NULL DEFAULT 'Dilip Grocery Store',
    tagline TEXT DEFAULT 'Shuddh, Taaza aur Mandi Bhaav par Groceries',
    whatsapp_number TEXT NOT NULL DEFAULT '919024782721',
    address TEXT NOT NULL DEFAULT 'Near Ghanta Ghar, Sardar Market, Jodhpur, Rajasthan - 342001',
    city TEXT DEFAULT 'Jodhpur',
    state TEXT DEFAULT 'Rajasthan',
    timings TEXT DEFAULT '8:00 AM – 9:00 PM (Daily)',
    delivery_charges NUMERIC(10, 2) DEFAULT 0.00,
    min_order_amount NUMERIC(10, 2) DEFAULT 99.00,
    currency TEXT DEFAULT '₹',
    website_url TEXT DEFAULT 'https://dilipgrocerystore.pages.dev',
    announcement TEXT DEFAULT '🎉 Mandi Fresh Veggies Daily! Free Home Delivery in Jodhpur on all orders.',
    logo_url TEXT,
    banner_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES (Admins) TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    hindi_name TEXT,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    hindi_name TEXT,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    base_price NUMERIC(10, 2) NOT NULL, -- price per primary unit (e.g. ₹20/kg)
    original_price NUMERIC(10, 2),
    unit TEXT DEFAULT 'kg', -- 'kg', 'dozen', 'litre', 'piece'
    available_units TEXT[] DEFAULT ARRAY['250g', '500g', '1kg', '2kg'],
    default_unit TEXT DEFAULT '1kg',
    stock NUMERIC(10, 2) DEFAULT 100.00,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    mandi_fresh BOOLEAN DEFAULT TRUE,
    image_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    landmark TEXT,
    instructions TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_charges NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'Awaiting WhatsApp Confirmation' CHECK (
        status IN (
            'Pending',
            'Awaiting WhatsApp Confirmation',
            'Confirmed',
            'Preparing',
            'Out for Delivery',
            'Delivered',
            'Cancelled'
        )
    ),
    whatsapp_status TEXT DEFAULT 'Awaiting WhatsApp Send',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT,
    product_name TEXT NOT NULL,
    selected_unit TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- INDEXES FOR FAST PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- STORE SETTINGS POLICIES
DROP POLICY IF EXISTS "Public can view store settings" ON public.store_settings;
CREATE POLICY "Public can view store settings" ON public.store_settings
    FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins can update store settings" ON public.store_settings;
CREATE POLICY "Admins can update store settings" ON public.store_settings
    FOR ALL TO authenticated USING (true);

-- CATEGORIES POLICIES
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories" ON public.categories
    FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL TO authenticated USING (true);

-- PRODUCTS POLICIES
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT TO public USING (is_available = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL TO authenticated USING (true);

-- ORDERS POLICIES
DROP POLICY IF EXISTS "Anyone can insert an order" ON public.orders;
CREATE POLICY "Anyone can insert an order" ON public.orders
    FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read order by ID" ON public.orders;
CREATE POLICY "Public can read order by ID" ON public.orders
    FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins can manage and update orders" ON public.orders;
CREATE POLICY "Admins can manage and update orders" ON public.orders
    FOR ALL TO authenticated USING (true);

-- ORDER ITEMS POLICIES
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Anyone can insert order items" ON public.order_items
    FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view order items" ON public.order_items;
CREATE POLICY "Public can view order items" ON public.order_items
    FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
CREATE POLICY "Admins can manage order items" ON public.order_items
    FOR ALL TO authenticated USING (true);

-- ====================================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION
-- ====================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view images in product-images bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'product-images');

-- Only authenticated admins can upload images
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
CREATE POLICY "Admin Upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'product-images');

-- Only authenticated admins can delete images
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
CREATE POLICY "Admin Delete" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'product-images');

-- ====================================================================
-- INITIAL SEED DATA
-- ====================================================================

-- 1. Initial Settings
INSERT INTO public.store_settings (
    id, store_name, tagline, whatsapp_number, address, city, state, timings, delivery_charges, min_order_amount, website_url, announcement
) VALUES (
    1,
    'Dilip Grocery Store',
    'Shuddh, Taaza aur Mandi Bhaav par Groceries',
    '919024782721',
    'Near Ghanta Ghar, Sardar Market, Jodhpur, Rajasthan - 342001',
    'Jodhpur',
    'Rajasthan',
    '8:00 AM – 9:00 PM (Daily)',
    0.00,
    99.00,
    'https://dilipgrocerystore.pages.dev',
    '🎉 Mandi Fresh Veggies Daily! Free Home Delivery in Jodhpur on all orders.'
) ON CONFLICT (id) DO UPDATE SET 
    store_name = EXCLUDED.store_name,
    whatsapp_number = EXCLUDED.whatsapp_number,
    timings = EXCLUDED.timings;

-- 1B. Admin Profile (Goutam Das)
INSERT INTO public.profiles (id, email, full_name, role)
VALUES ('7d46716c-898f-45e8-82f5-37b8253055c5', 'goutamdas8562001@gmail.com', 'Goutam Das', 'admin')
ON CONFLICT (id) DO NOTHING;

-- 2. Initial Categories
INSERT INTO public.categories (id, name, hindi_name, slug, image_url, description) VALUES
('cat-veg', 'Fresh Vegetables', 'ताज़ा सब्ज़ियाँ', 'vegetables', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80', 'Farm fresh Aloo, Onion, Garlic & daily leafy greens direct from Mandi.'),
('cat-fruits', 'Fresh Fruits', 'ताज़े फल', 'fruits', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80', 'Sweet, vitamin-rich seasonal & daily fruits.'),
('cat-grocery', 'Daily Grocery', 'दैनिक किराना', 'grocery', 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&w=400&q=80', 'Flour, Rice, Dal, Edible Oils, Sugar, Tea & essentials.'),
('cat-dairy', 'Dairy & Eggs', 'डेयरी और अंडे', 'dairy', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80', 'Pure cow milk, butter, fresh paneer, curd & farm eggs.'),
('cat-spices', 'Spices & Masale', 'शुद्ध मसाले', 'spices', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80', 'Authentic Rajasthani Mathania red chilli, turmeric, cumin, coriander.'),
('cat-other', 'Other Essentials', 'अन्य घरेलू सामान', 'other', 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80', 'Snacks, pooja items, personal care & dry fruits.')
ON CONFLICT (id) DO NOTHING;

-- 3. Initial Products
INSERT INTO public.products (id, name, hindi_name, category_id, base_price, original_price, unit, available_units, default_unit, stock, is_available, is_featured, mandi_fresh, image_url, description) VALUES
('prod-aloo', 'Desi Aloo (Fresh Potatoes)', 'देसी नया आलू', 'cat-veg', 20.00, 28.00, 'kg', ARRAY['250g', '500g', '1kg', '2kg', '5kg'], '1kg', 120.00, true, true, true, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80', 'Firm, farm-fresh mountain potatoes (Aloo), perfect for aloo parathas, dry sabzi, samosas and daily curries.'),
('prod-onion', 'Nashik Red Onion (Pyaaz)', 'नासिक लाल प्याज', 'cat-veg', 35.00, 45.00, 'kg', ARRAY['500g', '1kg', '2kg', '5kg'], '1kg', 150.00, true, true, true, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80', 'High pungency, crunchy red Nashik onions. Essential for tadka, salads, curries and Indian gravies.'),
('prod-garlic', 'Desi Garlic (Lahsun)', 'देसी कड़क लहसुन', 'cat-veg', 120.00, 160.00, 'kg', ARRAY['250g', '500g', '1kg'], '250g', 45.00, true, true, true, 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80', 'Aromatic, tightly packed Desi white garlic pods. Rich natural aroma and medicinal qualities for curries and dal tadka.'),
('prod-tomato', 'Fresh Hybrid Tomatoes (Tamatar)', 'ताज़ा लाल टमाटर', 'cat-veg', 25.00, 35.00, 'kg', ARRAY['500g', '1kg', '2kg'], '1kg', 80.00, true, true, true, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80', 'Juicy, ripe red tomatoes packed with rich flavor. Hand-sorted to avoid soft or damaged pieces.'),
('prod-apple', 'Shimla Royal Delicious Apples', 'शिमला सेब', 'cat-fruits', 140.00, 180.00, 'kg', ARRAY['500g', '1kg', '2kg'], '1kg', 50.00, true, true, false, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80', 'Crisp, sweet and juicy Shimla apples with natural wax polish.'),
('prod-paneer', 'Fresh Malai Paneer (Cottage Cheese)', 'ताज़ा मलाई पनीर', 'cat-dairy', 380.00, 420.00, 'kg', ARRAY['250g', '500g', '1kg'], '250g', 25.00, true, true, true, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', 'Super soft, melt-in-mouth fresh dairy malai paneer. Made from pure cow milk, high protein and preservative-free.'),
('prod-basmati', 'Royal Basmati Rice (Daawat / India Gate)', 'शाही बासमती चावल', 'cat-grocery', 90.00, 120.00, 'kg', ARRAY['1kg', '2kg', '5kg'], '1kg', 100.00, true, true, false, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80', 'Aged long-grain aromatic Basmati rice. Great for Biryani and Pulao.'),
('prod-chilli-powder', 'Mathania Red Chilli Powder (Lal Mirch)', 'मथानिया लाल मिर्च पाउडर', 'cat-spices', 340.00, 400.00, 'kg', ARRAY['100g', '250g', '500g', '1kg'], '250g', 50.00, true, true, false, 'https://images.unsplash.com/photo-1627735905051-968b555e56e0?auto=format&fit=crop&w=800&q=80', 'World-famous Jodhpur Mathania red chilli powder. Vibrant natural red color and deep royal flavor.')
ON CONFLICT (id) DO NOTHING;
