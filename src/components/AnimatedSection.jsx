"use client";

/**
 * AnimatedSection — Scroll-reveal wrapper using IntersectionObserver
 * Fades + slides content in from below when it enters the viewport.
 * Usage: <AnimatedSection delay={200}><YourContent /></AnimatedSection>
 */

import { useEffect, useRef, useState } from "react";

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up", // "up" | "left" | "right" | "none"
  threshold = 0.12,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el); // Only animate once
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const getTransform = () => {
    if (visible) return "translate3d(0,0,0)";
    switch (direction) {
      case "up":    return "translate3d(0, 40px, 0)";
      case "left":  return "translate3d(-40px, 0, 0)";
      case "right": return "translate3d(40px, 0, 0)";
      default:      return "translate3d(0, 0, 0)";
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
