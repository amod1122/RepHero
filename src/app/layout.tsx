import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { COMPANY_NAME, DOMAIN, TAGLINE, CONTACT_INFO, SOCIAL_LINKS } from "@/content";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rephero.co"),
  title: {
    default: "RepHero — Trained Remote Healthcare Staffing",
    template: "%s | RepHero",
  },
  description:
    "RepHero places trained, HIPAA-compliant remote professionals into US healthcare practices. Front desk, medical billing, clinical support, and after-hours coverage.",
  openGraph: {
    title: "RepHero — Trained Remote Healthcare Staffing",
    description:
      "Trained remote professionals for healthcare practices. 50-60% savings, HIPAA-compliant with signed BAA on every engagement.",
    url: "https://www.rephero.co",
    siteName: "RepHero",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_NAME,
    url: `https://${DOMAIN}`,
    logo: `https://${DOMAIN}/logo.jpg`,
    description: TAGLINE,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT_INFO.phone,
      contactType: "customer service",
      email: CONTACT_INFO.email,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "100 Pine Street, Suite 1250",
      addressLocality: "San Francisco",
      addressRegion: "CA",
      postalCode: "94111",
      addressCountry: "US",
    },
    sameAs: [
      SOCIAL_LINKS.linkedin,
    ],
  };

  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <noscript>
          <style>{`[data-motion="reveal"] { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <SmoothCursor />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-charcoal focus:text-white focus:rounded-[2px] focus:shadow-md"
        >
          Skip to main content
        </a>
        <Header />
        <div id="main-content" className="flex-1 w-full">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
