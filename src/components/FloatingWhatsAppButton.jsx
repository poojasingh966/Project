import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getWhatsAppInquiryUrl } from '../services/whatsappService';

export default function FloatingWhatsAppButton() {
  const { settings } = useStore();
  const whatsappUrl = getWhatsAppInquiryUrl(settings.whatsappNumber, settings.storeName);

  return (
    <aside 
      aria-label="Contact options"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-30 flex items-center gap-2 group"
    >
      <div className="hidden sm:block bg-stone-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Order on WhatsApp!
      </div>
      
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="relative w-13 h-13 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 active:scale-95 text-white rounded-full flex items-center justify-center shadow-elevated transition-transform transform duration-300"
        aria-label="Contact Dilip Grocery Store on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-green-400 animate-pulse-ring -z-10"></span>
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
      </a>
    </aside>
  );
}
