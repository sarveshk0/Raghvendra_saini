"use client";

import AnimatedSection from "./AnimatedSection";
import Tilt3DCard from "./Tilt3DCard";

export default function GallerySection({
  lang,
  t,
  galleryFilter,
  setGalleryFilter,
  setGalleryPage,
  galleryLoading,
  filteredGallery,
  dynamicGallery,
  galleryTotalPages,
  galleryPage,
  handleGalleryPageChange,
  setActivePhoto
}) {
  return (
    <section id="gallery" className="py-0 bg-white border-b border-[#e5e3dc] relative overflow-hidden">
      <div className="ambient-blob w-[400px] h-[400px] bg-[#EF9F27] top-10 right-[-100px] opacity-10" />
      <div className="ambient-blob w-[300px] h-[300px] bg-[#1D9E75] bottom-10 left-[-50px] opacity-5" />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <AnimatedSection className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#2C2C2A] tracking-tight">{t.galleryTitle}</h2>
          <p className="text-sm text-[#5F5E5A] mt-3 max-w-lg mx-auto">{t.gallerySub}</p>

          {/* Gallery Filter Buttons */}
          <div className="flex flex-wrap gap-2 justify-center mt-8">
            {[
              { id: "all", label: t.galleryFilterAll },
              { id: "field", label: t.galleryFilterField },
              { id: "meeting", label: t.galleryFilterMeeting },
              { id: "public", label: t.galleryFilterPublic },
              { id: "learning", label: t.galleryFilterLearning },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => { setGalleryFilter(f.id); setGalleryPage(1); }}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all border ${
                  galleryFilter === f.id
                    ? "bg-[#EF9F27] text-white border-[#EF9F27] shadow-md shadow-[#EF9F27]/20"
                    : "bg-[#FAFAF7] text-[#5F5E5A] border-[#e5e3dc] hover:bg-[#f0ede5] hover:border-[#EF9F27]/30"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        <div className="relative">
          {/* Loading Spinner Overlay */}
          {galleryLoading && (
            <div className="absolute inset-0 bg-[#FAFAF7]/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-3xl transition-opacity duration-300">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-[#EF9F27] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-[#EF9F27]">
                  {lang === "hi" ? "लोड हो रहा है..." : "Loading gallery..."}
                </span>
              </div>
            </div>
          )}

          {/* Gallery Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 transition-opacity duration-300 ${galleryLoading ? 'opacity-30' : 'opacity-100'}`}>
            {filteredGallery.map((item, idx) => (
              <AnimatedSection key={item.id || item.firestoreId || idx} delay={idx * 80} direction="up">
                <Tilt3DCard
                  intensity={6}
                  glare={true}
                  className="card-glass overflow-hidden h-full group cursor-pointer"
                  onClick={() => setActivePhoto(item)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-[#FAFAF7]">
                    <img
                      src={item.src}
                      alt={lang === "hi" ? item.captionHi : item.captionEn}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white/20 text-white backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        🔍 {lang === "hi" ? "बड़ा देखें" : "View Large"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-white/50 backdrop-blur-[2px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#EF9F27] block mb-1">
                      {item.cat === "field" ? t.galleryFilterField : item.cat === "meeting" ? t.galleryFilterMeeting : item.cat === "public" ? t.galleryFilterPublic : t.galleryFilterLearning}
                    </span>
                    <p className="text-xs font-bold text-[#2C2C2A] line-clamp-2 leading-relaxed">
                      {lang === "hi" ? item.captionHi : item.captionEn}
                    </p>
                  </div>
                </Tilt3DCard>
              </AnimatedSection>
            ))}
          </div>

          {/* ── PAGINATION CONTROLS ── */}
          {dynamicGallery.length > 0 && galleryTotalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 pb-4">
              <button
                onClick={() => handleGalleryPageChange(galleryPage - 1)}
                disabled={galleryPage === 1}
                className="flex items-center justify-center w-10 h-10 rounded-xl border border-[#e5e3dc] bg-white text-[#5F5E5A] hover:bg-[#EF9F27]/10 hover:border-[#EF9F27] hover:text-[#EF9F27] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-[#e5e3dc] disabled:hover:text-[#5F5E5A] transition-all cursor-pointer disabled:cursor-not-allowed"
                aria-label="Previous Page"
              >
                ←
              </button>
              {Array.from({ length: galleryTotalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handleGalleryPageChange(p)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    galleryPage === p
                      ? "bg-[#EF9F27] text-white shadow-md shadow-[#EF9F27]/25"
                      : "border border-[#e5e3dc] bg-white text-[#5F5E5A] hover:bg-[#EF9F27]/10 hover:border-[#EF9F27] hover:text-[#EF9F27]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => handleGalleryPageChange(galleryPage + 1)}
                disabled={galleryPage === galleryTotalPages}
                className="flex items-center justify-center w-10 h-10 rounded-xl border border-[#e5e3dc] bg-white text-[#5F5E5A] hover:bg-[#EF9F27]/10 hover:border-[#EF9F27] hover:text-[#EF9F27] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-[#e5e3dc] disabled:hover:text-[#5F5E5A] transition-all cursor-pointer disabled:cursor-not-allowed"
                aria-label="Next Page"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
