'use client';

import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function NewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center py-12">
      <div className="card-gradient rounded-xl p-8 max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Gagal Memuat Berita</h3>
        <p className="text-white/70 mb-4">
          Terjadi kesalahan saat memuat berita. Silakan coba lagi.
        </p>
        <button
          onClick={() => reset()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
