"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { HEADER_NAV_LINKS, HEADER_CTA, BRAND_NAME } from "@/content";
import { APPLE_EXIT, APPLE_SPRING_FAST } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const pathname = usePathname();
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const bookCallHref = HEADER_CTA?.href || "/book-a-call";
  const isHome = pathname === "/";

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

  // Lock body scroll while the drawer is open or animating out
  useEffect(() => {
    if (drawerMounted) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [drawerMounted]);

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
    <header className={`site-header ${isHome ? "site-header--overlay" : ""}`}>
      <div className="site-header__inner">
        
        {/* Left: Brand Wordmark Logo */}
        <a
          href="/"
          className="site-header__brand"
          aria-label={`${BRAND_NAME} Home`}
        >
          <span>RepHero</span>
          <span className="site-header__brand-dot">.</span>
        </a>

        {/* Center: Desktop Navigation (>=1024px) */}
        <nav aria-label="Primary navigation" className="site-header__nav">
          {HEADER_NAV_LINKS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <a
                key={item.href}
                href={item.href}
                className={`site-header__link ${isActive ? "is-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right Desktop: Book a Call CTA */}
        <div className="site-header__desktop-action">
          <a
            href={bookCallHref}
            className="site-header__cta"
          >
            {HEADER_CTA.label}
          </a>
        </div>

        {/* Right Mobile: Book a Call CTA (ALWAYS VISIBLE) + Hamburger Toggle */}
        <div className="site-header__mobile-actions">
          <a
            href={bookCallHref}
            className="site-header__mobile-cta"
          >
            {HEADER_CTA.label}
          </a>

          <button
            ref={toggleButtonRef}
            type="button"
            onClick={() => {
              if (isOpen) {
                setIsOpen(false);
              } else {
                setDrawerMounted(true);
                setIsOpen(true);
              }
            }}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-drawer"
            className="site-header__menu"
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={isOpen ? "close" : "menu"}
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.72, rotate: -8 }
                }
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.72, rotate: 8 }
                }
                transition={reduceMotion ? { duration: 0.15 } : APPLE_SPRING_FAST}
                aria-hidden="true"
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (<1024px) */}
      <AnimatePresence
        initial={false}
        onExitComplete={() => setDrawerMounted(false)}
      >
        {isOpen && (
          <motion.div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation drawer"
            className="site-drawer"
            variants={{
              hidden: {
                opacity: 0,
                y: reduceMotion ? 0 : -10,
                transition: APPLE_EXIT,
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: APPLE_SPRING_FAST,
              },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <nav aria-label="Mobile menu links" className="site-drawer__nav">
              {HEADER_NAV_LINKS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`site-drawer__link ${isActive ? "is-active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="site-drawer__active" />}
                  </a>
                );
              })}
            </nav>

            <div className="site-drawer__footer">
              <a
                href={bookCallHref}
                onClick={() => setIsOpen(false)}
                className="site-drawer__cta"
              >
                {HEADER_CTA.label}
              </a>
              <p className="site-drawer__note">
                15-minute discovery call. HIPAA compliant.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
