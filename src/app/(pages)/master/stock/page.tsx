'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MasterStock() {
  const router = useRouter();
  return (
    <div>
      <h1>MASTER STOCK</h1>

      <button className='btn--soft' onClick={() => router.push('/master/stock/create')}>
        CREATE
      </button>
    </div>
  );
}
