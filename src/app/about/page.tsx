import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About WaterScore — How We Score Water Quality',
  description: 'Learn how WaterScore calculates water quality grades using EPA data, contaminant levels, and violation history.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About WaterScore</h1>

      <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
        <p>
          WaterScore makes public water quality data accessible and understandable. 
          We aggregate data from the EPA, USGS, and state agencies to give every 
          US water system a simple A-F grade.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">How Scoring Works</h2>
        <p>Each water system receives a score from 0-100 based on five factors:</p>

        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">Violation History</div>
              <div className="text-sm text-gray-500">Health-based violations, recency, severity</div>
            </div>
            <div className="text-2xl font-bold text-water-600">40%</div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">Contaminant Levels</div>
              <div className="text-sm text-gray-500">Lead, copper, and other measured contaminants vs EPA limits</div>
            </div>
            <div className="text-2xl font-bold text-water-600">30%</div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">Water Source</div>
              <div className="text-sm text-gray-500">Groundwater vs surface water</div>
            </div>
            <div className="text-2xl font-bold text-water-600">10%</div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">Infrastructure</div>
              <div className="text-sm text-gray-500">System age and maintenance proxy</div>
            </div>
            <div className="text-2xl font-bold text-water-600">10%</div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">System Size</div>
              <div className="text-sm text-gray-500">Larger systems have more oversight and resources</div>
            </div>
            <div className="text-2xl font-bold text-water-600">10%</div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">Grade Scale</h2>
        <div className="grid grid-cols-5 gap-3 text-center">
          {[
            { grade: 'A', range: '90-100', color: 'bg-green-100 text-green-800', label: 'Excellent' },
            { grade: 'B', range: '80-89', color: 'bg-lime-100 text-lime-800', label: 'Good' },
            { grade: 'C', range: '70-79', color: 'bg-yellow-100 text-yellow-800', label: 'Fair' },
            { grade: 'D', range: '60-69', color: 'bg-orange-100 text-orange-800', label: 'Poor' },
            { grade: 'F', range: '0-59', color: 'bg-red-100 text-red-800', label: 'Failing' },
          ].map(({ grade, range, color, label }) => (
            <div key={grade} className={`${color} rounded-lg p-3`}>
              <div className="text-3xl font-bold">{grade}</div>
              <div className="text-sm font-medium">{label}</div>
              <div className="text-xs opacity-75">{range}</div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">Data Sources</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>EPA SDWIS</strong> — Safe Drinking Water Information System (violations, water systems)</li>
          <li><strong>EPA LCR</strong> — Lead and Copper Rule sample results</li>
          <li><strong>EPA Envirofacts</strong> — Superfund sites, toxic releases</li>
          <li><strong>USGS</strong> — Real-time water quality monitoring</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">Disclaimer</h2>
        <p className="text-sm text-gray-500">
          WaterScore provides information for educational purposes only. We aggregate publicly available 
          government data and apply our own scoring methodology. Always consult your local water utility 
          for the most current and official water quality reports (Consumer Confidence Reports).
        </p>
      </div>
    </div>
  );
}
