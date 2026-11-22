import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  MessageCircle,
  QrCode,
  Heart
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getWhatsAppInquiryUrl, getStoreShareUrl } from '../services/whatsappService';

export default function Footer() {
  const { settings, categories, setSelectedCategory, setIsQRScannerOpen } = useStore();

  return (
    <footer className="bg-stone-900 text-stone-300 mt-16 pt-14 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Trust Badges Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-stone-800 text-left">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/50">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Home Delivery</h4>
              <p className="text-xs text-stone-400 mt-0.5">Prompt delivery across Jodhpur city with no extra charges.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/50">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Mandi Fresh Quality</h4>
              <p className="text-xs text-stone-400 mt-0.5">Fresh Aloo, Onion, Garlic & greens handpicked every morning.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/50">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Instant WhatsApp Order</h4>
              <p className="text-xs text-stone-400 mt-0.5">No complicated payments. Order on WhatsApp & pay after checking.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/50">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">QR Code Enabled</h4>
              <p className="text-xs text-stone-400 mt-0.5">Scan product or store QR codes directly from your mobile camera.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-10 border-b border-stone-800">
          
          {/* Store Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                <ShoppingBag className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-white tracking-tight">{settings.storeName}</span>
                <span className="block text-[11px] text-emerald-400 font-medium">Jodhpur, Rajasthan</span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Your trusted local neighborhood grocery store in Jodhpur. We bring farm-fresh vegetables, seasonal fruits, dairy products, pure spices and kitchen staples straight to your home at honest Mandi prices.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={getWhatsAppInquiryUrl(settings.whatsappNumber, settings.storeName)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow transition"
              >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
              <button
                onClick={() => setIsQRScannerOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold border border-stone-700 transition"
              >
                <QrCode className="w-4 h-4 text-emerald-400" /> Scan QR
              </button>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Product Categories</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <Link
                    to="/products"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="hover:text-emerald-400 transition flex items-center gap-1.5"
                  >
                    <span className="text-stone-600">•</span> {cat.name} {cat.hindiName ? `(${cat.hindiName})` : ''}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/products" className="text-emerald-400 hover:underline font-semibold block pt-1">
                  View All Products →
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Hours & Location */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Store Contact & Hours</h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Store Timings: <strong className="text-white">{settings.timings}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>WhatsApp: <strong className="text-white">+91 {settings.whatsappNumber.replace(/^91/, '')}</strong></span>
              </div>
              <div className="pt-2">
                <a
                  href={getStoreShareUrl(settings)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-yellow-400 hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  📤 Share Store with Family on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Admin & Security */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Store Owner</h4>
            <p className="text-xs text-stone-400">
              Authorized store administrators can manage products, stock, prices & orders.
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs font-semibold border border-stone-700 transition"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Admin Portal
            </Link>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
          <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Jodhpur, Rajasthan • Free Tier Ready
          </p>
        </div>
      </div>
    </footer>
  );
}
