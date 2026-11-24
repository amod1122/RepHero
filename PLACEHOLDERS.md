# RepHero Missing Assets and Content Placeholders Tracker

This document catalogs all 20 brand assets, copy items, client logos, and legal sign-offs tracked for the RepHero marketing website (`www.rephero.co`).

Automated build check: `node scripts/check-placeholders.mjs` checks this file during build to warn against unverified placeholders before production release.

---

## Placeholder Items Inventory

| ID | Asset / Item | Status | Notes |
|:---|:---|:---|:---|
| 1 | RepHero Logo, Black Wordmark | Received (low resolution) | Received as 200x200px PNG. Vector SVG or high-resolution PNG required before launch. |
| 2 | RepHero Logo, White Version | Needed | Needed for dark hero and footer backgrounds. Can be recolored from vector SVG. |
| 3 | RepHero Brand Colors and Guidelines | Needed | Neutral palette (Ink #090E12, Charcoal #131D25, Deep Navy #0F3554, Mist #F7F8FA, Sky #C6DDF5, Peach #FFE3D1, Slate #4A5560, Line #E3E6EA) used until supplied. |
| 4 | RepHero Brand Fonts | Needed | Instrument Serif (headings) and Inter (body/UI) via next/font/google used until official brand fonts supplied. |
| 5 | Favicon and Social Share Image (OG Image) | To create | To create after logo and colors are final. Must be generated for /public/favicon.ico and /public/og-image.jpg. |
| 6 | Odonto Dental Logo | Needed | Logo file and written permission to display client mark needed from client. |
| 7 | Tareen Dental Logo | Needed | Logo file and written permission to display client mark needed from client. |
| 8 | MyPsychMD Logo | Needed | Logo file and written permission to display client mark needed from client. |
| 9 | FASTSIGNS Logo | Needed | Logo file and written permission to display client mark needed from client. |
| 10 | Testimonial 1 Attribution (Dental Front Desk / Odonto Dental) | Received | Testimonial quote received. Attribution unconfirmed; 'Rapido Global' corrected to 'RepHero Global'. Strictly display as 'Client Feedback' until written attribution approval obtained. |
| 11 | Testimonials 2 to 4 Quotes (Tareen Dental, MyPsychMD, FASTSIGNS) | Needed | Draft copy provided in design guidelines; pending written client approval. Banners must remain hidden via isApproved: false flag until approved. |
| 12 | Client Photos or Headshots for Testimonials | Optional | Client photos or physician headshots only to be included if written consent granted. |
| 13 | Real Company Contact Details (Email, Phone, Location) | Placeholder | Real corporate email, phone number, and physical office location required before public launch. |
| 14 | LinkedIn About Text and Company Facts | Needed | LinkedIn profile text could not be extracted automatically. Needed for company background on About page. |
| 15 | About Page Content, Team Photos and Executive Bios | Needed | Founder/leadership photos and bios optional depending on RepHero preference. |
| 16 | Hero and Section Imagery | To source | Licensed healthcare-appropriate photography and modern UI-style graphics. No generic headset cliches. |
| 17 | Industry Icons (6) and Service Icons (9) | To source | Consistent 24px line-icon set (Lucide-React) across all 6 industries and 9 roles. |
| 18 | Compliance Statement Wording (HIPAA, BAA) | Needed | Draft text provided; formal legal review and approval required from RepHero counsel before launch. |
| 19 | Privacy Policy and Terms of Use Text | To draft | Draft text prepared covering non-collection of PHI and calculation disclaimer; requires legal counsel review. |
| 20 | Aculis Reference Screenshots | Received | Received full-page reference screenshot; used as structural and aesthetic design baseline. |

---

## Launch Verification Rules
1. Any public release to production must review this tracker.
2. In development builds, `node scripts/check-placeholders.mjs` emits a prominent warning banner and exits with code 0.
3. In strict mode (`node scripts/check-placeholders.mjs --strict`), the build aborts with exit code 1 if any open item has status Needed, Placeholder, Pending, To create, To draft, or To source.
