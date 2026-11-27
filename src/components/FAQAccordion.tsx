"use client";

import React, { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { FAQ_ITEMS } from "@/content";
import type { FAQItem, FAQCategory } from "@/content/types";
import { APPLE_EXIT, APPLE_SPRING_FAST } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export interface FAQAccordionProps {
  items?: FAQItem[];
  category?: FAQCategory | "all";
  allowMultiple?: boolean;
  defaultOpenId?: string | null;
  showCategoryFilter?: boolean;
  limit?: number;
  variant?: "light" | "dark";
  className?: string;
}

const CATEGORIES: { label: string; value: FAQCategory | "all" }[] = [
  { label: "All Questions", value: "all" },
  { label: "General", value: "general" },
  { label: "Pricing & Billing", value: "pricing" },
  { label: "HIPAA & Compliance", value: "compliance" },
  { label: "Placement Process", value: "process" },
];

export function FAQAccordion({
  items = FAQ_ITEMS,
  category = "all",
  allowMultiple = false,
  defaultOpenId = null,
  showCategoryFilter = false,
  limit,
  variant = "light",
  className = "",
}: FAQAccordionProps) {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | "all">(category);
  const reduceMotion = usePrefersReducedMotion();
  const [openIds, setOpenIds] = useState<string[]>(() => {
    if (defaultOpenId) return [defaultOpenId];
    return [];
  });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Filter items by category
  let filteredItems = items;
  if (selectedCategory !== "all") {
    filteredItems = items.filter((item) => item.category === selectedCategory);
  }

  // Apply limit if specified
  if (limit && limit > 0) {
    filteredItems = filteredItems.slice(0, limit);
  }

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      if (allowMultiple) {
        return prev.includes(id) ? prev.filter((openId) => openId !== id) : [...prev, id];
      } else {
        return prev.includes(id) ? [] : [id];
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        const nextIndex = (index + 1) % filteredItems.length;
        buttonRefs.current[nextIndex]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        const prevIndex = (index - 1 + filteredItems.length) % filteredItems.length;
        buttonRefs.current[prevIndex]?.focus();
        break;
      case "Home":
        e.preventDefault();
        buttonRefs.current[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        buttonRefs.current[filteredItems.length - 1]?.focus();
        break;
    }
  };

  return (
    <div className={`w-full ${variant === "dark" ? "home-faq-accordion" : ""} ${className}`}>
      {/* Optional Category Filter Pills */}
      {showCategoryFilter && (
        <div className="flex flex-wrap items-center gap-2 mb-8" role="tablist" aria-label="FAQ Categories">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setOpenIds([]);
                }}
                className={`px-3.5 py-1.5 text-xs font-sans font-medium rounded-[2px] transition-colors ${
                  isSelected
                    ? "bg-charcoal text-white"
                    : "bg-mist text-slate hover:text-charcoal hover:bg-slate-200/60"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Accordion Items List */}
      {filteredItems.length === 0 ? (
        <p className="text-slate text-sm py-6">No questions found in this category.</p>
      ) : (
        <div className="divide-y divide-line border-t border-b border-line">
          {filteredItems.map((item, index) => {
            const isOpen = openIds.includes(item.id);
            const panelId = `faq-panel-${item.id}`;
            const buttonId = `faq-btn-${item.id}`;

            return (
              <div key={item.id} className="py-2">
                <h3>
                  <button
                    ref={(el) => {
                      buttonRefs.current[index] = el;
                    }}
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(item.id)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-full flex items-center justify-between text-left py-4 px-1 group transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal rounded-[2px]"
                  >
                    <span className="font-sans font-semibold text-base sm:text-lg text-charcoal group-hover:text-navy transition-colors pr-6">
                      {item.question}
                    </span>
                    <motion.span
                      className={`w-7 h-7 shrink-0 rounded-[2px] bg-mist flex items-center justify-center text-charcoal ${
                        isOpen ? "bg-sky/30 text-navy" : "group-hover:bg-slate-200/70"
                      }`}
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={reduceMotion ? { duration: 0 } : APPLE_SPRING_FAST}
                      aria-hidden="true"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="overflow-hidden"
                      variants={{
                        hidden: reduceMotion
                          ? { opacity: 0, transition: APPLE_EXIT }
                          : { height: 0, opacity: 0, transition: APPLE_EXIT },
                        visible: reduceMotion
                          ? { opacity: 1, transition: APPLE_SPRING_FAST }
                          : { height: "auto", opacity: 1, transition: APPLE_SPRING_FAST },
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <div className="px-1 pb-4">
                        <p className="text-slate text-sm sm:text-base leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FAQAccordion;
