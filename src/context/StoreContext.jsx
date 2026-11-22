import React, { createContext, useContext, useState, useEffect } from 'react';
import { storeService } from '../services/storeService';
import { calculateUnitPrice } from '../utils/priceCalculator';
import { getWhatsAppOrderUrl } from '../services/whatsappService';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS, INITIAL_ORDERS } from '../data/initialData';

const StoreContext = createContext(null);
const CART_STORAGE_KEY = 'dilip_grocery_cart_v1';

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Drawer / Modal states
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load initial data
  const loadStoreData = async () => {
    try {
      setLoading(true);
      const [fetchedSettings, fetchedCategories, fetchedProducts, fetchedOrders] = await Promise.all([
        storeService.getSettings(),
        storeService.getCategories(),
        storeService.getProducts(),
        storeService.getOrders()
      ]);

      setSettings(fetchedSettings);
      setCategories(fetchedCategories);
      setProducts(fetchedProducts);
      setOrders(fetchedOrders);
    } catch (err) {
      console.error('Error loading store data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoreData();
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error('Error saving cart to localStorage:', err);
    }
  }, [cart]);

  // Cart operations
  const addToCart = (product, unit = null, qty = 1) => {
    const selectedUnit = unit || product.defaultUnit || '1kg';
    const unitPrice = calculateUnitPrice(product.basePrice, selectedUnit);

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.productId === product.id && item.selectedUnit === selectedUnit
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + qty;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: Number((unitPrice * newQty).toFixed(2))
        };
        return updated;
      } else {
        const newItem = {
          productId: product.id,
          name: product.name,
          hindiName: product.hindiName || '',
          image: product.image,
          unit: product.unit,
          basePrice: product.basePrice,
          selectedUnit: selectedUnit,
          unitPrice: unitPrice,
          quantity: qty,
          totalPrice: Number((unitPrice * qty).toFixed(2))
        };
        return [...prevCart, newItem];
      }
    });
  };

  const updateCartQuantity = (productId, selectedUnit, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedUnit);
      return;
    }

    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.productId === productId && item.selectedUnit === selectedUnit) {
          const itemTotal = Number((item.unitPrice * quantity).toFixed(2));
          return {
            ...item,
            quantity,
            totalPrice: itemTotal
          };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId, selectedUnit) => {
    setCart(prevCart =>
      prevCart.filter(item => !(item.productId === productId && item.selectedUnit === selectedUnit))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + (Number(item.totalPrice) || 0), 0);
  const deliveryCharges = Number(settings.deliveryCharges || 0);
  const cartTotal = cartSubtotal + deliveryCharges;
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Customer checkout & WhatsApp order submission
  const placeOrder = async (customerDetails) => {
    if (cart.length === 0) {
      throw new Error('Your shopping cart is empty.');
    }

    const orderPayload = {
      customerName: customerDetails.customerName.trim(),
      customerPhone: customerDetails.customerPhone.trim(),
      deliveryAddress: customerDetails.deliveryAddress.trim(),
      landmark: customerDetails.landmark?.trim() || '',
      instructions: customerDetails.instructions?.trim() || '',
      items: cart,
      subtotal: cartSubtotal,
      deliveryCharges: deliveryCharges,
      totalAmount: cartTotal,
      storeName: settings.storeName,
      websiteUrl: settings.websiteUrl || window.location.origin
    };

    // Save to Database / LocalStorage
    const createdOrder = await storeService.createOrder(orderPayload);

    // Refresh orders and products (stock deduction)
    setOrders(prev => [createdOrder, ...prev]);
    const updatedProducts = await storeService.getProducts();
    setProducts(updatedProducts);

    // Generate WhatsApp URL
    const whatsappUrl = getWhatsAppOrderUrl(settings.whatsappNumber, {
      ...orderPayload,
      orderId: createdOrder.id
    });

    // Clear cart
    clearCart();

    return {
      order: createdOrder,
      whatsappUrl
    };
  };

  // Admin Actions
  const saveProduct = async (productData) => {
    const saved = await storeService.saveProduct(productData);
    const updated = await storeService.getProducts();
    setProducts(updated);
    return saved;
  };

  const deleteProduct = async (productId) => {
    await storeService.deleteProduct(productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const saveCategory = async (categoryData) => {
    const saved = await storeService.saveCategory(categoryData);
    const updated = await storeService.getCategories();
    setCategories(updated);
    return saved;
  };

  const deleteCategory = async (categoryId) => {
    await storeService.deleteCategory(categoryId);
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const updateStoreSettings = async (newSettings) => {
    const saved = await storeService.updateSettings(newSettings);
    setSettings(saved);
    return saved;
  };

  const updateOrderStatus = async (orderId, status) => {
    await storeService.updateOrderStatus(orderId, status);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        settings,
        loading,
        cart,
        cartSubtotal,
        deliveryCharges,
        cartTotal,
        cartItemCount,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        saveProduct,
        deleteProduct,
        saveCategory,
        deleteCategory,
        updateStoreSettings,
        updateOrderStatus,
        refreshData: loadStoreData,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isQRScannerOpen,
        setIsQRScannerOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
