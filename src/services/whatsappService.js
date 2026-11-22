import { sanitizeWhatsAppNumber } from '../utils/priceCalculator';

/**
 * Builds the WhatsApp pre-filled text for an order according to the master prompt specifications
 */
export function generateWhatsAppOrderMessage({
  storeName = "Dilip Grocery Store",
  orderId,
  customerName,
  customerPhone,
  deliveryAddress,
  landmark,
  instructions,
  items,
  subtotal,
  deliveryCharges,
  totalAmount,
  websiteUrl
}) {
  const currentOrigin = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : websiteUrl;
  const trackingUrl = `${currentOrigin}/order/${orderId}`;

  const itemsList = items.map(item => {
    const unitUpper = (item.selectedUnit || '1KG').toUpperCase();
    return `• ${item.name} – ${unitUpper} – ₹${item.totalPrice}`;
  }).join('\n');

  const deliveryText = deliveryCharges === 0 ? '₹0 (FREE DELIVERY)' : `₹${deliveryCharges}`;

  let message = `🛒 *${storeName.toUpperCase()} – NEW ORDER*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Order ID:* #${orderId}\n`;
  message += `*Customer Name:* ${customerName}\n`;
  message += `*Mobile:* ${customerPhone}\n`;
  message += `*Delivery Address:* ${deliveryAddress}\n`;
  if (landmark && landmark.trim()) {
    message += `*Landmark:* ${landmark.trim()}\n`;
  }
  if (instructions && instructions.trim()) {
    message += `*Special Instructions:* ${instructions.trim()}\n`;
  }
  message += `\n*ORDER DETAILS:*\n`;
  message += `${itemsList}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Subtotal:* ₹${subtotal}\n`;
  message += `*Delivery Charges:* ${deliveryText}\n`;
  message += `*TOTAL AMOUNT:* ₹${totalAmount}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Website Order Link:* ${trackingUrl}\n\n`;
  message += `Thank you for ordering from ${storeName}.\n`;
  message += `Please confirm my order and send estimated delivery time! 🙏`;

  return message;
}

/**
 * Creates the full wa.me link with URL-encoded text
 */
export function getWhatsAppOrderUrl(whatsappNumber, orderData) {
  const cleanNumber = sanitizeWhatsAppNumber(whatsappNumber);
  const text = generateWhatsAppOrderMessage(orderData);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate share link for a specific product
 */
export function getProductShareUrl(product, storeName = "Dilip Grocery Store", websiteUrl) {
  const currentOrigin = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : websiteUrl;
  const productUrl = `${currentOrigin}/product/${product.id}`;

  const text = `🛍️ *Check out ${product.name} on ${storeName}!*\n` +
    `💰 Price: ₹${product.basePrice} per ${product.unit}\n` +
    `🚚 Fresh Mandi Stock • Free Delivery in Jodhpur\n\n` +
    `👉 Order online or view details:\n${productUrl}`;

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Generate share link for the entire store
 */
export function getStoreShareUrl(storeSettings) {
  const currentOrigin = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : storeSettings.websiteUrl;
  const text = `🥦 *${storeSettings.storeName} – Fresh Vegetables & Daily Groceries*\n` +
    `📍 ${storeSettings.address}\n` +
    `⏰ Timings: ${storeSettings.timings}\n` +
    `✨ Fresh Aloo, Onion, Garlic, Fruits, Dairy & Mandi Rates!\n` +
    `🚚 Free Home Delivery in Jodhpur!\n\n` +
    `👉 Browse & Order online via WhatsApp:\n${currentOrigin}`;

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Direct WhatsApp chat with store owner for inquiries
 */
export function getWhatsAppInquiryUrl(whatsappNumber, storeName = "Dilip Grocery Store") {
  const cleanNumber = sanitizeWhatsAppNumber(whatsappNumber);
  const text = `Namaste ${storeName}! I have an inquiry regarding fresh groceries / delivery in Jodhpur.`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Direct WhatsApp chat with a customer for store admin
 */
export function getAdminToCustomerWhatsAppUrl(customerPhone, orderId, storeName = "Dilip Grocery Store") {
  const cleanNumber = sanitizeWhatsAppNumber(customerPhone);
  const text = `Namaste from ${storeName}! This is regarding your order #${orderId}. We have received your order and are preparing it fresh for delivery!`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}
