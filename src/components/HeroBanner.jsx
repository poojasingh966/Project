import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  QrCode, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  Clock, 
  BadgePercent
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getWhatsAppInquiryUrl } from '../services/whatsappService';

export default function HeroBanner() {
  const { settings, setIsQRScannerOpen, setSelectedCategory } = useStore();
  const navigate = useNavigate();

  const handleShopNow = () => {
    setSelectedCategory('all');
    navigate('/products');
  };

  const handleVeggies = () => {
    setSelectedCategory('cat-veg');
    navigate('/products');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-850 to-emerald-950 text-white rounded-3xl mx-4 sm:mx-6 my-4 shadow-xl">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-500/20 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 md:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-stone-900 font-extrabold text-xs px-3 py-1 rounded-full shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> Mandi Rates Guaranteed
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs px-3 py-1 rounded-full backdrop-blur">
                <Truck className="w-3.5 h-3.5 text-yellow-300" /> Free Delivery in Jodhpur
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Fresh Farm Vegetables & Daily Groceries in <span className="text-yellow-400 underline decoration-emerald-500 decoration-wavy decoration-2">Jodhpur</span>
              </h1>
              <p className="text-sm sm:text-base text-emerald-100/90 font-normal max-w-xl">
                Get handpicked Desi Aloo, Nashik Onions, Desi Garlic, fresh fruits, pure milk & daily kitchen ration delivered directly to your doorstep. Order easily on WhatsApp!
              </p>
            </div>

            {/* Quick Price Highlights */}
            <div className="flex flex-wrap items-center gap-3 py-1 text-xs">
              <div className="bg-white/10 backdrop-blur border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
                <span className="text-lg">🥔</span>
                <div>
                  <span className="font-bold text-yellow-300">Fresh Aloo</span>
                  <span className="text-white/80 block text-[10px]">Just ₹20 / kg</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
                <span className="text-lg">🧅</span>
                <div>
                  <span className="font-bold text-yellow-300">Nashik Onion</span>
                  <span className="text-white/80 block text-[10px]">Just ₹35 / kg</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
                <span className="text-lg">🧄</span>
                <div>
                  <span className="font-bold text-yellow-300">Desi Garlic</span>
                  <span className="text-white/80 block text-[10px]">Mandi Fresh</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleShopNow}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-stone-900 font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-yellow-400/20 transition"
              >
                <span>Shop All Items</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleVeggies}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-sm px-5 py-3.5 rounded-2xl border border-emerald-500/50 shadow transition"
              >
                <span>Fresh Vegetables</span>
              </button>

              <button
                onClick={() => setIsQRScannerOpen(true)}
                className="flex items-center gap-2 bg-stone-900/60 hover:bg-stone-900 text-white font-bold text-sm px-4 py-3.5 rounded-2xl border border-white/20 transition"
                title="Scan QR Code from shop or pamphlet"
              >
                <QrCode className="w-4 h-4 text-yellow-300" />
                <span className="hidden sm:inline">Scan QR</span>
              </button>
            </div>

            {/* Store Timing & Guarantee */}
            <div className="pt-2 flex items-center gap-4 text-xs text-emerald-200/80 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-yellow-400" /> Open: {settings.timings}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" /> 100% Quality Check
              </span>
            </div>
          </div>

          {/* Right Visual Image & Quick Promo Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              
              {/* Main Image with rounded border & shadow */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 group">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                  alt="Fresh Mandi Vegetables - Dilip Grocery Store"
                  className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent"></div>
                
                {/* Floating On-Image Details */}
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <div className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider mb-1">
                    Jodhpur Mandi Fresh
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    Aloo, Onion, Garlic & Leafy Greens Handpicked Daily
                  </h3>
                  <p className="text-xs text-stone-300">Cleaned, sorted & weighed accurately.</p>
                </div>
              </div>

              {/* Floating WhatsApp Action Pill */}
              <div className="absolute -bottom-4 -left-3 sm:-left-6 bg-white text-stone-900 p-3 rounded-2xl shadow-xl border border-emerald-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="text-left pr-2">
                  <div className="text-[11px] text-stone-500 font-semibold">Easy Order on WhatsApp</div>
                  <div className="text-xs font-bold text-emerald-800">+91 {settings.whatsappNumber.replace(/^91/, '')}</div>
                </div>
              </div>

              {/* Free Delivery Floating Badge */}
              <div className="absolute -top-3 -right-3 sm:-right-4 bg-yellow-400 text-stone-900 px-3.5 py-1.5 rounded-2xl font-black text-xs shadow-lg transform rotate-3 flex items-center gap-1.5">
                <Truck className="w-4 h-4" /> ₹0 Delivery Fee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
