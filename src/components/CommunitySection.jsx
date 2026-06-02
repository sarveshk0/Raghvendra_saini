"use client";

import AnimatedSection from "./AnimatedSection";
import Tilt3DCard from "./Tilt3DCard";

export default function CommunitySection({
  lang,
  t,
  dynamicCommunity,
  communityLoading,
  communityPage,
  communityTotalPages,
  handleCommunityPageChange,
  setActiveInitiative
}) {
  return (
    <section id="work" className="py-0 bg-[#FAFAF7] relative overflow-hidden">
      <div className="ambient-blob w-[300px] h-[300px] bg-[#EF9F27] top-10 right-[-50px] opacity-10" />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <AnimatedSection className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#2C2C2A] tracking-tight">{t.workTitle}</h2>
          <p className="text-sm text-[#5F5E5A] mt-3 max-w-lg mx-auto">{t.workSub}</p>
        </AnimatedSection>

        {(() => {
          const activeCommunity = dynamicCommunity.length > 0 ? dynamicCommunity : [
            {
              title: lang === "hi" ? "सोशल मीडिया मॉनिटरिंग सेल" : "Social Media Monitoring Cell",
              desc: lang === "hi" ? "गृह विभाग (उत्तर प्रदेश सरकार) के अधीन सोशल मीडिया मॉनिटरिंग सेल के संयोजक के रूप में साइबर सुरक्षा, जन-जागरूकता और डिजिटल विमर्श का प्रबंधन।" : "Heading the monitoring cell under UP Home Dept to manage public communication and security metrics.",
              icon: "⚖️",
              accent: "card-accent-blue",
              iconBg: "bg-[#E6F1FB] text-[#185FA5]",
              beneficiaries: "Active State Level",
              area: "Home Dept., UP Govt.",
              year: "2020–Present",
              details: `<h3><strong>Cyber Security & Digital Public Governance</strong></h3><p>As the Coordinator of the Social Media Monitoring Cell under the Home Department, Uttar Pradesh Government, Raghvendra Saini plays a crucial role in safeguarding the state's digital ecosystem.</p><h4>Key Achievements & Core Duties:</h4><ul><li><strong>24/7 Digital Monitoring:</strong> Leading a dedicated team to monitor and analyze public sentiments, security concerns, and fake news dissemination across all social platforms.</li><li><strong>Cyber Threat Mitigation:</strong> Quick coordination with law enforcement agencies to track and neutralize online security threats, preventing rumor escalations.</li><li><strong>Public Awareness Drives:</strong> Initiating online campaigns to educate citizens on digital rights, cyber security hygiene, and governmental grievance redress channels.</li><li><strong>Crisis Management:</strong> Managed critical digital communication campaigns during major state policies and public security milestones.</li></ul>`
            },
            {
              title: lang === "hi" ? "डिजिटल साक्षरता अभियान" : "Digital Literacy Camps",
              desc: lang === "hi" ? "फतेहपुर जिले में 5,000+ से अधिक ग्रामीण युवाओं को डिजिटल साक्षर बनाने और आधुनिक तकनीकी विधाओं से जोड़ने का सफल प्रयास।" : "Successfully educated 5,000+ rural youths on digital skills across the Fatehpur district.",
              icon: "📱",
              accent: "card-accent-saffron",
              iconBg: "bg-[#FAEEDA] text-[#BA7517]",
              beneficiaries: "5,000+ Rural Youth",
              area: "Fatehpur District",
              year: "2022–23",
              details: `<h3><strong>Empowering Rural Uttar Pradesh through Technology</strong></h3><p>Designed and executed a mass digital training framework targeted at youth in the remote parts of Fatehpur District to bridge the tech divide.</p><h4>Initiative Highlights:</h4><ul><li><strong>Core Tech Training:</strong> Taught basic computing, internet navigation, online banking safety, and standard digital tools to over 5,000 young individuals.</li><li><strong>Employment Opportunities:</strong> Linked trainees with emerging digital jobs, call center roles, and e-governance service operators (CSC).</li><li><strong>Mobile Learning Labs:</strong> Deployed vans with laptop systems to provide hands-on experience directly at their village centers.</li></ul>`
            },
            {
              title: lang === "hi" ? "मतदाता जागरूकता अभियान" : "Voter Awareness Drive",
              desc: lang === "hi" ? "बिन्दकी तहसील में 12,000+ से अधिक नए मतदाताओं को लोकतांत्रिक प्रक्रिया से जोड़ने हेतु वृहद जन-जागरण अभियान।" : "Empowered and registered 12,000+ voters in Bindki Tehsil to build a robust electoral footprint.",
              icon: "🤝",
              accent: "card-accent-green",
              iconBg: "bg-[#E1F5EE] text-[#1D9E75]",
              beneficiaries: "12,000+ Registered Citizens",
              area: "Bindki Tehsil",
              year: "2024",
              details: `<h3><strong>Strengthening Democratic Foundations</strong></h3><p>A non-partisan citizen engagement initiative designed to maximize voter participation and digital registration in UP's electoral processes.</p><h4>Key Impact Metrics:</h4><ul><li><strong>Mass Registrations:</strong> Successfully helped register and verify over 12,000 new and young voters using the digital NVSP portal.</li><li><strong>Youth Forums:</strong> Organized over 50 campus workshops, debate sessions, and awareness matches to stress the value of voting.</li><li><strong>Booth-Level Coordination:</strong> Mobilized volunteers to help elderly and disabled citizens reach polling centers safely.</li></ul>`
            }
          ];

          const schemaData = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": lang === "hi" ? "समुदाय कार्य और सामाजिक पहल" : "Community Works and Social Initiatives",
            "description": lang === "hi" ? "राघवेन्द्र सैनी द्वारा संचालित प्रमुख सामाजिक एवं जन कल्याणकारी कार्यक्रम।" : "Key social and welfare initiatives led by Raghvendra Saini.",
            "itemListElement": activeCommunity.map((card, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "item": {
                "@type": "Project",
                "name": lang === "hi" ? (card.titleHi || card.title) : (card.titleEn || card.title),
                "description": lang === "hi" ? (card.descHi || card.desc) : (card.descEn || card.desc),
                "location": {
                  "@type": "Place",
                  "name": lang === "hi" ? (card.areaHi || card.area) : (card.areaEn || card.area)
                },
                "audience": {
                  "@type": "Audience",
                  "audienceType": lang === "hi" ? (card.beneficiariesHi || card.beneficiaries) : (card.beneficiariesEn || card.beneficiaries)
                },
                "temporalCoverage": card.year || ""
              }
            }))
          };

          return (
            <div className="relative">
              {/* Dynamic JSON-LD Structured Data Schema */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
              />

              {/* Loading Spinner Overlay */}
              {communityLoading && (
                <div className="absolute inset-0 bg-[#FAFAF7]/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-3xl transition-opacity duration-300">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#EF9F27] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold text-[#EF9F27]">
                      {lang === "hi" ? "लोड हो रहा है..." : "Loading initiatives..."}
                    </span>
                  </div>
                </div>
              )}

              <div className={`grid md:grid-cols-3 gap-8 transition-opacity duration-300 ${communityLoading ? 'opacity-30' : 'opacity-100'}`}>
                {activeCommunity.map((card, idx) => {
                  const activeTitle = lang === "hi" ? (card.titleHi || card.title) : (card.titleEn || card.title);
                  const activeDesc = lang === "hi" ? (card.descHi || card.desc) : (card.descEn || card.desc);
                  const activeArea = lang === "hi" ? (card.areaHi || card.area) : (card.areaEn || card.area);
                  const activeBeneficiaries = lang === "hi" ? (card.beneficiariesHi || card.beneficiaries) : (card.beneficiariesEn || card.beneficiaries);

                  return (
                    <AnimatedSection key={card.id || card.firestoreId || idx} delay={idx * 120} direction="up">
                      <Tilt3DCard
                        intensity={8}
                        glare={true}
                        className={`card-glass ${card.accent || "card-accent-green"} p-8 h-full group cursor-pointer flex flex-col justify-between`}
                        onClick={() => setActiveInitiative(card)}
                      >
                        <div>
                          <div className={`w-14 h-14 ${card.iconBg || "bg-[#E1F5EE] text-[#1D9E75]"} rounded-2xl flex items-center justify-center text-2xl mb-6 transition-transform group-hover:scale-110 duration-300 shadow-sm`}>
                            {card.icon || "🤝"}
                          </div>
                          <h3 className="text-lg font-bold text-[#2C2C2A] mb-3 group-hover:text-[#EF9F27] transition-colors">{activeTitle}</h3>
                          <div 
                            dangerouslySetInnerHTML={{ __html: activeDesc }}
                            className="text-sm text-[#5F5E5A] leading-relaxed line-clamp-3 mb-4 overflow-hidden"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center text-[10px] font-bold text-[#888780] border-t border-[#e5e3dc]/50 pt-3 mb-4">
                            <span>📍 {activeArea}</span>
                            <span className="text-[#1D9E75] bg-[#E1F5EE] px-2 py-0.5 rounded-md">👥 {activeBeneficiaries}</span>
                          </div>

                          {/* Hover indicator */}
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#EF9F27] group-hover:translate-x-1 transition-transform">
                            <span>{lang === "hi" ? "अधिक जानें" : "Learn more"}</span>
                            <span>→</span>
                          </div>
                        </div>
                      </Tilt3DCard>
                    </AnimatedSection>
                  );
                })}
              </div>

              {/* ── PAGINATION CONTROLS ── */}
              {dynamicCommunity.length > 0 && communityTotalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 pb-4">
                  <button
                    onClick={() => handleCommunityPageChange(communityPage - 1)}
                    disabled={communityPage === 1}
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-[#e5e3dc] bg-white text-[#5F5E5A] hover:bg-[#EF9F27]/10 hover:border-[#EF9F27] hover:text-[#EF9F27] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-[#e5e3dc] disabled:hover:text-[#5F5E5A] transition-all cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Previous Page"
                  >
                    ←
                  </button>
                  {Array.from({ length: communityTotalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handleCommunityPageChange(p)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                        communityPage === p
                          ? "bg-[#EF9F27] text-white shadow-md shadow-[#EF9F27]/25"
                          : "border border-[#e5e3dc] bg-white text-[#5F5E5A] hover:bg-[#EF9F27]/10 hover:border-[#EF9F27] hover:text-[#EF9F27]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => handleCommunityPageChange(communityPage + 1)}
                    disabled={communityPage === communityTotalPages}
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
