"use client";

import AnimatedSection from "./AnimatedSection";
import Tilt3DCard from "./Tilt3DCard";

export default function ThoughtsSection({
  lang,
  t,
  thoughtSearch,
  handleThoughtSearch,
  thoughtCategories,
  thoughtCatFilter,
  handleThoughtCat,
  paginatedThoughts,
  thoughtTotal,
  thoughtTotalPages,
  thoughtSafePage,
  setThoughtPage,
  setActiveThought
}) {
  return (
    <section id="thoughts" className="py-0 bg-white border-y border-[#e5e3dc] relative overflow-hidden">
      <div className="ambient-blob w-[350px] h-[350px] bg-[#1D9E75] bottom-[-50px] left-[-50px] opacity-8" />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <AnimatedSection className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#2C2C2A] tracking-tight">{t.thoughtsTitle}</h2>
          <p className="text-sm text-[#5F5E5A] mt-3 max-w-lg mx-auto">{t.thoughtsSub}</p>
        </AnimatedSection>

        {/* ── TOP BAR: Search + Category Filter ─────────────────────── */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888780] text-sm">🔍</span>
            <input
              type="text"
              value={thoughtSearch}
              onChange={e => handleThoughtSearch(e.target.value)}
              placeholder={lang === "hi" ? "विचार खोजें..." : "Search thoughts..."}
              className="w-full text-sm border border-[#d3d1c7] rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 bg-white transition-all"
            />
          </div>

          {/* Category Filter */}
          {thoughtCategories.length > 0 && (
            <select
              value={thoughtCatFilter}
              onChange={e => handleThoughtCat(e.target.value)}
              className="text-sm border border-[#d3d1c7] rounded-xl px-4 py-2.5 outline-none bg-white focus:border-[#EF9F27] cursor-pointer transition-all"
            >
              <option value="all">{lang === "hi" ? "📂 सभी श्रेणियाँ" : "📂 All Categories"}</option>
              {thoughtCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          {/* Count badge */}
          <span className="text-xs text-[#888780] font-medium ml-auto">
            {paginatedThoughts.length} / {thoughtTotal} {lang === "hi" ? "विचार" : "thoughts"}
          </span>
        </div>

        {/* ── CARDS GRID ────────────────────────────────────────────── */}
        {paginatedThoughts.length === 0 ? (
          <div className="text-center py-16 text-[#888780]">
            {lang === "hi" ? "कोई विचार नहीं मिला।" : "No thoughts found. Try a different search or category."}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedThoughts.map((post, idx) => (
              <AnimatedSection key={post.id || idx} delay={idx * 60} direction="up">
                <Tilt3DCard
                  intensity={6}
                  glare={true}
                  className="card-glass p-6 flex flex-col justify-between h-full group cursor-pointer hover:border-[#EF9F27]/30 transition-colors"
                  onClick={() => setActiveThought(post)}
                >
                  <div>
                    {/* Tags + date row */}
                    <div className="flex gap-2 items-center mb-3 flex-wrap">
                      {post.tags && post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="badge badge-saffron">{tag}</span>
                      ))}
                      {post.views > 0 && (
                        <span className="text-[10px] text-[#888780] font-medium ml-auto flex items-center gap-1">
                          👁 {post.views.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#2C2C2A] mb-2 leading-snug group-hover:text-[#BA7517] transition-colors line-clamp-2">
                      {lang === "hi" ? post.titleHi : post.titleEn}
                    </h3>
                    <div
                      dangerouslySetInnerHTML={{ __html: lang === "hi" ? post.descHi : post.descEn }}
                      className="text-sm text-[#5F5E5A] leading-relaxed mb-4 line-clamp-3 overflow-hidden"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#f0ede5] mt-auto">
                    <span className="text-[10px] text-[#aaa9a4] font-medium">📅 {post.date}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveThought(post); }}
                      className="text-xs font-bold text-[#BA7517] flex items-center gap-1 hover:text-[#EF9F27] transition-colors group-hover:gap-2 cursor-pointer"
                    >
                      {t.readMore} <span className="transition-transform group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                </Tilt3DCard>
              </AnimatedSection>
            ))}
          </div>
        )}

        {/* ── PAGINATION ────────────────────────────────────────────── */}
        {thoughtTotalPages > 1 && (
          <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
            {/* Prev */}
            <button
              onClick={() => setThoughtPage(p => Math.max(1, p - 1))}
              disabled={thoughtSafePage === 1}
              className={`text-sm px-4 py-2 rounded-xl border font-bold transition-all ${
                thoughtSafePage === 1
                  ? "border-[#e5e3dc] text-[#ccc] bg-[#f5f4f0] cursor-default"
                  : "border-[#d3d1c7] text-[#2C2C2A] bg-white hover:border-[#EF9F27] hover:text-[#BA7517] cursor-pointer"
              }`}
            >
              « {lang === "hi" ? "पिछला" : "Prev"}
            </button>

            {/* Pages */}
            {Array.from({ length: thoughtTotalPages }, (_, i) => i + 1).map(p => {
              const isActive = p === thoughtSafePage;
              const show = p === 1 || p === thoughtTotalPages || Math.abs(p - thoughtSafePage) <= 1;
              if (show) {
                return (
                  <button
                    key={p}
                    onClick={() => setThoughtPage(p)}
                    className={`text-xs w-9 h-9 rounded-xl font-bold border transition-all ${
                      isActive
                        ? "bg-[#EF9F27] text-white border-[#EF9F27] shadow-md shadow-[#EF9F27]/20 cursor-default"
                        : "bg-white text-[#2C2C2A] border-[#d3d1c7] hover:border-[#EF9F27] hover:text-[#BA7517] cursor-pointer"
                    }`}
                  >{p}</button>
                );
              }
              const showEllipsis = p === 2 || p === thoughtTotalPages - 1;
              if (showEllipsis) {
                return (
                  <span key={p} className="text-xs text-[#888780] font-bold px-1.5 select-none">...</span>
                );
              }
              return null;
            })}

            {/* Next */}
            <button
              onClick={() => setThoughtPage(p => Math.min(thoughtTotalPages, p + 1))}
              disabled={thoughtSafePage === thoughtTotalPages}
              className={`text-sm px-4 py-2 rounded-xl border font-bold transition-all ${
                thoughtSafePage === thoughtTotalPages
                  ? "border-[#e5e3dc] text-[#ccc] bg-[#f5f4f0] cursor-default"
                  : "border-[#d3d1c7] text-[#2C2C2A] bg-white hover:border-[#EF9F27] hover:text-[#BA7517] cursor-pointer"
              }`}
            >
              {lang === "hi" ? "अगला" : "Next"} »
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
