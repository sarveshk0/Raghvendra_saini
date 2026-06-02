"use client";

/**
 * QuoteMarquee — Auto-scrolling political quotes ticker
 * Smooth infinite loop, pauses on hover, BJP saffron styling.
 */

import { useRef, useEffect } from "react";

const QUOTES = [
  { text: "सबका साथ, सबका विकास, सबका विश्वास", author: "नरेंद्र मोदी" },
  { text: "राष्ट्र सर्वोपरि — भारत माता की जय!", author: "राष्ट्रीय स्वयंसेवक संघ" },
  { text: "एक भारत, श्रेष्ठ भारत — डिजिटल सशक्त भारत", author: "राघवेन्द्र सैनी" },
  { text: "जिसने देश के लिए सर्वस्व त्यागा, वही सच्चा देशभक्त है।", author: "डॉ. श्यामाप्रसाद मुखर्जी" },
  { text: "योगी जी के नेतृत्व में UP बन रहा है — Uttar Pradesh = Uttam Pradesh", author: "BJP UP" },
  { text: "Every youth of India is capable of leading the nation into a digital future.", author: "Raghvendra Saini" },
  { text: "Digital governance is not a luxury — it is the new form of democracy.", author: "Campaign Portal" },
];

export default function QuoteMarquee({ lang = "hi" }) {
  const trackRef = useRef(null);
  const isPaused = useRef(false);
  const posRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Clone children for seamless loop
    const clone = track.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.parentElement.appendChild(clone);

    const speed = 0.5; // px per frame

    const animate = () => {
      if (!isPaused.current) {
        posRef.current -= speed;
        const totalWidth = track.scrollWidth;
        if (Math.abs(posRef.current) >= totalWidth) {
          posRef.current = 0;
        }
        track.parentElement.style.transform = `translateX(${posRef.current}px)`;
        clone.parentElement && (clone.parentElement.style.transform = `translateX(${posRef.current}px)`);
        if (track.parentElement) {
          track.parentElement.style.transform = `translateX(${posRef.current}px)`;
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (clone.parentElement) clone.parentElement.removeChild(clone);
    };
  }, []);

  return (
    <div
      className="relative overflow-hidden bg-gradient-to-r from-[#1a1a18] via-[#2a1a00] to-[#1a1a18] border-y border-[#EF9F27]/30 py-3 select-none"
      onMouseEnter={() => (isPaused.current = true)}
      onMouseLeave={() => (isPaused.current = false)}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#1a1a18] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#1a1a18] to-transparent z-10 pointer-events-none" />

      <div className="flex whitespace-nowrap" style={{ willChange: "transform" }}>
        <div ref={trackRef} className="flex items-center gap-0 shrink-0">
          {QUOTES.map((q, i) => (
            <div key={i} className="flex items-center gap-3 px-8">
              <span className="text-[#EF9F27] text-lg leading-none">❝</span>
              <span className="text-white/90 text-sm font-medium">
                {q.text}
              </span>
              <span className="text-[#EF9F27]/70 text-xs font-bold">— {q.author}</span>
              <span className="text-[#EF9F27]/30 mx-4 text-lg">◆</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
