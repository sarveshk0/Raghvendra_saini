"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import LotusOpening from "../components/LotusOpening";
import AnimatedSection from "../components/AnimatedSection";
import CounterStat from "../components/CounterStat";
import Tilt3DCard from "../components/Tilt3DCard";
import QuoteMarquee from "../components/QuoteMarquee";
import Navbar from "../components/Navbar";
import OrgAchievements from "../components/OrgAchievements";

// ============================================================
// TRANSLATIONS — unchanged from original
// ============================================================
const TRANSLATIONS = {
  hi: {
    navAbout: "परिचय",
    navJourney: "राजनैतिक यात्रा",
    navWork: "सरकारी कार्यक्षेत्र",
    navThoughts: "मेरे विचार",
    navContact: "संपर्क करें",
    adminBtn: "एडमिन पोर्टल",
    heroWelcome: "राष्ट्र सेवा और जन कल्याण के लिए समर्पित",
    heroTitle: "राघवेन्द्र सैनी",
    heroRole: "संयोजक, सोशल मीडिया मॉनिटरिंग सेल, गृह विभाग, उत्तर प्रदेश सरकार",
    heroSub: "राष्ट्रवादी विचारधारा के प्रति समर्पित, सामाजिक उत्थान और डिजिटल शासन व्यवस्था के माध्यम से नीति निर्माण और जनसरोकार को सशक्त बनाने में कार्यरत।",
    ctaExplore: "राजनैतिक यात्रा देखें",
    ctaThoughts: "मेरे विचार पढ़ें",
    statsSangh: "संघ सेवा वर्ष",
    statsRoles: "सांगठनिक भूमिकाएं",
    statsStates: "कार्य क्षेत्र (राज्य)",
    statsProjects: "शोध एवं अनुसंधान",
    journeyTitle: "राजनैतिक एवं सांगठनिक यात्रा",
    journeySub: "राष्ट्र सेवा, सामाजिक कार्यों और संगठन निर्माण की महत्वपूर्ण कड़ियाँ",
    filterAll: "सभी क्षेत्र",
    filterPolitical: "राजनैतिक",
    filterGovt: "शासकीय",
    filterEducation: "शैक्षणिक / शोध",
    workTitle: "शासकीय एवं सामाजिक कार्यक्षेत्र",
    workSub: "डिजिटल गवर्नेंस और समाज कल्याण के लिए किए गए प्रमुख प्रयास",
    work1Title: "सोशल मीडिया मॉनिटरिंग",
    work1Desc: "गृह विभाग (उत्तर प्रदेश सरकार) के अधीन सोशल मीडिया मॉनिटरिंग सेल के संयोजक के रूप में साइबर सुरक्षा, जन-जागरूकता और डिजिटल विमर्श का प्रबंधन।",
    work2Title: "डिजिटल साक्षरता अभियान",
    work2Desc: "फतेहपुर जिले में 5,000+ से अधिक ग्रामीण युवाओं को डिजिटल साक्षर बनाने और आधुनिक तकनीकी विधाओं से जोड़ने का सफल प्रयास।",
    work3Title: "मतदाता जागरूकता अभियान",
    work3Desc: "बिन्दकी तहसील में 12,000+ से अधिक नए मतदाताओं को लोकतांत्रिक प्रक्रिया से जोड़ने हेतु वृहद जन-जागरण अभियान।",
    thoughtsTitle: "नवीनतम विचार व दृष्टिकोण",
    thoughtsSub: "राष्ट्रीय मुद्दे, सामाजिक परिवर्तन और उत्तर प्रदेश के विकास पर मेरी राय",
    readMore: "पूरा पढ़ें",
    contactTitle: "जुड़ें और संवाद करें",
    contactSub: "आपके सुझाव और विचार हमारे लिए अत्यंत महत्वपूर्ण हैं। सीधे संपर्क के लिए फॉर्म भरें या सोशल मीडिया पर जुड़ें।",
    contactFormName: "आपका नाम",
    contactFormEmail: "ईमेल पता",
    contactFormMsg: "आपका संदेश",
    contactFormBtn: "संदेश भेजें",
    contactPhone: "फ़ोन नंबर",
    contactEmail: "ईमेल",
    contactAddress: "स्थायी पता",
    galleryTitle: "व्यक्तिगत फोटो गैलरी",
    gallerySub: "केवल आधिकारिक नहीं — फील्ड विजिट, बैठकें, जन संपर्क और सीखने के पल",
    galleryFilterAll: "सभी",
    galleryFilterField: "फील्ड विजिट",
    galleryFilterMeeting: "बैठकें",
    galleryFilterPublic: "जन संपर्क",
    galleryFilterLearning: "सीखने के पल",
    navGallery: "गैलरी",
    footerText: "© 2026 राघवेन्द्र सैनी। सर्वाधिकार सुरक्षित। भारतीय जनता पार्टी कार्यकर्ता एवं समाज सेवक।"
  },
  en: {
    navAbout: "About",
    navJourney: "Political Journey",
    navWork: "Scope of Work",
    navThoughts: "My Thoughts",
    navContact: "Contact",
    adminBtn: "Admin Portal",
    heroWelcome: "Dedicated to National Service & Public Welfare",
    heroTitle: "Raghvendra Saini",
    heroRole: "Coordinator, Social Media Monitoring Cell, Home Dept., UP Govt.",
    heroSub: "Driven by nationalist ideology, working to strengthen policy-making and public engagement through digital governance and grassroots social welfare.",
    ctaExplore: "Explore Journey",
    ctaThoughts: "Read My Thoughts",
    statsSangh: "Sangh Experience",
    statsRoles: "Organizational Roles",
    statsStates: "States Worked",
    statsProjects: "Research Projects",
    journeyTitle: "Political & Organizational Journey",
    journeySub: "Key milestones of commitment to the nation, party organization, and government policy",
    filterAll: "All sectors",
    filterPolitical: "Political",
    filterGovt: "Government",
    filterEducation: "Education / Research",
    workTitle: "Scope of Work & Social Initiatives",
    workSub: "Highlighting key milestones in digital governance, research, and community welfare",
    work1Title: "Social Media Monitoring Cell",
    work1Desc: "Heading the monitoring cell under UP Home Dept. to manage public communication and security metrics.",
    work2Title: "Digital Literacy Camps",
    work2Desc: "Successfully educated 5,000+ rural youths on digital skills across the Fatehpur district.",
    work3Title: "Voter Awareness Drive",
    work3Desc: "Empowered and registered 12,000+ citizens in Bindki Tehsil to build a robust electoral footprint.",
    thoughtsTitle: "Latest Opinions & Vision",
    thoughtsSub: "My thoughts on national security, digital governance, and UP developmental metrics",
    readMore: "Read More",
    contactTitle: "Connect & Converse",
    contactSub: "Your suggestions and thoughts are valuable. Drop a message using the form below or connect via social media.",
    contactFormName: "Your Name",
    contactFormEmail: "Email Address",
    contactFormMsg: "Your Message",
    contactFormBtn: "Send Message",
    contactPhone: "Phone",
    contactEmail: "Email",
    contactAddress: "Permanent Address",
    galleryTitle: "Personal Gallery",
    gallerySub: "Not only official photos — Field Visits, Meetings, Public Interaction & Learning Moments",
    galleryFilterAll: "All",
    galleryFilterField: "Field Visits",
    galleryFilterMeeting: "Meetings",
    galleryFilterPublic: "Public Interaction",
    galleryFilterLearning: "Learning Moments",
    navGallery: "Gallery",
    footerText: "© 2026 Raghvendra Saini. All rights reserved. BJP Worker & Social Professional."
  }
};

// ============================================================
// WORK CARDS CONFIG
// ============================================================
const WORK_CARDS = (t) => [
  { icon: "⚖️", title: t.work1Title, desc: t.work1Desc, accent: "card-accent-blue", iconBg: "bg-[#E6F1FB] text-[#185FA5]" },
  { icon: "📱", title: t.work2Title, desc: t.work2Desc, accent: "card-accent-saffron", iconBg: "bg-[#FAEEDA] text-[#BA7517]" },
  { icon: "🤝", title: t.work3Title, desc: t.work3Desc, accent: "card-accent-green", iconBg: "bg-[#E1F5EE] text-[#1D9E75]" },
];

// ============================================================
// CAT BADGE COLORS
// ============================================================
const CAT_BADGE = {
  political: "badge-saffron",
  govt: "badge-blue",
  education: "badge badge-blue",
};
const CAT_LABEL = { political: "🏛️ Political", govt: "🏢 Government", education: "📚 Education" };

// ============================================================
// SCROLL TO TOP BUTTON
// ============================================================
function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      id="scroll-to-top-btn"
      className="scroll-top-btn"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}

// Unified Navbar replaces separate MobileNav

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
export default function Home() {
  const [lang, setLang] = useState("hi");
  const [journeyTab, setJourneyTab] = useState("timeline"); // "timeline" or "rss"
  const [journeyFilter, setJourneyFilter] = useState("all");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [introRevealed, setIntroRevealed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [activePhoto, setActivePhoto] = useState(null);

  // Dynamic API States
  const [dynamicProfile, setDynamicProfile] = useState(null);
  const [dynamicTimeline, setDynamicTimeline] = useState([]);
  const [dynamicThoughts, setDynamicThoughts] = useState([]);
  const [dynamicGallery, setDynamicGallery] = useState([]);
  const [dynamicOrgWork, setDynamicOrgWork] = useState([]);
  const [dynamicCommunity, setDynamicCommunity] = useState([]);
  const [activeInitiative, setActiveInitiative] = useState(null);
  const [activeThought, setActiveThought] = useState(null);

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => setDynamicProfile(data))
      .catch(e => console.error("Error loading profile:", e));

    fetch("/api/timeline")
      .then(res => res.json())
      .then(data => setDynamicTimeline(Array.isArray(data) ? data : []))
      .catch(e => console.error("Error loading timeline:", e));

    fetch("/api/thoughts")
      .then(res => res.json())
      .then(data => setDynamicThoughts(Array.isArray(data) ? data.filter(t => t.status === "published") : []))
      .catch(e => console.error("Error loading thoughts:", e));

    fetch("/api/gallery")
      .then(res => res.json())
      .then(data => setDynamicGallery(Array.isArray(data) ? data : []))
      .catch(e => console.error("Error loading gallery:", e));

    fetch("/api/organizational")
      .then(res => res.json())
      .then(data => setDynamicOrgWork(Array.isArray(data) ? data : []))
      .catch(e => console.error("Error loading organizational work:", e));

    fetch("/api/community")
      .then(res => res.json())
      .then(data => setDynamicCommunity(Array.isArray(data) ? data : []))
      .catch(e => console.error("Error loading community:", e));
  }, []);

  const t = TRANSLATIONS[lang];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.message) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: "", email: "", message: "" });
      }, 3000);
    }
  };

  const activeTimeline = dynamicTimeline;
  const filteredTimeline = journeyFilter === "all"
    ? activeTimeline
    : activeTimeline.filter(item => item.cat === journeyFilter);

  const activeThoughts = dynamicThoughts;
  
  const filteredGallery = galleryFilter === "all"
    ? dynamicGallery
    : dynamicGallery.filter(item => item.cat === galleryFilter);

  return (
    <>
      <LotusOpening onReveal={() => setIntroRevealed(true)} />

      <Navbar lang={lang} setLang={setLang} />

      <ScrollToTop />

      <div
        className={`min-h-screen bg-[#FAFAF7] text-[#2C2C2A] font-sans antialiased selection:bg-[#EF9F27]/30 selection:text-[#BA7517] transition-opacity duration-[1500ms] ease-out ${introRevealed ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      >

        {/* ── HERO SECTION ── */}
        <section id="about" className="relative overflow-hidden pt-10 pb-10 md:pt-14 md:pb-14">
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

                {/* Caption overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-5 text-center text-white text-xs font-semibold backdrop-blur-[2px]">
                  {lang === "hi" ? "राष्ट्रवादी समाज-सेवक · डिजिटल संयोजक" : "Nationalist Social Worker & Tech Innovator"}
                </div>

                {/* Decorative rings */}
                <div className="absolute inset-[-8px] rounded-full border-2 border-[#EF9F27]/20 animate-spin-slow pointer-events-none" />
                <div className="absolute inset-[-20px] rounded-full border border-[#1D9E75]/10 animate-spin-slow pointer-events-none" style={{ animationDirection: "reverse", animationDuration: "20s" }} />
              </Tilt3DCard>
            </AnimatedSection>
          </div>
        </section>

        {/* ── QUOTE MARQUEE ── */}
        <QuoteMarquee lang={lang} />

        {/* ── JOURNEY / TIMELINE SECTION ── */}
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

        {/* ── SCOPE OF WORK SECTION ── */}
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

              return (
                <div className="grid md:grid-cols-3 gap-8">
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
              );
            })()}
          </div>
        </section>

        {/* ── THOUGHTS SECTION ── */}
        <section id="thoughts" className="py-0 bg-white border-y border-[#e5e3dc] relative overflow-hidden">
          <div className="ambient-blob w-[350px] h-[350px] bg-[#1D9E75] bottom-[-50px] left-[-50px] opacity-8" />

          <div className="max-w-7xl mx-auto px-6 py-10">
            <AnimatedSection className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#2C2C2A] tracking-tight">{t.thoughtsTitle}</h2>
              <p className="text-sm text-[#5F5E5A] mt-3 max-w-lg mx-auto">{t.thoughtsSub}</p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8">
              {activeThoughts.map((post, idx) => (
                <AnimatedSection key={post.id || idx} delay={idx * 100} direction="up">
                  <Tilt3DCard
                    intensity={6}
                    glare={true}
                    className="card-glass p-8 flex flex-col justify-between h-full group cursor-pointer hover:border-[#EF9F27]/30 transition-colors"
                    onClick={() => setActiveThought(post)}
                  >
                    <div>
                      <div className="flex gap-2 items-center mb-4 flex-wrap">
                        {post.tags && post.tags.map(tag => (
                          <span key={tag} className="badge badge-saffron">{tag}</span>
                        ))}
                        {post.views > 0 && (
                          <span className="text-[10px] text-[#888780] font-medium ml-auto flex items-center gap-1">
                            👁 {post.views.toLocaleString()}
                          </span>
                        )}
                        <span className="text-[10px] text-[#888780] font-medium ml-auto">{post.date}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#2C2C2A] mb-3 leading-snug group-hover:text-[#BA7517] transition-colors">
                        {lang === "hi" ? post.titleHi : post.titleEn}
                      </h3>
                      <div 
                        dangerouslySetInnerHTML={{ __html: lang === "hi" ? post.descHi : post.descEn }}
                        className="text-sm text-[#5F5E5A] leading-relaxed mb-6 line-clamp-2 min-h-[40px] overflow-hidden"
                      />
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveThought(post); }}
                      className="text-xs font-bold text-[#BA7517] flex items-center gap-1.5 hover:text-[#EF9F27] transition-colors self-start group-hover:gap-3 cursor-pointer"
                    >
                      {t.readMore}
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </button>
                  </Tilt3DCard>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── PERSONAL GALLERY SECTION ── */}
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
                    onClick={() => setGalleryFilter(f.id)}
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

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {filteredGallery.map((item, idx) => (
                <AnimatedSection key={item.id} delay={idx * 80} direction="up">
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
          </div>
        </section>

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
            className="fixed inset-0 z-[100] bg-[#FAFAF7] overflow-y-auto animate-fade-in"
            onClick={() => setActiveThought(null)}
          >
            {/* Floating Close Button */}
            <button 
              className="fixed top-6 right-6 z-[110] text-[#888780] hover:text-[#2C2C2A] bg-[#f0ede5] hover:bg-[#e2dfd5] p-3 rounded-full transition-all text-sm font-bold w-12 h-12 flex items-center justify-center shadow-lg border border-[#e5e3dc] hover:scale-105 active:scale-95 cursor-pointer"
              onClick={() => setActiveThought(null)}
              aria-label="Close reader"
            >
              ✕
            </button>

            {/* Main Article Container */}
            <div 
              className="max-w-3xl mx-auto px-6 py-16 md:py-24"
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
                    <span className="text-[10px] text-[#888780] font-semibold block uppercase tracking-wider">
                      {lang === "hi" ? "संयोजक, सोशल मीडिया मॉनिटरिंग सेल" : "Coordinator, Social Media Cell"}
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

        {/* ── CONTACT SECTION ── */}
        <section id="contact" className="py-0 bg-[#FAFAF7] relative overflow-hidden">
          <div className="ambient-blob w-[400px] h-[400px] bg-[#185FA5] top-10 left-[-100px] opacity-8" />

          <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-12 gap-12">
            <AnimatedSection className="md:col-span-5" direction="left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#2C2C2A] tracking-tight mb-4">{t.contactTitle}</h2>
              <p className="text-sm text-[#5F5E5A] leading-relaxed mb-8">{t.contactSub}</p>

              <div className="flex flex-col gap-6">
                {[
                  { icon: "📞", label: t.contactPhone, value: "+91 9454180009", href: "tel:+919454180009" },
                  { icon: "✉️", label: t.contactEmail, value: "sainiraghvendra@gmail.com", href: "mailto:sainiraghvendra@gmail.com" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span className="w-11 h-11 rounded-xl glass flex items-center justify-center text-lg shadow-sm border border-[#e5e3dc] shrink-0">{item.icon}</span>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#888780] block">{item.label}</span>
                      <a href={item.href} className="text-sm font-semibold text-[#2C2C2A] hover:text-[#EF9F27] transition-colors">{item.value}</a>
                    </div>
                  </div>
                ))}
                <div className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-xl glass flex items-center justify-center text-lg shadow-sm border border-[#e5e3dc] shrink-0">📍</span>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#888780] block">{t.contactAddress}</span>
                    <span className="text-sm font-semibold text-[#2C2C2A] leading-relaxed">
                      {lang === "hi"
                        ? "खानपुर कदीम, दिघरुवा, बिन्दकी, फतेहपुर, उत्तर प्रदेश"
                        : "Khanpur Kadim, Digharua, Bindki, Fatehpur, Uttar Pradesh"}
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection className="md:col-span-7" direction="right" delay={100}>
              <div className="card-glass p-8 card-accent-saffron">
                {formSubmitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <span className="text-5xl mb-4 animate-float">🙏</span>
                    <h3 className="text-lg font-bold text-[#1D9E75]">{lang === "hi" ? "संदेश सफलतापूर्वक भेजा गया!" : "Message Sent Successfully!"}</h3>
                    <p className="text-xs text-[#5F5E5A] mt-1">{lang === "hi" ? "हम जल्द ही आपसे संपर्क करेंगे।" : "We will get in touch with you shortly."}</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                    {[
                      { label: t.contactFormName, name: "name", type: "text", required: true, placeholder: "e.g. Rakesh Kumar" },
                      { label: t.contactFormEmail, name: "email", type: "email", required: false, placeholder: "e.g. rakesh@example.com" },
                    ].map(field => (
                      <div key={field.name}>
                        <label className="text-xs font-bold text-[#5F5E5A] block mb-2">{field.label}</label>
                        <input
                          type={field.type}
                          name={field.name}
                          required={field.required}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          className="w-full text-sm border border-[#e5e3dc] rounded-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-white/60 backdrop-blur-sm"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="text-xs font-bold text-[#5F5E5A] block mb-2">{t.contactFormMsg}</label>
                      <textarea
                        rows={4}
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="..."
                        className="w-full text-sm border border-[#e5e3dc] rounded-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-white/60 backdrop-blur-sm resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#EF9F27] to-[#BA7517] text-white hover:from-[#BA7517] hover:to-[#8a5410] font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-[#EF9F27]/20 hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      {t.contactFormBtn}
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-[#1a1a18] text-[#888780] py-8 border-t border-black">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#EF9F27] to-[#BA7517] flex items-center justify-center text-white font-bold text-xs shadow-md">
                RS
              </div>
              <div>
                <span className="font-bold text-sm tracking-wider text-white block">RAGHVENDRA SAINI</span>
                <span className="text-[10px] text-[#EF9F27]/70 uppercase tracking-widest">BJP · UP Govt</span>
              </div>
            </div>

            <p className="text-xs text-center sm:text-left text-[#5F5E5A] max-w-md">{t.footerText}</p>

            <nav className="flex items-center gap-4 text-xs font-bold text-white/70">
              <Link href="/admin" className="hover:text-[#EF9F27] transition-colors">Admin Portal</Link>
              <span className="text-white/20">·</span>
              <a href="#about" className="hover:text-[#EF9F27] transition-colors">↑ Top</a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
