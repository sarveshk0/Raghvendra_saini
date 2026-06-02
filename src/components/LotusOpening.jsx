"use client";

import { useEffect, useState, useRef } from "react";

export default function LotusOpening({ onReveal }) {
  const [showIntro, setShowIntro] = useState(false);
  const [bloomProgress, setBloomProgress] = useState(0); // 0 to 1
  const [introFinished, setIntroFinished] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false); // Curtains split & flower splits
  const [scrollY, setScrollY] = useState(0);
  const [svgContent, setSvgContent] = useState("");
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const prevTimeRef = useRef(null);
  const particlesRef = useRef([]);

  // Fetch structured BJP Logo SVG on mount for high-performance inline animation
  useEffect(() => {
    fetch("/BJP Logo.svg")
      .then((res) => res.text())
      .then((data) => {
        // Strip XML declarations and inject an ID for targeting
        const cleanSvg = data
          .replace(/<\?xml[^>]*\?>/gi, "")
          .replace(/<!DOCTYPE[^>]*>/gi, "")
          .replace(/<svg/, '<svg id="BJP-Logo-SVG"');
        setSvgContent(cleanSvg);
      })
      .catch((err) => console.error("Error loading BJP Logo SVG:", err));
  }, []);

  // 1. Always play the intro on first mount/refresh
  useEffect(() => {
    setShowIntro(true);
    // Start the auto-bloom sequence
    setTimeout(() => {
      setBloomProgress(0.2);
    }, 400);
    setTimeout(() => {
      setBloomProgress(0.65);
    }, 1800);
    setTimeout(() => {
      setBloomProgress(0.9);
    }, 3200);
    setTimeout(() => {
      setBloomProgress(1);
    }, 4000);
    // Trigger splitting transition 1.2s before intro finishes
    setTimeout(() => {
      setIsSplitting(true);
    }, 4800);
    setTimeout(() => {
      setIntroFinished(true);
      if (onReveal) onReveal();
    }, 6000);
  }, [onReveal]);

  // 2. Scroll tracking for floating background
  useEffect(() => {
    if (!introFinished) return;
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [introFinished]);

  // 3. Canvas Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      constructor(x, y, isIntro) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * (isIntro ? 7 : 3.5) + 1.5;
        this.speedX = (Math.random() - 0.5) * (isIntro ? 5 : 1.2);
        this.speedY = -Math.random() * (isIntro ? 4 : 2) - 1;
        this.opacity = 1;
        this.color = `rgba(255, ${160 + Math.floor(Math.random() * 95)}, 51, `;
        this.decay = Math.random() * 0.012 + 0.006;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= this.decay;
        if (this.opacity < 0) this.opacity = 0;
      }
      draw(c) {
        c.save();
        c.shadowBlur = this.size * 2.5;
        c.shadowColor = "rgba(255, 153, 51, 0.75)";
        c.fillStyle = this.color + this.opacity + ")";
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    const animate = (time) => {
      if (prevTimeRef.current !== undefined) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Emit particles
        if (showIntro && !introFinished && bloomProgress > 0.1) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const count = bloomProgress === 1 ? 1 : Math.floor(Math.random() * 4) + 1;
          for (let i = 0; i < count; i++) {
            particlesRef.current.push(new Particle(centerX, centerY, true));
          }
        }

        // Update and draw particles
        particlesRef.current = particlesRef.current.filter(p => p.opacity > 0);
        particlesRef.current.forEach(p => {
          p.update();
          p.draw(ctx);
        });
      }
      prevTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [showIntro, introFinished, bloomProgress, scrollY]);

  const handleManualReplay = () => {
    setShowIntro(true);
    setIntroFinished(false);
    setIsSplitting(false);
    setBloomProgress(0);
    // Restart animation flow
    setTimeout(() => {
      setBloomProgress(0.2);
    }, 100);
    setTimeout(() => {
      setBloomProgress(0.65);
    }, 1500);
    setTimeout(() => {
      setBloomProgress(0.9);
    }, 2800);
    setTimeout(() => {
      setBloomProgress(1);
    }, 3600);
    setTimeout(() => {
      setIsSplitting(true);
    }, 4400);
    setTimeout(() => {
      setIntroFinished(true);
      if (onReveal) onReveal();
    }, 5600);
  };

  const ReplayButton = () => (
    <button 
      onClick={handleManualReplay} 
      className="fixed bottom-6 left-6 z-50 text-[10px] uppercase font-bold tracking-widest bg-white/70 hover:bg-white text-[#5F5E5A] border border-[#e5e3dc] py-1.5 px-3 rounded-lg shadow-sm backdrop-blur transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
    >
      <span>🌸</span> {introFinished ? "Replay Intro" : "Blooming..."}
    </button>
  );

  // 4. Intro Overlay (Blooming Animation on lotus_premium.svg)
  if (showIntro && !introFinished) {
    let rotX = 72; 
    let rotY = 10;
    let rotZ = -45;
    let scaleVal = 0.01;
    let blurVal = 6;
    let opacityVal = 0.1;

    if (bloomProgress > 0.1) {
      rotX = 72 - (72 - 0) * bloomProgress; // Tilts upright
      rotY = 10 - (10 - 0) * bloomProgress;
      rotZ = -45 - (-45 - 0) * bloomProgress; // Aligns straight
      scaleVal = 0.01 + (1 - 0.01) * bloomProgress; // Scales up to full size
      blurVal = 6 - (6 - 0) * bloomProgress; // Sharpens focus
      opacityVal = 0.1 + (1 - 0.1) * bloomProgress; // Fades in completely
    }

    return (
      <div className="fixed inset-0 z-[100] bg-transparent flex flex-col items-center justify-center overflow-hidden preserve-3d pointer-events-none">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

        {/* Theatrical Curtain Left door */}
        <div 
          className={`absolute inset-y-0 left-0 w-1/2 bg-[#1a1a18] z-0 transition-transform duration-[1200ms] ease-in-out`}
          style={{
            transform: isSplitting ? "translate3d(-100%, 0, 0)" : "translate3d(0, 0, 0)",
          }}
        />
        
        {/* Theatrical Curtain Right door */}
        <div 
          className={`absolute inset-y-0 right-0 w-1/2 bg-[#1a1a18] z-0 transition-transform duration-[1200ms] ease-in-out`}
          style={{
            transform: isSplitting ? "translate3d(100%, 0, 0)" : "translate3d(0, 0, 0)",
          }}
        />

        {/* Ambient Saffron Radial Glow behind the custom SVG */}
        <div 
          className="absolute w-[24rem] h-[24rem] sm:w-[36rem] sm:h-[36rem] rounded-full bg-gradient-to-tr from-[#EF9F27]/25 to-[#BA7517]/10 blur-[90px] -z-10 transition-all duration-[4s]" 
          style={{ transform: `scale(${0.25 + bloomProgress * 0.75})`, opacity: isSplitting ? 0 : bloomProgress }}
        />

        {/* Inline CSS animation styles for structured BJP Logo SVG groups */}
        <style>{`
          #BJP-Logo-SVG {
            width: 100%;
            height: 100%;
          }
          #lotus-center, #petal-layer-1, #petal-layer-2, #petal-layer-3, #petal-layer-4, #stem, #leaves {
            transform-origin: 140px 170px;
            transition: transform 3.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 3s ease-out;
          }
          
          /* Closed Bud State */
          .lotus-bud #petal-layer-1 { transform: scale(0.25); opacity: 0; }
          .lotus-bud #petal-layer-2 { transform: scale(0.2) rotate(15deg); opacity: 0; }
          .lotus-bud #petal-layer-3 { transform: scale(0.1) rotate(-15deg); opacity: 0; }
          .lotus-bud #petal-layer-4 { transform: scale(0.05) rotate(20deg); opacity: 0; }
          .lotus-bud #leaves { transform: scale(0.4); opacity: 0; }
          .lotus-bud #stem { transform: scale(0.5) translateY(20px); opacity: 0; }
          .lotus-bud #lotus-center { transform: scale(0.3); opacity: 0; }

          /* Open/Bloomed State */
          .lotus-bloom #petal-layer-1 { transform: scale(1) rotate(0deg); opacity: 1; transition-delay: 0.2s; }
          .lotus-bloom #petal-layer-2 { transform: scale(1) rotate(0deg); opacity: 1; transition-delay: 0.6s; }
          .lotus-bloom #petal-layer-3 { transform: scale(1) rotate(0deg); opacity: 1; transition-delay: 1.1s; }
          .lotus-bloom #petal-layer-4 { transform: scale(1) rotate(0deg); opacity: 1; transition-delay: 1.6s; }
          .lotus-bloom #leaves { transform: scale(1); opacity: 1; transition-delay: 0.8s; }
          .lotus-bloom #stem { transform: scale(1) translateY(0px); opacity: 1; transition-delay: 0.4s; }
          .lotus-bloom #lotus-center { transform: scale(1); opacity: 1; transition-delay: 0s; }
        `}</style>

        {/* 3D Viewport wrapper */}
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center perspective-[900px] preserve-3d z-10 select-none">
          
          {/* Flower Left (travels left to become the left floating flower) */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-all duration-[1200ms] cubic-bezier(0.25, 0.8, 0.25, 1) preserve-3d"
            style={{
              transform: isSplitting 
                ? "translate3d(calc(-50vw + 60px), 0, 0) rotateY(-30deg) rotateZ(-15deg) scale(0.68)" 
                : `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scaleVal})`,
              filter: `blur(${isSplitting ? 0 : blurVal}px) drop-shadow(0 15px 45px rgba(255, 153, 51, ${isSplitting ? 0.25 : 0.2 + bloomProgress * 0.5}))`,
              opacity: isSplitting ? 0.35 : opacityVal,
            }}
          >
            {svgContent ? (
              <div 
                className={`w-full h-full flex items-center justify-center ${bloomProgress === 0 ? "lotus-bud" : "lotus-bloom"}`}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : (
              <img 
                src="/BJP Logo.svg" 
                alt="BJP Logo" 
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Flower Right (travels right to become the right floating flower) */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-all duration-[1200ms] cubic-bezier(0.25, 0.8, 0.25, 1) preserve-3d"
            style={{
              transform: isSplitting 
                ? "translate3d(calc(50vw - 60px), 0, 0) rotateY(30deg) rotateZ(15deg) scale(0.68)" 
                : `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scaleVal})`,
              filter: `blur(${isSplitting ? 0 : blurVal}px) drop-shadow(0 15px 45px rgba(255, 153, 51, ${isSplitting ? 0.25 : 0.2 + bloomProgress * 0.5}))`,
              opacity: isSplitting ? 0.35 : opacityVal,
            }}
          >
            {svgContent ? (
              <div 
                className={`w-full h-full flex items-center justify-center ${bloomProgress === 0 ? "lotus-bud" : "lotus-bloom"}`}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : (
              <img 
                src="/BJP Logo.svg" 
                alt="BJP Logo" 
                className="w-full h-full object-contain"
              />
            )}
          </div>

        </div>

        {/* Text Fade-in */}
        <div className="absolute bottom-16 z-20 text-center select-none transition-opacity duration-500" style={{ opacity: isSplitting ? 0 : 1 }}>
          <h2 
            className="text-white text-base sm:text-lg tracking-widest font-black uppercase transition-all duration-[3s]"
            style={{ 
              opacity: Math.max(0, (bloomProgress - 0.2) * 1.25),
              transform: `translateY(${(1 - bloomProgress) * 20}px)`
            }}
          >
            शुभ आगमनम् 🙏
          </h2>
          <p 
            className="text-[#EF9F27] text-[11px] font-bold uppercase tracking-[0.2em] mt-3 transition-all duration-[3.5s]"
            style={{ 
              opacity: Math.max(0, (bloomProgress - 0.4) * 1.6),
              transform: `translateY(${(1 - bloomProgress) * 10}px)`
            }}
          >
            Raghvendra Saini Campaign Portal
          </p>
        </div>
        <ReplayButton />
      </div>
    );
  }

  // 5. Floating Background Element
  if (introFinished) {
    // Ambient floating sway only (no scroll-based translation):
    const time = typeof window !== "undefined" ? window.performance.now() : 0;
    
    // Right side sway
    const swayX = Math.sin(time / 2200) * 10;
    const swayY = Math.cos(time / 1800) * 6;
    const rot = Math.sin(time / 3000) * 5;

    // Left side sway (staggered phases)
    const swayXLeft = Math.sin(time / 2200 + Math.PI) * 10;
    const swayYLeft = Math.cos(time / 1800 + Math.PI) * 6;
    const rotLeft = Math.sin(time / 3000 + Math.PI) * 5;

    const floatStyleRight = {
      transform: `translate3d(${swayX}px, ${swayY}px, 0px) rotateY(30deg) rotateZ(${15 + rot}deg) scale(0.68)`,
      filter: "drop-shadow(0 8px 20px rgba(255, 153, 51, 0.25))",
      transition: "transform 0.8s ease-out",
    };

    const floatStyleLeft = {
      transform: `translate3d(${swayXLeft}px, ${swayYLeft}px, 0px) rotateY(-30deg) rotateZ(${-15 + rotLeft}deg) scale(0.68)`,
      filter: "drop-shadow(0 8px 20px rgba(255, 153, 51, 0.25))",
      transition: "transform 0.8s ease-out",
    };

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[60]">
        {/* Floating Lotus Element (Right Side) */}
        <div 
          className="fixed right-[-120px] md:right-[-45px] top-[32%] w-64 h-64 flex items-center justify-center perspective-[600px] preserve-3d opacity-35 hover:opacity-60 transition-all duration-500 hidden sm:flex"
          style={floatStyleRight}
        >
          <div className="absolute inset-0 flex items-center justify-center preserve-3d">
            {svgContent ? (
              <div 
                className="w-full h-full flex items-center justify-center lotus-bloom"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : (
              <img 
                src="/BJP Logo.svg" 
                alt="BJP Logo floating background" 
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>

        {/* Floating Lotus Element (Left Side) */}
        <div 
          className="fixed left-[-120px] md:left-[-45px] top-[32%] w-64 h-64 flex items-center justify-center perspective-[600px] preserve-3d opacity-35 hover:opacity-60 transition-all duration-500 hidden sm:flex"
          style={floatStyleLeft}
        >
          <div className="absolute inset-0 flex items-center justify-center preserve-3d">
            {svgContent ? (
              <div 
                className="w-full h-full flex items-center justify-center lotus-bloom"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : (
              <img 
                src="/BJP Logo.svg" 
                alt="BJP Logo floating background" 
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
