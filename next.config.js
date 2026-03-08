/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow reading data files at build time
  experimental: {
    serverComponentsExternalPackages: ['fs'],
  },
}

module.exports = nextConfig
