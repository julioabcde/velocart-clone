'use client';

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export default function CartSummary({ subtotal, discount, tax, total }: CartSummaryProps) {
  return (
    <div className="space-y-2 p-4 bg-slate-50 rounded-lg">
      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>Rp {subtotal.toLocaleString('id-ID')}</span>
      </div>
      
      {discount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Discount</span>
          <span>-Rp {discount.toLocaleString('id-ID')}</span>
        </div>
      )}
      
      <div className="flex justify-between text-sm">
        <span>Tax (11%)</span>
        <span>Rp {tax.toLocaleString('id-ID')}</span>
      </div>
      
      <div className="flex justify-between text-lg font-bold pt-2 border-t">
        <span>Total</span>
        <span className="text-blue-600">Rp {total.toLocaleString('id-ID')}</span>
      </div>
    </div>
  );
}   