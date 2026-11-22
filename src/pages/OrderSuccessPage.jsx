import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  MessageCircle, 
  Printer, 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Phone, 
  AlertCircle,
  Truck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/priceCalculator';
import { getWhatsAppOrderUrl } from '../services/whatsappService';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const { orders, settings } = useStore();

  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Order Not Found</h2>
        <p className="text-xs text-stone-500">Could not find order #{id}. It may still be syncing or does not exist.</p>
        <Link to="/" className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">
          Go to Homepage
        </Link>
      </div>
    );
  }

  // Generate WhatsApp order URL for re-triggering
  const whatsappUrl = getWhatsAppOrderUrl(settings.whatsappNumber, {
    storeName: settings.storeName,
    orderId: order.id,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    deliveryAddress: order.deliveryAddress,
    landmark: order.landmark,
    instructions: order.instructions,
    items: order.items,
    subtotal: order.subtotal,
    deliveryCharges: order.deliveryCharges,
    totalAmount: order.totalAmount,
    websiteUrl: settings.websiteUrl || window.location.origin
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
      
      {/* Top Banner Notice */}
      <div className="bg-emerald-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-3 no-print">
        <div className="w-14 h-14 mx-auto rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-yellow-300">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Order Recorded in System!
        </h1>

        <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto">
          Order <strong>#{order.id}</strong> has been saved. Please make sure to send the pre-filled message on WhatsApp to complete your confirmation with Dilip Grocery Store.
        </p>

        {/* WhatsApp Reopen Button */}
        <div className="pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-stone-900 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-lg transition"
          >
            <MessageCircle className="w-4 h-4 fill-current text-green-700" />
            <span>Open WhatsApp to Confirm Order</span>
          </a>
        </div>
      </div>

      {/* Printable Receipt Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-card space-y-6 print-container">
        
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <span className="text-lg font-black text-stone-900">{settings.storeName}</span>
            <p className="text-xs text-stone-500">{settings.address}</p>
            <p className="text-xs text-stone-500">WhatsApp: +91 {settings.whatsappNumber.replace(/^91/, '')}</p>
          </div>

          <div className="sm:text-right">
            <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-1">
              Status: {order.status}
            </span>
            <p className="text-xs text-stone-400">Order ID: #{order.id}</p>
            <p className="text-xs text-stone-400">
              Date: {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">Customer Details</span>
            <p className="font-bold text-stone-900">{order.customerName}</p>
            <p className="flex items-center gap-1 text-stone-600 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" /> {order.customerPhone}
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">Delivery Address</span>
            <p className="font-medium text-stone-900">{order.deliveryAddress}</p>
            {order.landmark && <p className="text-stone-500">Landmark: {order.landmark}</p>}
            {order.instructions && <p className="text-stone-500">Notes: {order.instructions}</p>}
          </div>
        </div>

        {/* Itemized Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Items Ordered</h3>
          <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-stone-50">
                <div>
                  <span className="font-bold text-stone-900">{item.name}</span>
                  <span className="text-stone-500 block text-[11px]">
                    Qty: {item.quantity} × {item.selectedUnit} (@ ₹{item.unitPrice})
                  </span>
                </div>
                <span className="font-black text-stone-900">
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <div className="pt-2 space-y-1.5 text-xs text-stone-600 max-w-xs ml-auto text-right">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-bold text-stone-900">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charges:</span>
            <span className="font-bold text-emerald-700">
              {order.deliveryCharges === 0 ? 'FREE' : formatCurrency(order.deliveryCharges)}
            </span>
          </div>
          <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-200">
            <span>Total Amount:</span>
            <span className="text-emerald-800">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold border border-stone-300 transition"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
