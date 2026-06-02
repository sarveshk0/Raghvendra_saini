"use client";

import AnimatedSection from "./AnimatedSection";
import OrgAchievements from "./OrgAchievements";

const CAT_LABEL = { political: "🏛️ Political", govt: "🏢 Government", education: "📚 Education" };

export default function JourneySection({
  lang,
  t,
  journeyTab,
  setJourneyTab,
  journeyFilter,
  setJourneyFilter,
  dynamicTimeline,
  dynamicOrgWork
}) {
  const activeTimeline = dynamicTimeline;
  const filteredTimeline = journeyFilter === "all"
    ? activeTimeline
    : activeTimeline.filter(item => item.cat === journeyFilter);

  return (
    <section id="journey" className="py-0 bg-white border-y border-[#e5e3dc] relative overflow-hidden">
      {/* Subtle bg texture */}
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{
        backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(239,159,39,0.03) 20px, rgba(239,159,39,0.03) 21px)",
      }} />

      <div className="max-w-5xl mx-auto px-6 relative z-10 py-12">
        {/* Elegant Tab Switcher */}
        <div className="flex bg-[#f0ede5] p-1 rounded-2xl max-w-md mx-auto mb-12 border border-[#d3d1c7] shadow-inner">
          <button
            onClick={() => setJourneyTab("timeline")}
            className={`flex-1 text-xs font-black uppercase tracking-wider py-3.5 rounded-xl transition-all ${
              journeyTab === "timeline"
                ? "bg-gradient-to-r from-[#EF9F27] to-[#BA7517] text-white shadow-md shadow-[#EF9F27]/25"
                : "text-[#5F5E5A] hover:bg-[#e2dfd5]/60"
            }`}
          >
            {lang === "hi" ? "कालानुक्रमिक यात्रा" : "Timeline Journey"}
          </button>
          <button
            onClick={() => setJourneyTab("rss")}
            className={`flex-1 text-xs font-black uppercase tracking-wider py-3.5 rounded-xl transition-all ${
              journeyTab === "rss"
                ? "bg-gradient-to-r from-[#EF9F27] to-[#BA7517] text-white shadow-md shadow-[#EF9F27]/25"
                : "text-[#5F5E5A] hover:bg-[#e2dfd5]/60"
            }`}
          >
            {lang === "hi" ? "सांगठनिक कार्य" : "Org. Contributions"}
          </button>
        </div>

        {journeyTab === "timeline" ? (
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#2C2C2A] tracking-tight gradient-text">{t.journeyTitle}</h2>
              <p className="text-sm text-[#5F5E5A] mt-3 max-w-lg mx-auto">{t.journeySub}</p>

              <div className="flex flex-wrap gap-2 justify-center mt-8">
                {[
                  { id: "all", label: t.filterAll },
                  { id: "political", label: t.filterPolitical },
                  { id: "govt", label: t.filterGovt },
                  { id: "education", label: t.filterEducation },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setJourneyFilter(f.id)}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all border ${journeyFilter === f.id
                        ? "bg-[#1D9E75] text-white border-[#1D9E75] shadow-md shadow-[#1D9E75]/20"
                        : "bg-[#FAFAF7] text-[#5F5E5A] border-[#e5e3dc] hover:bg-[#f0ede5] hover:border-[#EF9F27]/30"
                      }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </AnimatedSection>

            <div className="relative border-l-2 border-[#e5e3dc] ml-4 md:ml-32">
              {filteredTimeline.map((item, idx) => (
                <AnimatedSection key={idx} delay={idx * 80} direction="right">
                  <div className="mb-4 last:mb-0 relative">
                    {/* Year tag */}
                    <div className="absolute hidden md:block right-full mr-8 text-right top-1">
                      <span className="text-sm font-bold text-[#EF9F27] bg-[#FAEEDA] px-3 py-1 rounded-lg border border-[#EF9F27]/20 shadow-sm whitespace-nowrap">
                        {item.year}
                      </span>
                    </div>

                    {/* Timeline node */}
                    <div className={`absolute -left-1.5 top-2 w-3.5 h-3.5 rounded-full border-2 border-white bg-[#1D9E75] shadow-md flex items-center justify-center ${item.active ? "timeline-node-active" : ""}`}>
                      {item.active && <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />}
                    </div>

                    {/* Content — no card box, just text */}
                    <div className="ml-6 md:ml-8 py-3 px-4 hover:bg-[#FAFAF7] rounded-xl transition-colors">
                      <span className="inline-block md:hidden text-[10px] font-bold text-[#EF9F27] bg-[#FAEEDA] px-2.5 py-0.5 rounded-md border border-[#EF9F27]/20 mb-2">
                        {item.year}
                      </span>

                      <h3 className="text-base sm:text-lg font-bold text-[#2C2C2A]">
                        {lang === "hi" ? item.roleHi : item.roleEn}
                      </h3>

                      <h4 className="text-xs font-bold text-[#5F5E5A] mt-1">
                        {lang === "hi" ? item.orgHi : item.orgEn}
                      </h4>

                      <div className="flex items-center gap-2 mt-2">
                        <span className={`badge ${item.cat === "political" ? "badge-saffron" : item.cat === "govt" ? "badge-blue" : "badge-blue"}`}>
                          {CAT_LABEL[item.cat] || item.cat}
                        </span>
                        {item.active && (
                          <span className="badge badge-green">
                            <span className="w-1.5 h-1.5 bg-[#1D9E75] rounded-full animate-ping inline-block" />
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        ) : (
          <OrgAchievements dynamicOrgWork={dynamicOrgWork} lang={lang} />
        )}
      </div>
    </section>
  );
}
