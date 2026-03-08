'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const q = query.trim();
    // If it looks like a zip code
    if (/^\d{5}$/.test(q)) {
      router.push(`/zip/${q}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const isLarge = size === 'lg';

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className={`flex ${isLarge ? 'gap-3' : 'gap-2'}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter zip code or city name..."
          className={`flex-1 rounded-xl border-2 border-water-200 bg-white focus:border-water-500 focus:ring-2 focus:ring-water-200 outline-none transition-all ${
            isLarge ? 'px-6 py-4 text-lg' : 'px-4 py-2 text-base'
          }`}
        />
        <button
          type="submit"
          className={`bg-water-600 hover:bg-water-700 text-white font-semibold rounded-xl transition-colors ${
            isLarge ? 'px-8 py-4 text-lg' : 'px-5 py-2 text-base'
          }`}
        >
          Check Water
        </button>
      </div>
    </form>
  );
}
