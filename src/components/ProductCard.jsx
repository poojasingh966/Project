import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Minus, 
  ShoppingBag, 
  Share2, 
  QrCode, 
  Check, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { 
  calculateUnitPrice, 
  formatCurrency, 
  calculateDiscountPercent 
} from '../utils/priceCalculator';
import { getProductShareUrl } from '../services/whatsappService';

export default function ProductCard({ product, onOpenQR }) {
  const { cart, addToCart, updateCartQuantity, settings, setIsCartDrawerOpen } = useStore();
  const navigate = useNavigate();

  // Unit selection state (e.g., "1kg", "500g", "250g")
  const availableUnits = product.availableUnits?.length 
    ? product.availableUnits 
    : ['250g', '500g', '1kg', '2kg'];
  
  const [selectedUnit, setSelectedUnit] = useState(product.defaultUnit || availableUnits[0] || '1kg');
  const [copied, setCopied] = useState(false);

  // Dynamic price calculation
  const currentUnitPrice = calculateUnitPrice(product.basePrice, selectedUnit);
  const originalUnitPrice = product.originalPrice 
    ? calculateUnitPrice(product.originalPrice, selectedUnit) 
    : null;
  const discountPercent = originalUnitPrice 
    ? calculateDiscountPercent(originalUnitPrice, currentUnitPrice) 
    : 0;

  // Check if this specific product & unit combination is in the cart
  const cartItem = cart.find(
    item => item.productId === product.id && item.selectedUnit === selectedUnit
  );
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product, selectedUnit, 1);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    e.preventDefault();
    updateCartQuantity(product.id, selectedUnit, inCartQty + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    e.preventDefault();
    updateCartQuantity(product.id, selectedUnit, inCartQty - 1);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (inCartQty === 0) {
      addToCart(product, selectedUnit, 1);
    }
    navigate('/checkout');
  };

  const handleWhatsAppShare = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const shareUrl = getProductShareUrl(product, settings.storeName, settings.websiteUrl);
    window.open(shareUrl, '_blank');
  };

  const handleShowQR = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onOpenQR) {
      onOpenQR(product);
    }
  };

  const isOutOfStock = !product.isAvailable || product.stock <= 0;

  return (
    <div className="bg-white rounded-2xl border border-stone-250/70 hover:border-emerald-300 hover:shadow-card transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* Product Image & Badges */}
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover group-hover:scale-105 transition duration-500 ${
              isOutOfStock ? 'grayscale opacity-60' : ''
            }`}
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {discountPercent > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.mandiFresh && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-yellow-300" /> Mandi Fresh
            </span>
          )}
        </div>

        {/* Top Right Quick Actions: QR Code & WhatsApp Share */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition">
          <button
            onClick={handleShowQR}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur hover:bg-white text-stone-700 hover:text-emerald-700 shadow flex items-center justify-center transition"
            title="View Product QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleWhatsAppShare}
            className="w-8 h-8 rounded-full bg-green-500/90 backdrop-blur hover:bg-green-600 text-white shadow flex items-center justify-center transition"
            title="Share on WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center text-white font-bold text-sm">
            <span className="bg-red-600 px-3 py-1 rounded-full text-xs uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 text-left justify-between">
        
        <div>
          {/* Hindi Name + Stock note */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
            <span className="text-emerald-700 font-semibold">{product.hindiName || 'Fresh Stock'}</span>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="text-amber-600 font-medium flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3" /> Only {product.stock} {product.unit} left
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.id}`} className="block group-hover:text-emerald-700 transition">
            <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="text-xs text-stone-500 mt-1 line-clamp-1 font-normal">
            {product.description}
          </p>

          {/* Unit Selector Pills */}
          <div className="mt-3">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Select Quantity / मात्रा
            </span>
            <div className="flex flex-wrap gap-1.5">
              {availableUnits.map((u) => {
                const isSelected = selectedUnit === u;
                return (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setSelectedUnit(u)}
                    className={`text-[11px] px-2 py-1 rounded-lg font-semibold transition border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {u}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pricing & Add to Cart Section */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-lg sm:text-xl font-extrabold text-stone-900">
              {formatCurrency(currentUnitPrice)}
            </span>
            {originalUnitPrice && originalUnitPrice > currentUnitPrice && (
              <span className="text-xs text-stone-400 line-through">
                {formatCurrency(originalUnitPrice)}
              </span>
            )}
            <span className="text-[11px] text-stone-400 font-medium">
              for {selectedUnit}
            </span>
          </div>

          {/* Action Row */}
          {isOutOfStock ? (
            <button
              disabled
              className="w-full py-2 bg-stone-100 text-stone-400 text-xs font-semibold rounded-xl cursor-not-allowed"
            >
              Unavailable
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {/* Add to Cart / Counter */}
              {inCartQty === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-2 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Add to Cart</span>
                </button>
              ) : (
                <div className="flex items-center justify-between bg-emerald-600 text-white rounded-xl px-2 py-1 shadow-sm">
                  <button
                    onClick={handleDecrement}
                    className="p-1 hover:bg-emerald-700 rounded-lg active:scale-90"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-black">{inCartQty}</span>
                  <button
                    onClick={handleIncrement}
                    className="p-1 hover:bg-emerald-700 rounded-lg active:scale-90"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Buy Now Direct Button */}
              <button
                onClick={handleBuyNow}
                className="w-full py-2 px-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition active:scale-95 shadow-sm"
              >
                <span>Buy Now</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
