import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const BASE_URL = 'https://aiameen.online'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function generateSeo() {
  return {
    name: 'generate-seo',
    writeBundle() {
      try {
        const modulesPath = path.resolve(__dirname, 'src/courses/teaming/data/modulesManifest.ts')
        const src = fs.readFileSync(modulesPath, 'utf8')
        const modules = []
        const importRe = /import\s+\{\s*MODULE_(\d+)\s*\}\s+from\s+['"]\.\/modules\/module\1['"]/g
        const moduleIndices = []
        let im
        while ((im = importRe.exec(src)) !== null) {
          moduleIndices.push(parseInt(im[1]))
        }
        moduleIndices.sort((a, b) => a - b)
        for (const idx of moduleIndices) {
          const mpath = path.resolve(__dirname, `src/courses/teaming/data/modules/module${idx}.ts`)
          const msrc = fs.readFileSync(mpath, 'utf8')
          const slugMatch = msrc.match(/slug:\s*['"]([^'"]+)['"]/)
          const lessonsArrMatch = msrc.match(/lessons:\s*\[([\s\S]*?)\]\s*,/)
          if (lessonsArrMatch) {
            const arr = lessonsArrMatch[1]
            const lsr = /slug:\s*['"]([^'"]+)['"]/g
            let x
            const list = []
            while ((x = lsr.exec(arr)) !== null) {
              list.push(x[1])
            }
            modules.push({ slug: slugMatch ? slugMatch[1] : `module${idx}`, lessons: list })
          } else {
            modules.push({ slug: slugMatch ? slugMatch[1] : `module${idx}`, lessons: [] })
          }
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
${urls
          .map(
            (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
          )
          .join('\n')}
</urlset>
`
        const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`
        const distDir = path.resolve(__dirname, 'dist')
        fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), sitemap)
        fs.writeFileSync(path.resolve(distDir, 'robots.txt'), robots)
      } catch (e) {
        console.warn('SEO generation skipped')
      }
    }
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), generateSeo()]
})
