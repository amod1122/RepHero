export * from "./PlaceholderBadge";
export * from "./Header";
export * from "./Footer";
export * from "./TrustStrip";
export * from "./FAQAccordion";
export * from "./RoleCard";
export * from "./IndustryCard";
export * from "./SuccessStoryBanner";
export * from "./SavingsCalculator";
export * from "./BookCallForm";

declare global {
  interface SuccessStoryBannerProps {
    testimonial: import("@/content/types").TestimonialBanner;
    previewMode?: boolean;
    className?: string;
  }
}
