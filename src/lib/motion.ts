export const APPLE_SPRING = {
  type: "spring",
  bounce: 0,
  duration: 0.4,
} as const;

export const APPLE_SPRING_FAST = {
  type: "spring",
  bounce: 0,
  duration: 0.3,
} as const;

export const APPLE_EXIT = {
  duration: 0.2,
  ease: [0.4, 0, 1, 1],
} as const;
