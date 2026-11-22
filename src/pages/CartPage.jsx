import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Truck, 
  ShieldCheck,
  MessageCircle 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/priceCalculator';

export default function CartPage() {
  const { 
    cart, 
    cartSubtotal, 
    deliveryCharges, 
    cartTotal, 
    cartItemCount, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    settings 
  } = useStore();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-24 h-24 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-4xl shadow-inner">
          🥦
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-stone-900">Your Shopping Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
            You haven't added any fresh vegetables or groceries yet. Explore our Mandi fresh collection!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/20 transition"
        >
          <span>Start Shopping Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Review Shopping Cart
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {cartItemCount} item{cartItemCount === 1 ? '' : 's'} in your cart • Free Home Delivery in Jodhpur
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-800 font-bold self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-red-50 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Empty Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-3.5">
          {cart.map((item) => (
            <div
              key={`${item.productId}-${item.selectedUnit}`}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-stone-200 flex-shrink-0"
                />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {item.selectedUnit}
                    </span>
                    <span className="text-xs text-stone-500">
                      ₹{item.unitPrice} per {item.selectedUnit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Counter & Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                <div className="flex items-center bg-stone-100 rounded-xl p-1">
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.selectedUnit, item.quantity - 1)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 active:scale-90"
                    aria-label="Decrease"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-black text-stone-900">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.selectedUnit, item.quantity + 1)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 active:scale-90"
                    aria-label="Increase"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  <span className="text-sm sm:text-base font-black text-stone-900 block">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId, item.selectedUnit)}
                  className="text-stone-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-stone-100 transition"
                  title="Remove from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:underline pt-2"
          >
            <ArrowLeft className="w-4 h-4" /> Add More Groceries
          </Link>
        </div>

        {/* Right: Bill Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-card space-y-4">
          <h3 className="text-base font-extrabold text-stone-900 pb-3 border-b border-stone-100">
            Order Bill Summary
          </h3>

          <div className="space-y-2.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-stone-900">{formatCurrency(cartSubtotal)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Delivery Charges</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {deliveryCharges === 0 ? 'FREE DELIVERY' : formatCurrency(deliveryCharges)}
              </span>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-sm font-black text-stone-900">
              <span>Final Total Amount</span>
              <span className="text-xl text-emerald-800">{formatCurrency(cartTotal)}</span>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl text-xs text-emerald-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>Doorstep Delivery in Jodhpur</span>
            </div>
            <p className="text-[11px] text-emerald-800/80">
              Pay with Cash or UPI after inspecting your fresh vegetables at home.
            </p>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition"
          >
            <MessageCircle className="w-4 h-4 text-yellow-300" />
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
