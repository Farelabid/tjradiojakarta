import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-white/10">
      <div className="mx-auto max-w-5xl px-4 py-8 pb-[calc(env(safe-area-inset-bottom)+110px)]">
        <div className="text-sm text-white/70">© {year} TJRadio Jakarta. All rights reserved.</div>
      </div>
    </footer>
  );
}