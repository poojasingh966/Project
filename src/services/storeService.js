import { supabase, isSupabaseConfigured } from './supabase';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS, INITIAL_ORDERS } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'dilip_grocery_products_v1',
  CATEGORIES: 'dilip_grocery_categories_v1',
  SETTINGS: 'dilip_grocery_settings_v1',
  ORDERS: 'dilip_grocery_orders_v1'
};

// Helper to get or init localStorage safely
const getLocal = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(data);
    if (!parsed || (Array.isArray(fallback) && !Array.isArray(parsed))) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return parsed;
  } catch (err) {
    console.warn(`Failed reading localStorage key: ${key}`, err);
    return fallback;
  }
};

const setLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed writing localStorage key: ${key}`, err);
  }
};

export const storeService = {
  // ----------------- SETTINGS -----------------
  async getSettings() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .limit(1)
          .single();

        if (data && !error) {
          const mapped = {
            storeName: data.store_name || INITIAL_SETTINGS.storeName,
            tagline: data.tagline || INITIAL_SETTINGS.tagline,
            whatsappNumber: data.whatsapp_number || INITIAL_SETTINGS.whatsappNumber,
            address: data.address || INITIAL_SETTINGS.address,
            city: data.city || INITIAL_SETTINGS.city,
            state: data.state || INITIAL_SETTINGS.state,
            timings: data.timings || INITIAL_SETTINGS.timings,
            deliveryCharges: Number(data.delivery_charges ?? INITIAL_SETTINGS.deliveryCharges),
            minOrderAmount: Number(data.min_order_amount ?? INITIAL_SETTINGS.minOrderAmount),
            currency: data.currency || INITIAL_SETTINGS.currency,
            websiteUrl: data.website_url || INITIAL_SETTINGS.websiteUrl,
            announcement: data.announcement || INITIAL_SETTINGS.announcement,
            logoUrl: data.logo_url || INITIAL_SETTINGS.logoUrl,
            bannerUrl: data.banner_url || INITIAL_SETTINGS.bannerUrl,
          };
          setLocal(STORAGE_KEYS.SETTINGS, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getSettings error, falling back to local storage', err);
      }
    }
    return getLocal(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  async updateSettings(settings) {
    setLocal(STORAGE_KEYS.SETTINGS, settings);

    if (isSupabaseConfigured() && supabase) {
      try {
        const payload = {
          id: 1,
          store_name: settings.storeName,
          tagline: settings.tagline,
          whatsapp_number: settings.whatsappNumber,
          address: settings.address,
          city: settings.city,
          state: settings.state,
          timings: settings.timings,
          delivery_charges: settings.deliveryCharges,
          min_order_amount: settings.minOrderAmount,
          currency: settings.currency,
          website_url: settings.websiteUrl,
          announcement: settings.announcement,
          logo_url: settings.logoUrl,
          banner_url: settings.bannerUrl,
          updated_at: new Date().toISOString()
        };
        await supabase.from('store_settings').upsert(payload);
      } catch (err) {
        console.error('Failed to sync settings to Supabase', err);
      }
    }
    return settings;
  },

  // ----------------- CATEGORIES -----------------
  async getCategories() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (data && !error && data.length > 0) {
          const mapped = data.map(c => ({
            id: c.id,
            name: c.name,
            hindiName: c.hindi_name || '',
            slug: c.slug,
            image: c.image_url,
            description: c.description || ''
          }));
          setLocal(STORAGE_KEYS.CATEGORIES, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getCategories error, falling back to local storage', err);
      }
    }
    return getLocal(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  async saveCategory(category) {
    const list = getLocal(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    let updated;
    const isNew = !category.id || !list.some(c => c.id === category.id);
    const catId = category.id || `cat-${Date.now()}`;
    const cleanCat = { ...category, id: catId };

    if (isNew) {
      updated = [...list, cleanCat];
    } else {
      updated = list.map(c => c.id === catId ? cleanCat : c);
    }
    setLocal(STORAGE_KEYS.CATEGORIES, updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('categories').upsert({
          id: cleanCat.id,
          name: cleanCat.name,
          hindi_name: cleanCat.hindiName,
          slug: cleanCat.slug || cleanCat.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          image_url: cleanCat.image,
          description: cleanCat.description
        });
      } catch (err) {
        console.error('Supabase saveCategory sync error', err);
      }
    }
    return cleanCat;
  },

  async deleteCategory(categoryId) {
    const list = getLocal(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const updated = list.filter(c => c.id !== categoryId);
    setLocal(STORAGE_KEYS.CATEGORIES, updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('categories').delete().eq('id', categoryId);
      } catch (err) {
        console.error('Supabase deleteCategory sync error', err);
      }
    }
    return true;
  },

  // ----------------- PRODUCTS -----------------
  async getProducts() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && !error && data.length > 0) {
          const mapped = data.map(p => ({
            id: p.id,
            name: p.name,
            hindiName: p.hindi_name || '',
            categoryId: p.category_id,
            basePrice: Number(p.base_price),
            originalPrice: p.original_price ? Number(p.original_price) : null,
            unit: p.unit || 'kg',
            availableUnits: p.available_units || ['250g', '500g', '1kg', '2kg'],
            defaultUnit: p.default_unit || '1kg',
            stock: Number(p.stock || 0),
            isAvailable: Boolean(p.is_available),
            isFeatured: Boolean(p.is_featured),
            image: p.image_url,
            description: p.description || '',
            mandiFresh: Boolean(p.mandi_fresh)
          }));
          setLocal(STORAGE_KEYS.PRODUCTS, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getProducts error, falling back to local storage', err);
      }
    }
    return getLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async saveProduct(product) {
    const list = getLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const prodId = product.id || `prod-${Date.now()}`;
    const cleanProd = {
      ...product,
      id: prodId,
      basePrice: Number(product.basePrice) || 0,
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      stock: Number(product.stock) || 0,
      availableUnits: product.availableUnits?.length ? product.availableUnits : ['250g', '500g', '1kg', '2kg'],
      defaultUnit: product.defaultUnit || '1kg',
      isAvailable: product.isAvailable !== false,
      isFeatured: Boolean(product.isFeatured),
      mandiFresh: Boolean(product.mandiFresh)
    };

    const exists = list.some(p => p.id === prodId);
    const updated = exists
      ? list.map(p => p.id === prodId ? cleanProd : p)
      : [cleanProd, ...list];

    setLocal(STORAGE_KEYS.PRODUCTS, updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').upsert({
          id: cleanProd.id,
          name: cleanProd.name,
          hindi_name: cleanProd.hindiName,
          category_id: cleanProd.categoryId,
          base_price: cleanProd.basePrice,
          original_price: cleanProd.originalPrice,
          unit: cleanProd.unit,
          available_units: cleanProd.availableUnits,
          default_unit: cleanProd.defaultUnit,
          stock: cleanProd.stock,
          is_available: cleanProd.isAvailable,
          is_featured: cleanProd.isFeatured,
          image_url: cleanProd.image,
          description: cleanProd.description,
          mandi_fresh: cleanProd.mandiFresh,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.error('Supabase saveProduct sync error', err);
      }
    }
    return cleanProd;
  },

  async deleteProduct(productId) {
    const list = getLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const updated = list.filter(p => p.id !== productId);
    setLocal(STORAGE_KEYS.PRODUCTS, updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').delete().eq('id', productId);
      } catch (err) {
        console.error('Supabase deleteProduct sync error', err);
      }
    }
    return true;
  },

  // ----------------- ORDERS -----------------
  async getOrders() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (data && !error && data.length > 0) {
          const mapped = data.map(o => ({
            id: o.id,
            createdAt: o.created_at,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            deliveryAddress: o.delivery_address,
            landmark: o.landmark || '',
            instructions: o.instructions || '',
            subtotal: Number(o.subtotal),
            deliveryCharges: Number(o.delivery_charges),
            totalAmount: Number(o.total_amount),
            status: o.status,
            whatsappStatus: o.whatsapp_status || 'Awaiting Customer Send',
            items: (o.order_items || []).map(item => ({
              productId: item.product_id,
              name: item.product_name,
              selectedUnit: item.selected_unit,
              unitPrice: Number(item.unit_price),
              quantity: Number(item.quantity),
              totalPrice: Number(item.total_price)
            }))
          }));
          setLocal(STORAGE_KEYS.ORDERS, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getOrders error, falling back to local storage', err);
      }
    }
    return getLocal(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  async createOrder(orderData) {
    const orderId = orderData.id || `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString(),
      status: 'Awaiting WhatsApp Confirmation',
      whatsappStatus: 'Awaiting WhatsApp Send'
    };

    const currentOrders = getLocal(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    setLocal(STORAGE_KEYS.ORDERS, [newOrder, ...currentOrders]);

    // Deduct stock locally
    const products = getLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const updatedProducts = products.map(prod => {
      const match = newOrder.items.find(i => i.productId === prod.id);
      if (match) {
        const newStock = Math.max(0, prod.stock - match.quantity);
        return { ...prod, stock: newStock, isAvailable: newStock > 0 };
      }
      return prod;
    });
    setLocal(STORAGE_KEYS.PRODUCTS, updatedProducts);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: ordErr } = await supabase.from('orders').insert({
          id: newOrder.id,
          customer_name: newOrder.customerName,
          customer_phone: newOrder.customerPhone,
          delivery_address: newOrder.deliveryAddress,
          landmark: newOrder.landmark,
          instructions: newOrder.instructions,
          subtotal: newOrder.subtotal,
          delivery_charges: newOrder.deliveryCharges,
          total_amount: newOrder.totalAmount,
          status: newOrder.status,
          whatsapp_status: newOrder.whatsappStatus,
          created_at: newOrder.createdAt
        });

        if (!ordErr && newOrder.items?.length > 0) {
          const itemsPayload = newOrder.items.map(item => ({
            order_id: newOrder.id,
            product_id: item.productId,
            product_name: item.name,
            selected_unit: item.selectedUnit,
            unit_price: item.unitPrice,
            quantity: item.quantity,
            total_price: item.totalPrice
          }));
          await supabase.from('order_items').insert(itemsPayload);
        }
      } catch (err) {
        console.error('Supabase createOrder sync error', err);
      }
    }
    return newOrder;
  },

  async updateOrderStatus(orderId, status) {
    const orders = getLocal(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setLocal(STORAGE_KEYS.ORDERS, updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', orderId);
      } catch (err) {
        console.error('Supabase updateOrderStatus sync error', err);
      }
    }
    return true;
  },

  // ----------------- IMAGE UPLOAD -----------------
  async uploadImage(file) {
    // If Supabase Storage is configured, attempt upload to 'product-images' bucket
    if (isSupabaseConfigured() && supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);
          return publicUrl;
        }
      } catch (err) {
        console.warn('Supabase storage upload failed, converting to compressed data URL', err);
      }
    }

    // Local fallback: Convert to Data URL (base64) so it saves and renders immediately!
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};
