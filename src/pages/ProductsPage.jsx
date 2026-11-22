import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  Check, 
  Sparkles, 
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import ProductQRModal from '../components/ProductQRModal';

export default function ProductsPage() {
  const { 
    products, 
    categories, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory 
  } = useStore();

  const [qrModalProduct, setQrModalProduct] = useState(null);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'name-asc'
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Category filter
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesHindi = p.hindiName && p.hindiName.toLowerCase().includes(query);
        const matchesDesc = p.description && p.description.toLowerCase().includes(query);
        if (!matchesName && !matchesHindi && !matchesDesc) return false;
      }

      // 3. In-Stock filter
      if (inStockOnly && (!p.isAvailable || p.stock <= 0)) {
        return false;
      }

      // 4. Featured filter
      if (featuredOnly && !p.isFeatured) {
        return false;
      }

      // 5. Discount only filter
      if (discountOnly && (!p.originalPrice || p.originalPrice <= p.basePrice)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.basePrice - b.basePrice;
      }
      if (sortBy === 'price-high') {
        return b.basePrice - a.basePrice;
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      // default: featured first
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, featuredOnly, discountOnly, sortBy]);

  const activeCategoryObj = categories.find(c => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-yellow-300 font-extrabold text-xs uppercase tracking-wider block mb-1">
            Dilip Grocery Store Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {activeCategoryObj ? `${activeCategoryObj.name} (${activeCategoryObj.hindiName})` : "All Fresh Groceries & Vegetables"}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            {activeCategoryObj?.description || "Browse fresh farm vegetables, fruits, dairy, pure spices & daily essentials at Mandi rates with Free Home Delivery in Jodhpur."}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-white/10 backdrop-blur px-4 py-2 rounded-2xl border border-white/20 text-xs font-semibold">
          <span>Total Items:</span>
          <span className="text-yellow-300 font-black text-sm">{filteredProducts.length}</span>
        </div>
      </div>

      {/* Filter and Search Control Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs space-y-4">
        
        {/* Top Controls: Search & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Live Search */}
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search vegetables, atta, dal, milk, ghee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-stone-100/80 hover:bg-stone-100 focus:bg-white text-xs sm:text-sm rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-stone-400" />
            <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-stone-100 text-stone-800 text-xs font-semibold px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High (₹)</option>
              <option value="price-high">Price: High to Low (₹)</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-xl whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Categories
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl whitespace-nowrap transition ${
                selectedCategory === c.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Quick Checkbox Toggles */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-stone-100 text-xs font-medium text-stone-700">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-800">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span>In Stock Only</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-800">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span>Featured Specials</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-800">
            <input
              type="checkbox"
              checked={discountOnly}
              onChange={(e) => setDiscountOnly(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span>Discount Offers (% Off)</span>
          </label>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 text-stone-400 flex items-center justify-center text-2xl">
            🔍
          </div>
          <h3 className="text-base font-bold text-stone-900">No matching products found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try adjusting your search query, clearing filters, or switching category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setInStockOnly(false);
              setFeaturedOnly(false);
              setDiscountOnly(false);
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenQR={(p) => setQrModalProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Product QR Code Modal */}
      <ProductQRModal
        product={qrModalProduct}
        onClose={() => setQrModalProduct(null)}
      />
    </div>
  );
}
