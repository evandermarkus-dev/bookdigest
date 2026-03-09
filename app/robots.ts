import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/login', '/books/', '/sv/books/'],
      disallow: ['/dashboard', '/settings', '/api/', '/s/'],
    },
    sitemap: 'https://bookdigest.se/sitemap.xml',
  }
}
