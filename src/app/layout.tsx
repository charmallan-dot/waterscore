import type { Metadata } from 'next';
import '../styles/globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'WaterScore — Know What\'s In Your Water',
  description: 'Free water quality reports for every US zip code. Check contaminants, violations, lead pipe risk, and PFAS levels. Data from EPA.',
  openGraph: {
    title: 'WaterScore — Know What\'s In Your Water',
    description: 'Free water quality intelligence for any US address. Powered by EPA data.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Nav */}
        <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-water-700">
              💧 WaterScore
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/search?q=" className="text-gray-600 hover:text-water-600 transition-colors">
                Search
              </Link>
              <Link href="/worst" className="text-gray-600 hover:text-water-600 transition-colors">
                Worst Water
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-water-600 transition-colors">
                About
              </Link>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-100 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
            <p>💧 WaterScore — Free water quality intelligence for every US address</p>
            <p className="mt-1">
              Data from <a href="https://www.epa.gov/enviro/sdwis-search" className="underline hover:text-water-600">EPA SDWIS</a> • 
              Updated daily • Open source
            </p>
            <p className="mt-1 text-xs text-gray-400">
              WaterScore provides information for educational purposes. Always consult your local water utility for official reports.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
