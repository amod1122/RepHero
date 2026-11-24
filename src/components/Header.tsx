"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { HEADER_NAV_LINKS, HEADER_CTA, BRAND_NAME } from "@/content";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const bookCallHref = HEADER_CTA?.href || "/book-a-call";

  // Auto-close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle Escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Auto-close on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-line">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Left: Brand Wordmark Logo */}
        <a
          href="/"
          className="font-sans font-bold text-xl sm:text-2xl tracking-tight text-charcoal hover:opacity-85 transition-opacity flex items-center"
          aria-label={`${BRAND_NAME} Home`}
        >
          <span>RepHero</span>
          <span className="text-navy">.</span>
        </a>

        {/* Center: Desktop Navigation (>=1024px) */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-7 xl:gap-9">
          {HEADER_NAV_LINKS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm font-sans tracking-normal transition-colors relative py-1 ${
                  isActive
                    ? "font-semibold text-charcoal after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-charcoal"
                    : "font-medium text-slate hover:text-charcoal"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right Desktop: Book a Call CTA */}
        <div className="hidden lg:flex items-center">
          <a
            href={bookCallHref}
            className="inline-flex items-center justify-center bg-charcoal hover:bg-ink text-white text-sm font-medium px-5 py-2.5 rounded-[2px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
          >
            {HEADER_CTA.label}
          </a>
        </div>

        {/* Right Mobile: Book a Call CTA (ALWAYS VISIBLE) + Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-2.5 sm:gap-3">
          <a
            href={bookCallHref}
            className="inline-flex items-center justify-center bg-charcoal hover:bg-ink text-white text-xs sm:text-sm font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-[2px] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
          >
            {HEADER_CTA.label}
          </a>

          <button
            ref={toggleButtonRef}
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-drawer"
            className="w-10 h-10 flex items-center justify-center rounded-[2px] text-charcoal hover:bg-mist transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
          >
            {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (<1024px) */}
      {isOpen && (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation drawer"
          className="lg:hidden fixed inset-x-0 top-16 sm:top-20 bottom-0 z-50 bg-white/98 backdrop-blur-xl border-t border-line overflow-y-auto px-6 py-6 flex flex-col justify-between shadow-2xl"
        >
          <nav aria-label="Mobile menu links" className="flex flex-col divide-y divide-line/60">
            {HEADER_NAV_LINKS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`py-3.5 text-base transition-colors flex items-center justify-between ${
                    isActive
                      ? "font-semibold text-charcoal"
                      : "font-medium text-slate hover:text-charcoal"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-charcoal" />}
                </a>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-line mt-6 flex flex-col gap-3">
            <a
              href={bookCallHref}
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center bg-charcoal hover:bg-ink text-white text-sm font-medium py-3 rounded-[2px] transition-colors"
            >
              {HEADER_CTA.label}
            </a>
            <p className="text-center text-xs text-slate">
              15-min discovery call · HIPAA compliant
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
