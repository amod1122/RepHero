import type { MetadataRoute } from 'next';
import { SEO_METADATA } from '@/content';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return Object.values(SEO_METADATA)
    .filter((meta) => meta.inSitemap)
    .map((meta) => ({
      url: meta.canonical,
      lastModified,
      changeFrequency: meta.changeFrequency,
      priority: meta.priority,
    }));
}
