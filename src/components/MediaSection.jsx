"use client";

import AnimatedSection from "./AnimatedSection";
import Tilt3DCard from "./Tilt3DCard";

export default function MediaSection({
  lang,
  t,
  dynamicMedia,
  mediaLoading,
  mediaPage,
  mediaTotalPages,
  handleMediaPageChange
}) {
  return (
    <section id="media" className="py-0 bg-[#FAFAF7] border-b border-[#e5e3dc] relative overflow-hidden">
      <div className="ambient-blob w-[300px] h-[300px] bg-[#1D9E75] top-10 left-[-50px] opacity-10" />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <AnimatedSection className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#2C2C2A] tracking-tight">{t.mediaTitle}</h2>
          <p className="text-sm text-[#5F5E5A] mt-3 max-w-lg mx-auto">{t.mediaSub}</p>
        </AnimatedSection>

        {(() => {
          const activeMedia = dynamicMedia.length > 0 ? dynamicMedia : [
            { id: 1, title: "UP सरकार की डिजिटल नीति पर विशेष साक्षात्कार", outlet: "Dainik Jagran", type: "interview", date: "2026-03-10" },
            { id: 2, title: "Social Media Monitoring in Governance", outlet: "The Hindu", type: "article", date: "2026-01-22" },
            { id: 3, title: "कश्मीर अध्ययन: मीडिया रिपोर्ट", outlet: "Aaj Tak", type: "video", date: "2025-11-05" },
            { id: 4, title: "BJP Youth Leadership Panel Discussion", outlet: "Republic Bharat", type: "video", date: "2025-09-18" }
          ];

          const schemaData = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": lang === "hi" ? "मीडिया कवरेज और साक्षात्कार" : "Media Coverage & Interviews",
            "description": lang === "hi" ? "राघवेन्द्र सैनी के साक्षात्कार और समाचार लेख।" : "News articles, interviews, and public discussions featuring Raghvendra Saini.",
            "itemListElement": activeMedia.map((m, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "item": {
                "@type": m.type === "article" ? "NewsArticle" : "CreativeWork",
                "headline": m.title,
                "publisher": {
                  "@type": "Organization",
                  "name": m.outlet
                },
                "datePublished": m.date
              }
            }))
          };

          const getTypeBadge = (type) => {
            switch(type) {
              case 'interview': return { icon: "🎤", text: lang === "hi" ? "साक्षात्कार" : "Interview", bg: "bg-[#E6F1FB] text-[#185FA5]" };
              case 'article': return { icon: "📰", text: lang === "hi" ? "लेख / समाचार" : "Article", bg: "bg-[#E1F5EE] text-[#1D9E75]" };
              case 'video': return { icon: "🎥", text: lang === "hi" ? "वीडियो / टीवी" : "Video / TV", bg: "bg-[#FAEEDA] text-[#BA7517]" };
              default: return { icon: "📡", text: lang === "hi" ? "मीडिया" : "Media", bg: "bg-[#f5f4f0] text-[#5f5e5a]" };
            }
          };

          return (
            <div className="relative">
              {/* Dynamic JSON-LD Structured Data Schema for Media */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
              />

              {/* Loading Spinner Overlay */}
              {mediaLoading && (
                <div className="absolute inset-0 bg-[#FAFAF7]/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-3xl transition-opacity duration-300">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#EF9F27] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold text-[#EF9F27]">
                      {lang === "hi" ? "लोड हो रहा है..." : "Loading coverage..."}
                    </span>
                  </div>
                </div>
              )}

              <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${mediaLoading ? 'opacity-30' : 'opacity-100'}`}>
                {activeMedia.map((m, idx) => {
                  const badge = getTypeBadge(m.type);
                  return (
                    <AnimatedSection key={m.id || m.firestoreId || idx} delay={idx * 80} direction="up">
                      <Tilt3DCard
                        intensity={6}
                        glare={true}
                        className="card-glass p-6 h-full flex flex-col justify-between group hover:border-[#EF9F27]/30 transition-all cursor-default"
                      >
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 ${badge.bg}`}>
                              <span>{badge.icon}</span>
                              <span>{badge.text}</span>
                            </span>
                            <span className="text-[10px] text-[#aaa9a4] font-medium">📅 {m.date}</span>
                          </div>
                          <h3 className="text-base font-bold text-[#2C2C2A] mb-3 leading-snug line-clamp-3">
                            {m.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 pt-3 border-t border-[#f0ede5] mt-4">
                          <span className="text-xs text-[#888780] font-bold">📡 {m.outlet}</span>
                        </div>
                      </Tilt3DCard>
                    </AnimatedSection>
                  );
                })}
              </div>

              {/* ── PAGINATION CONTROLS ── */}
              {dynamicMedia.length > 0 && mediaTotalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10 pb-4">
                  <button
                    onClick={() => handleMediaPageChange(mediaPage - 1)}
                    disabled={mediaPage === 1}
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-[#e5e3dc] bg-white text-[#5F5E5A] hover:bg-[#EF9F27]/10 hover:border-[#EF9F27] hover:text-[#EF9F27] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-[#e5e3dc] disabled:hover:text-[#5F5E5A] transition-all cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Previous Page"
                  >
                    ←
                  </button>
                  {Array.from({ length: mediaTotalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handleMediaPageChange(p)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                        mediaPage === p
                          ? "bg-[#EF9F27] text-white shadow-md shadow-[#EF9F27]/25"
                          : "border border-[#e5e3dc] bg-white text-[#5F5E5A] hover:bg-[#EF9F27]/10 hover:border-[#EF9F27] hover:text-[#EF9F27]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => handleMediaPageChange(mediaPage + 1)}
                    disabled={mediaPage === mediaTotalPages}
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-[#e5e3dc] bg-white text-[#5F5E5A] hover:bg-[#EF9F27]/10 hover:border-[#EF9F27] hover:text-[#EF9F27] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-[#e5e3dc] disabled:hover:text-[#5F5E5A] transition-all cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Next Page"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </section>
  );
}
