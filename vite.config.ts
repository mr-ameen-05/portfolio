import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://aiameen.online'

function generateSeo() {
  return {
    name: 'generate-seo',
    writeBundle() {
      try {
        const today = new Date().toISOString().split('T')[0]
        const urls = [
          { loc: `${BASE_URL}/`, changefreq: 'weekly', priority: '1.0', lastmod: today },
          { loc: `${BASE_URL}/#projects`, changefreq: 'weekly', priority: '0.8', lastmod: today },
          { loc: `${BASE_URL}/#field-notes`, changefreq: 'weekly', priority: '0.8', lastmod: today },
          { loc: `${BASE_URL}/#journey`, changefreq: 'monthly', priority: '0.7', lastmod: today },
          { loc: `${BASE_URL}/#community`, changefreq: 'monthly', priority: '0.7', lastmod: today },
          { loc: `${BASE_URL}/#about`, changefreq: 'monthly', priority: '0.6', lastmod: today },
          { loc: `${BASE_URL}/privacy.html`, changefreq: 'yearly', priority: '0.3', lastmod: today },
          { loc: `${BASE_URL}/terms.html`, changefreq: 'yearly', priority: '0.3', lastmod: today },
          { loc: `${BASE_URL}/llms.txt`, changefreq: 'monthly', priority: '0.5', lastmod: today },
        ]

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`
        const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`

        const distDir = path.resolve(__dirname, 'dist')
        fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), sitemap)
        fs.writeFileSync(path.resolve(distDir, 'robots.txt'), robots)
        console.log('SEO: wrote sitemap.xml and robots.txt to dist/')
      } catch (e) {
        console.warn('SEO generation skipped:', (e as Error)?.message)
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), generateSeo()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
})
