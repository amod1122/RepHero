/**
 * Lightweight Zero-Dependency HTML Parser for Static Export Validation
 */

export class HtmlParser {
  /**
   * Strip HTML tags to get plain visible text
   * @param {string} html 
   * @returns {string}
   */
  static extractText(html) {
    if (!html || typeof html !== 'string') return '';
    return html
      .replace(/<script\b[\s\S]*?<\/script>/gi, '')
      .replace(/<style\b[\s\S]*?<\/style>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '') // Strip React SSR comments first without inserting whitespace
      .replace(/<[^<>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Check if text or regex is present in the HTML (or plain text)
   * @param {string} html 
   * @param {string|RegExp} pattern 
   * @returns {boolean}
   */
  static hasText(html, pattern) {
    if (!html || typeof html !== 'string') return false;
    if (pattern instanceof RegExp) {
      return pattern.test(html) || pattern.test(this.extractText(html));
    }
    return html.includes(pattern) || this.extractText(html).toLowerCase().includes(pattern.toLowerCase());
  }

  /**
   * Extract title tag
   * @param {string} html 
   * @returns {string|null}
   */
  static extractTitle(html) {
    if (!html || typeof html !== 'string') return null;
    const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return match ? match[1].trim() : null;
  }

  /**
   * Extract all meta tags with name/property and content
   * @param {string} html 
   * @returns {Array<{ name?: string, property?: string, content: string }>}
   */
  static extractMetaTags(html) {
    if (!html || typeof html !== 'string') return [];
    const results = [];
    const metaRegex = /<meta\s+([^>]+)>/gi;
    let match;

    while ((match = metaRegex.exec(html)) !== null) {
      const attrsStr = match[1];
      const nameMatch = attrsStr.match(/name=["']([^"']+)["']/i);
      const propMatch = attrsStr.match(/property=["']([^"']+)["']/i);
      const contentMatch = attrsStr.match(/content=["']([^"']*)["']/i);

      if (contentMatch) {
        results.push({
          name: nameMatch ? nameMatch[1] : undefined,
          property: propMatch ? propMatch[1] : undefined,
          content: contentMatch[1]
        });
      }
    }
    return results;
  }

  /**
   * Extract OpenGraph meta tags as a key-value map
   * @param {string} html 
   * @returns {Record<string, string>}
   */
  static extractOpenGraph(html) {
    if (!html || typeof html !== 'string') return {};
    const metaTags = this.extractMetaTags(html);
    const og = {};
    for (const tag of metaTags) {
      if (tag.property && tag.property.startsWith('og:')) {
        og[tag.property] = tag.content;
      }
    }
    return og;
  }

  /**
   * Extract canonical link href
   * @param {string} html 
   * @returns {string|null}
   */
  static extractCanonical(html) {
    if (!html || typeof html !== 'string') return null;
    const match = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
      || html.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
    return match ? match[1] : null;
  }

  /**
   * Extract all JSON-LD scripts and parse their JSON content
   * @param {string} html 
   * @returns {Array<object>}
   */
  static extractJsonLd(html) {
    if (!html || typeof html !== 'string') return [];
    const scripts = [];
    const scriptRegex = /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;

    while ((match = scriptRegex.exec(html)) !== null) {
      const rawJson = match[1].trim();
      try {
        const parsed = JSON.parse(rawJson);
        scripts.push(parsed);
      } catch (err) {
        scripts.push({ __parseError: err.message, raw: rawJson });
      }
    }
    return scripts;
  }

  /**
   * Extract HTML landmarks (header, nav, main, footer)
   * @param {string} html 
   * @returns {{ hasHeader: boolean, hasNav: boolean, hasMain: boolean, hasFooter: boolean, headerHtml: string|null, footerHtml: string|null }}
   */
  static extractLandmarks(html) {
    if (!html || typeof html !== 'string') {
      return { hasHeader: false, hasNav: false, hasMain: false, hasFooter: false, headerHtml: null, footerHtml: null };
    }
    const headerMatch = html.match(/<header\b[^>]*>([\s\S]*?)<\/header>/i);
    const footerMatch = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/i);
    const hasNav = /<nav\b[^>]*>/i.test(html);
    const hasMain = /<main\b[^>]*>/i.test(html);

    return {
      hasHeader: !!headerMatch,
      hasNav,
      hasMain,
      hasFooter: !!footerMatch,
      headerHtml: headerMatch ? headerMatch[0] : null,
      footerHtml: footerMatch ? footerMatch[0] : null
    };
  }

  /**
   * Extract links from a given HTML block or full document
   * @param {string} html 
   * @returns {Array<{ href: string, text: string, html: string }>}
   */
  static extractLinks(html) {
    if (!html || typeof html !== 'string') return [];
    const links = [];
    const linkRegex = /<a\s+([^>]*?)>([\s\S]*?)<\/a>/gi;
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      const attrs = match[1];
      const body = match[2];
      const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
      if (hrefMatch) {
        links.push({
          href: hrefMatch[1],
          text: this.extractText(body),
          html: match[0]
        });
      }
    }
    return links;
  }

  /**
   * Extract sequential sections from HTML.
   * Matches <section> elements or elements with data-section, id, or role="region".
   * @param {string} html 
   * @returns {Array<{ index: number, id?: string, dataSection?: string, classList: string[], headingText?: string }>}
   */
  static extractSections(html) {
    if (!html || typeof html !== 'string') return [];
    const sections = [];
    
    // Scan all <section> tags regardless of attributes
    const generalSectionRegex = /<section\b([^>]*)>([\s\S]*?)<\/section>/gi;
    let match;
    let index = 0;

    while ((match = generalSectionRegex.exec(html)) !== null) {
      const attrs = match[1];
      const content = match[2];

      const idMatch = attrs.match(/id=["']([^"']+)["']/i);
      const dataSectionMatch = attrs.match(/data-section=["']([^"']+)["']/i);
      const classMatch = attrs.match(/class=["']([^"']+)["']/i);
      const headingMatch = content.match(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/i);

      sections.push({
        index: index++,
        id: idMatch ? idMatch[1] : undefined,
        dataSection: dataSectionMatch ? dataSectionMatch[1] : undefined,
        classList: classMatch ? classMatch[1].split(/\s+/) : [],
        headingText: headingMatch ? this.extractText(headingMatch[1]) : undefined,
        rawAttrs: attrs
      });
    }

    return sections;
  }

  /**
   * Extract forms and inputs
   * @param {string} html 
   * @returns {Array<{ action?: string, method?: string, inputs: Array<{ name: string, type: string, required: boolean, id?: string }> }>}
   */
  static extractForms(html) {
    if (!html || typeof html !== 'string') return [];
    const forms = [];
    const formRegex = /<form\b([^>]*)>([\s\S]*?)<\/form>/gi;
    let match;

    while ((match = formRegex.exec(html)) !== null) {
      const formAttrs = match[1];
      const formContent = match[2];

      const inputs = [];
      const inputRegex = /<(input|textarea|select)\b([^>]*)>/gi;
      let inputMatch;

      while ((inputMatch = inputRegex.exec(formContent)) !== null) {
        const tag = inputMatch[1];
        const attrs = inputMatch[2];

        const nameMatch = attrs.match(/name=["']([^"']+)["']/i);
        const typeMatch = attrs.match(/type=["']([^"']+)["']/i);
        const idMatch = attrs.match(/id=["']([^"']+)["']/i);
        const isRequired = /\brequired\b/i.test(attrs);

        inputs.push({
          tag,
          name: nameMatch ? nameMatch[1] : '',
          type: typeMatch ? typeMatch[1] : (tag === 'textarea' ? 'textarea' : (tag === 'select' ? 'select' : 'text')),
          id: idMatch ? idMatch[1] : undefined,
          required: isRequired,
          rawAttrs: attrs
        });
      }

      forms.push({
        rawAttrs: formAttrs,
        inputs
      });
    }

    return forms;
  }
}
