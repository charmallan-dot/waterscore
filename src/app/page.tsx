import SearchBar from '@/components/SearchBar';
import ScoreGauge from '@/components/ScoreGauge';
import GradeBar from '@/components/GradeBar';
import Link from 'next/link';
import { getTotalStats, getWorstSystems, getBestSystems } from '@/lib/data';

export default function HomePage() {
  const stats = getTotalStats();
  const worst = getWorstSystems(5);
  const best = getBestSystems(5);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-water-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Know What&apos;s In Your Water
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Free water quality reports for every US zip code. Check contaminants, 
            violations, lead pipe risk, and PFAS levels.
          </p>
          
          <SearchBar size="lg" />
          
          <p className="text-sm text-gray-400 mt-4">
            Try: 90210, Los Angeles, or your own zip code
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-water-700">{stats.totalSystems.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Water Systems</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-water-700">{stats.totalPopulation.toLocaleString()}</div>
              <div className="text-sm text-gray-500">People Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-water-700">{stats.avgScore}</div>
              <div className="text-sm text-gray-500">Average Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-water-700">{stats.states}</div>
              <div className="text-sm text-gray-500">States</div>
            </div>
          </div>
        </div>
      </section>

      {/* Grade Distribution */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Water Quality Distribution
          </h2>
          <GradeBar distribution={stats.gradeDistribution} />
        </div>
      </section>

      {/* Worst & Best */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Worst */}
          <div>
            <h2 className="text-xl font-bold text-red-700 mb-4">⚠️ Worst Water Quality</h2>
            <div className="space-y-3">
              {worst.map(s => (
                <Link 
                  key={s.system_id} 
                  href={`/system/${s.system_id}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-red-300 transition-colors"
                >
                  <ScoreGauge score={s.overall_score} grade={s.grade} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{s.system_name}</div>
                    <div className="text-sm text-gray-500">{s.city}, {s.state}</div>
                    {s.top_concerns[0] && (
                      <div className="text-xs text-red-600 mt-1">{s.top_concerns[0]}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Best */}
          <div>
            <h2 className="text-xl font-bold text-green-700 mb-4">✅ Best Water Quality</h2>
            <div className="space-y-3">
              {best.map(s => (
                <Link 
                  key={s.system_id} 
                  href={`/system/${s.system_id}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                >
                  <ScoreGauge score={s.overall_score} grade={s.grade} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{s.system_name}</div>
                    <div className="text-sm text-gray-500">{s.city}, {s.state} • {s.population_served.toLocaleString()} people</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">How WaterScore Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold text-lg mb-2">We Aggregate Data</h3>
              <p className="text-gray-600 text-sm">
                EPA violations, contaminant levels, lead & copper tests, and infrastructure data from government sources.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">🧮</div>
              <h3 className="font-semibold text-lg mb-2">We Score It</h3>
              <p className="text-gray-600 text-sm">
                Our algorithm weighs violations (40%), contaminant levels (30%), source type, infrastructure, and system size.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">💡</div>
              <h3 className="font-semibold text-lg mb-2">You Act On It</h3>
              <p className="text-gray-600 text-sm">
                Get a clear A-F grade, understand your risks, and see which water filter can help.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
