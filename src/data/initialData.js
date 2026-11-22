// Initial Seed Data for Dilip Grocery Store, Jodhpur
export const INITIAL_SETTINGS = {
  storeName: "Dilip Grocery Store",
  tagline: "Shuddh, Taaza aur Mandi Bhaav par Groceries",
  whatsappNumber: "919024782721",
  address: "Near Ghanta Ghar, Sardar Market, Jodhpur, Rajasthan - 342001",
  city: "Jodhpur",
  state: "Rajasthan",
  timings: "8:00 AM – 9:00 PM (Daily)",
  deliveryCharges: 0, // Free Delivery as specified
  minOrderAmount: 99,
  currency: "₹",
  websiteUrl: (typeof window !== 'undefined' && window.location) ? window.location.origin : "https://dilipgrocerystore.pages.dev",
  announcement: "🎉 Mandi Fresh Veggies Daily! Free Home Delivery in Jodhpur on all orders. Order on WhatsApp!",
  logoUrl: "/favicon.svg",
  bannerUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
};

export const INITIAL_CATEGORIES = [
  {
    id: "cat-veg",
    name: "Fresh Vegetables",
    hindiName: "ताज़ा सब्ज़ियाँ",
    slug: "vegetables",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    description: "Farm fresh Aloo, Onion, Garlic & daily leafy greens direct from Mandi."
  },
  {
    id: "cat-fruits",
    name: "Fresh Fruits",
    hindiName: "ताज़े फल",
    slug: "fruits",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80",
    description: "Sweet, vitamin-rich seasonal & daily fruits."
  },
  {
    id: "cat-grocery",
    name: "Daily Grocery",
    hindiName: "दैनिक किराना",
    slug: "grocery",
    image: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&w=400&q=80",
    description: "Flour, Rice, Dal, Edible Oils, Sugar, Tea & essentials."
  },
  {
    id: "cat-dairy",
    name: "Dairy & Eggs",
    hindiName: "डेयरी और अंडे",
    slug: "dairy",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    description: "Pure cow milk, butter, fresh paneer, curd & farm eggs."
  },
  {
    id: "cat-spices",
    name: "Spices & Masale",
    hindiName: "शुद्ध मसाले",
    slug: "spices",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    description: "Authentic Rajasthani Mathania red chilli, turmeric, cumin, coriander."
  },
  {
    id: "cat-other",
    name: "Other Essentials",
    hindiName: "अन्य घरेलू सामान",
    slug: "other",
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80",
    description: "Snacks, pooja items, personal care & dry fruits."
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: "prod-aloo",
    name: "Desi Aloo (Fresh Potatoes)",
    hindiName: "देसी नया आलू",
    categoryId: "cat-veg",
    basePrice: 20, // ₹20/kg
    originalPrice: 28,
    unit: "kg",
    availableUnits: ["250g", "500g", "1kg", "2kg", "5kg"],
    defaultUnit: "1kg",
    stock: 120, // kg
    isAvailable: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    description: "Firm, farm-fresh mountain potatoes (Aloo), perfect for aloo parathas, dry sabzi, samosas and daily curries. Cleaned and handpicked daily.",
    mandiFresh: true
  },
  {
    id: "prod-onion",
    name: "Nashik Red Onion (Pyaaz)",
    hindiName: "नासिक लाल प्याज",
    categoryId: "cat-veg",
    basePrice: 35, // ₹35/kg
    originalPrice: 45,
    unit: "kg",
    availableUnits: ["500g", "1kg", "2kg", "5kg"],
    defaultUnit: "1kg",
    stock: 150,
    isAvailable: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80",
    description: "High pungency, crunchy red Nashik onions. Essential for tadka, salads, curries and Indian gravies. Dried skins and long shelf life.",
    mandiFresh: true
  },
  {
    id: "prod-garlic",
    name: "Desi Garlic (Lahsun)",
    hindiName: "देसी कड़क लहसुन",
    categoryId: "cat-veg",
    basePrice: 120, // ₹120/kg
    originalPrice: 160,
    unit: "kg",
    availableUnits: ["250g", "500g", "1kg"],
    defaultUnit: "250g",
    stock: 45,
    isAvailable: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80",
    description: "Aromatic, tightly packed Desi white garlic pods. Rich natural aroma and medicinal qualities for curries, dal tadka and chutneys.",
    mandiFresh: true
  },
  {
    id: "prod-tomato",
    name: "Fresh Hybrid Tomatoes (Tamatar)",
    hindiName: "ताज़ा लाल टमाटर",
    categoryId: "cat-veg",
    basePrice: 25,
    originalPrice: 35,
    unit: "kg",
    availableUnits: ["500g", "1kg", "2kg"],
    defaultUnit: "1kg",
    stock: 80,
    isAvailable: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    description: "Juicy, ripe red tomatoes packed with rich flavor. Hand-sorted to avoid soft or damaged pieces.",
    mandiFresh: true
  },
  {
    id: "prod-chilli",
    name: "Spicy Green Chilli (Hari Mirch)",
    hindiName: "तीखी हरी मिर्च",
    categoryId: "cat-veg",
    basePrice: 60,
    originalPrice: 80,
    unit: "kg",
    availableUnits: ["100g", "250g", "500g"],
    defaultUnit: "250g",
    stock: 30,
    isAvailable: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80",
    description: "Crisp and fiery fresh green chillies. Ideal for tempering dal, sabzi, pakoras and pickles.",
    mandiFresh: true
  },
  {
    id: "prod-ginger",
    name: "Fresh Ginger (Adrak)",
    hindiName: "ताज़ा अदरक",
    categoryId: "cat-veg",
    basePrice: 100,
    originalPrice: 140,
    unit: "kg",
    availableUnits: ["250g", "500g", "1kg"],
    defaultUnit: "250g",
    stock: 40,
    isAvailable: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    description: "Juicy, fibrous and pungent ginger root. Essential for morning kadak chai, curries and immunity.",
    mandiFresh: true
  },
  {
    id: "prod-apple",
    name: "Shimla Royal Delicious Apples",
    hindiName: "शिमला सेब",
    categoryId: "cat-fruits",
    basePrice: 140,
    originalPrice: 180,
    unit: "kg",
    availableUnits: ["500g", "1kg", "2kg"],
    defaultUnit: "1kg",
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
    description: "Crisp, sweet and juicy Shimla apples with natural wax polish. Packed with dietary fiber and antioxidants.",
    mandiFresh: false
  },
  {
    id: "prod-banana",
    name: "Fresh Robusta Bananas (Kela)",
    hindiName: "ताज़ा केला (दर्जन)",
    categoryId: "cat-fruits",
    basePrice: 40, // per dozen
    originalPrice: 50,
    unit: "dozen",
    availableUnits: ["6 pieces", "1 dozen", "2 dozen"],
    defaultUnit: "1 dozen",
    stock: 60,
    isAvailable: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    description: "Naturally ripened, energy-boosting sweet yellow bananas. Perfect for breakfast and smoothies.",
    mandiFresh: true
  },
  {
    id: "prod-paneer",
    name: "Fresh Malai Paneer (Cottage Cheese)",
    hindiName: "ताज़ा मलाई पनीर",
    categoryId: "cat-dairy",
    basePrice: 380, // per kg
    originalPrice: 420,
    unit: "kg",
    availableUnits: ["250g", "500g", "1kg"],
    defaultUnit: "250g",
    stock: 25,
    isAvailable: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    description: "Super soft, melt-in-mouth fresh dairy malai paneer. Made from pure cow milk, high protein and preservative-free.",
    mandiFresh: true
  },
  {
    id: "prod-milk",
    name: "Full Cream Fresh Cow Milk",
    hindiName: "शुद्ध गाय का दूध (लीटर)",
    categoryId: "cat-dairy",
    basePrice: 65,
    originalPrice: 70,
    unit: "litre",
    availableUnits: ["500ml", "1 litre", "2 litre"],
    defaultUnit: "1 litre",
    stock: 80,
    isAvailable: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80",
    description: "Freshly sourced pure whole milk with thick natural cream. Chilled and delivered fresh daily.",
    mandiFresh: true
  },
  {
    id: "prod-basmati",
    name: "Royal Basmati Rice (Daawat / India Gate)",
    hindiName: "शाही बासमती चावल",
    categoryId: "cat-grocery",
    basePrice: 90,
    originalPrice: 120,
    unit: "kg",
    availableUnits: ["1kg", "2kg", "5kg"],
    defaultUnit: "1kg",
    stock: 100,
    isAvailable: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    description: "Aged long-grain aromatic Basmati rice. Slender grains that double in length after cooking. Great for Biryani and Pulao.",
    mandiFresh: false
  },
  {
    id: "prod-atta",
    name: "Sharbati Whole Wheat Atta",
    hindiName: "शरबती गेहूं का आटा",
    categoryId: "cat-grocery",
    basePrice: 42,
    originalPrice: 50,
    unit: "kg",
    availableUnits: ["1kg", "5kg", "10kg"],
    defaultUnit: "5kg",
    stock: 200,
    isAvailable: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    description: "100% pure MP Sharbati wheat flour, freshly stone ground (chakki fresh). Rotis stay soft for over 8 hours.",
    mandiFresh: false
  },
  {
    id: "prod-chilli-powder",
    name: "Mathania Red Chilli Powder (Lal Mirch)",
    hindiName: "मथानिया लाल मिर्च पाउडर",
    categoryId: "cat-spices",
    basePrice: 340,
    originalPrice: 400,
    unit: "kg",
    availableUnits: ["100g", "250g", "500g", "1kg"],
    defaultUnit: "250g",
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1627735905051-968b555e56e0?auto=format&fit=crop&w=800&q=80",
    description: "World-famous Jodhpur Mathania red chilli powder. Vibrant natural red color and deep royal flavor with balanced heat.",
    mandiFresh: false
  },
  {
    id: "prod-turmeric",
    name: "Pure Salem Haldi (Turmeric Powder)",
    hindiName: "शुद्ध देसी हल्दी पाउडर",
    categoryId: "cat-spices",
    basePrice: 220,
    originalPrice: 260,
    unit: "kg",
    availableUnits: ["100g", "250g", "500g", "1kg"],
    defaultUnit: "250g",
    stock: 60,
    isAvailable: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    description: "High-curcumin golden turmeric powder. No artificial colors, pure ground rhizomes.",
    mandiFresh: false
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-94812",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    customerName: "Rahul Sharma",
    customerPhone: "9876543210",
    deliveryAddress: "House 24, Near Clock Tower, Nai Sarak, Jodhpur",
    landmark: "Behind City Post Office",
    instructions: "Please deliver before 5 PM, ring bell twice.",
    items: [
      {
        productId: "prod-aloo",
        name: "Desi Aloo (Fresh Potatoes)",
        selectedUnit: "2kg",
        unitPrice: 20,
        quantity: 1,
        totalPrice: 40
      },
      {
        productId: "prod-onion",
        name: "Nashik Red Onion (Pyaaz)",
        selectedUnit: "1kg",
        unitPrice: 35,
        quantity: 1,
        totalPrice: 35
      },
      {
        productId: "prod-garlic",
        name: "Desi Garlic (Lahsun)",
        selectedUnit: "250g",
        unitPrice: 120,
        quantity: 1,
        totalPrice: 30
      }
    ],
    subtotal: 105,
    deliveryCharges: 0,
    totalAmount: 105,
    status: "Confirmed",
    whatsappStatus: "Sent by Customer"
  },
  {
    id: "ORD-94813",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    customerName: "Pooja Bhati",
    customerPhone: "9414123456",
    deliveryAddress: "Flat 302, Green Valley Apartments, Ratanada, Jodhpur",
    landmark: "Opposite Circuit House",
    instructions: "Leave with security if not available.",
    items: [
      {
        productId: "prod-paneer",
        name: "Fresh Malai Paneer (Cottage Cheese)",
        selectedUnit: "500g",
        unitPrice: 380,
        quantity: 1,
        totalPrice: 190
      },
      {
        productId: "prod-tomato",
        name: "Fresh Hybrid Tomatoes (Tamatar)",
        selectedUnit: "1kg",
        unitPrice: 25,
        quantity: 1,
        totalPrice: 25
      }
    ],
    subtotal: 215,
    deliveryCharges: 0,
    totalAmount: 215,
    status: "Delivered",
    whatsappStatus: "Sent by Customer"
  }
];
