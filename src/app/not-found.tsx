import Link from "next/link";
import { CTA_LABELS } from "@/content";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white text-slate py-20 px-6 md:px-12 flex items-center justify-center">
      <title>Page Not Found (404) | RepHero</title>
      <meta
        name="description"
        content="The page you requested could not be found. Return to RepHero Home or explore our healthcare staffing services."
      />
      <div className="max-w-md w-full mx-auto text-center border border-line rounded-[2px] p-8 md:p-10 bg-white shadow-sm">
        {/* 1. Error Message Section */}
        <section data-section="error-message" id="error-message" className="mb-8">
          <span className="font-serif text-5xl text-charcoal font-normal block mb-2">
            404
          </span>
          <h1 className="font-sans font-medium text-xl text-charcoal mb-3">
            Page Not Found
          </h1>
          <p className="text-sm text-slate leading-relaxed">
            The page you are looking for does not exist or has been moved. Explore our remote healthcare staffing services below.
          </p>
        </section>

        {/* 2. Recovery Links Section */}
        <section data-section="recovery-links" id="recovery-links" className="space-y-3">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center font-medium text-sm px-5 py-2.5 rounded-[2px] bg-charcoal text-white hover:bg-ink transition-colors shadow-sm"
          >
            Return to Home
          </Link>
          <Link
            href="/services"
            className="w-full inline-flex items-center justify-center font-medium text-sm px-5 py-2.5 rounded-[2px] border border-line text-charcoal hover:bg-mist transition-colors"
          >
            Explore Healthcare Roles
          </Link>
          <Link
            href="/book-a-call"
            className="w-full inline-flex items-center justify-center font-medium text-sm px-5 py-2.5 rounded-[2px] bg-navy text-white hover:bg-navy/90 transition-colors shadow-sm"
          >
            {CTA_LABELS.primary}
          </Link>
        </section>
      </div>
    </main>
  );
}
