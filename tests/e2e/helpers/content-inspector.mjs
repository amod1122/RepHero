/**
 * Content Inspector Helper for RepHero Zero-Hardcoding and Schema Contracts
 */

import fs from 'node:fs';
import path from 'node:path';
import { CONTENT_DIR, PROJECT_ROOT, SRC_DIR, PROHIBITED_WORDS } from '../config.mjs';

export class ContentInspector {
  constructor(contentDir = CONTENT_DIR, srcDir = SRC_DIR, projectRoot = PROJECT_ROOT) {
    this.contentDir = contentDir;
    this.srcDir = srcDir;
    this.projectRoot = projectRoot;
  }

  /**
   * Check if a content file exists
   * @param {string} fileName (e.g. 'siteConfig.ts', 'testimonials.ts')
   * @returns {boolean}
   */
  hasContentFile(fileName) {
    return fs.existsSync(path.join(this.contentDir, fileName));
  }

  /**
   * Read raw content of a file in src/content/
   * @param {string} fileName 
   * @returns {string|null}
   */
  getContentFileRaw(fileName) {
    const fullPath = path.join(this.contentDir, fileName);
    if (!fs.existsSync(fullPath)) return null;
    return fs.readFileSync(fullPath, 'utf-8');
  }

  /**
   * Extract a named exported constant value from a TypeScript file
   * @param {string} fileName 
   * @param {string} exportName 
   * @returns {string|number|null}
   */
  extractExportedConstant(fileName, exportName) {
    const raw = this.getContentFileRaw(fileName);
    if (!raw) return null;

    // export const NAME = value;
    const regex = new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*([^;\\n]+)`, 'm');
    const match = raw.match(regex);
    if (!match) return null;

    const valStr = match[1].trim();
    if (valStr.startsWith('"') || valStr.startsWith("'") || valStr.startsWith('`')) {
      return valStr.slice(1, -1);
    }
    const num = Number(valStr);
    return isNaN(num) ? valStr : num;
  }

  /**
   * Collect all code files in a directory matching extensions
   * @param {string} dir 
   * @param {string[]} extensions 
   * @returns {string[]}
   */
  collectFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
    if (!fs.existsSync(dir)) return [];
    const results = [];

    const walk = (currentDir) => {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== 'out') {
            walk(fullPath);
          }
        } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
          results.push(fullPath);
        }
      }
    };

    walk(dir);
    return results;
  }

  /**
   * Scan component and app source files for prohibited hardcoded terms
   * @param {string[]} prohibitedWords 
   * @returns {Array<{ file: string, line: number, matchedWord: string, preview: string }>}
   */
  scanForProhibitedTerms(prohibitedWords = PROHIBITED_WORDS) {
    const findings = [];
    const targetDirs = [
      path.join(this.srcDir, 'components'),
      path.join(this.srcDir, 'app')
    ];

    const files = [];
    for (const dir of targetDirs) {
      files.push(...this.collectFiles(dir));
    }

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split(/\r?\n/);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Strip single-line comments and JSX comments before checking code
        const codeOnly = line.replace(/\/\/.*$/, '').replace(/\{\/\*.*?\*\/\}/g, '').trim();
        if (!codeOnly) continue;

        for (const word of prohibitedWords) {
          const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          // Match with word boundaries to prevent collision on e.g. "indexes"
          const wordRegex = new RegExp(`\\b${escaped}\\b`, 'i');

          if (wordRegex.test(codeOnly)) {
            findings.push({
              file: path.relative(this.projectRoot, file),
              line: i + 1,
              matchedWord: word,
              preview: line.trim()
            });
          }
        }
      }
    }

    return findings;
  }

  /**
   * Scan component files for hardcoded list prices like $1,499 or $1,999
   * (Prices must come from src/content/services.ts or calculator data)
   * @returns {Array<{ file: string, line: number, match: string }>}
   */
  scanForHardcodedPrices() {
    const findings = [];
    const componentsDir = path.join(this.srcDir, 'components');
    const files = this.collectFiles(componentsDir);
    const priceRegex = /\$\s*1[,.]?(?:499|999|299|799)/g;

    for (const file of files) {
      // Exclude files that might be mock test fixtures if inside tests
      if (file.includes('tests')) continue;
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split(/\r?\n/);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Allow if importing or referencing config/content or pure prop display
        if (priceRegex.test(line) && !line.includes('//') && !line.includes('default') && !line.includes('fallback')) {
          findings.push({
            file: path.relative(this.projectRoot, file),
            line: i + 1,
            match: line.trim()
          });
        }
      }
    }
    return findings;
  }

  /**
   * Read and parse PLACEHOLDERS.md
   * @returns {{ exists: boolean, content: string|null, catalogedItems: string[] }}
   */
  getPlaceholdersCatalog() {
    const placeholdersFile = path.join(this.projectRoot, 'PLACEHOLDERS.md');
    if (!fs.existsSync(placeholdersFile)) {
      return { exists: false, content: null, catalogedItems: [] };
    }

    const content = fs.readFileSync(placeholdersFile, 'utf-8');
    const catalogedItems = [];
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      if (line.includes('|') && !line.includes('---') && !line.includes('Asset / Item')) {
        const cols = line.split('|').map(c => c.trim()).filter(Boolean);
        if (cols.length >= 2) {
          catalogedItems.push(cols[1]); // Asset / Item column
        }
      }
    }

    return {
      exists: true,
      content,
      catalogedItems
    };
  }

  /**
   * Inspect Testimonials content file
   * @returns {{ raw: string|null, has4Banners: boolean, invariantAttributionStrict: boolean, hasApprovalFlag: boolean }}
   */
  inspectTestimonialsContent() {
    const raw = this.getContentFileRaw('testimonials.ts');
    if (!raw) {
      return {
        raw: null,
        has4Banners: false,
        invariantAttributionStrict: false,
        hasApprovalFlag: false
      };
    }

    const hasOdonto = /Odonto Dental/i.test(raw);
    const hasTareen = /Tareen Dental/i.test(raw);
    const hasMyPsych = /MyPsychMD/i.test(raw);
    const hasFastsigns = /FASTSIGNS/i.test(raw);
    const has4Banners = hasOdonto && hasTareen && hasMyPsych && hasFastsigns;

    const hasApprovalFlag = /\bisApproved\s*:\s*(?:true|false|boolean)/.test(raw);
    const invariantAttributionStrict = /Client Feedback/.test(raw);

    return {
      raw,
      has4Banners,
      invariantAttributionStrict,
      hasApprovalFlag
    };
  }
}
