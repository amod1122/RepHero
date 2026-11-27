"use client"

import React from "react"
import Link from "next/link"
import { motion, type MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

const MotionLink = motion.create(Link)

const animationProps: MotionProps = {
  initial: { "--x": "100%", scale: 1 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
}

interface ShinyButtonProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps>,
    MotionProps {
  children: React.ReactNode
  className?: string
  href?: string
  type?: "button" | "submit" | "reset"
}

export const ShinyButton = React.forwardRef<
  HTMLElement,
  ShinyButtonProps
>(({ children, className, href, type = "button", ...props }, ref) => {
  const buttonClassName = cn(
    "relative cursor-pointer rounded-lg border px-6 py-2 font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,var(--primary)/10%_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_var(--primary)/10%)]",
    className
  )
  const content = (
    <>
      <span
        className="relative z-20 block size-full text-sm tracking-wide text-[rgb(0,0,0,65%)] uppercase dark:font-light dark:text-[rgb(255,255,255,90%)]"
      >
        {children}
      </span>
      <span
        style={{
          mask: "linear-gradient(#000, #000) content-box exclude, linear-gradient(#000, #000)",
          WebkitMask:
            "linear-gradient(#000, #000) content-box exclude, linear-gradient(#000, #000)",
          backgroundImage:
            "linear-gradient(115deg, transparent 25%, color-mix(in srgb, var(--primary) 82%, white) 50%, transparent 75%)",
          backgroundPosition: "var(--x) 0",
          backgroundSize: "200% 100%",
        }}
        className="pointer-events-none absolute inset-0 z-10 block rounded-[inherit] p-px opacity-90"
      />
    </>
  )

  if (href) {
    return (
      <MotionLink
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={buttonClassName}
        {...animationProps}
        {...props}
      >
        {content}
      </MotionLink>
    )
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={buttonClassName}
      {...animationProps}
      {...props}
    >
      {content}
    </motion.button>
  )
})

ShinyButton.displayName = "ShinyButton"
