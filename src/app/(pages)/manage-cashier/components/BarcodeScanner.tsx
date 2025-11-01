import React, { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Product } from '@/models/Product';

interface BarcodeScannerProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onProductFound: (product: Product) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  isOpen,
  products,
  onClose,
  onProductFound
}) => {
  const [scannedCode, setScannedCode] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      alert('Tidak dapat mengakses kamera. Gunakan pencarian manual.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScannedCode("");
  };

  const handleManualBarcode = () => {
    if (!scannedCode.trim()) return;
    
    const product = products.find(p => 
      p.productId.toLowerCase() === scannedCode.trim().toLowerCase()
    );
    
    if (product) {
      onProductFound(product);
      setScannedCode("");
      onClose();
    } else {
      alert('Produk tidak ditemukan!');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualBarcode();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Scan Barcode</h2>
          <button 
            onClick={onClose} 
            className="h-10 w-10 border border-slate-300 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-xl overflow-hidden" style={{ height: '240px' }}>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="text-sm text-slate-600 text-center">
            Arahkan kamera ke barcode atau masukkan SKU manual
          </div>
          
          <div className="flex gap-2">
            <input 
              type="text"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ketik SKU manual..."
              className="flex-1 h-11 px-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              onClick={handleManualBarcode}
              className="h-11 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg shadow-blue-500/25 transition-all"
            >
              Cari
            </button>
          </div>
          
          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
            <strong>Contoh SKU:</strong> SKU-ARAB-250, SKU-TEH-050, SKU-AIR-600
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;