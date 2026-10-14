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
        // Dynamically read course data from built context? Easier: read TS source as text and extract slugs
        const modulesPath = path.resolve(__dirname, 'src/courses/teaming/data/modulesManifest.ts')
        const src = fs.readFileSync(modulesPath, 'utf8')

        const modules = []
        // Extract module entries: id, slug, lessons array with slugs
        const moduleRegex = /{\s*id:\s*['"]([^'"]+)['"][^}]*slug:\s*['"]([^'"]+)['"][^}]*lessons:\s*\[([\s\S]*?)\]\s*\}/g
        let m
        while ((m = moduleRegex.exec(src)) !== null) {
          const moduleSlug = m[2]
          const lessonsBlock = m[3]
          const lessonRegex = /slug:\s*['"]([^'"]+)['"]/g
          const lessons = []
          let l
          while ((l = lessonRegex.exec(lessonsBlock)) !== null) {
            lessons.push(l[1])
          }
          modules.push({ slug: moduleSlug, lessons })
        }

        const today = new Date().toISOString().split('T')[0]
        const urls = [
          { loc: `${BASE_URL}/`, changefreq: 'weekly', priority: '1.0', lastmod: today },
          { loc: `${BASE_URL}/privacy.html`, changefreq: 'yearly', priority: '0.3', lastmod: today },
          { loc: `${BASE_URL}/terms.html`, changefreq: 'yearly', priority: '0.3', lastmod: today },
          { loc: `${BASE_URL}/courses/teaming`, changefreq: 'weekly', priority: '0.9', lastmod: today },
          { loc: `${BASE_URL}/courses/teaming/resources`, changefreq: 'monthly', priority: '0.6', lastmod: today },
          { loc: `${BASE_URL}/courses/teaming/glossary`, changefreq: 'monthly', priority: '0.6', lastmod: today },
          { loc: `${BASE_URL}/courses/teaming/progress`, changefreq: 'monthly', priority: '0.5', lastmod: today },
          { loc: `${BASE_URL}/courses/teaming/capstone`, changefreq: 'monthly', priority: '0.6', lastmod: today },
        ]

        for (const mod of modules) {
          urls.push({ loc: `${BASE_URL}/courses/teaming/modules/${mod.slug}`, changefreq: 'monthly', priority: '0.7', lastmod: today })
          for (const ls of mod.lessons) {
            urls.push({ loc: `${BASE_URL}/courses/teaming/lessons/${ls}`, changefreq: 'monthly', priority: '0.7', lastmod: today })
          }
        }

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
        console.warn('SEO generation skipped:', e.message)
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
      }
    }
  }
})
