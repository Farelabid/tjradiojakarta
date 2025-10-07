// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://tjradiojakarta.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'], // Melarang crawler mengakses direktori API
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}