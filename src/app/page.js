"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LotusOpening from "../components/LotusOpening";
import QuoteMarquee from "../components/QuoteMarquee";
import Navbar from "../components/Navbar";

// Section Components
import AboutSection from "../components/AboutSection";
import JourneySection from "../components/JourneySection";
import CommunitySection from "../components/CommunitySection";
import ThoughtsSection from "../components/ThoughtsSection";
import MediaSection from "../components/MediaSection";
import GallerySection from "../components/GallerySection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import Modals from "../components/Modals";

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
    mediaTitle: "मीडिया कवरेज और साक्षात्कार",
    mediaSub: "प्रमुख समाचार पत्रों, समाचार चैनलों और वेब पोर्टलों पर प्रकाशित विचार व साक्षात्कार",
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
    mediaTitle: "Media Coverage & Interviews",
    mediaSub: "Interviews, articles, and discussions published in leading newspapers, TV channels, and portals",
    footerText: "© 2026 Raghvendra Saini. All rights reserved. BJP Worker & Social Professional."
  }
};

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

  // Thoughts: Search / Category / Pagination
  const [thoughtSearch, setThoughtSearch]   = useState("");
  const [thoughtCatFilter, setThoughtCatFilter] = useState("all");
  const [thoughtPage, setThoughtPage]       = useState(1);
  const THOUGHT_PAGE_SIZE = 12;

  // Community Section: Pagination & Load States
  const [communityPage, setCommunityPage] = useState(1);
  const [communityTotalPages, setCommunityTotalPages] = useState(1);
  const [communityTotal, setCommunityTotal] = useState(0);
  const [communityLoading, setCommunityLoading] = useState(false);
  const COMMUNITY_LIMIT = 3;

  // Media Section: Pagination & Load States
  const [dynamicMedia, setDynamicMedia] = useState([]);
  const [mediaPage, setMediaPage] = useState(1);
  const [mediaTotalPages, setMediaTotalPages] = useState(1);
  const [mediaTotal, setMediaTotal] = useState(0);
  const [mediaLoading, setMediaLoading] = useState(false);
  const MEDIA_LIMIT = 6;

  // Gallery Section: Pagination & Load States
  const [galleryPage, setGalleryPage] = useState(1);
  const [galleryTotalPages, setGalleryTotalPages] = useState(1);
  const [galleryTotal, setGalleryTotal] = useState(0);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const GALLERY_LIMIT = 8;

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

    fetch("/api/organizational")
      .then(res => res.json())
      .then(data => setDynamicOrgWork(Array.isArray(data) ? data : []))
      .catch(e => console.error("Error loading organizational work:", e));
  }, []);

  useEffect(() => {
    setGalleryLoading(true);
    fetch(`/api/gallery?page=${galleryPage}&limit=${GALLERY_LIMIT}&category=${galleryFilter}`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.data)) {
          setDynamicGallery(data.data);
          setGalleryTotalPages(data.totalPages || 1);
          setGalleryTotal(data.total || 0);
        } else {
          setDynamicGallery(Array.isArray(data) ? data : []);
          setGalleryTotalPages(1);
          setGalleryTotal(Array.isArray(data) ? data.length : 0);
        }
      })
      .catch(e => console.error("Error loading gallery:", e))
      .finally(() => setGalleryLoading(false));
  }, [galleryPage, galleryFilter]);

  useEffect(() => {
    setCommunityLoading(true);
    fetch(`/api/community?page=${communityPage}&limit=${COMMUNITY_LIMIT}`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.data)) {
          setDynamicCommunity(data.data);
          setCommunityTotalPages(data.totalPages || 1);
          setCommunityTotal(data.total || 0);
        } else {
          setDynamicCommunity(Array.isArray(data) ? data : []);
          setCommunityTotalPages(1);
          setCommunityTotal(Array.isArray(data) ? data.length : 0);
        }
      })
      .catch(e => console.error("Error loading community:", e))
      .finally(() => setCommunityLoading(false));
  }, [communityPage]);

  useEffect(() => {
    setMediaLoading(true);
    fetch(`/api/media?page=${mediaPage}&limit=${MEDIA_LIMIT}`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.data)) {
          setDynamicMedia(data.data);
          setMediaTotalPages(data.totalPages || 1);
          setMediaTotal(data.total || 0);
        } else {
          setDynamicMedia(Array.isArray(data) ? data : []);
          setMediaTotalPages(1);
          setMediaTotal(Array.isArray(data) ? data.length : 0);
        }
      })
      .catch(e => console.error("Error loading media:", e))
      .finally(() => setMediaLoading(false));
  }, [mediaPage]);

  const t = TRANSLATIONS[lang];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCommunityPageChange = (page) => {
    if (page < 1 || page > communityTotalPages) return;
    setCommunityPage(page);
    const section = document.getElementById("work");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleMediaPageChange = (page) => {
    if (page < 1 || page > mediaTotalPages) return;
    setMediaPage(page);
    const section = document.getElementById("media");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleGalleryPageChange = (page) => {
    if (page < 1 || page > galleryTotalPages) return;
    setGalleryPage(page);
    const section = document.getElementById("gallery");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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

  // Thoughts filters
  const allPublishedThoughts = dynamicThoughts;
  const thoughtCategories = [...new Set(allPublishedThoughts.flatMap(t => t.tags || []))].filter(Boolean);

  const thoughtsAfterSearch = thoughtSearch
    ? allPublishedThoughts.filter(t =>
        (t.titleHi || "").toLowerCase().includes(thoughtSearch.toLowerCase()) ||
        (t.titleEn || "").toLowerCase().includes(thoughtSearch.toLowerCase()) ||
        (t.descHi  || "").toLowerCase().includes(thoughtSearch.toLowerCase()) ||
        (Array.isArray(t.tags) && t.tags.some(tag => tag.toLowerCase().includes(thoughtSearch.toLowerCase())))
      )
    : allPublishedThoughts;

  const thoughtsAfterCat = thoughtCatFilter === "all"
    ? thoughtsAfterSearch
    : thoughtsAfterSearch.filter(t => Array.isArray(t.tags) && t.tags.includes(thoughtCatFilter));

  const thoughtTotal     = thoughtsAfterCat.length;
  const thoughtTotalPages = Math.max(1, Math.ceil(thoughtTotal / THOUGHT_PAGE_SIZE));
  const thoughtSafePage   = Math.min(thoughtPage, thoughtTotalPages);
  const paginatedThoughts = thoughtsAfterCat.slice((thoughtSafePage - 1) * THOUGHT_PAGE_SIZE, thoughtSafePage * THOUGHT_PAGE_SIZE);

  const handleThoughtSearch = (val) => { setThoughtSearch(val); setThoughtPage(1); };
  const handleThoughtCat    = (val) => { setThoughtCatFilter(val); setThoughtPage(1); };
  
  const filteredGallery = dynamicGallery;

  return (
    <>
      <LotusOpening onReveal={() => setIntroRevealed(true)} />

      <Navbar lang={lang} setLang={setLang} />

      <ScrollToTop />

      <div
        className={`min-h-screen bg-[#FAFAF7] text-[#2C2C2A] font-sans antialiased selection:bg-[#EF9F27]/30 selection:text-[#BA7517] transition-opacity duration-[1500ms] ease-out ${
          introRevealed ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* ── HERO / ABOUT SECTION ── */}
        <AboutSection
          lang={lang}
          t={t}
          dynamicProfile={dynamicProfile}
          dynamicTimeline={dynamicTimeline}
        />

        {/* ── QUOTE MARQUEE ── */}
        <QuoteMarquee lang={lang} />

        {/* ── JOURNEY / TIMELINE SECTION ── */}
        <JourneySection
          lang={lang}
          t={t}
          journeyTab={journeyTab}
          setJourneyTab={setJourneyTab}
          journeyFilter={journeyFilter}
          setJourneyFilter={setJourneyFilter}
          dynamicTimeline={dynamicTimeline}
          dynamicOrgWork={dynamicOrgWork}
        />

        {/* ── SCOPE OF WORK SECTION ── */}
        <CommunitySection
          lang={lang}
          t={t}
          dynamicCommunity={dynamicCommunity}
          communityLoading={communityLoading}
          communityPage={communityPage}
          communityTotalPages={communityTotalPages}
          handleCommunityPageChange={handleCommunityPageChange}
          setActiveInitiative={setActiveInitiative}
        />

        {/* ── THOUGHTS SECTION ── */}
        <ThoughtsSection
          lang={lang}
          t={t}
          thoughtSearch={thoughtSearch}
          handleThoughtSearch={handleThoughtSearch}
          thoughtCategories={thoughtCategories}
          thoughtCatFilter={thoughtCatFilter}
          handleThoughtCat={handleThoughtCat}
          paginatedThoughts={paginatedThoughts}
          thoughtTotal={thoughtTotal}
          thoughtTotalPages={thoughtTotalPages}
          thoughtSafePage={thoughtSafePage}
          setThoughtPage={setThoughtPage}
          setActiveThought={setActiveThought}
        />

        {/* ── MEDIA COVERAGE SECTION ── */}
        <MediaSection
          lang={lang}
          t={t}
          dynamicMedia={dynamicMedia}
          mediaLoading={mediaLoading}
          mediaPage={mediaPage}
          mediaTotalPages={mediaTotalPages}
          handleMediaPageChange={handleMediaPageChange}
        />

        {/* ── PERSONAL GALLERY SECTION ── */}
        <GallerySection
          lang={lang}
          t={t}
          galleryFilter={galleryFilter}
          setGalleryFilter={setGalleryFilter}
          setGalleryPage={setGalleryPage}
          galleryLoading={galleryLoading}
          filteredGallery={filteredGallery}
          dynamicGallery={dynamicGallery}
          galleryTotalPages={galleryTotalPages}
          galleryPage={galleryPage}
          handleGalleryPageChange={handleGalleryPageChange}
          setActivePhoto={setActivePhoto}
        />

        {/* ── CONTACT SECTION ── */}
        <ContactSection
          lang={lang}
          t={t}
          formData={formData}
          formSubmitted={formSubmitted}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
        />

        {/* ── FOOTER ── */}
        <Footer lang={lang} t={t} />
      </div>

      {/* Overlays / Modals */}
      <Modals
        lang={lang}
        setLang={setLang}
        t={t}
        activePhoto={activePhoto}
        setActivePhoto={setActivePhoto}
        activeInitiative={activeInitiative}
        setActiveInitiative={setActiveInitiative}
        activeThought={activeThought}
        setActiveThought={setActiveThought}
        dynamicProfile={dynamicProfile}
      />
    </>
  );
}
