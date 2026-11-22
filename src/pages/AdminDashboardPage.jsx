import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import * as htmlToImage from 'html-to-image';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Settings, 
  QrCode, 
  Image as ImageIcon, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Upload, 
  Truck,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { storeService } from '../services/storeService';
import { formatCurrency, calculateUnitPrice } from '../utils/priceCalculator';
import { getAdminToCustomerWhatsAppUrl } from '../services/whatsappService';

export default function AdminDashboardPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const { 
    products, 
    categories, 
    orders, 
    settings, 
    saveProduct, 
    deleteProduct, 
    saveCategory, 
    deleteCategory, 
    updateStoreSettings, 
    updateOrderStatus 
  } = useStore();
  const navigate = useNavigate();

  // Active Tab: 'overview' | 'products' | 'categories' | 'orders' | 'settings' | 'qr' | 'banner'
  const [activeTab, setActiveTab] = useState('overview');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    hindiName: '',
    categoryId: 'cat-veg',
    basePrice: '',
    originalPrice: '',
    unit: 'kg',
    availableUnits: ['250g', '500g', '1kg', '2kg'],
    defaultUnit: '1kg',
    stock: '',
    isAvailable: true,
    isFeatured: false,
    mandiFresh: true,
    description: '',
    image: ''
  });
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    hindiName: '',
    slug: '',
    image: '',
    description: ''
  });

  // Settings State
  const [settingsFormData, setSettingsFormData] = useState({ ...settings });
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // QR Studio State
  const [selectedQRType, setSelectedQRType] = useState('store'); // 'store' | 'product' | 'category'
  const [selectedQRTargetId, setSelectedQRTargetId] = useState(products[0]?.id || '');
  const qrPrintRef = useRef(null);

  // Banner Studio Ref
  const bannerPreviewRef = useRef(null);
  const [isDownloadingBanner, setIsDownloadingBanner] = useState(false);

  // Filter & Search states inside Admin tables
  const [adminSearch, setAdminSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // If not authenticated, redirect
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Admin Authentication Required</h2>
        <p className="text-xs text-stone-500">Please login to access the store management dashboard.</p>
        <Link to="/admin/login" className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">
          Go to Admin Login
        </Link>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // ----------------- PRODUCT ACTIONS -----------------
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      hindiName: '',
      categoryId: categories[0]?.id || 'cat-veg',
      basePrice: '',
      originalPrice: '',
      unit: 'kg',
      availableUnits: ['250g', '500g', '1kg', '2kg'],
      defaultUnit: '1kg',
      stock: '50',
      isAvailable: true,
      isFeatured: false,
      mandiFresh: true,
      description: '',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name,
      hindiName: prod.hindiName || '',
      categoryId: prod.categoryId,
      basePrice: prod.basePrice,
      originalPrice: prod.originalPrice || '',
      unit: prod.unit || 'kg',
      availableUnits: prod.availableUnits || ['250g', '500g', '1kg', '2kg'],
      defaultUnit: prod.defaultUnit || '1kg',
      stock: prod.stock,
      isAvailable: prod.isAvailable,
      isFeatured: prod.isFeatured,
      mandiFresh: Boolean(prod.mandiFresh),
      description: prod.description || '',
      image: prod.image
    });
    setIsProductModalOpen(true);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const uploadedUrl = await storeService.uploadImage(file);
      setProductFormData(prev => ({ ...prev, image: uploadedUrl }));
    } catch (err) {
      alert('Failed to upload image. Please try another image.');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSaveProductSubmit = async (e) => {
    e.preventDefault();
    if (!productFormData.name.trim() || !productFormData.basePrice) {
      alert('Please fill product name and price.');
      return;
    }

    const payload = {
      ...productFormData,
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      basePrice: Number(productFormData.basePrice),
      originalPrice: productFormData.originalPrice ? Number(productFormData.originalPrice) : null,
      stock: Number(productFormData.stock) || 0
    };

    await saveProduct(payload);
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteProduct(id);
    }
  };

  // ----------------- CATEGORY ACTIONS -----------------
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      hindiName: '',
      slug: '',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
      description: ''
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryFormData({
      name: cat.name,
      hindiName: cat.hindiName || '',
      slug: cat.slug || '',
      image: cat.image,
      description: cat.description || ''
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) {
      alert('Please enter category name.');
      return;
    }

    const catId = editingCategory ? editingCategory.id : `cat-${Date.now()}`;
    await saveCategory({
      ...categoryFormData,
      id: catId,
      slug: categoryFormData.slug || categoryFormData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    });
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      await deleteCategory(id);
    }
  };

  // ----------------- SETTINGS ACTIONS -----------------
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await updateStoreSettings(settingsFormData);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  // ----------------- BANNER DOWNLOAD ACTION -----------------
  const handleDownloadPromoBanner = async () => {
    if (!bannerPreviewRef.current) return;
    try {
      setIsDownloadingBanner(true);
      const dataUrl = await htmlToImage.toPng(bannerPreviewRef.current, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `Dilip_Grocery_Store_WhatsApp_Banner.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating banner image:', err);
      alert('Could not generate banner image automatically. You can take a screenshot of the banner preview.');
    } finally {
      setIsDownloadingBanner(false);
    }
  };

  // Overview metrics
  const totalSales = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Awaiting WhatsApp Confirmation');
  const confirmedOrders = orders.filter(o => o.status === 'Confirmed' || o.status === 'Preparing');
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10);

  // Target URL for QR Studio
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : settings.websiteUrl;
  const qrTargetUrl = selectedQRType === 'store'
    ? currentOrigin
    : selectedQRType === 'product'
    ? `${currentOrigin}/product/${selectedQRTargetId}`
    : `${currentOrigin}/products`;

  return (
    <div className="min-h-screen bg-stone-100/70 text-left">
      
      {/* Top Admin Header */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-yellow-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white">{settings.storeName}</span>
                <span className="bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800">
                  Admin Panel
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-mono hidden sm:block">
                Logged in as: {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-xs font-semibold rounded-xl text-stone-300 hover:text-white transition"
              title="Open Customer Website"
            >
              <span>View Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-200 border border-red-800/60 text-xs font-bold rounded-xl transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-stone-800/80 text-xs font-bold pt-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2.5 rounded-t-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-stone-100 text-stone-900 shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2.5 rounded-t-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-stone-100 text-stone-900 shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3.5 py-2.5 rounded-t-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-stone-100 text-stone-900 shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2.5 rounded-t-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-stone-100 text-stone-900 shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
            {pendingOrders.length > 0 && (
              <span className="bg-yellow-400 text-stone-900 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3.5 py-2.5 rounded-t-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'qr'
                ? 'bg-stone-100 text-stone-900 shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('banner')}
            className={`px-3.5 py-2.5 rounded-t-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'banner'
                ? 'bg-stone-100 text-stone-900 shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>WhatsApp Promo Banner</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2.5 rounded-t-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-stone-100 text-stone-900 shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Settings</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        
        {/* ===================== TAB 1: OVERVIEW ===================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Total Sales</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-800 mt-1 block">
                  {formatCurrency(totalSales)}
                </span>
                <span className="text-[11px] text-stone-400 mt-1 block">Recorded store orders</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Total Orders</span>
                <span className="text-2xl sm:text-3xl font-black text-stone-900 mt-1 block">
                  {orders.length}
                </span>
                <span className="text-[11px] text-yellow-600 font-semibold mt-1 block">
                  {pendingOrders.length} Pending / Awaiting Confirmation
                </span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Active Products</span>
                <span className="text-2xl sm:text-3xl font-black text-stone-900 mt-1 block">
                  {products.length}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                  {categories.length} Categories
                </span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Low Stock Alerts</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 block">
                  {lowStockProducts.length}
                </span>
                <span className="text-[11px] text-stone-400 mt-1 block">Items &lt; 10 units left</span>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="bg-emerald-800 rounded-3xl p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold">Welcome back, Goutam Das!</h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Manage Dilip Grocery Store items, prices, print QR codes or share today's promotional flyer.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-stone-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow transition"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
                <button
                  onClick={() => setActiveTab('banner')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-500 transition"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" /> WhatsApp Flyer
                </button>
                <button
                  onClick={() => setActiveTab('qr')}
                  className="px-4 py-2 bg-stone-900/60 hover:bg-stone-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/20 transition"
                >
                  <QrCode className="w-4 h-4 text-emerald-300" /> Print Shop QR
                </button>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Recent Customer Orders</h3>
                  <p className="text-xs text-stone-500">Latest orders submitted through the website</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                    <tr>
                      <th className="p-3 font-semibold">Order ID</th>
                      <th className="p-3 font-semibold">Customer</th>
                      <th className="p-3 font-semibold">Items</th>
                      <th className="p-3 font-semibold">Total</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} className="hover:bg-stone-50">
                        <td className="p-3 font-mono font-bold text-stone-900">#{o.id}</td>
                        <td className="p-3">
                          <span className="font-bold text-stone-900 block">{o.customerName}</span>
                          <span className="text-[11px] text-stone-400">{o.customerPhone}</span>
                        </td>
                        <td className="p-3 text-stone-600">
                          {o.items.length} item{o.items.length === 1 ? '' : 's'}
                        </td>
                        <td className="p-3 font-black text-stone-900">{formatCurrency(o.totalAmount)}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            o.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : o.status === 'Confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <a
                            href={getAdminToCustomerWhatsAppUrl(o.customerPhone, o.id, settings.storeName)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white rounded-lg text-[11px] font-bold hover:bg-green-600"
                          >
                            <MessageCircle className="w-3 h-3" /> Chat
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: PRODUCTS MANAGEMENT ===================== */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-5">
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Product Management</h2>
                <p className="text-xs text-stone-500">Add, edit, change prices, update stock and manage Mandi items</p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow transition self-start"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </button>
            </div>

            {/* Search within Admin Products */}
            <div className="relative max-w-sm">
              <input
                type="text"
                placeholder="Search products by name..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="p-3 font-semibold">Image</th>
                    <th className="p-3 font-semibold">Product Name</th>
                    <th className="p-3 font-semibold">Category</th>
                    <th className="p-3 font-semibold">Base Price</th>
                    <th className="p-3 font-semibold">Stock</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products
                    .filter(p => p.name.toLowerCase().includes(adminSearch.toLowerCase()))
                    .map(p => {
                      const catObj = categories.find(c => c.id === p.categoryId);

                      return (
                        <tr key={p.id} className="hover:bg-stone-50">
                          <td className="p-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                            />
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-stone-900 block">{p.name}</span>
                            <span className="text-[11px] text-emerald-700">{p.hindiName}</span>
                          </td>
                          <td className="p-3 text-stone-600">{catObj?.name || 'General'}</td>
                          <td className="p-3">
                            <span className="font-black text-stone-900">{formatCurrency(p.basePrice)}</span>
                            <span className="text-stone-400 text-[10px] block">per {p.unit}</span>
                          </td>
                          <td className="p-3">
                            <span className={`font-bold ${p.stock <= 10 ? 'text-amber-600' : 'text-stone-700'}`}>
                              {p.stock} {p.unit}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.isAvailable && p.stock > 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {p.isAvailable && p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                to={`/product/${p.id}`}
                                target="_blank"
                                className="p-1.5 text-stone-400 hover:text-emerald-700 hover:bg-stone-100 rounded-lg"
                                title="Preview on website"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 text-stone-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Edit product"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                title="Delete product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: CATEGORIES MANAGEMENT ===================== */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Category Management</h2>
                <p className="text-xs text-stone-500">Manage categories, images and navigation pills</p>
              </div>

              <button
                onClick={handleOpenAddCategory}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow transition self-start"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map(c => (
                <div key={c.id} className="p-4 rounded-2xl border border-stone-200 flex items-center justify-between gap-3 bg-stone-50">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-14 h-14 rounded-xl object-cover border border-stone-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">{c.name}</h4>
                      <p className="text-xs text-emerald-700 font-semibold">{c.hindiName}</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        {products.filter(p => p.categoryId === c.id).length} Products
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleOpenEditCategory(c)}
                      className="p-1.5 text-stone-500 hover:text-blue-600 hover:bg-white rounded-lg shadow-2xs"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c.id, c.name)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-white rounded-lg shadow-2xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: ORDERS MANAGEMENT ===================== */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Order Management</h2>
                <p className="text-xs text-stone-500">Track and update customer order fulfillment statuses</p>
              </div>

              {/* Status Filter */}
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none"
              >
                <option value="all">All Statuses ({orders.length})</option>
                <option value="Pending">Pending</option>
                <option value="Awaiting WhatsApp Confirmation">Awaiting WhatsApp Confirmation</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Note on WhatsApp synchronization */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Store Owner Tip:</strong> Orders placed on the website automatically appear here with status <em>"Awaiting WhatsApp Confirmation"</em>. When the customer sends their message via WhatsApp Click-to-Chat, you can verify their items and update status to <em>"Confirmed"</em> or <em>"Out for Delivery"</em>.
              </span>
            </div>

            <div className="space-y-4">
              {orders
                .filter(o => orderStatusFilter === 'all' || o.status === orderStatusFilter)
                .map(order => (
                  <div key={order.id} className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-4">
                    
                    {/* Top Row: Order ID, Timestamp & Status Selector */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                      <div>
                        <span className="font-mono font-bold text-stone-900 text-sm">#{order.id}</span>
                        <span className="text-xs text-stone-400 ml-2">
                          {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-500">Update Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                          <option value="Awaiting WhatsApp Confirmation">Awaiting WhatsApp Confirmation</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer Info & Address */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">Customer</span>
                        <p className="font-bold text-stone-900 text-sm mt-0.5">{order.customerName}</p>
                        <p className="text-stone-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-600" /> {order.customerPhone}
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">Delivery Address</span>
                        <p className="text-stone-800 font-medium mt-0.5">{order.deliveryAddress}</p>
                        {order.landmark && <p className="text-stone-500">Landmark: {order.landmark}</p>}
                        {order.instructions && (
                          <p className="text-amber-700 font-medium">Notes: {order.instructions}</p>
                        )}
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="bg-white p-3 rounded-xl border border-stone-200">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                        Ordered Grocery Items:
                      </span>
                      <div className="space-y-1 text-xs">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-stone-700">
                            <span>• {item.name} ({item.selectedUnit}) × {item.quantity}</span>
                            <span className="font-black text-stone-900">{formatCurrency(item.totalPrice)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 mt-2 border-t border-stone-100 flex justify-between items-baseline text-xs font-black">
                        <span>Total Payable:</span>
                        <span className="text-sm text-emerald-800">{formatCurrency(order.totalAmount)}</span>
                      </div>
                    </div>

                    {/* Direct Actions: Chat on WhatsApp & Print Slip */}
                    <div className="flex items-center justify-between pt-1">
                      <a
                        href={getAdminToCustomerWhatsAppUrl(order.customerPhone, order.id, settings.storeName)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>Chat with Customer on WhatsApp</span>
                      </a>

                      <Link
                        to={`/order/${order.id}`}
                        target="_blank"
                        className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" /> View / Print Slip
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 5: QR CODE STUDIO ===================== */}
        {activeTab === 'qr' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-stone-900">QR Code Generator Studio</h2>
              <p className="text-xs text-stone-500">
                Generate high-resolution scannable QR codes for your store counter, printed pamphlets or individual products.
              </p>
            </div>

            {/* Type selector */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-xs font-bold text-stone-700">Select QR Target:</label>
              
              <button
                onClick={() => setSelectedQRType('store')}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                  selectedQRType === 'store'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Entire Store (Home Page)
              </button>

              <button
                onClick={() => setSelectedQRType('product')}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                  selectedQRType === 'product'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Individual Product
              </button>

              <button
                onClick={() => setSelectedQRType('category')}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                  selectedQRType === 'category'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Catalog Page
              </button>
            </div>

            {/* Product Selector Dropdown if 'product' is chosen */}
            {selectedQRType === 'product' && (
              <div className="max-w-md">
                <label className="text-xs font-bold text-stone-700 block mb-1">Select Product:</label>
                <select
                  value={selectedQRTargetId}
                  onChange={(e) => setSelectedQRTargetId(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.hindiName}) - ₹{p.basePrice}/{p.unit}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Printable Counter Placard Preview */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
              
              <div className="md:col-span-7 bg-stone-50 p-6 rounded-3xl border border-stone-200 flex flex-col items-center text-center space-y-4" ref={qrPrintRef}>
                <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Dilip Grocery Store • Jodhpur
                </div>

                <h3 className="text-xl font-black text-stone-900 leading-tight">
                  Scan to Order Fresh Groceries on WhatsApp!
                </h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  {selectedQRType === 'product' 
                    ? `Direct link to order ${products.find(p => p.id === selectedQRTargetId)?.name}` 
                    : "Farm fresh Aloo, Onion, Garlic, Milk & Spices delivered to your home."}
                </p>

                <div className="p-5 bg-white rounded-3xl border-3 border-emerald-600/30 shadow-lg">
                  <QRCodeSVG
                    id="admin-active-qr-svg"
                    value={qrTargetUrl}
                    size={220}
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                      src: "/favicon.svg",
                      x: undefined,
                      y: undefined,
                      height: 40,
                      width: 40,
                      excavate: true,
                    }}
                  />
                </div>

                <div className="text-xs font-mono text-stone-600 bg-white px-3 py-1 rounded-lg border border-stone-200 break-all max-w-sm">
                  {qrTargetUrl}
                </div>

                <p className="text-[11px] text-stone-400 font-medium">
                  WhatsApp: +91 {settings.whatsappNumber.replace(/^91/, '')} • Timings: {settings.timings}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-5 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-stone-900">Download & Print Options</h4>
                  <p className="text-xs text-stone-500">
                    Print and display on your cash counter, grocery crates or delivery bags.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const svgElement = document.getElementById('admin-active-qr-svg');
                      if (!svgElement) return;
                      const svgData = new XMLSerializer().serializeToString(svgElement);
                      const canvas = document.createElement('canvas');
                      const ctx = canvas.getContext('2d');
                      const img = new Image();
                      canvas.width = 800;
                      canvas.height = 800;
                      img.onload = () => {
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 50, 50, 700, 700);
                        const a = document.createElement('a');
                        a.download = `Dilip_Grocery_QR_${selectedQRType}.png`;
                        a.href = canvas.toDataURL('image/png');
                        a.click();
                      };
                      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow"
                  >
                    <Download className="w-4 h-4" /> Download High-Res PNG
                  </button>

                  <button
                    onClick={() => {
                      const svgElement = document.getElementById('admin-active-qr-svg');
                      if (!svgElement) return;
                      const svgData = new XMLSerializer().serializeToString(svgElement);
                      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                      const a = document.createElement('a');
                      a.download = `Dilip_Grocery_QR_${selectedQRType}.svg`;
                      a.href = URL.createObjectURL(blob);
                      a.click();
                    }}
                    className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-stone-200"
                  >
                    <Download className="w-4 h-4" /> Download Vector SVG
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow"
                  >
                    <Printer className="w-4 h-4" /> Print Shop Counter Placard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 6: WHATSAPP PROMOTIONAL BANNER STUDIO ===================== */}
        {activeTab === 'banner' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-stone-900">WhatsApp Group Promotional Banner Studio</h2>
              <p className="text-xs text-stone-500">
                Generate and download an eye-catching poster flyer ready to share in WhatsApp family groups and status stories!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Visual Banner Preview to be captured */}
              <div className="lg:col-span-8 flex justify-center">
                <div 
                  ref={bannerPreviewRef}
                  className="w-full max-w-lg bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border-4 border-yellow-400/40"
                >
                  {/* Subtle decorative circles */}
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl"></div>

                  {/* Header Branding */}
                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-emerald-700/60">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-yellow-300 font-extrabold shadow-lg">
                        <ShoppingBag className="w-7 h-7" />
                      </div>
                      <div className="text-left">
                        <span className="text-xl sm:text-2xl font-black tracking-tight text-white block">
                          {settings.storeName}
                        </span>
                        <span className="text-[11px] text-yellow-300 font-semibold block">
                          ताज़ा सब्ज़ियाँ एवं दैनिक किराना • जोधपुर
                        </span>
                      </div>
                    </div>

                    <span className="bg-yellow-400 text-stone-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      Mandi Rates
                    </span>
                  </div>

                  {/* Main Offer Announcement */}
                  <div className="py-5 text-center space-y-1">
                    <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                      ताज़ा आलू, प्याज, लहसुन व फल <br/>
                      <span className="text-yellow-400 underline decoration-emerald-400 decoration-wavy">
                        सीधे घर मंगवाएं!
                      </span>
                    </h3>
                    <p className="text-xs text-emerald-100 font-medium pt-1">
                      घर बैठे WhatsApp पर ऑर्डर करें • डिजिटल कांटे से तौल • संतुष्टि की गारंटी
                    </p>
                  </div>

                  {/* Visual Vegetable collage */}
                  <div className="grid grid-cols-3 gap-2.5 my-2">
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-2 text-center border border-white/10">
                      <img
                        src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80"
                        alt="Aloo"
                        className="w-full h-20 object-cover rounded-xl mb-1.5"
                      />
                      <span className="text-xs font-bold text-white block">नया देसी आलू</span>
                      <span className="text-xs font-black text-yellow-300">₹20 / kg</span>
                    </div>

                    <div className="bg-white/10 backdrop-blur rounded-2xl p-2 text-center border border-white/10">
                      <img
                        src="https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=300&q=80"
                        alt="Onion"
                        className="w-full h-20 object-cover rounded-xl mb-1.5"
                      />
                      <span className="text-xs font-bold text-white block">नासिक प्याज</span>
                      <span className="text-xs font-black text-yellow-300">₹35 / kg</span>
                    </div>

                    <div className="bg-white/10 backdrop-blur rounded-2xl p-2 text-center border border-white/10">
                      <img
                        src="https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=300&q=80"
                        alt="Garlic"
                        className="w-full h-20 object-cover rounded-xl mb-1.5"
                      />
                      <span className="text-xs font-bold text-white block">देसी लहसुन</span>
                      <span className="text-xs font-black text-yellow-300">मंडी भाव</span>
                    </div>
                  </div>

                  {/* Bottom: QR Code + WhatsApp Details */}
                  <div className="mt-4 pt-4 border-t border-emerald-700/60 flex items-center justify-between gap-4 bg-emerald-950/60 p-4 rounded-2xl">
                    <div className="text-left space-y-1">
                      <span className="text-xs font-black text-yellow-300 flex items-center gap-1">
                        <Truck className="w-4 h-4" /> FREE HOME DELIVERY
                      </span>
                      <p className="text-sm font-extrabold text-white flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4 text-green-400 fill-current" />
                        <span>+91 {settings.whatsappNumber.replace(/^91/, '')}</span>
                      </p>
                      <p className="text-[11px] text-stone-300">
                        {settings.address}
                      </p>
                      <p className="text-[10px] text-yellow-300 font-mono">
                        {settings.websiteUrl}
                      </p>
                    </div>

                    <div className="p-2 bg-white rounded-xl shadow-md flex-shrink-0 text-center">
                      <QRCodeSVG
                        value={settings.websiteUrl || currentOrigin}
                        size={84}
                        level="M"
                      />
                      <span className="text-[9px] font-black text-stone-800 uppercase block mt-0.5">
                        Scan to Shop
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-yellow-600" />
                    <span>WhatsApp Promotion Guide:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    1. Tap <strong>"Download Flyer Image (PNG)"</strong> below.<br/>
                    2. Share the image directly in your WhatsApp groups, broadcast lists and WhatsApp Status.<br/>
                    3. Customers can scan the QR code with their phone camera or click your store website link to order!
                  </p>
                </div>

                <button
                  onClick={handleDownloadPromoBanner}
                  disabled={isDownloadingBanner}
                  className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 active:scale-98 text-stone-950 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloadingBanner ? 'Generating Image...' : 'Download Flyer Image (PNG)'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 7: STORE SETTINGS ===================== */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6 max-w-2xl">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Store Settings & Configuration</h2>
              <p className="text-xs text-stone-500">Update store name, WhatsApp number, address, timings and free delivery terms.</p>
            </div>

            {settingsSavedMessage && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Store settings updated and synchronized successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Store Name</label>
                <input
                  type="text"
                  value={settingsFormData.storeName}
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, storeName: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">WhatsApp Number (For Orders)</label>
                <input
                  type="text"
                  value={settingsFormData.whatsappNumber}
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, whatsappNumber: e.target.value })}
                  placeholder="919024782721"
                  className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                />
                <p className="text-[10px] text-stone-400 mt-0.5">Include country code 91 for India without spaces or symbols.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Store Address / Location</label>
                <input
                  type="text"
                  value={settingsFormData.address}
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, address: e.target.value })}
                  placeholder="Near Ghanta Ghar, Sardar Market, Jodhpur, Rajasthan"
                  className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Store Timings</label>
                  <input
                    type="text"
                    value={settingsFormData.timings}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, timings: e.target.value })}
                    placeholder="8:00 AM – 9:00 PM"
                    className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Delivery Charges (₹)</label>
                  <input
                    type="number"
                    value={settingsFormData.deliveryCharges}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, deliveryCharges: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <p className="text-[10px] text-stone-400 mt-0.5">Set to 0 for Free Delivery.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Website URL (For WhatsApp Order Links & QR)</label>
                <input
                  type="url"
                  value={settingsFormData.websiteUrl}
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, websiteUrl: e.target.value })}
                  placeholder="https://dilipgrocerystore.pages.dev"
                  className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Top Announcement Banner</label>
                <input
                  type="text"
                  value={settingsFormData.announcement}
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, announcement: e.target.value })}
                  placeholder="🎉 Mandi Fresh Veggies Daily! Free Home Delivery in Jodhpur."
                  className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition"
                >
                  Save Store Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ===================== ADD / EDIT PRODUCT MODAL ===================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)} />
          
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 text-left border border-stone-200 max-h-[90vh] flex flex-col">
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Grocery Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-emerald-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Product Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    placeholder="e.g. Desi Aloo (Potatoes)"
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Hindi Name</label>
                  <input
                    type="text"
                    value={productFormData.hindiName}
                    onChange={(e) => setProductFormData({ ...productFormData, hindiName: e.target.value })}
                    placeholder="e.g. नया देसी आलू"
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={productFormData.categoryId}
                    onChange={(e) => setProductFormData({ ...productFormData, categoryId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productFormData.basePrice}
                    onChange={(e) => setProductFormData({ ...productFormData, basePrice: e.target.value })}
                    placeholder="20"
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={productFormData.originalPrice}
                    onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value })}
                    placeholder="28"
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Primary Unit</label>
                  <select
                    value={productFormData.unit}
                    onChange={(e) => setProductFormData({ ...productFormData, unit: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="dozen">Dozen</option>
                    <option value="litre">Litre</option>
                    <option value="packet">Packet</option>
                    <option value="piece">Piece</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Available Stock</label>
                  <input
                    type="number"
                    value={productFormData.stock}
                    onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                    placeholder="100"
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Image Upload & Preview */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Photo</label>
                <div className="flex items-center gap-3">
                  {productFormData.image && (
                    <img
                      src={productFormData.image}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold flex items-center gap-1.5 border border-stone-200"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{imageUploading ? 'Uploading...' : 'Upload Image from Device'}</span>
                    </button>
                    <input
                      type="text"
                      placeholder="Or paste image URL"
                      value={productFormData.image}
                      onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                      className="w-full p-1.5 text-[11px] rounded-lg border border-stone-200 bg-stone-50"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  placeholder="Fresh from mandi, handpicked and cleaned..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productFormData.isAvailable}
                    onChange={(e) => setProductFormData({ ...productFormData, isAvailable: e.target.checked })}
                    className="rounded text-emerald-600 w-4 h-4"
                  />
                  <span className="font-bold">In Stock & Active</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productFormData.isFeatured}
                    onChange={(e) => setProductFormData({ ...productFormData, isFeatured: e.target.checked })}
                    className="rounded text-emerald-600 w-4 h-4"
                  />
                  <span className="font-bold">Featured Special</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productFormData.mandiFresh}
                    onChange={(e) => setProductFormData({ ...productFormData, mandiFresh: e.target.checked })}
                    className="rounded text-emerald-600 w-4 h-4"
                  />
                  <span className="font-bold">Mandi Fresh Badge</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== ADD / EDIT CATEGORY MODAL ===================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 text-left border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategorySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  placeholder="e.g. Fresh Vegetables"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Hindi Name</label>
                <input
                  type="text"
                  value={categoryFormData.hindiName}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, hindiName: e.target.value })}
                  placeholder="e.g. ताज़ा सब्ज़ियाँ"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={categoryFormData.image}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
