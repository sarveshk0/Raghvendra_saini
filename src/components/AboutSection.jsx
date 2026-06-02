"use client";

import AnimatedSection from "./AnimatedSection";
import Tilt3DCard from "./Tilt3DCard";
import CounterStat from "./CounterStat";

export default function AboutSection({ lang, t, dynamicProfile, dynamicTimeline }) {
  return (
    <section id="about" className="relative overflow-hidden pt-10 pb-10 md:pt-14 md:pb-14">
      {/* Background Image Watermark */}
      <div 
        className="absolute inset-0 pointer-events-none bg-no-repeat bg-cover bg-center opacity-[0.5]"
        style={{ 
          backgroundImage: "url('/hero_bg.jpg')",
          WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,1) 100%)",
          maskImage: "linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,1) 100%)"
        }}
      />

      {/* Ambient blobs */}
      <div className="ambient-blob w-[500px] h-[500px] bg-[#EF9F27] top-[-100px] left-[-100px] opacity-20" style={{ animationDelay: "0s" }} />
      <div className="ambient-blob w-[400px] h-[400px] bg-[#1D9E75] bottom-[-80px] right-[-80px] opacity-15" style={{ animationDelay: "3s" }} />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(rgba(239,159,39,0.06) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-12 gap-12 items-center">
        <AnimatedSection className="md:col-span-7 flex flex-col items-start text-left" direction="left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E1F5EE] text-[#1D9E75] border border-[#1D9E75]/20 mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 bg-[#1D9E75] rounded-full animate-ping" />
            {t.heroWelcome}
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#2C2C2A] tracking-tight leading-none mb-4">
            <span className="gradient-text">{t.heroTitle}</span>
          </h1>

          <h2 className="text-lg md:text-xl font-bold text-[#BA7517] leading-relaxed mb-6 border-l-4 border-[#EF9F27] pl-4">
            {lang === "hi" ? (dynamicProfile?.currentRoleHi || t.heroRole) : (dynamicProfile?.currentRoleEn || t.heroRole)}
          </h2>

          <p className="text-base md:text-lg text-[#5F5E5A] leading-relaxed mb-8 max-w-xl">
            {t.heroSub}
          </p>

          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            <a href="#journey" className="flex-1 sm:flex-none text-center bg-gradient-to-r from-[#EF9F27] to-[#BA7517] text-white hover:from-[#BA7517] hover:to-[#8a5410] font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-[#EF9F27]/25 transform hover:-translate-y-1 hover:shadow-xl">
              {t.ctaExplore}
            </a>
            <a href="#thoughts" className="flex-1 sm:flex-none text-center border border-[#d3d1c7] bg-white/70 backdrop-blur-sm text-[#2C2C2A] hover:bg-[#f5f4f0] font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md">
              {t.ctaThoughts}
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-10 pt-6 border-t border-[#e5e3dc]">
            {[
              { target: lang === "hi" ? (dynamicProfile?.sanghExperienceHi || "20") : (dynamicProfile?.sanghExperienceEn || "20"), suffix: "+", label: t.statsSangh },
              { target: dynamicTimeline.length > 0 ? dynamicTimeline.length : 7, suffix: "+", label: t.statsRoles },
              { target: 4, suffix: "", label: t.statsStates },
              { target: 2, suffix: "", label: t.statsProjects },
            ].map((stat, idx) => (
              <div key={idx} className="p-3 text-center">
                <CounterStat
                  target={stat.target}
                  suffix={stat.suffix}
                  label={stat.label}
                  valueClass="text-[#1D9E75]"
                  labelClass="text-[#5F5E5A]"
                />
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Hero Visual */}
        <AnimatedSection className="md:col-span-5 flex justify-center relative" direction="right" delay={150}>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#EF9F27]/15 to-[#1D9E75]/15 blur-3xl -z-10 rounded-full animate-pulse" />
          <Tilt3DCard
            intensity={12}
            glare={true}
            className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center"
            style={{ background: dynamicProfile?.profileImage ? "transparent" : "linear-gradient(135deg, #FAEEDA, #E1F5EE)" }}
          >
            {/* Actual profile image — shown when set in admin */}
            {dynamicProfile?.profileImage ? (
              <img
                src={dynamicProfile.profileImage}
                alt={lang === "hi" ? "राघवेन्द्र सैनी" : "Raghvendra Saini"}
                className="w-full h-full object-cover object-top"
                onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
              />
            ) : null}

            {/* Fallback initials — shown when no image set */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ display: dynamicProfile?.profileImage ? "none" : "flex" }}
            >
              <span className="text-8xl sm:text-9xl tracking-widest font-black select-none text-[#BA7517]/20">RS</span>
            </div>



            {/* Decorative rings */}
            <div className="absolute inset-[-8px] rounded-full border-2 border-[#EF9F27]/20 animate-spin-slow pointer-events-none" />
            <div className="absolute inset-[-20px] rounded-full border border-[#1D9E75]/10 animate-spin-slow pointer-events-none" style={{ animationDirection: "reverse", animationDuration: "20s" }} />
          </Tilt3DCard>
        </AnimatedSection>
      </div>
    </section>
  );
}
