import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Share2, 
  QrCode, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { 
  calculateUnitPrice, 
  formatCurrency, 
  calculateDiscountPercent 
} from '../utils/priceCalculator';
import { getProductShareUrl } from '../services/whatsappService';
import ProductCard from '../components/ProductCard';
import ProductQRModal from '../components/ProductQRModal';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories, cart, addToCart, updateCartQuantity, settings } = useStore();

  const product = products.find(p => p.id === id);
  const [selectedUnit, setSelectedUnit] = useState('1kg');
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Set default unit when product loads
  useEffect(() => {
    if (product) {
      setSelectedUnit(product.defaultUnit || product.availableUnits?.[0] || '1kg');
      window.scrollTo(0, 0);
    }
  }, [product, id]);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-4xl">🥦</div>
        <h2 className="text-xl font-bold text-stone-900">Product Not Found</h2>
        <p className="text-xs text-stone-500">The product you are looking for might have been moved or removed.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const category = categories.find(c => c.id === product.categoryId);
  const availableUnits = product.availableUnits?.length ? product.availableUnits : ['250g', '500g', '1kg', '2kg'];

  // Dynamic pricing
  const currentUnitPrice = calculateUnitPrice(product.basePrice, selectedUnit);
  const originalUnitPrice = product.originalPrice 
    ? calculateUnitPrice(product.originalPrice, selectedUnit) 
    : null;
  const discountPercent = originalUnitPrice 
    ? calculateDiscountPercent(originalUnitPrice, currentUnitPrice) 
    : 0;

  // Cart item match
  const cartItem = cart.find(
    item => item.productId === product.id && item.selectedUnit === selectedUnit
  );
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = !product.isAvailable || product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product, selectedUnit, 1);
  };

  const handleBuyNow = () => {
    if (inCartQty === 0) {
      addToCart(product, selectedUnit, 1);
    }
    navigate('/checkout');
  };

  const handleShare = () => {
    const url = getProductShareUrl(product, settings.storeName, settings.websiteUrl);
    window.open(url, '_blank');
  };

  // Related products
  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-left space-y-10">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/" className="hover:text-emerald-700">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-emerald-700">Products</Link>
        <span>/</span>
        {category && (
          <>
            <span className="text-stone-400">{category.name}</span>
            <span>/</span>
          </>
        )}
        <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-card">
        
        {/* Left Column: Image Gallery */}
        <div className="md:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
              {discountPercent > 0 && (
                <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
              {product.mandiFresh && (
                <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Mandi Fresh Daily
                </span>
              )}
            </div>

            {/* Quick QR & Share Floating Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={() => setQrModalOpen(true)}
                className="w-10 h-10 rounded-2xl bg-white/95 text-stone-700 hover:text-emerald-700 shadow-md flex items-center justify-center transition"
                title="View Product QR Code"
              >
                <QrCode className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-2xl bg-green-500 hover:bg-green-600 text-white shadow-md flex items-center justify-center transition"
                title="Share on WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span className="flex items-center gap-1 text-emerald-800 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Cleaned & Hand-Sorted
            </span>
            <span className="flex items-center gap-1 text-emerald-800 font-medium">
              <Truck className="w-4 h-4 text-emerald-600" /> Free Jodhpur Delivery
            </span>
          </div>
        </div>

        {/* Right Column: Pricing & Quantity Selector */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            {/* Hindi Name & Stock Status */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                {product.hindiName || 'Fresh Stock'}
              </span>

              {isOutOfStock ? (
                <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Low Stock ({product.stock} {product.unit} left)
                </span>
              ) : (
                <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> In Stock & Fresh
                </span>
              )}
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
                {product.name}
              </h1>
              <p className="text-xs text-stone-400 mt-1">Category: {category?.name || 'Daily Grocery'}</p>
            </div>

            {/* Price Calculator Box */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-stone-900">
                  {formatCurrency(currentUnitPrice)}
                </span>
                {originalUnitPrice && originalUnitPrice > currentUnitPrice && (
                  <span className="text-base text-stone-400 line-through">
                    {formatCurrency(originalUnitPrice)}
                  </span>
                )}
                <span className="text-xs font-semibold text-stone-500">
                  for {selectedUnit} ({formatCurrency(product.basePrice)}/{product.unit})
                </span>
              </div>

              {discountPercent > 0 && (
                <div className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-lg inline-block">
                  💰 You save {formatCurrency(originalUnitPrice - currentUnitPrice)} ({discountPercent}% Mandi Discount)
                </div>
              )}

              {/* Weight Selector */}
              <div className="pt-2 border-t border-stone-200/60">
                <label className="text-xs font-bold text-stone-600 block mb-2">
                  Select Quantity Weight / वज़न चुनें:
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableUnits.map((u) => {
                    const isSelected = selectedUnit === u;
                    const calculated = calculateUnitPrice(product.basePrice, u);

                    return (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setSelectedUnit(u)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-200'
                            : 'bg-white text-stone-700 border-stone-300 hover:border-emerald-400 hover:bg-emerald-50'
                        }`}
                      >
                        <span>{u}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-stone-400'}`}>
                          ({formatCurrency(calculated)})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Product Description</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            {isOutOfStock ? (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl text-center">
                Currently Out of Stock. Will be replenished tomorrow morning from Mandi.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cart Button or Counter */}
                {inCartQty === 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition"
                  >
                    <Plus className="w-4 h-4 text-yellow-300" />
                    <span>Add to Cart ({selectedUnit})</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-600 text-white rounded-xl px-4 py-2 shadow-md">
                    <button
                      onClick={() => updateCartQuantity(product.id, selectedUnit, inCartQty - 1)}
                      className="p-1 hover:bg-emerald-700 rounded-lg active:scale-90"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-black">{inCartQty} in cart ({selectedUnit})</span>
                    <button
                      onClick={() => updateCartQuantity(product.id, selectedUnit, inCartQty + 1)}
                      className="p-1 hover:bg-emerald-700 rounded-lg active:scale-90"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 active:scale-98 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
                >
                  <ShoppingBag className="w-4 h-4 text-yellow-300" />
                  <span>Buy Now (Direct Checkout)</span>
                </button>
              </div>
            )}

            {/* Secondary Actions: WhatsApp Share & QR Code */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleShare}
                className="flex-1 py-2.5 px-3 bg-green-50 hover:bg-green-100 text-green-800 rounded-xl text-xs font-bold border border-green-200 flex items-center justify-center gap-2 transition"
              >
                <Share2 className="w-4 h-4 text-green-600" />
                <span>Share on WhatsApp</span>
              </button>

              <button
                onClick={() => setQrModalOpen(true)}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold border border-stone-200 flex items-center justify-center gap-2 transition"
                title="View Product QR Code"
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Product QR</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-stone-900">Similar Fresh Items</h3>
            <Link to="/products" className="text-xs font-bold text-emerald-700 hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenQR={() => setQrModalOpen(true)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Product QR Code Modal */}
      <ProductQRModal
        product={qrModalOpen ? product : null}
        onClose={() => setQrModalOpen(false)}
      />
    </div>
  );
}
