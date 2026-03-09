/** @type {import('next').NextConfig} */
const nextConfig = {
  // All data pages are dynamic (fetch from Supabase at request time)
  experimental: {
    serverComponentsExternalPackages: ['fs'],
  },
}

module.exports = nextConfig
