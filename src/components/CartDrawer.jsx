import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck,
  MessageCircle 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/priceCalculator';

export default function CartDrawer() {
  const { 
    cart, 
    cartSubtotal, 
    deliveryCharges, 
    cartTotal, 
    cartItemCount, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    isCartDrawerOpen, 
    setIsCartDrawerOpen,
    settings 
  } = useStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  if (!isCartDrawerOpen) {
    // Return floating mobile bar if cart has items
    if (cartItemCount > 0) {
      return (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-30 animate-bounce-subtle">
          <div className="bg-stone-900 text-white p-3 rounded-2xl shadow-2xl flex items-center justify-between border border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-sm text-yellow-300">
                {cartItemCount}
              </div>
              <div className="text-left">
                <span className="text-[10px] text-stone-400 block font-medium">Cart Total</span>
                <span className="text-sm font-extrabold text-white">{formatCurrency(cartTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-stone-950 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow"
            >
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col text-left">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Your Shopping Cart</h3>
                <p className="text-xs text-stone-500">{cartItemCount} item{cartItemCount === 1 ? '' : 's'} selected</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 rounded hover:bg-red-50"
                  title="Empty Cart"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Delivery Promise Banner */}
          <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2.5 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
            <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>🎉 Free Home Delivery in Jodhpur on all orders!</span>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl">
                  🥦
                </div>
                <div>
                  <h4 className="text-base font-bold text-stone-900">Your cart is empty</h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                    Looks like you haven't added any fresh vegetables or groceries yet.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow hover:bg-emerald-700 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={`${item.productId}-${item.selectedUnit}`}
                  className="flex gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/80 hover:border-emerald-200 transition"
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-white flex-shrink-0 border border-stone-200"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.productId, item.selectedUnit)}
                          className="text-stone-400 hover:text-red-500 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                          {item.selectedUnit}
                        </span>
                        <span>₹{item.unitPrice} per {item.selectedUnit}</span>
                      </div>
                    </div>

                    {/* Quantity controller & line total */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-200/60">
                      <div className="flex items-center bg-white border border-stone-200 rounded-lg shadow-2xs">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.selectedUnit, item.quantity - 1)}
                          className="p-1 text-stone-600 hover:text-stone-900 active:scale-90"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-black text-stone-900">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.selectedUnit, item.quantity + 1)}
                          className="p-1 text-stone-600 hover:text-stone-900 active:scale-90"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-stone-900">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-emerald-700">
                    {deliveryCharges === 0 ? 'FREE' : formatCurrency(deliveryCharges)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="text-emerald-800">{formatCurrency(cartTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
              >
                <MessageCircle className="w-4 h-4 text-yellow-300" />
                <span>Place Order on WhatsApp</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <p className="text-[10px] text-center text-stone-400">
                🔒 Direct WhatsApp confirmation • Pay when groceries are delivered
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
