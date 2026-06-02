"use client";

import Link from "next/link";

export default function Footer({ lang, t }) {
  return (
    <footer className="bg-[#111110] text-[#888780] border-t border-white/5">

      {/* ── Top CTA strip ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#EF9F27]/10 via-[#BA7517]/10 to-[#EF9F27]/10 border-b border-[#EF9F27]/15">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-white font-bold text-base">
              {lang === "hi" ? "🪷 राघवेन्द्र सैनी से जुड़ें" : "🪷 Connect with Raghvendra Saini"}
            </div>
            <div className="text-xs text-[#888780] mt-0.5">
              {lang === "hi"
                ? "सीधे संपर्क करें — ईमेल या सोशल मीडिया के माध्यम से"
                : "Reach out directly — via email or social media"}
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a href="#contact"
              className="flex items-center gap-2 bg-[#EF9F27] text-[#1a1a18] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#BA7517] transition-all shadow-lg shadow-[#EF9F27]/20">
              ✉️ {lang === "hi" ? "संदेश भेजें" : "Send Message"}
            </a>
          </div>
        </div>
      </div>

      {/* ── Main footer grid ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Column 1 — Brand + Mission */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#EF9F27] to-[#BA7517] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#EF9F27]/30 shrink-0">
              RS
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider text-white block leading-none">
                {lang === "hi" ? "राघवेन्द्र सैनी" : "RAGHVENDRA SAINI"}
              </span>
              <span className="text-[10px] text-[#EF9F27] uppercase tracking-widest font-bold mt-0.5 block">
                BJP · UP Government
              </span>
            </div>
          </div>
          <p className="text-xs text-[#5F5E5A] leading-relaxed mb-6">
            {lang === "hi"
              ? "राष्ट्रसेवा, डिजिटल शासन और सामाजिक उत्थान के लिए समर्पित — उत्तर प्रदेश से एक मजबूत आवाज।"
              : "Dedicated to national service, digital governance, and social upliftment — a strong voice from Uttar Pradesh."}
          </p>
          {/* Social Links */}
          <div className="flex gap-3 flex-wrap">
            {[
              { icon: "𝕏", label: "Twitter / X", href: "https://x.com/sainiraghvendra", color: "#1DA1F2" },
              { icon: "f", label: "Facebook", href: "https://facebook.com", color: "#1877F2" },
              { icon: "in", label: "LinkedIn", href: "https://linkedin.com", color: "#0A66C2" },
              { icon: "▶", label: "YouTube", href: "https://youtube.com", color: "#FF0000" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                title={s.label}
                className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-[11px] font-bold text-white/50 hover:text-white hover:border-[#EF9F27]/50 hover:bg-[#EF9F27]/10 transition-all"
              >{s.icon}</a>
            ))}
          </div>
        </div>

        {/* Column 2 — Quick Navigation */}
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.12em] text-[#EF9F27] mb-5">
            {lang === "hi" ? "त्वरित नेविगेशन" : "Quick Navigation"}
          </div>
          <ul className="flex flex-col gap-3">
            {[
              { href: "#about", hiLabel: "परिचय", enLabel: "About" },
              { href: "#journey", hiLabel: "राजनैतिक यात्रा", enLabel: "Political Journey" },
              { href: "#work", hiLabel: "सरकारी कार्यक्षेत्र", enLabel: "Scope of Work" },
              { href: "#thoughts", hiLabel: "मेरे विचार", enLabel: "My Thoughts" },
              { href: "#media", hiLabel: "मीडिया कवरेज", enLabel: "Media Coverage" },
              { href: "#gallery", hiLabel: "फोटो गैलरी", enLabel: "Gallery" },
              { href: "#community", hiLabel: "समुदाय कार्य", enLabel: "Community Work" },
              { href: "#contact", hiLabel: "संपर्क करें", enLabel: "Contact" },
            ].map(link => (
              <li key={link.href}>
                <a href={link.href}
                  className="text-xs text-[#5F5E5A] hover:text-[#EF9F27] transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-[#EF9F27]/30 group-hover:bg-[#EF9F27] transition-colors" />
                  {lang === "hi" ? link.hiLabel : link.enLabel}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Contact Info */}
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.12em] text-[#EF9F27] mb-5">
            {lang === "hi" ? "संपर्क जानकारी" : "Contact Info"}
          </div>
          <ul className="flex flex-col gap-5">
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-sm shrink-0">✉️</span>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#5F5E5A] font-bold mb-0.5">
                  {lang === "hi" ? "ईमेल" : "Email"}
                </div>
                <a href="mailto:sainiraghvendra@gmail.com" className="text-xs text-white/80 hover:text-[#EF9F27] transition-colors font-semibold break-all">
                  sainiraghvendra@gmail.com
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-sm shrink-0">📍</span>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#5F5E5A] font-bold mb-0.5">
                  {lang === "hi" ? "स्थायी पता" : "Address"}
                </div>
                <span className="text-xs text-white/70 leading-relaxed">
                  {lang === "hi"
                    ? "खानपुर कदीम, दिघरुआ, बिन्दकी, फतेहपुर, उत्तर प्रदेश"
                    : "Khanpur Kadim, Digharua, Bindki, Fatehpur, Uttar Pradesh"}
                </span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-sm shrink-0">🏛️</span>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#5F5E5A] font-bold mb-0.5">
                  {lang === "hi" ? "कार्यालय" : "Office"}
                </div>
                <span className="text-xs text-white/70 leading-relaxed">
                  {lang === "hi"
                    ? "गृह विभाग, सोशल मीडिया सेल, लखनऊ, उत्तर प्रदेश"
                    : "Home Dept., Social Media Cell, Lucknow, UP"}
                </span>
              </div>
            </li>
          </ul>
        </div>

        {/* Column 4 — Portal Links + Stats */}
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.12em] text-[#EF9F27] mb-5">
            {lang === "hi" ? "पोर्टल एवं संसाधन" : "Portals & Resources"}
          </div>
          <ul className="flex flex-col gap-3 mb-8">
            {[
              { href: "/admin", icon: "⚙️", hiLabel: "एडमिन पोर्टल", enLabel: "Admin Portal" },
              { href: "/api-docs", icon: "📖", hiLabel: "API डॉक्यूमेंटेशन", enLabel: "API Documentation" },
              { href: "#thoughts", icon: "💡", hiLabel: "विचार व ब्लॉग", enLabel: "Thoughts & Blog" },
              { href: "#media", icon: "📺", hiLabel: "मीडिया कवरेज", enLabel: "Media Coverage" },
              { href: "#gallery", icon: "🖼️", hiLabel: "फोटो गैलरी", enLabel: "Photo Gallery" },
            ].map(link => (
              <li key={link.href}>
                <Link href={link.href}
                  className="text-xs text-[#5F5E5A] hover:text-[#EF9F27] transition-colors flex items-center gap-2.5 group">
                  <span className="text-sm">{link.icon}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    {lang === "hi" ? link.hiLabel : link.enLabel}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mini stat strip */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "20+", label: lang === "hi" ? "वर्ष सेवा" : "Yrs Service" },
              { value: "15+", label: lang === "hi" ? "भूमिकाएं" : "Roles Held" },

            ].map(s => (
              <div key={s.label} className="bg-white/3 border border-white/6 rounded-xl p-3 text-center">
                <div className="text-base font-extrabold text-[#EF9F27]">{s.value}</div>
                <div className="text-[10px] text-[#5F5E5A] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[11px] text-[#3a3a38] text-center sm:text-left">
          {t.footerText}
        </p>
        <div className="flex items-center gap-5 text-[11px] text-[#3a3a38]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse" />
            {lang === "hi" ? "सर्वर चालू" : "Live"}
          </span>
          <span className="text-white/10">|</span>
          <Link href="/admin" className="hover:text-[#EF9F27] transition-colors">Admin</Link>
          <span className="text-white/10">|</span>
          <Link href="/api-docs" className="hover:text-[#EF9F27] transition-colors">API Docs</Link>
          <span className="text-white/10">|</span>
          <a href="#about" className="hover:text-[#EF9F27] transition-colors flex items-center gap-1">
            ↑ {lang === "hi" ? "ऊपर" : "Top"}
          </a>
        </div>
      </div>

    </footer>
  );
}
