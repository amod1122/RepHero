import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { skipIfNoExport } from '../helpers/assertions.mjs';

const crawler = new RouteCrawler();

describe('F9: Dedicated Our Team Route', () => {
  test('team content is removed from the homepage', (t) => {
    if (skipIfNoExport(t, '/')) return;

    const html = crawler.getPageHtml('/');
    assert.ok(html, 'Home page HTML must exist');
    assert.ok(
      !HtmlParser.hasText(html, /People behind the practice/i),
      'Homepage must not contain the team section',
    );
    assert.ok(
      !HtmlParser.hasText(html, /Maya Chen/i),
      'Homepage must not contain team profiles',
    );
  });

  test('Our Team page contains the team section and profiles', (t) => {
    if (skipIfNoExport(t, '/our-team')) return;

    const html = crawler.getPageHtml('/our-team');
    assert.ok(html, 'Our Team page HTML must exist');
    assert.ok(
      HtmlParser.hasText(html, /People behind the practice/i),
      'Our Team page must contain the team heading',
    );
    assert.ok(
      HtmlParser.hasText(html, /Asad Naeem/i) &&
        HtmlParser.hasText(html, /Founder, President & Board Member/i),
      'Our Team page must contain the founder and president profile',
    );
    assert.ok(
      HtmlParser.hasText(html, /Sarah Sheikh/i) &&
        HtmlParser.hasText(html, /Chief Executive Officer/i),
      'Our Team page must contain the chief executive officer profile',
    );
    assert.ok(
      HtmlParser.hasText(html, /Book a Call/i),
      'Our Team page must contain a booking CTA',
    );
  });
});
