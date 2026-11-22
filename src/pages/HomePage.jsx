import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Clock, 
  MessageCircle, 
  QrCode,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import HeroBanner from '../components/HeroBanner';
import CategorySlider from '../components/CategorySlider';
import ProductCard from '../components/ProductCard';
import ProductQRModal from '../components/ProductQRModal';
import { getWhatsAppInquiryUrl } from '../services/whatsappService';

export default function HomePage() {
  const { products, settings, setIsQRScannerOpen, setSelectedCategory } = useStore();
  const [qrModalProduct, setQrModalProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Filter products for homepage sections
  const featuredVeggies = products.filter(p => p.categoryId === 'cat-veg');
  const featuredProducts = products.filter(p => p.isFeatured);

  const displayedProducts = activeTab === 'all' 
    ? products.slice(0, 8)
    : activeTab === 'veg'
    ? products.filter(p => p.categoryId === 'cat-veg')
    : activeTab === 'dairy'
    ? products.filter(p => p.categoryId === 'cat-dairy')
    : products.filter(p => p.categoryId === 'cat-fruits');

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Category Circular Slider */}
      <CategorySlider />

      {/* 3. Mandi Fresh Specials: Aloo, Onion, Garlic (Priority Highlight) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-amber-50 rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-1.5 shadow-xs">
                <Flame className="w-3.5 h-3.5 text-yellow-300" /> Mandi Rates Today
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Daily Mandi Fresh Vegetables <span className="text-emerald-700">(ताज़ा सब्ज़ियाँ)</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Aloo ₹20/kg, Nashik Pyaaz, Desi Garlic and greens delivered straight from local Jodhpur mandi.
              </p>
            </div>

            <Link
              to="/products"
              onClick={() => setSelectedCategory('cat-veg')}
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-100 px-4 py-2.5 rounded-xl border border-emerald-200 shadow-xs transition self-start"
            >
              <span>View All Vegetables</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid of Vegetable Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {featuredVeggies.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenQR={(p) => setQrModalProduct(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Tabbed Catalog (Popular, Dairy, Fruits) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
              <span>Popular Grocery Essentials</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                घरेलू किराना
              </span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">Handpicked staples, dairy, fruits and authentic spices</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition ${
                activeTab === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveTab('veg')}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition ${
                activeTab === 'veg'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Vegetables
            </button>
            <button
              onClick={() => setActiveTab('dairy')}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition ${
                activeTab === 'dairy'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Dairy & Paneer
            </button>
            <button
              onClick={() => setActiveTab('fruits')}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition ${
                activeTab === 'fruits'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Fruits
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenQR={(p) => setQrModalProduct(p)}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center pt-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition"
          >
            <span>Explore Complete Store Catalog (50+ Items)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. How WhatsApp Ordering Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-soft text-left">
          
          <div className="max-w-2xl mb-8">
            <span className="text-emerald-700 font-extrabold text-xs uppercase tracking-wider block mb-1">
              Frictionless Shopping
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              How WhatsApp Ordering Works
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              No account creation, no password, no pre-payment hassle. Simple as sending a message!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/60 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-3">
                  1
                </span>
                <h4 className="text-sm font-bold text-stone-900">Select Fresh Groceries</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Choose Aloo, Onion, Garlic, Milk, Atta, etc. Select custom weights (500g, 1kg, 2kg).
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/60 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-3">
                  2
                </span>
                <h4 className="text-sm font-bold text-stone-900">Enter Address</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Fill your delivery address in Jodhpur. No password or card details needed.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/60 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-xl bg-green-500 text-white font-black text-sm flex items-center justify-center mb-3">
                  3
                </span>
                <h4 className="text-sm font-bold text-stone-900">Click Order on WhatsApp</h4>
                <p className="text-xs text-stone-500 mt-1">
                  WhatsApp opens with your full item list, total amount and tracking link pre-filled.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/60 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-xl bg-yellow-400 text-stone-900 font-black text-sm flex items-center justify-center mb-3">
                  4
                </span>
                <h4 className="text-sm font-bold text-stone-900">Free Doorstep Delivery</h4>
                <p className="text-xs text-stone-500 mt-1">
                  We prepare your fresh groceries and deliver them to your home in Jodhpur. Pay on delivery!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product QR Code Modal Popup */}
      <ProductQRModal
        product={qrModalProduct}
        onClose={() => setQrModalProduct(null)}
      />
    </div>
  );
}
