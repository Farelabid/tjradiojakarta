'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// ID Google Analytics Anda
const GA_MEASUREMENT_ID = 'G-913X6XFVQ3';

declare global {
  interface Window {
    gtag: (command: string, id: string, config?: Record<string, unknown>) => void;
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Fungsi ini akan dipanggil setiap kali pathname atau searchParams berubah
    const url = pathname + searchParams.toString();
    
    // Pastikan gtag sudah ada di window (dimuat oleh layout.tsx)
    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  // Komponen ini tidak me-render apapun
  return null;
}