import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, RefreshCw, AlertCircle, ExternalLink, Keyboard } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function QRScannerModal() {
  const { isQRScannerOpen, setIsQRScannerOpen, products } = useStore();
  const navigate = useNavigate();

  const [scanResult, setScanResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!isQRScannerOpen) return;

    let scannerInstance = null;
    const scannerId = "qr-reader-container";

    const startScanner = async () => {
      try {
        setErrorMessage('');
        setIsScanning(true);

        scannerInstance = new Html5Qrcode(scannerId);
        scannerRef.current = scannerInstance;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        await scannerInstance.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            handleScanSuccess(decodedText, scannerInstance);
          },
          (error) => {
            // Standard scan frame noise, ignore non-critical errors
          }
        );
      } catch (err) {
        console.warn("Camera scan error / permission denied:", err);
        setErrorMessage(
          err?.message?.includes("NotAllowedError") || err?.name === "NotAllowedError"
            ? "Camera permission was denied. Please allow camera access in your browser or enter code manually."
            : "Could not access camera. You can manually enter the product link or code below."
        );
        setIsScanning(false);
        setShowManualInput(true);
      }
    };

    // Small delay to ensure DOM element is ready
    const timer = setTimeout(() => {
      startScanner();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current.clear())
          .catch((err) => console.warn("Scanner cleanup warning:", err));
      }
    };
  }, [isQRScannerOpen]);

  const handleScanSuccess = async (decodedText, scannerInstance) => {
    if (scannerInstance) {
      try {
        await scannerInstance.stop();
      } catch (err) {
        // ignore
      }
    }
    setScanResult(decodedText);
    processScannedValue(decodedText);
  };

  const processScannedValue = (val) => {
    const text = val.trim();

    // Check if it's a full URL
    try {
      if (text.startsWith('http://') || text.startsWith('https://')) {
        const url = new URL(text);
        const path = url.pathname;
        
        // Match /product/:id
        const productMatch = path.match(/\/product\/([a-zA-Z0-9_-]+)/);
        if (productMatch) {
          setIsQRScannerOpen(false);
          navigate(`/product/${productMatch[1]}`);
          return;
        }

        // Match /products or /
        if (path === '/' || path === '/products') {
          setIsQRScannerOpen(false);
          navigate('/products');
          return;
        }

        // Otherwise open url
        window.location.href = text;
        return;
      }
    } catch {
      // not a url
    }

    // Check if it's a product ID directly (e.g. "prod-aloo")
    const matchedProduct = products.find(
      p => p.id === text || p.name.toLowerCase().includes(text.toLowerCase())
    );
    if (matchedProduct) {
      setIsQRScannerOpen(false);
      navigate(`/product/${matchedProduct.id}`);
      return;
    }

    setErrorMessage(`Scanned value: "${text}". Could not find matching store product.`);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      processScannedValue(manualCode);
    }
  };

  if (!isQRScannerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm"
        onClick={() => setIsQRScannerOpen(false)}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden z-10 text-left border border-stone-200">
        
        {/* Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-yellow-300" />
            <h3 className="text-sm font-bold">Scan QR Code</h3>
          </div>
          <button
            onClick={() => setIsQRScannerOpen(false)}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Viewport */}
        <div className="p-4 space-y-4">
          <p className="text-xs text-stone-600 text-center">
            Point camera at a Dilip Grocery Store product QR code or shop poster.
          </p>

          {/* QR Viewfinder Container */}
          <div className="relative rounded-2xl overflow-hidden bg-stone-950 aspect-square flex items-center justify-center border-2 border-dashed border-emerald-500">
            <div id="qr-reader-container" className="w-full h-full"></div>
            
            {!errorMessage && isScanning && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-yellow-400/80 rounded-2xl animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Error / Permission Alert */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Manual Input Toggle */}
          <div className="pt-2 border-t border-stone-100">
            {!showManualInput ? (
              <button
                type="button"
                onClick={() => setShowManualInput(true)}
                className="w-full py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Keyboard className="w-4 h-4" /> Enter Product Code or Link Manually
              </button>
            ) : (
              <form onSubmit={handleManualSubmit} className="space-y-2">
                <label className="text-[11px] font-bold text-stone-500 block">
                  Manual Code / URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. prod-aloo or paste link"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                  >
                    Open
                  </button>
                </div>
              </form>
            )}
          </div>

          <p className="text-[10px] text-stone-400 text-center">
            🔒 Camera is only used in your browser for scanning. Video is never uploaded.
          </p>
        </div>
      </div>
    </div>
  );
}
