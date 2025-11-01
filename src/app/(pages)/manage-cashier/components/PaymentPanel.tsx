'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';

interface PaymentPanelProps {
  total: number;
  onPaymentComplete: (amountPaid: number, paymentMethod: string) => void;
}

export default function PaymentPanel({ total, onPaymentComplete }: PaymentPanelProps) {
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'card'>('cash');

  const change = amountPaid - total;
  const quickAmounts = [10000, 20000, 50000, 100000, 200000];

  const handlePayment = () => {
    if (amountPaid < total) {
      alert('Insufficient payment amount');
      return;
    }
    onPaymentComplete(amountPaid, paymentMethod);
  };

  return (
    <div className="space-y-4">
      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium mb-2">Payment Method</label>
        <div className="grid grid-cols-3 gap-2">
          {(['cash', 'qris', 'card'] as const).map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`py-2 rounded-lg text-sm font-medium ${
                paymentMethod === method
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {method.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Amount Paid */}
      <div>
        <label className="block text-sm font-medium mb-2">Amount Paid</label>
        <input
          type="number"
          value={amountPaid || ''}
          onChange={(e) => setAmountPaid(parseInt(e.target.value) || 0)}
          className="w-full px-4 py-2 border rounded-lg text-lg font-semibold"
          placeholder="0"
        />
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => setAmountPaid((prev) => prev + amount)}
            className="py-2 bg-slate-100 rounded text-sm hover:bg-slate-200"
          >
            +{(amount / 1000).toFixed(0)}K
          </button>
        ))}
        <button
          onClick={() => setAmountPaid(total)}
          className="py-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
        >
          Exact
        </button>
      </div>

      {/* Change */}
      {amountPaid >= total && (
        <div className="p-3 bg-yellow-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Change</span>
            <span className="text-lg font-bold text-yellow-700">
              Rp {change.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      )}

      {/* Process Payment Button */}
      <button
        onClick={handlePayment}
        disabled={amountPaid < total}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <CreditCard className="h-5 w-5" />
        Process Payment
      </button>
    </div>
  );
}