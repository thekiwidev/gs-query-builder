"use client";

import React from "react";

/**
 * Animation and transition utilities for the search interface
 * Provides reusable animation patterns with smooth timing
 */

export interface AnimationConfig {
  duration: "fast" | "base" | "slow";
  delay?: number;
  easing?: "ease-in" | "ease-out" | "ease-in-out" | "linear";
}

// Duration mappings for animations
export const ANIMATION_DURATIONS = {
  fast: "150ms",
  base: "200ms",
  slow: "300ms",
} as const;

// Easing functions
export const ANIMATION_EASING = {
  "ease-in": "ease-in",
  "ease-out": "ease-out",
  "ease-in-out": "ease-in-out",
  linear: "linear",
} as const;

/**
 * Generate CSS transition style string
 */
export function generateTransition(
  property: string = "all",
  config: AnimationConfig = { duration: "base" }
): string {
  const duration = ANIMATION_DURATIONS[config.duration] || "200ms";
  const easing =
    ANIMATION_EASING[config.easing || "ease-in-out"] || "ease-in-out";
  const delay = config.delay ? `${config.delay}ms` : "0s";

  return `${property} ${duration} ${easing} ${delay}`;
}

/**
 * Tailwind class builder for animations
 */
export function getAnimationClasses(
  type: "fade" | "slide" | "scale" | "bounce",
  config: AnimationConfig = { duration: "base" }
): string {
  const durationClass = `duration-${
    config.duration === "fast"
      ? "150"
      : config.duration === "slow"
      ? "300"
      : "200"
  }`;
  const easingClass = `ease-${config.easing || "in-out"}`;

  const animationMap = {
    fade: `animate-fade-in ${durationClass} ${easingClass}`,
    slide: `animate-slide-in ${durationClass} ${easingClass}`,
    scale: `transition-transform ${durationClass} ${easingClass}`,
    bounce: `animate-bounce ${durationClass} ${easingClass}`,
  };

  return animationMap[type] || "";
}

interface StaggerContainerProps {
  children: React.ReactNode;
  delay?: number;
  staggerBy?: number;
}

/**
 * Container that staggering children animations
 */
export function StaggerContainer({
  children,
  delay = 50,
  staggerBy = 0,
}: StaggerContainerProps) {
  return (
    <div style={{ "--stagger-delay": `${delay}ms` } as React.CSSProperties}>
      {React.Children.map(children, (child, index) => (
        <div style={{ animationDelay: `${staggerBy + index * delay}ms` }}>
          {child}
        </div>
      ))}
    </div>
  );
}

interface FadeInProps {
  children: React.ReactNode;
  config?: AnimationConfig;
}

/**
 * Fade in animation wrapper
 */
export function FadeIn({
  children,
  config = { duration: "base" },
}: FadeInProps) {
  const animationClass = getAnimationClasses("fade", config);

  return <div className={animationClass}>{children}</div>;
}

interface SlideInProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  config?: AnimationConfig;
}

/**
 * Slide in animation wrapper
 */
export function SlideIn({
  children,
  direction = "up",
  config = { duration: "base" },
}: SlideInProps) {
  const animationClass = getAnimationClasses("slide", config);
  const directionClass = `slide-in-from-${
    direction === "up"
      ? "top"
      : direction === "down"
      ? "bottom"
      : direction === "left"
      ? "left"
      : "right"
  }-${
    config.duration === "fast" ? "1" : config.duration === "slow" ? "3" : "2"
  }`;

  return (
    <div className={`${animationClass} animate-in ${directionClass}`}>
      {children}
    </div>
  );
}

/**
 * Smooth transition for when content changes
 */
export function SmoothTransition({
  children,
  key,
  className = "",
}: {
  children: React.ReactNode;
  key?: string | number;
  className?: string;
}) {
  return (
    <div
      key={key}
      className={`transition-all duration-200 ease-in-out ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Hover scale effect
 */
export function HoverScale({
  children,
  scale = 1.05,
  className = "",
}: {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}) {
  return (
    <div
      className={`transition-transform duration-200 ease-in-out hover:scale-${
        scale === 1.05 ? "105" : scale === 1.1 ? "110" : "100"
      } ${className}`}
    >
      {children}
    </div>
  );
}
