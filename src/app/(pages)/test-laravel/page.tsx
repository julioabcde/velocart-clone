'use client';

import { useEffect, useState } from 'react';

export default function TestLaravel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/hello')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Laravel API Response</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
