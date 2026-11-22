import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Share2, Printer, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/priceCalculator';
import { getProductShareUrl } from '../services/whatsappService';

export default function ProductQRModal({ product, onClose }) {
  const { settings } = useStore();
  const printRef = useRef(null);

  if (!product) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : settings.websiteUrl;
  const productUrl = `${currentOrigin}/product/${product.id}`;

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById(`product-qr-svg-${product.id}`);
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${product.name.replace(/[^a-zA-Z0-9]/g, '_')}_QR.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleDownloadPNG = () => {
    const svgElement = document.getElementById(`product-qr-svg-${product.id}`);
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 600;
    canvas.height = 600;

    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 50, 50, 500, 500);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${product.name.replace(/[^a-zA-Z0-9]/g, '_')}_QR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const shareUrl = getProductShareUrl(product, settings.storeName, settings.websiteUrl);
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden z-10 text-left border border-stone-200">
        
        {/* Header */}
        <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold">Product QR Code</h3>
            <p className="text-[11px] text-emerald-100">{settings.storeName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div ref={printRef} className="p-5 text-center space-y-4">
          
          {/* Product Header */}
          <div className="flex items-center gap-3 text-left p-2.5 bg-stone-50 rounded-2xl border border-stone-200/80">
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 rounded-xl object-cover border border-stone-200"
            />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{product.name}</h4>
              <p className="text-[11px] text-emerald-700 font-semibold">{product.hindiName}</p>
              <p className="text-xs font-black text-stone-900 mt-0.5">
                {formatCurrency(product.basePrice)} <span className="text-[10px] text-stone-500 font-normal">/ {product.unit}</span>
              </p>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="p-4 bg-white rounded-2xl border-2 border-emerald-500/30 inline-block shadow-inner">
            <QRCodeSVG
              id={`product-qr-svg-${product.id}`}
              value={productUrl}
              size={180}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/favicon.svg",
                x: undefined,
                y: undefined,
                height: 32,
                width: 32,
                excavate: true,
              }}
            />
          </div>

          <p className="text-[11px] text-stone-500 leading-tight">
            Scan with any phone camera to view details and order directly on WhatsApp!
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1 no-print">
            <button
              onClick={handleDownloadPNG}
              className="py-2 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border border-emerald-200 transition"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>PNG</span>
            </button>

            <button
              onClick={handleDownloadSVG}
              className="py-2 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border border-stone-200 transition"
            >
              <Download className="w-4 h-4 text-stone-700" />
              <span>SVG</span>
            </button>

            <button
              onClick={handleShare}
              className="py-2 px-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 shadow-sm transition"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
