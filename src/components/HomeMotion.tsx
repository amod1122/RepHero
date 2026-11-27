"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { HowItWorksStep } from "@/content/types";
import Beams from "@/components/Beams";
import { Reveal, RevealHeading } from "@/components/Motion";
import { APPLE_SPRING } from "@/lib/motion";

export { Reveal, RevealHeading } from "@/components/Motion";

export function HeroTitle({ children }: { children: string }) {
  const words = children.split(" ");

  return (
    <motion.h1
      className="home-hero__title"
      aria-label={children}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.075,
            delayChildren: 0.12,
          },
        },
      }}
    >
      {words.map((word, index) => (
        <span className="home-hero__word" aria-hidden="true" key={`${word}-${index}`}>
          <motion.span
            data-motion="reveal"
            variants={{
              hidden: { opacity: 0, y: "0.42em", rotate: 1.5 },
              visible: {
                opacity: 1,
                y: 0,
                rotate: 0,
                transition: APPLE_SPRING,
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}

export function HeroBeams() {
  const beamsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: beamsRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 72]);
  const opacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 1, 0.58]);

  return (
    <motion.div
      ref={beamsRef}
      className="home-hero__beams"
      style={{ y, opacity }}
      aria-hidden="true"
    >
      <Beams
        color="#85c5fd"
        beamWidth={140}
        rotation={30}
        speed={1}
        glow={0.6}
      />
    </motion.div>
  );
}

function ProcessStep({
  step,
  index,
}: {
  step: HowItWorksStep;
  index: number;
}) {
  return (
    <Reveal className="home-process__step" amount={0.28}>
      <span className="home-process__number">
        {String(step.step).padStart(2, "0")}
      </span>
      <div className="home-process__step-copy">
        <h3>{step.title}</h3>
        <p className="home-process__subtitle">{step.subtitle}</p>
      </div>
      <div className="home-process__step-detail">
        <p>{step.description}</p>
        {step.deliverable ? (
          <p className="home-process__deliverable">
            <span>What you receive</span>
            {step.deliverable}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}

export function ProcessJourney({ steps }: { steps: HowItWorksStep[] }) {
  return (
    <div className="home-process__journey">
      <aside className="home-process__rail" aria-label="Engagement progress">
        <p>Six steps from first call to daily coverage.</p>
        <ol>
          {steps.map((step) => (
            <li key={step.step}>
              <span>{String(step.step).padStart(2, "0")}</span>
              {step.title}
            </li>
          ))}
        </ol>
      </aside>

      <div className="home-process__steps">
        {steps.map((step, index) => (
          <ProcessStep step={step} index={index} key={step.step} />
        ))}
      </div>
    </div>
  );
}
