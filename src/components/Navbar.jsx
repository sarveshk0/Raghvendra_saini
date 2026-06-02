"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_TRANSLATIONS = {
  hi: {
    navAbout: "परिचय",
    navJourney: "राजनैतिक यात्रा",
    navWork: "सरकारी कार्यक्षेत्र",
    navThoughts: "मेरे विचार",
    navMedia: "मीडिया कवरेज",
    navContact: "संपर्क करें",
    navGallery: "गैलरी",
    adminBtn: "एडमिन पोर्टल"
  },
  en: {
    navAbout: "About",
    navJourney: "Political Journey",
    navWork: "Scope of Work",
    navThoughts: "My Thoughts",
    navMedia: "Media Coverage",
    navContact: "Contact",
    navGallery: "Gallery",
    adminBtn: "Admin Portal"
  }
};

export default function Navbar({ lang: externalLang, setLang: externalSetLang, onNavLinkClick }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [localLang, setLocalLang] = useState("hi");

  const lang = externalLang !== undefined ? externalLang : localLang;
  const setLang = (val) => {
    if (externalSetLang) {
      externalSetLang(val);
    } else {
      setLocalLang(val);
    }
  };

  const t = NAV_TRANSLATIONS[lang] || NAV_TRANSLATIONS.hi;

  const links = [
    { href: "/#about", label: t.navAbout },
    { href: "/#journey", label: t.navJourney },
    { href: "/#work", label: t.navWork },
    { href: "/#thoughts", label: t.navThoughts },
    { href: "/#media", label: t.navMedia },
    { href: "/#gallery", label: t.navGallery },
    { href: "/#contact", label: t.navContact },
  ];

  const handleLinkClick = () => {
    setMobileNavOpen(false);
    if (onNavLinkClick) {
      onNavLinkClick();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-[90] w-full bg-[#FAFAF7]/90 backdrop-blur-lg border-b border-[#e5e3dc]/80 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity" onClick={handleLinkClick}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#EF9F27] to-[#1D9E75] flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-md animate-pulse-glow">
              RS
            </div>
            <div>
              <span className="font-bold text-base tracking-wide text-[#2C2C2A] block leading-none">
                {lang === "hi" ? "राघवेन्द्र सैनी" : "RAGHVENDRA SAINI"}
              </span>

            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#5F5E5A]">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="hover:text-[#EF9F27] transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#EF9F27] group-hover:w-full transition-all duration-300 rounded" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Language Switch */}
            <div className="hidden sm:flex bg-[#f0ede5] p-0.5 rounded-lg gap-1 shadow-inner border border-[#d3d1c7]">
              <button
                onClick={() => setLang("hi")}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${lang === "hi" ? "bg-[#EF9F27] text-white shadow" : "text-[#5F5E5A] hover:bg-[#e2dfd5]"}`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLang("en")}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${lang === "en" ? "bg-[#185FA5] text-white shadow" : "text-[#5F5E5A] hover:bg-[#e2dfd5]"}`}
              >
                ENG
              </button>
            </div>

            {/* Admin Portal Button */}
            <Link
              href="/admin"
              onClick={handleLinkClick}
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-[#2C2C2A] text-white hover:bg-black transition-all shadow-md hidden md:block"
            >
              {t.adminBtn}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[#f0ede5] transition-colors"
              aria-label="Open menu"
            >
              <span className="w-5 h-0.5 bg-[#2C2C2A] rounded" />
              <span className="w-5 h-0.5 bg-[#2C2C2A] rounded" />
              <span className="w-5 h-0.5 bg-[#2C2C2A] rounded" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileNavOpen && (
        <div
          className="mobile-nav-overlay fixed inset-0 z-[120] bg-black/75 backdrop-blur-md flex items-center justify-center animate-fade-in"
          onClick={() => setMobileNavOpen(false)}
        >
          <div className="flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
            {/* Logo */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#EF9F27] to-[#1D9E75] flex items-center justify-center text-white font-black text-xl shadow-lg mb-4">
              RS
            </div>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="text-white text-2xl font-bold tracking-wide hover:text-[#EF9F27] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setLang("hi"); handleLinkClick(); }}
                className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${lang === "hi" ? "bg-[#EF9F27] text-white" : "bg-white/10 text-white/70"}`}
              >
                हिंदी
              </button>
              <button
                onClick={() => { setLang("en"); handleLinkClick(); }}
                className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${lang === "en" ? "bg-[#185FA5] text-white" : "bg-white/10 text-white/70"}`}
              >
                ENG
              </button>
            </div>

            {/* Admin link inside Mobile Nav */}
            <Link
              href="/admin"
              onClick={handleLinkClick}
              className="text-sm font-bold text-white hover:text-[#EF9F27] transition-colors mt-2"
            >
              {t.adminBtn}
            </Link>

            <button onClick={() => setMobileNavOpen(false)} className="mt-4 text-white/40 hover:text-white text-sm">✕ Close</button>
          </div>
        </div>
      )}
    </>
  );
}
