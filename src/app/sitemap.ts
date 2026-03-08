import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://waterscore.app', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://waterscore.app/search', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: 'https://waterscore.app/worst', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: 'https://waterscore.app/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];
}
