/**
 * Route Crawler Helper for RepHero Static Export & Sitemap Validation
 */

import fs from 'node:fs';
import path from 'node:path';
import { EXPORT_DIR, PROJECT_ROOT, SRC_DIR, ROUTES } from '../config.mjs';

export class RouteCrawler {
  constructor(exportDir = EXPORT_DIR, projectRoot = PROJECT_ROOT) {
    this.exportDir = exportDir;
    this.projectRoot = projectRoot;
  }

  /**
   * Check if the static export directory `out/` exists
   * @returns {boolean}
   */
  isExportPresent() {
    return fs.existsSync(this.exportDir) && fs.statSync(this.exportDir).isDirectory();
  }

  /**
   * Locate the static HTML file for a given route
   * @param {string} routePath (e.g. '/', '/services', '/not-found')
   * @returns {string|null} absolute path to the HTML file or null
   */
  getExportFilePath(routePath) {
    if (!this.isExportPresent()) return null;

    const routeConfig = ROUTES.find(r => r.path === routePath);
    const candidates = [];

    if (routeConfig) {
      if (routeConfig.exportFile) candidates.push(path.join(this.exportDir, routeConfig.exportFile));
      if (routeConfig.altExportFile) candidates.push(path.join(this.exportDir, routeConfig.altExportFile));
    }

    const clean = routePath.replace(/^\//, '');
    if (clean === '') {
      candidates.push(path.join(this.exportDir, 'index.html'));
    } else {
      candidates.push(path.join(this.exportDir, clean, 'index.html'));
      candidates.push(path.join(this.exportDir, `${clean}.html`));
    }

    if (routePath === '/not-found' || routePath === '/404') {
      candidates.push(path.join(this.exportDir, '404.html'));
      candidates.push(path.join(this.exportDir, 'not-found.html'));
      candidates.push(path.join(this.exportDir, 'not-found', 'index.html'));
    }

    for (const file of candidates) {
      if (fs.existsSync(file)) {
        return file;
      }
    }
    return null;
  }

  /**
   * Check if a route has been exported to HTML
   * @param {string} routePath 
   * @returns {boolean}
   */
  hasPageExport(routePath) {
    return this.getExportFilePath(routePath) !== null;
  }

  /**
   * Read HTML contents of an exported route
   * @param {string} routePath 
   * @returns {string|null}
   */
  getPageHtml(routePath) {
    const filePath = this.getExportFilePath(routePath);
    if (!filePath) return null;
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Recursively crawl out/ and collect all HTML files
   * @returns {string[]} array of relative paths from out/
   */
  getAllExportedHtmlFiles() {
    if (!this.isExportPresent()) return [];

    const results = [];
    const walk = (dir, base = '') => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = base ? `${base}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          walk(fullPath, relPath);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
          results.push(relPath);
        }
      }
    };

    walk(this.exportDir);
    return results;
  }

  /**
   * Read sitemap.xml content from out/sitemap.xml or public/sitemap.xml
   * @returns {{ content: string, sourcePath: string }|null}
   */
  getSitemapXml() {
    const candidatePaths = [
      path.join(this.exportDir, 'sitemap.xml'),
      path.join(this.projectRoot, 'public', 'sitemap.xml'),
      path.join(this.projectRoot, 'src', 'app', 'sitemap.xml')
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        return { content: fs.readFileSync(p, 'utf-8'), sourcePath: p };
      }
    }
    return null;
  }

  /**
   * Extract all <loc> URLs from sitemap.xml
   * @returns {string[]}
   */
  extractSitemapUrls() {
    const sitemap = this.getSitemapXml();
    if (!sitemap) return [];

    const urls = [];
    const locRegex = /<loc>([^<]+)<\/loc>/gi;
    let match;
    while ((match = locRegex.exec(sitemap.content)) !== null) {
      urls.push(match[1].trim());
    }
    return urls;
  }

  /**
   * Read robots.txt content from out/robots.txt or public/robots.txt
   * @returns {{ content: string, sourcePath: string }|null}
   */
  getRobotsTxt() {
    const candidatePaths = [
      path.join(this.exportDir, 'robots.txt'),
      path.join(this.projectRoot, 'public', 'robots.txt')
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        return { content: fs.readFileSync(p, 'utf-8'), sourcePath: p };
      }
    }
    return null;
  }

  /**
   * Parse robots.txt lines into directives
   * @returns {{ userAgents: string[], allows: string[], disallows: string[], sitemaps: string[] }}
   */
  parseRobotsTxt() {
    const robots = this.getRobotsTxt();
    if (!robots) {
      return { userAgents: [], allows: [], disallows: [], sitemaps: [] };
    }

    const lines = robots.content.split(/\r?\n/);
    const userAgents = [];
    const allows = [];
    const disallows = [];
    const sitemaps = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;

      const [key, ...valParts] = line.split(':');
      const val = valParts.join(':').trim();
      const lowerKey = key.trim().toLowerCase();

      if (lowerKey === 'user-agent') userAgents.push(val);
      else if (lowerKey === 'allow') allows.push(val);
      else if (lowerKey === 'disallow') disallows.push(val);
      else if (lowerKey === 'sitemap') sitemaps.push(val);
    }

    return { userAgents, allows, disallows, sitemaps };
  }

  /**
   * Check if a source page exists under src/app/
   * @param {string} routePath 
   * @returns {string|null}
   */
  getSourcePagePath(routePath) {
    const appDir = path.join(SRC_DIR, 'app');
    const clean = routePath.replace(/^\//, '');

    const candidates = [];
    if (clean === '') {
      candidates.push(path.join(appDir, 'page.tsx'));
      candidates.push(path.join(appDir, 'page.jsx'));
    } else if (clean === 'not-found' || clean === '404') {
      candidates.push(path.join(appDir, 'not-found.tsx'));
      candidates.push(path.join(appDir, 'not-found.jsx'));
    } else {
      candidates.push(path.join(appDir, clean, 'page.tsx'));
      candidates.push(path.join(appDir, clean, 'page.jsx'));
    }

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) return candidate;
    }
    return null;
  }
}
