import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  MessageCircle, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  Truck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/priceCalculator';

export default function CheckoutPage() {
  const { cart, cartSubtotal, deliveryCharges, cartTotal, placeOrder, settings } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    landmark: '',
    instructions: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect
  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Your Cart is Empty</h2>
        <p className="text-xs text-stone-500">Please add products to your cart before proceeding to checkout.</p>
        <Link to="/products" className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">
          Browse Groceries
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const errs = {};
    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      errs.customerName = 'Please enter your full name (at least 2 characters)';
    }

    const cleanPhone = formData.customerPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.customerPhone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.deliveryAddress.trim() || formData.deliveryAddress.trim().length < 6) {
      errs.deliveryAddress = 'Please enter your complete street / house delivery address in Jodhpur';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // Save order to DB and build WhatsApp URL
      const { order, whatsappUrl } = await placeOrder(formData);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore confetti errors
      }

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      // Navigate to order confirmation tracking page
      navigate(`/order/${order.id}`);
    } catch (err) {
      console.error('Order placement error:', err);
      alert(err.message || 'Failed to place order. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
      
      {/* Header */}
      <div>
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline mb-2">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Customer Delivery & Checkout
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Order directly via WhatsApp • No online pre-payment required • Pay on Delivery
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Customer Details Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-soft space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <User className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-stone-900">Your Contact & Delivery Address</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Customer Full Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Full Name / आपका पूरा नाम <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className={`w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border outline-none transition ${
                    errors.customerName 
                      ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-200' 
                      : 'border-stone-200 bg-stone-50/50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                  }`}
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              </div>
              {errors.customerName && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.customerName}
                </p>
              )}
            </div>

            {/* Mobile Phone Number */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                WhatsApp / Mobile Number / मोबाइल नंबर <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="e.g. 9876543210 (10 Digits)"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className={`w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border outline-none transition ${
                    errors.customerPhone 
                      ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-200' 
                      : 'border-stone-200 bg-stone-50/50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                  }`}
                />
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              </div>
              {errors.customerPhone && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.customerPhone}
                </p>
              )}
              <p className="text-[10px] text-stone-400 mt-0.5">We will use this to confirm delivery on WhatsApp.</p>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Delivery Address in Jodhpur / डिलीवरी का पता <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  rows="2"
                  placeholder="House No., Street Name, Colony / Area, Jodhpur"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className={`w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border outline-none transition ${
                    errors.deliveryAddress 
                      ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-200' 
                      : 'border-stone-200 bg-stone-50/50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                  }`}
                />
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              </div>
              {errors.deliveryAddress && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.deliveryAddress}
                </p>
              )}
            </div>

            {/* Landmark (Optional) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Nearby Landmark / लैंडमार्क (वैकल्पिक)
              </label>
              <input
                type="text"
                placeholder="e.g. Near Clock Tower / Behind Temple"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
              />
            </div>

            {/* Special Instructions (Optional) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Order Notes / विशेष निर्देश (वैकल्पिक)
              </label>
              <input
                type="text"
                placeholder="e.g. Deliver before 5 PM, ring bell twice, fresh potatoes only"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-stone-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-green-600 hover:bg-green-700 active:scale-98 text-white rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-green-600/25 transition"
              >
                <MessageCircle className="w-5 h-5 text-yellow-200 fill-current" />
                <span>{isSubmitting ? 'Recording Order...' : 'Place Order on WhatsApp'}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 mt-2.5 text-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Your order is recorded & opens WhatsApp with pre-filled items</span>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary Review */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-card space-y-4">
          <h3 className="text-base font-extrabold text-stone-900 pb-3 border-b border-stone-100">
            Order Review ({cart.length} item{cart.length === 1 ? '' : 's'})
          </h3>

          <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
            {cart.map((item) => (
              <div
                key={`${item.productId}-${item.selectedUnit}`}
                className="flex items-center justify-between gap-3 p-2 rounded-xl bg-stone-50 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                  />
                  <div>
                    <span className="font-bold text-stone-900 block line-clamp-1">{item.name}</span>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      {item.selectedUnit} × {item.quantity}
                    </span>
                  </div>
                </div>

                <span className="font-black text-stone-900 whitespace-nowrap">
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="pt-3 border-t border-stone-200 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">{formatCurrency(cartSubtotal)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Delivery Charges</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {deliveryCharges === 0 ? 'FREE DELIVERY' : formatCurrency(deliveryCharges)}
              </span>
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-between items-baseline text-sm font-black text-stone-900">
              <span>Total Payable Amount</span>
              <span className="text-xl text-emerald-800">{formatCurrency(cartTotal)}</span>
            </div>
          </div>

          {/* Store Guarantee */}
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs text-stone-500 space-y-1">
            <div className="font-bold text-stone-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Dilip Grocery Store Guarantee</span>
            </div>
            <p className="text-[11px]">
              • Inspected fresh daily at Mandi.<br/>
              • Weighed on digital scales.<br/>
              • If not satisfied, reject or replace at doorstep!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
