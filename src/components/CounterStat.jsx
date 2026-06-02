"use client";

/**
 * CounterStat — Animated number counter
 * Counts from 0 to `target` when the element enters viewport.
 * Supports suffixes like "+" or "K+"
 *
 * Usage: <CounterStat target={20} suffix="+" label="Years Experience" />
 */

import { useEffect, useRef, useState } from "react";

export default function CounterStat({ target, suffix = "", prefix = "", label, valueClass = "", labelClass = "" }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  // Parse numeric target from strings like "20+" → 20
  const numericTarget = parseInt(String(target).replace(/\D/g, ""), 10) || 0;
  const extractedSuffix = suffix || (String(target).match(/[^\d]+$/) || [""])[0];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let startTime = null;
    const duration = 1800; // ms

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(easeOut(progress) * numericTarget));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(numericTarget);
      }
    };

    requestAnimationFrame(step);
  }, [started, numericTarget]);

  return (
    <div ref={ref} className="text-center">
      <div className={`text-3xl font-black tabular-nums ${valueClass}`}>
        {prefix}{count}{extractedSuffix}
      </div>
      {label && <div className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${labelClass}`}>{label}</div>}
    </div>
  );
}
