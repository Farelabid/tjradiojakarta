// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getOpinis } from '@/lib/opini';
import { getAll as getAllEvents } from '@/lib/events';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tjradiojakarta.com';

  // Halaman statis
  const staticRoutes = [
    '/',
    '/live',
    '/news',
    '/video',
    '/event',
    '/opini',
    '/traffic',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // Halaman dinamis dari Opini
  const opiniRoutes = getOpinis().map((opini) => ({
    url: `${baseUrl}/opini/${opini.slug}`,
    lastModified: new Date(opini.date).toISOString(),
  }));

  // Halaman dinamis dari Event
  const eventRoutes = getAllEvents().map((event) => ({
    url: `${baseUrl}/event/${event.slug}`,
    lastModified: event.startDate ? new Date(event.startDate).toISOString() : new Date().toISOString(),
  }));

  return [...staticRoutes, ...opiniRoutes, ...eventRoutes];
}