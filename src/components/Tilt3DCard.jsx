"use client";

/**
 * Tilt3DCard — Mouse-tracking 3D perspective tilt card wrapper
 * No external dependencies. Pure CSS transforms driven by mouse position.
 *
 * Usage: <Tilt3DCard className="..." intensity={12}><YourCard /></Tilt3DCard>
 */

import { useRef, useCallback } from "react";

export default function Tilt3DCard({
  children,
  className = "",
  intensity = 10,
  glare = true,
  style = {},
}) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);

  const handleMouseMove = useCallback(
    (e) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * intensity;
      const rotateX = -((y - centerY) / centerY) * intensity;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = "transform 0.08s linear";

      if (glare && glareRef.current) {
        const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
        glareRef.current.style.opacity = "0.18";
        glareRef.current.style.transform = `rotate(${angle}deg)`;
      }
    },
    [intensity, glare]
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    card.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";

    if (glare && glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
  }, [glare]);

  return (
    <div
      ref={cardRef}
      className={className}
      style={{ transformStyle: "preserve-3d", ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glare overlay */}
      {glare && (
        <div
          ref={glareRef}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 60%)",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 10,
            transition: "opacity 0.3s ease",
          }}
        />
      )}
      {children}
    </div>
  );
}
