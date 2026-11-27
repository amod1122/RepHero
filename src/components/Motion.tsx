"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { APPLE_SPRING } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const revealTransition = (delay = 0) => ({
  ...APPLE_SPRING,
  delay,
});

export function Reveal({
  children,
  className = "",
  id,
  delay = 0,
  amount = 0.18,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  amount?: number;
}) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      className={className}
      id={id}
      data-motion="reveal"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={revealTransition(delay)}
    >
      {children}
    </motion.div>
  );
}

export function RevealHeading({
  children,
  className = "",
  id,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.h2
      className={className}
      id={id}
      data-motion="reveal"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={revealTransition(delay)}
    >
      {children}
    </motion.h2>
  );
}

type RevealSectionProps = Omit<
  HTMLMotionProps<"section">,
  "initial" | "whileInView" | "transition"
> & {
  delay?: number;
  amount?: number;
  y?: number;
};

export function RevealSection({
  children,
  delay = 0,
  amount = 0.08,
  y = 14,
  ...props
}: RevealSectionProps) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.section
      {...props}
      data-motion="reveal"
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={revealTransition(delay)}
    >
      {children}
    </motion.section>
  );
}
