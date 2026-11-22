import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  QrCode, 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  ShieldCheck, 
  Clock, 
  MapPin,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/priceCalculator';
import { getWhatsAppInquiryUrl } from '../services/whatsappService';

export default function Navbar() {
  const { 
    settings, 
    cartItemCount, 
    cartSubtotal, 
    setIsCartDrawerOpen, 
    setIsQRScannerOpen,
    searchQuery,
    setSearchQuery,
    setSelectedCategory
  } = useStore();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== '/products') {
      navigate('/products');
    }
  };

  const handleCategoryClick = (catSlug) => {
    setSelectedCategory(catSlug);
    setMobileMenuOpen(false);
    navigate('/products');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-600/60 px-2 py-0.5 rounded-full text-[11px] font-semibold text-yellow-300">
              <Sparkles className="w-3 h-3" /> Jodhpur Mandi Fresh
            </span>
            <span className="hidden sm:inline text-emerald-100">
              {settings.announcement || "Free Home Delivery in Jodhpur! Direct WhatsApp Ordering."}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-emerald-100">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-yellow-300" /> {settings.timings}
            </span>
            <span className="hidden md:flex items-center gap-1">
              <MapPin className="w-3 h-3 text-yellow-300" /> Jodhpur, Rajasthan
            </span>
            <a 
              href={getWhatsAppInquiryUrl(settings.whatsappNumber, settings.storeName)}
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-yellow-300 hover:text-white font-semibold transition"
            >
              <Phone className="w-3 h-3" /> +91 {settings.whatsappNumber.replace(/^91/, '')}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          
          {/* Logo & Store Name */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition transform">
              <ShoppingBag className="w-6 h-6 text-yellow-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-stone-900 group-hover:text-emerald-700 transition">
                  {settings.storeName}
                </span>
                <span className="hidden sm:inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                  Fresh
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block -mt-0.5">
                Mandi Rates • Direct WhatsApp Order
              </p>
            </div>
          </Link>

          {/* Search Input Bar (Desktop & Tablet) */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-md relative items-center"
          >
            <input
              type="text"
              placeholder="Search Aloo, Onion, Garlic, Milk, Rice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-100/80 hover:bg-stone-100 focus:bg-white text-stone-800 text-sm pl-10 pr-10 py-2.5 rounded-full border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Scan QR Code Trigger */}
            <button
              onClick={() => setIsQRScannerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 hover:text-emerald-700 bg-stone-100 hover:bg-emerald-50 rounded-xl transition border border-stone-200/60"
              title="Scan Store or Product QR Code"
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>

            {/* WhatsApp Quick Chat */}
            <a
              href={getWhatsAppInquiryUrl(settings.whatsappNumber, settings.storeName)}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition border border-emerald-200"
              title="Chat with Store Owner on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-semibold shadow-md shadow-emerald-600/20 transition"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-yellow-300" />
              <div className="text-left hidden sm:block leading-tight">
                <span className="text-[10px] text-emerald-100 font-medium block">Cart</span>
                <span className="text-xs font-bold text-white">{formatCurrency(cartSubtotal)}</span>
              </div>
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-stone-900 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Admin Portal Link */}
            <Link
              to={isAuthenticated ? "/admin" : "/admin/login"}
              className="p-2 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition border border-transparent hover:border-emerald-200"
              title={isAuthenticated ? "Admin Dashboard" : "Admin Login"}
            >
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-xl bg-stone-100"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Below brand header on small screens) */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search Aloo, Onion, Garlic, Milk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-100 text-stone-800 text-sm pl-9 pr-9 py-2 rounded-xl border border-stone-200 focus:border-emerald-500 focus:bg-white outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-stone-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>

        {/* Category Quick Links (Desktop Sub-nav) */}
        <nav className="hidden md:flex items-center gap-6 mt-3 pt-2.5 border-t border-stone-100 text-xs font-semibold text-stone-600">
          <Link to="/" className="hover:text-emerald-700 transition">Home</Link>
          <button onClick={() => handleCategoryClick('all')} className="hover:text-emerald-700 transition">
            All Products
          </button>
          <button onClick={() => handleCategoryClick('cat-veg')} className="hover:text-emerald-700 transition flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Vegetables (सब्ज़ियाँ)
          </button>
          <button onClick={() => handleCategoryClick('cat-fruits')} className="hover:text-emerald-700 transition">
            Fresh Fruits (फल)
          </button>
          <button onClick={() => handleCategoryClick('cat-dairy')} className="hover:text-emerald-700 transition">
            Dairy & Eggs (दूध / पनीर)
          </button>
          <button onClick={() => handleCategoryClick('cat-grocery')} className="hover:text-emerald-700 transition">
            Daily Grocery (किराना)
          </button>
          <button onClick={() => handleCategoryClick('cat-spices')} className="hover:text-emerald-700 transition">
            Spices (मसाले)
          </button>
          <div className="ml-auto text-emerald-800 font-bold flex items-center gap-1 text-[11px] bg-emerald-50 px-2.5 py-1 rounded-full">
            🚚 Free Home Delivery in Jodhpur
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Quick Categories</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <button 
              onClick={() => handleCategoryClick('all')} 
              className="text-left px-3 py-2 rounded-lg bg-stone-50 hover:bg-emerald-50 hover:text-emerald-700"
            >
              🛒 All Items
            </button>
            <button 
              onClick={() => handleCategoryClick('cat-veg')} 
              className="text-left px-3 py-2 rounded-lg bg-stone-50 hover:bg-emerald-50 hover:text-emerald-700 text-emerald-800 font-semibold"
            >
              🥔 Vegetables (सब्जी)
            </button>
            <button 
              onClick={() => handleCategoryClick('cat-fruits')} 
              className="text-left px-3 py-2 rounded-lg bg-stone-50 hover:bg-emerald-50 hover:text-emerald-700"
            >
              🍎 Fresh Fruits
            </button>
            <button 
              onClick={() => handleCategoryClick('cat-dairy')} 
              className="text-left px-3 py-2 rounded-lg bg-stone-50 hover:bg-emerald-50 hover:text-emerald-700"
            >
              🥛 Dairy & Paneer
            </button>
            <button 
              onClick={() => handleCategoryClick('cat-grocery')} 
              className="text-left px-3 py-2 rounded-lg bg-stone-50 hover:bg-emerald-50 hover:text-emerald-700"
            >
              🌾 Rice, Dal & Atta
            </button>
            <button 
              onClick={() => handleCategoryClick('cat-spices')} 
              className="text-left px-3 py-2 rounded-lg bg-stone-50 hover:bg-emerald-50 hover:text-emerald-700"
            >
              🌶️ Mathania Spices
            </button>
          </div>

          <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
            <button
              onClick={() => { setIsQRScannerOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl"
            >
              <QrCode className="w-4 h-4 text-emerald-600" /> Scan QR Code
            </button>
            <a
              href={getWhatsAppInquiryUrl(settings.whatsappNumber, settings.storeName)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-600 text-white text-xs font-bold rounded-xl"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp (+91 {settings.whatsappNumber.replace(/^91/, '')})
            </a>
            <Link
              to={isAuthenticated ? "/admin" : "/admin/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2 text-stone-500 text-xs font-semibold hover:text-emerald-700"
            >
              <ShieldCheck className="w-4 h-4" /> {isAuthenticated ? "Admin Dashboard" : "Store Admin Login"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
