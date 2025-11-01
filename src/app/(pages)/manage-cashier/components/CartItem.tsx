'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { Product } from '@/models/Product';

export interface CartItemData {
  product: Product;
  quantity: number;
  discount: number;
}

interface CartItemProps {
  item: CartItemData;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const { product, quantity, discount } = item;
  const subtotal = (product.sellingPrice || 0) * quantity - discount;

  return (
    <div className="flex items-center gap-3 p-3 border-b hover:bg-slate-50">
      {/* Product Info */}
      <div className="flex-1">
        <div className="font-medium text-sm">{product.productName}</div>
        <div className="text-xs text-slate-500">{product.productId}</div>
        <div className="text-sm font-semibold text-green-600 mt-1">
          Rp {product.sellingPrice?.toLocaleString('id-ID')}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onQuantityChange(product.productId, quantity - 1)}
          className="p-1 rounded hover:bg-slate-200"
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </button>
        
        <input
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(product.productId, parseInt(e.target.value) || 1)}
          className="w-16 text-center border rounded px-2 py-1 text-sm"
          min="1"
        />
        
        <button
          onClick={() => onQuantityChange(product.productId, quantity + 1)}
          className="p-1 rounded hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Subtotal & Remove */}
      <div className="text-right">
        <div className="font-semibold text-sm">
          Rp {subtotal.toLocaleString('id-ID')}
        </div>
        {discount > 0 && (
          <div className="text-xs text-green-600">-Rp {discount.toLocaleString('id-ID')}</div>
        )}
      </div>

      <button
        onClick={() => onRemove(product.productId)}
        className="p-2 text-rose-600 hover:bg-rose-50 rounded"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}