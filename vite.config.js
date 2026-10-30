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
        writeBundle: function () {
            try {
                var today = new Date().toISOString().split('T')[0];
                var urls = [
                    { loc: "".concat(BASE_URL, "/"), changefreq: 'weekly', priority: '1.0', lastmod: today },
                    { loc: "".concat(BASE_URL, "/#projects"), changefreq: 'weekly', priority: '0.8', lastmod: today },
                    { loc: "".concat(BASE_URL, "/#field-notes"), changefreq: 'weekly', priority: '0.8', lastmod: today },
                    { loc: "".concat(BASE_URL, "/#journey"), changefreq: 'monthly', priority: '0.7', lastmod: today },
                    { loc: "".concat(BASE_URL, "/#community"), changefreq: 'monthly', priority: '0.7', lastmod: today },
                    { loc: "".concat(BASE_URL, "/#about"), changefreq: 'monthly', priority: '0.6', lastmod: today },
                    { loc: "".concat(BASE_URL, "/privacy.html"), changefreq: 'yearly', priority: '0.3', lastmod: today },
                    { loc: "".concat(BASE_URL, "/terms.html"), changefreq: 'yearly', priority: '0.3', lastmod: today },
                ];
                var sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n".concat(urls.map(function (u) { return "  <url>\n    <loc>".concat(u.loc, "</loc>\n    <lastmod>").concat(u.lastmod, "</lastmod>\n    <changefreq>").concat(u.changefreq, "</changefreq>\n    <priority>").concat(u.priority, "</priority>\n  </url>"); }).join('\n'), "\n</urlset>\n");
                var robots = "User-agent: *\nAllow: /\n\nSitemap: ".concat(BASE_URL, "/sitemap.xml\n");
                var distDir = path.resolve(__dirname, 'dist');
                fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), sitemap);
                fs.writeFileSync(path.resolve(distDir, 'robots.txt'), robots);
                console.log('SEO: wrote sitemap.xml and robots.txt to dist/');
            }
            catch (e) {
                console.warn('SEO generation skipped:', e === null || e === void 0 ? void 0 : e.message);
            }
        }
    };
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
});
