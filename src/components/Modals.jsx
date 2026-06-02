"use client";

import Navbar from "./Navbar";

export default function Modals({
  lang,
  setLang,
  t,
  activePhoto,
  setActivePhoto,
  activeInitiative,
  setActiveInitiative,
  activeThought,
  setActiveThought,
  dynamicProfile
}) {
  return (
    <>
      {/* Lightbox / Modal */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all text-xl"
            onClick={() => setActivePhoto(null)}
          >
            ✕
          </button>

          {/* Modal Content */}
          <div 
            className="max-w-4xl w-full flex flex-col gap-4 animate-float"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full max-h-[75vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <img 
                src={activePhoto.src} 
                alt={lang === "hi" ? activePhoto.captionHi : activePhoto.captionEn}
                className="w-full h-full object-contain mx-auto"
              />
            </div>
            <div className="text-center text-white px-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#EF9F27] block mb-1">
                {activePhoto.cat === "field" ? t.galleryFilterField : activePhoto.cat === "meeting" ? t.galleryFilterMeeting : activePhoto.cat === "public" ? t.galleryFilterPublic : t.galleryFilterLearning}
              </span>
              <p className="text-sm font-semibold text-white/90 max-w-xl mx-auto">
                {lang === "hi" ? activePhoto.captionHi : activePhoto.captionEn}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Initiative / Scope of Work Details Modal */}
      {activeInitiative && (() => {
        const activeTitle = lang === "hi" ? (activeInitiative.titleHi || activeInitiative.title) : (activeInitiative.titleEn || activeInitiative.title);
        const activeArea = lang === "hi" ? (activeInitiative.areaHi || activeInitiative.area) : (activeInitiative.areaEn || activeInitiative.area);
        const activeBeneficiaries = lang === "hi" ? (activeInitiative.beneficiariesHi || activeInitiative.beneficiaries) : (activeInitiative.beneficiariesEn || activeInitiative.beneficiaries);
        const activeDetails = lang === "hi" ? (activeInitiative.detailsHi || activeInitiative.details) : (activeInitiative.detailsEn || activeInitiative.details);
        const activeDesc = lang === "hi" ? (activeInitiative.descHi || activeInitiative.desc) : (activeInitiative.descEn || activeInitiative.desc);

        return (
          <div 
            className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveInitiative(null)}
          >
            <div 
              className="bg-white border border-[#e5e3dc] rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative animate-float"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                className="absolute top-4 right-4 text-[#888780] hover:text-[#2C2C2A] bg-[#f0ede5] hover:bg-[#e2dfd5] p-2 rounded-full transition-all text-xs font-bold w-8 h-8 flex items-center justify-center"
                onClick={() => setActiveInitiative(null)}
              >
                ✕
              </button>

              {/* Header Info */}
              <div className="flex gap-4 items-center mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm bg-[#FAEEDA] text-[#BA7517]`}>
                  {activeInitiative.icon || "🤝"}
                </div>
                <div>
                  <span className="inline-block text-[10px] font-bold text-[#EF9F27] bg-[#FAEEDA] px-2.5 py-0.5 rounded-md border border-[#EF9F27]/20 mb-1">
                    {activeInitiative.year}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#2C2C2A] leading-tight">
                    {activeTitle}
                  </h3>
                </div>
              </div>

              {/* Location and Beneficiary Badges */}
              <div className="flex flex-wrap gap-3 mb-6 border-y border-[#e5e3dc] py-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#5F5E5A]">
                  <span style={{ fontSize: 14 }}>📍</span>
                  <span>{lang === "hi" ? "भौगोलिक क्षेत्र:" : "Area:"}</span>
                  <span className="text-[#2C2C2A]">{activeArea}</span>
                </div>
                <div className="w-1.5 h-1.5 bg-[#e5e3dc] rounded-full hidden sm:block self-center" />
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#5F5E5A]">
                  <span style={{ fontSize: 14 }}>👥</span>
                  <span>{lang === "hi" ? "लाभार्थी संख्या:" : "Beneficiaries:"}</span>
                  <span className="text-[#1D9E75] bg-[#E1F5EE] px-2 py-0.5 rounded-md">{activeBeneficiaries}</span>
                </div>
              </div>

              {/* Rich Text Details Body */}
              <div 
                dangerouslySetInnerHTML={{ __html: activeDetails || activeDesc }} 
                className="initiative-modal-prose"
              />

              <style>{`
                .initiative-modal-prose {
                  font-size: 13.5px;
                  line-height: 1.8;
                  color: #5F5E5A;
                }
                .initiative-modal-prose h3 {
                  font-size: 16px;
                  font-weight: 700;
                  color: #2C2C2A;
                  margin-top: 0;
                  margin-bottom: 12px;
                }
                .initiative-modal-prose h4 {
                  font-size: 14.5px;
                  font-weight: 700;
                  color: #BA7517;
                  margin-top: 18px;
                  margin-bottom: 8px;
                }
                .initiative-modal-prose p {
                  margin-bottom: 12px;
                }
                .initiative-modal-prose ul {
                  padding-left: 20px;
                  margin-bottom: 16px;
                  list-style-type: disc;
                }
                .initiative-modal-prose li {
                  margin-bottom: 6px;
                }
                .initiative-modal-prose strong {
                  color: #2C2C2A;
                }
              `}</style>

              {/* Close Button Footer */}
              <div className="mt-8 pt-4 border-t border-[#e5e3dc] flex justify-end">
                <button 
                  onClick={() => setActiveInitiative(null)}
                  className="bg-[#2C2C2A] text-white hover:bg-black font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {lang === "hi" ? "बंद करें" : "Close"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Thought Details Modal */}
      {activeThought && (
        <div 
          className="fixed inset-0 z-[100] bg-[#FAFAF7] overflow-y-auto animate-fade-in flex flex-col"
          onClick={() => setActiveThought(null)}
        >
          <Navbar lang={lang} setLang={setLang} onNavLinkClick={() => setActiveThought(null)} />

          {/* Main Article Container */}
          <div 
            className="max-w-3xl mx-auto px-6 py-12 md:py-16 w-full flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Back button */}
            <button 
              onClick={() => setActiveThought(null)} 
              className="inline-flex items-center gap-1 text-xs font-bold text-[#EF9F27] hover:text-[#BA7517] mb-8 group transition-colors"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
              <span>{lang === "hi" ? "वापस विचारों पर" : "Back to thoughts"}</span>
            </button>

            {/* Header Info */}
            <div className="mb-10 pb-8 border-b border-[#e5e3dc]">
              <div className="flex gap-2 items-center mb-4 flex-wrap">
                {activeThought.tags && activeThought.tags.map(tag => (
                  <span key={tag} className="badge badge-saffron text-[10px] uppercase font-bold tracking-wider">{tag}</span>
                ))}
                {activeThought.views > 0 && (
                  <span className="text-[11px] text-[#888780] font-bold ml-auto flex items-center gap-1.5 bg-[#f0ede5] px-2.5 py-0.5 rounded-md">
                    👁 {activeThought.views.toLocaleString()} {lang === "hi" ? "व्यूज़" : "Views"}
                  </span>
                )}
                <span className="text-[11px] text-[#888780] font-bold bg-[#f0ede5] px-2.5 py-0.5 rounded-md">{activeThought.date}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#2C2C2A] tracking-tight leading-tight mb-6 animate-fade-in">
                {lang === "hi" ? activeThought.titleHi : activeThought.titleEn}
              </h1>
              
              {/* Author block */}
              <div className="flex items-center gap-3.5 mt-6">
                {dynamicProfile?.profileImage ? (
                  <img 
                    src={dynamicProfile.profileImage} 
                    alt="Raghvendra Saini" 
                    className="w-10 h-10 rounded-full object-cover border border-[#EF9F27]" 
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#EF9F27] text-white flex items-center justify-center font-bold text-sm">RS</div>
                )}
                <div>
                  <span className="font-bold text-sm text-[#2C2C2A] block">
                    {lang === "hi" ? "राघवेन्द्र सैनी" : "Raghvendra Saini"}
                  </span>
                  <span className="text-[10px] text-[#888780] font-semibold mt-0.5 block">
                    {lang === "hi" ? "संयोजक, सोशल मीडिया सेल, उ.प्र. सरकार" : "Coordinator, Social Media Cell, UP Govt."}
                  </span>
                </div>
              </div>
            </div>

            {/* Description / Article Body */}
            <div 
              dangerouslySetInnerHTML={{ __html: lang === "hi" ? activeThought.descHi : activeThought.descEn }}
              className="thought-article-prose"
            />

            {/* Language Switch Notice */}
            <div className="mt-12 p-4 bg-[#FAEEDA]/50 rounded-xl border border-[#EF9F27]/20 flex gap-3 items-center">
              <span className="text-xl">🗣️</span>
              <p className="text-xs text-[#8a5410] font-medium leading-relaxed m-0">
                {lang === "hi" 
                  ? "यह लेख अंग्रेजी में भी उपलब्ध है। भाषा बदलने के लिए ऊपर NAVBAR में 'ENG' पर क्लिक करें।" 
                  : "This entry is also available in Hindi. Click 'हिंदी' in the top navbar to toggle the translation."}
              </p>
            </div>

            {/* Footer CTA */}
            <div className="mt-16 pt-8 border-t border-[#e5e3dc] flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-center sm:text-left">
                <span className="text-xs text-[#888780] font-bold block uppercase tracking-wider mb-1">Enjoyed reading this?</span>
                <a href="#contact" onClick={() => setActiveThought(null)} className="text-sm font-bold text-[#EF9F27] hover:text-[#BA7517] hover:underline">Share your feedback with Raghvendra Ji →</a>
              </div>
              <button 
                onClick={() => setActiveThought(null)}
                className="bg-[#2C2C2A] text-white hover:bg-black font-bold text-xs px-8 py-3 rounded-xl transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                {lang === "hi" ? "वापस जाएँ" : "Close Reader"}
              </button>
            </div>
          </div>

          <style>{`
            .thought-article-prose {
              font-size: 1.1rem;
              line-height: 1.9;
              color: #2C2C2A;
            }
            .thought-article-prose h3 {
              font-size: 1.5rem;
              font-weight: 800;
              color: #2C2C2A;
              margin-top: 2rem;
              margin-bottom: 0.75rem;
              line-height: 1.3;
            }
            .thought-article-prose h4 {
              font-size: 1.25rem;
              font-weight: 700;
              color: #BA7517;
              margin-top: 1.5rem;
              margin-bottom: 0.5rem;
              line-height: 1.3;
            }
            .thought-article-prose p {
              margin-bottom: 1.5rem;
            }
            .thought-article-prose ul {
              list-style-type: disc;
              padding-left: 1.5rem;
              margin-bottom: 1.5rem;
            }
            .thought-article-prose ol {
              list-style-type: decimal;
              padding-left: 1.5rem;
              margin-bottom: 1.5rem;
            }
            .thought-article-prose li {
              margin-bottom: 0.5rem;
            }
            .thought-article-prose strong {
              color: #2C2C2A;
              font-weight: 700;
            }
            .thought-article-prose em {
              font-style: italic;
            }
            .thought-article-prose a {
              color: #EF9F27;
              font-weight: 600;
              text-decoration: underline;
            }
            .thought-article-prose a:hover {
              color: #BA7517;
            }
          `}</style>
        </div>
      )}
    </>
  );
}
