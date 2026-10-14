import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
var BASE_URL = 'https://aiameen.online';
function generateSeo() {
    return {
        name: 'generate-seo',
        writeBundle: function () {
            try {
                // Dynamically read course data from built context? Easier: read TS source as text and extract slugs
                var modulesPath = path.resolve(__dirname, 'src/courses/teaming/data/modulesManifest.ts');
                var src = fs.readFileSync(modulesPath, 'utf8');
                var modules = [];
                // Extract module entries: id, slug, lessons array with slugs
                var moduleRegex = /{\s*id:\s*['"]([^'"]+)['"][^}]*slug:\s*['"]([^'"]+)['"][^}]*lessons:\s*\[([\s\S]*?)\]\s*\}/g;
                var m = void 0;
                while ((m = moduleRegex.exec(src)) !== null) {
                    var moduleSlug = m[2];
                    var lessonsBlock = m[3];
                    var lessonRegex = /slug:\s*['"]([^'"]+)['"]/g;
                    var lessons = [];
                    var l = void 0;
                    while ((l = lessonRegex.exec(lessonsBlock)) !== null) {
                        lessons.push(l[1]);
                    }
                    modules.push({ slug: moduleSlug, lessons: lessons });
                }
                var today = new Date().toISOString().split('T')[0];
                var urls = [
                    { loc: "".concat(BASE_URL, "/"), changefreq: 'weekly', priority: '1.0', lastmod: today },
                    { loc: "".concat(BASE_URL, "/privacy.html"), changefreq: 'yearly', priority: '0.3', lastmod: today },
                    { loc: "".concat(BASE_URL, "/terms.html"), changefreq: 'yearly', priority: '0.3', lastmod: today },
                    { loc: "".concat(BASE_URL, "/courses/teaming"), changefreq: 'weekly', priority: '0.9', lastmod: today },
                    { loc: "".concat(BASE_URL, "/courses/teaming/resources"), changefreq: 'monthly', priority: '0.6', lastmod: today },
                    { loc: "".concat(BASE_URL, "/courses/teaming/glossary"), changefreq: 'monthly', priority: '0.6', lastmod: today },
                    { loc: "".concat(BASE_URL, "/courses/teaming/progress"), changefreq: 'monthly', priority: '0.5', lastmod: today },
                    { loc: "".concat(BASE_URL, "/courses/teaming/capstone"), changefreq: 'monthly', priority: '0.6', lastmod: today },
                ];
                for (var _i = 0, modules_1 = modules; _i < modules_1.length; _i++) {
                    var mod = modules_1[_i];
                    urls.push({ loc: "".concat(BASE_URL, "/courses/teaming/modules/").concat(mod.slug), changefreq: 'monthly', priority: '0.7', lastmod: today });
                    for (var _a = 0, _b = mod.lessons; _a < _b.length; _a++) {
                        var ls = _b[_a];
                        urls.push({ loc: "".concat(BASE_URL, "/courses/teaming/lessons/").concat(ls), changefreq: 'monthly', priority: '0.7', lastmod: today });
                    }
                }
                var sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n".concat(urls.map(function (u) { return "  <url>\n    <loc>".concat(u.loc, "</loc>\n    <lastmod>").concat(u.lastmod, "</lastmod>\n    <changefreq>").concat(u.changefreq, "</changefreq>\n    <priority>").concat(u.priority, "</priority>\n  </url>"); }).join('\n'), "\n</urlset>\n");
                var robots = "User-agent: *\nAllow: /\n\nSitemap: ".concat(BASE_URL, "/sitemap.xml\n");
                var distDir = path.resolve(__dirname, 'dist');
                fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), sitemap);
                fs.writeFileSync(path.resolve(distDir, 'robots.txt'), robots);
                console.log('SEO: wrote sitemap.xml and robots.txt to dist/');
            }
            catch (e) {
                console.warn('SEO generation skipped:', e.message);
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
            }
        }
    }
});
