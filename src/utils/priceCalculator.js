/**
 * Quantity and Price Calculator for Dilip Grocery Store
 * Accurate fractional calculation for grocery weights & packages.
 */

export const UNIT_MULTIPLIERS = {
  // Grams to KG
  '100g': 0.1,
  '250g': 0.25,
  '500g': 0.5,
  '750g': 0.75,
  '1kg': 1.0,
  '2kg': 2.0,
  '5kg': 5.0,
  '10kg': 10.0,
  
  // Liquids
  '250ml': 0.25,
  '500ml': 0.5,
  '1 litre': 1.0,
  '1l': 1.0,
  '2 litre': 2.0,
  '2l': 2.0,

  // Dozen / Pieces
  '6 pieces': 0.5,
  '1 dozen': 1.0,
  '2 dozen': 2.0,
  '1 piece': 1.0,
  '1 packet': 1.0,
  '1 box': 1.0,
};

/**
 * Calculate the price for a specific unit selection based on basePrice (price per 1 kg / 1 unit)
 */
export function calculateUnitPrice(basePrice, selectedUnit) {
  if (!basePrice || isNaN(basePrice)) return 0;
  
  const unitLower = (selectedUnit || '1kg').toLowerCase().trim();
  const multiplier = UNIT_MULTIPLIERS[unitLower] !== undefined ? UNIT_MULTIPLIERS[unitLower] : 1.0;
  
  // Round to 2 decimal places or nearest rupee
  const calculated = Number((basePrice * multiplier).toFixed(2));
  return calculated;
}

/**
 * Format currency with Indian Rupee symbol
 */
export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: num % 1 === 0 ? 0 : 2
  })}`;
}

/**
 * Calculate savings percentage between original and discounted price
 */
export function calculateDiscountPercent(originalPrice, basePrice) {
  if (!originalPrice || originalPrice <= basePrice) return 0;
  const saving = ((originalPrice - basePrice) / originalPrice) * 100;
  return Math.round(saving);
}

/**
 * Clean phone number for WhatsApp wa.me links
 * Default Indian country code +91
 */
export function sanitizeWhatsAppNumber(phone) {
  if (!phone) return '919024782721';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}
