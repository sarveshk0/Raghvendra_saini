"use client";

import AnimatedSection from "./AnimatedSection";
import Tilt3DCard from "./Tilt3DCard";

export default function OrgAchievements({ dynamicOrgWork, lang }) {
  return (
    <div className="max-w-5xl mx-auto">
      <AnimatedSection className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#2C2C2A] tracking-tight gradient-text">
          {lang === "hi" ? "सांगठनिक कार्य और सहभागिता" : "RSS & Organizational Contributions"}
        </h2>
        <p className="text-sm text-[#5F5E5A] mt-3 max-w-xl mx-auto leading-relaxed">
          {lang === "hi" 
            ? "संघ के वरिष्ठ प्रचारकों के सानिध्य में गंगा संरक्षण, राष्ट्रोत्थान, वैचारिक चेतना और सामाजिक सेवा के विविध संकल्प" 
            : "Honoring service achievements alongside senior RSS pracharaks in national integration, environmental, and socio-cultural works"}
        </p>
      </AnimatedSection>

      {/* Grid of 20 RSS Pracharak Contributions */}
      <div className="grid gap-6 sm:grid-cols-2 mt-10">
        {dynamicOrgWork.map((item, idx) => (
          <AnimatedSection key={item.id || idx} delay={idx * 30} direction="up">
            <Tilt3DCard
              intensity={6}
              glare={true}
              className="bg-white border border-[#e5e3dc] rounded-2xl p-6 shadow-sm hover:border-[#EF9F27]/30 transition-all flex gap-4 items-start h-full"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EF9F27] to-[#BA7517] flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md shadow-[#EF9F27]/25">
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="text-[13px] sm:text-[14px] font-bold text-[#2C2C2A] leading-relaxed">
                  {lang === "hi" ? item.titleHi : item.titleEn}
                </p>
              </div>
            </Tilt3DCard>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
