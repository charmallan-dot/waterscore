import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import ScoreGauge from '@/components/ScoreGauge';
import { searchSystems } from '@/lib/data';
import type { Metadata } from 'next';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" Water Quality Results — WaterScore` : 'Search Water Quality — WaterScore',
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q || '';
  const results = query ? await searchSystems(query, 50) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Water Quality</h1>
      <SearchBar size="lg" />
      {query && (
        <p className="text-sm text-gray-500 mt-4 mb-6">
          {results.length} results for &quot;{query}&quot;
        </p>
      )}
      {results.length > 0 && (
        <div className="space-y-3 mt-6">
          {results.map(s => (
            <Link key={s.system_id} href={`/system/${s.system_id}`}
              className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-water-300 hover:shadow-sm transition-all">
              <ScoreGauge score={s.overall_score} grade={s.grade} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">{s.system_name}</div>
                <div className="text-sm text-gray-500">{s.city}, {s.state} • {s.population_served?.toLocaleString()} people</div>
                {s.top_concerns?.[0] && <div className="text-xs text-red-600 mt-1">{s.top_concerns[0]}</div>}
              </div>
              <div className="text-sm text-gray-400">→</div>
            </Link>
          ))}
        </div>
      )}
      {query && results.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>No results found for &quot;{query}&quot;</p>
          <p className="text-sm mt-1">Try a different zip code or city name</p>
        </div>
      )}
    </div>
  );
}
