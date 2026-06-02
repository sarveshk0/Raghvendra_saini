/**
 * seed-firebase.js — Raghvendra Saini Campaign Portal
 * Pure In-Memory Firebase Firestore Seeder Script
 *
 * Houses all initial mock data in-memory and uploads them to Firestore.
 * Run this to completely initialize or reset your Firestore cloud database.
 *
 * Usage:
 *   npm run seed
 */

// Load env vars from .env.local
require('dotenv').config({ path: '.env.local' });

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, addDoc, getDocs, deleteDoc } = require('firebase/firestore');

// ── Firebase Config ─────────────────────────────────────────
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
  console.error('❌ Firebase credentials missing. Fill in .env.local first!');
  process.exit(1);
}

// ── Initialize ──────────────────────────────────────────────
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── In-Memory Datasets ───────────────────────────────────────

const PROFILE = {
  nameHi: "राघवेन्द्र सैनी",
  nameEn: "Raghvendra Saini",
  educationHi: "एम.ओ.एम.सी., एम.ए., एलएलबी",
  educationEn: "M.O.M.C., M.A., LLB",
  currentRoleHi: "संयोजक, सोशल मीडिया मॉनिटरिंग सेल, गृह विभाग, उत्तर प्रदेश सरकार",
  currentRoleEn: "Coordinator, Social Media Monitoring Cell, Home Dept., UP Govt.",
  partyAffiliationHi: "भारतीय जनता पार्टी (भाजपा)",
  partyAffiliationEn: "Bharatiya Janata Party (BJP)",
  sanghExperienceHi: "20+ वर्ष",
  sanghExperienceEn: "20+ Years",
  contact: "9454180009",
  email: "sainiraghvendra@gmail.com",
  profileImage: ""
};

const SETTINGS = {
  lang: "hindi",
  privacyProfile: true,
  privacyDocs: false,
  showContact: true
};

const ANALYTICS = {
  totalViews: 17020,
  avgTime: "2m 34s",
  topSection: "Timeline",
  months: ["Jan", "Feb", "Mar", "Apr", "May"],
  views: [2100, 2800, 3200, 4100, 4820]
};

const TIMELINE = [
  { year: "2007+", roleHi: "मुख्य शिक्षक, शाखा कार्यवाह", roleEn: "Mukhya Shikshak, Shakha Karyawah", orgHi: "राष्ट्रीय स्वयंसेवक संघ (RSS)", orgEn: "Rashtriya Swayamsevak Sangh (RSS)", cat: "political" },
  { year: "2013–16", roleHi: "संस्थान प्रमुख", roleEn: "Campus Head", orgHi: "काशी हिंदू विश्वविद्यालय (BHU)", orgEn: "Banaras Hindu University (BHU)", cat: "education" },
  { year: "2016–17", roleHi: "थिंक इंडिया कोऑर्डिनेटर (ABVP)", roleEn: "Think India Coordinator (ABVP)", orgHi: "IIMCS, नई दिल्ली", orgEn: "IIMCS, New Delhi", cat: "political" },
  { year: "2017", roleHi: "मीडिया प्रभारी — राष्ट्रीय अधिवेशन", roleEn: "Media Head — National Convention", orgHi: "भारतीय मजदूर संघ, कानपुर", orgEn: "Bharatiya Mazdoor Sangh, Kanpur", cat: "political" },
  { year: "2017–20", roleHi: "मीडिया शोधकर्ता", roleEn: "Media Researcher", orgHi: "जम्मू कश्मीर अध्ययन केंद्र", orgEn: "J&K Study Centre", cat: "education" },
  { year: "Present", roleHi: "संयोजक, सोशल मीडिया मॉनिटरिंग सेल", roleEn: "Coordinator, Social Media Monitoring Cell", orgHi: "गृह विभाग, उत्तर प्रदेश सरकार", orgEn: "Home Dept., UP Govt.", cat: "govt", active: true },
];

const THOUGHTS = [
  { titleHi: "सोशल मीडिया और राष्ट्रीय सुरक्षा", titleEn: "Social Media & National Security", descHi: "डिजिटल युग में अफवाहों पर अंकुश और कानून व्यवस्था बनाए रखने में सोशल मीडिया सेल की महत्वपूर्ण भूमिका पर प्रकाश।", descEn: "Insights on the pivotal role of social monitoring cells in controlling digital rumors and maintaining order.", status: "published", date: "2026-05-20", tags: ["Security", "Digital"], views: 1240 },
  { titleHi: "कश्मीर: मीडिया का सच और झूठ", titleEn: "Kashmir: Media Truth & Lies", descHi: "कश्मीर के संदर्भ में मीडिया रिपोर्टिंग की विसंगतियां और यथार्थ पर शोध-आधारित विश्लेषण।", descEn: "Research-based analysis of the discrepancies and realities of media reporting in Kashmir.", status: "published", date: "2026-04-15", tags: ["Kashmir", "Research"], views: 3800 },
  { titleHi: "युवा और राजनीति में भागीदारी", titleEn: "Youth Participation in Politics", descHi: "सशक्त राष्ट्र निर्माण हेतु युवाओं की राजनैतिक चेतना और नेतृत्व क्षमता का विकास।", descEn: "Development of youth's political awareness and leadership capabilities for strong nation building.", status: "published", date: "2026-05-28", tags: ["Youth", "Politics"], views: 2900 },
  { titleHi: "UP शासन में डिजिटल क्रांति", titleEn: "Digital Revolution in UP Governance", descHi: "माननीय मुख्यमंत्री योगी आदित्यनाथ जी के नेतृत्व में उत्तर प्रदेश शासन की लोक-कल्याणकारी नीतियों की तीव्र डिजिटल पहुँच।", descEn: "How digitized public channels under CM Yogi Adityanath's leadership are optimizing citizen grievance redresses.", status: "published", date: "2026-06-01", tags: ["UP Govt", "Tech"], views: 4350 },
  { titleHi: "फतेहपुर में डिजिटल साक्षरता की नई अलख", titleEn: "Digital Literacy Campaign in Fatehpur", descHi: "ग्रामीण फतेहपुर के युवाओं को मुख्यधारा की डिजिटल तकनीक से जोड़ने और रोजगार के नए अवसर प्रदान करने का अभियान।", descEn: "A comprehensive drive connecting rural Fatehpur youth with core digital technologies and opening new career pathways.", status: "published", date: "2026-05-10", tags: ["Fatehpur", "Literacy"], views: 2450 },
  { titleHi: "भारतीय राष्ट्रवाद और आज का युवा", titleEn: "Indian Nationalism and Modern Youth", descHi: "राष्ट्रवादी सोच and सांस्कृतिक विरासत के साथ आधुनिक तकनीक के समन्वय द्वारा भारत को विश्व गुरु बनाने का संकल्प।", descEn: "Harnessing nationalist values and cultural heritage alongside modern technology to strengthen youth contributions.", status: "published", date: "2026-05-25", tags: ["Nationalism", "Youth"], views: 4200 },
  { titleHi: "भारत का सांस्कृतिक पुनरुत्थान", titleEn: "India's Cultural Resurgence", descHi: "श्रीराम जन्मभूमि मंदिर निर्माण और भारत के सांस्कृतिक गौरव के नव-उत्थान पर समाजशास्त्रीय दृष्टिकोण।", descEn: "A sociological perspective on the construction of the Shri Ram Janmabhoomi Temple and India's cultural rebirth.", status: "published", date: "2026-05-15", tags: ["Culture", "Nationalism"], views: 3100 },
  { titleHi: "नागरिकता कानून और जन-संवाद", titleEn: "Citizenship Law & Public Dialogue", descHi: "नागरिकता संशोधन अधिनियम (CAA) के प्रावधानों पर जन-चेतना और रचनात्मक संवाद की आवश्यकता।", descEn: "The necessity of public awareness and constructive dialogues around the Citizenship Amendment Act (CAA).", status: "published", date: "2026-04-20", tags: ["Governance", "Politics"], views: 2700 },
  { titleHi: "डिजिटल साक्षरता से सशक्त नारी", titleEn: "Empowering Women via Digital Literacy", descHi: "ग्रामीण उत्तर प्रदेश की महिलाओं को ऑनलाइन माध्यमों और आत्मनिर्भरता योजनाओं से जोड़ने का विमर्श।", descEn: "Discussions on connecting rural UP women with online channels and self-reliance welfare programs.", status: "published", date: "2026-05-05", tags: ["Literacy", "Youth"], views: 1800 },
  { titleHi: "भारतीय संस्कृति में योग और स्वास्थ्य की प्रासंगिकता", titleEn: "Relevance of Yoga & Health in Indian Culture", descHi: "आधुनिक जीवनशैली में तनाव मुक्ति और शारीरिक-मानसिक कल्याण के लिए पारंपरिक योग पद्धतियों के महत्व पर चर्चा।", descEn: "Discussions on the importance of traditional yoga practices for stress relief and physical-mental well-being in modern lifestyle.", status: "published", date: "2026-06-02", tags: ["Culture", "Wellness"], views: 1950 },
  { titleHi: "डिजिटल इंडिया और आत्मनिर्भर उत्तर प्रदेश", titleEn: "Digital India & Self-Reliant Uttar Pradesh", descHi: "उत्तर प्रदेश को एक ट्रिलियन डॉलर अर्थव्यवस्था बनाने में डिजिटल तकनीक और स्टार्टअप इकोसिस्टम का योगदान।", descEn: "Contribution of digital technologies and startup ecosystems in making Uttar Pradesh a one-trillion-dollar economy.", status: "published", date: "2026-05-30", tags: ["Tech", "UP Govt"], views: 2150 },
  { titleHi: "फतेहपुर में जल संरक्षण योजना और जनभागीदारी", titleEn: "Water Conservation & Public Participation in Fatehpur", descHi: "भूजल स्तर सुधारने और पारंपरिक जलाशयों के संरक्षण में ग्रामीण समुदायों की सक्रिय सहभागिता का महत्व।", descEn: "Importance of active rural community participation in improving groundwater levels and preserving traditional water reservoirs.", status: "published", date: "2026-05-12", tags: ["Fatehpur", "Conservation"], views: 1400 },
  { titleHi: "स्वदेशी उत्पादों को बढ़ावा देने में युवाओं की भूमिका", titleEn: "Role of Youth in Promoting Swadeshi Products", descHi: "स्थानीय कला, शिल्प और कुटीर उद्योगों को डिजिटल प्लेटफॉर्म के जरिए वैश्विक पहचान दिलाने का युवाओं का संकल्प।", descEn: "Youth's resolution to give global identity to local art, craft, and cottage industries through digital platforms.", status: "published", date: "2026-05-18", tags: ["Youth", "Self-Reliance"], views: 1720 },
  { titleHi: "राष्ट्र प्रथम: हमारा संकल्प, हमारा पथ", titleEn: "Nation First: Our Resolution, Our Path", descHi: "राष्ट्र की एकता, अखंडता और सुरक्षा के प्रति नागरिक कर्तव्यों और सामाजिक मूल्यों का निर्वहन।", descEn: "Upholding citizen duties and social values towards the unity, integrity, and security of the nation.", status: "published", date: "2026-06-03", tags: ["Nationalism", "Governance"], views: 3200 }
];

const MEDIA = [
  { title: "UP सरकार की डिजिटल नीति पर विशेष साक्षात्कार", outlet: "Dainik Jagran", type: "interview", date: "2026-03-10" },
  { title: "Social Media Monitoring in Governance", outlet: "The Hindu", type: "article", date: "2026-01-22" },
  { title: "कश्मीर अध्ययन: मीडिया रिपोर्ट", outlet: "Aaj Tak", type: "video", date: "2025-11-05" },
  { title: "BJP Youth Leadership Panel Discussion", outlet: "Republic Bharat", type: "video", date: "2025-09-18" },
  { title: "साइबर सुरक्षा एवं अफवाहों पर रोकथाम पर मीडिया वक्तव्य", outlet: "News18 UP", type: "interview", date: "2026-04-05" },
  { title: "डिजिटल साक्षरता और युवा रोजगार अवसर", outlet: "Amar Ujala", type: "article", date: "2026-04-18" },
  { title: "यूपी में सोशल मीडिया सेल का योगदान", outlet: "Zee News", type: "video", date: "2026-05-12" },
  { title: "Voter Mobilization in Uttar Pradesh Rural Hubs", outlet: "Indian Express", type: "article", date: "2026-05-29" },
  { title: "फतेहपुर में स्वास्थ्य शिविरों के सफल आयोजन पर विशेष कवरेज", outlet: "Amar Ujala", type: "article", date: "2026-04-25" },
  { title: "डिजिटल मॉनिटरिंग और सुरक्षा व्यवस्था पर संगोष्ठी में संबोधन", outlet: "Dainik Bhaskar", type: "article", date: "2026-05-15" },
  { title: "BJP organizational meeting and youth outreach in Bindki Tehsil", outlet: "News Nation", type: "video", date: "2026-05-22" },
  { title: "Interview: Balancing technology with grassroots social service in UP", outlet: "The Pioneer", type: "interview", date: "2026-05-02" },
  { title: "राष्ट्रवादी पत्रकारिता एवं समाज निर्माण में मीडिया का योगदान", outlet: "Hindusthan Samachar", type: "article", date: "2026-06-01" }
];

const COMMUNITY = [
  {
    titleHi: "सोशल मीडिया मॉनिटरिंग सेल",
    titleEn: "Social Media Monitoring Cell",
    beneficiariesHi: "सक्रिय राज्य स्तरीय",
    beneficiariesEn: "Active State Level",
    areaHi: "गृह विभाग, उत्तर प्रदेश सरकार",
    areaEn: "Home Department, UP Government",
    year: "2020–Present",
    descHi: "गृह विभाग (उत्तर प्रदेश सरकार) के अधीन सोशल मीडिया मॉनिटरिंग सेल के संयोजक के रूप में साइबर सुरक्षा, जन-जागरूकता और डिजिटल विमर्श का प्रबंधन।",
    descEn: "Heading the monitoring cell under UP Home Dept to manage public communication and security metrics.",
    icon: "⚖️",
    accent: "card-accent-blue",
    iconBg: "bg-[#E6F1FB] text-[#185FA5]",
    detailsHi: "<h3><strong>साइबर सुरक्षा और डिजिटल पब्लिक गवर्नेंस</strong></h3><p>गृह विभाग, उत्तर प्रदेश सरकार के अधीन सोशल मीडिया मॉनिटरिंग सेल के संयोजक के रूप में राघवेन्द्र सैनी राज्य के डिजिटल पारिस्थितिकी तंत्र की सुरक्षा में महत्वपूर्ण भूमिका निभा रहे हैं।</p><h4>प्रमुख उपलब्धियां और कार्यक्षेत्र:</h4><ul><li><strong>24/7 डिजिटल मॉनिटरिंग:</strong> सभी सोशल मीडिया प्लेटफार्मों पर जनभावनाओं, सुरक्षा चिंताओं और भ्रामक प्रचारों की निगरानी के लिए एक समर्पित टीम का नेतृत्व।</li><li><strong>Cyber Threat Mitigation:</strong> ऑनलाइन सुरक्षा खतरों को ट्रैक करने और उन्हें बेअसर करने के लिए कानून प्रवर्तन एजेंसियों के साथ त्वरित समन्वय।</li><li><strong>जन-जागरूकता अभियान:</strong> नागरिकों को डिजिटल अधिकारों, साइबर सुरक्षा और सरकारी शिकायत निवारण चैनलों के प्रति शिक्षित करने के लिए ऑनलाइन अभियान।</li></ul>",
    detailsEn: "<h3><strong>Cyber Security & Digital Public Governance</strong></h3><p>As the Coordinator of the Social Media Monitoring Cell under the Home Department, Uttar Pradesh Government, Raghvendra Saini plays a crucial role in safeguarding the state's digital ecosystem.</p><h4>Key Achievements & Core Duties:</h4><ul><li><strong>24/7 Digital Monitoring:</strong> Leading a dedicated team to monitor and analyze public sentiments, security concerns, and fake news dissemination across all social platforms.</li><li><strong>Cyber Threat Mitigation:</strong> Quick coordination with law enforcement agencies to track and neutralize online security threats, preventing rumor escalations.</li><li><strong>Public Awareness Drives:</strong> Initiating online campaigns to educate citizens on digital rights, cyber security hygiene, and governmental grievance redress channels.</li><li><strong>Crisis Management:</strong> Managed critical digital communication campaigns during major state policies and public security milestones.</li></ul>"
  },
  {
    titleHi: "डिजिटल साक्षरता अभियान",
    titleEn: "Digital Literacy Camps",
    beneficiariesHi: "5,000+ ग्रामीण युवा",
    beneficiariesEn: "5,000+ Rural Youth",
    areaHi: "फतेहपुर जिला",
    areaEn: "Fatehpur District",
    year: "2022–23",
    descHi: "फतेहपुर जिले में 5,000+ से अधिक ग्रामीण युवाओं को डिजिटल साक्षर बनाने और आधुनिक तकनीकी विधाओं से जोड़ने का सफल प्रयास।",
    descEn: "Successfully educated 5,000+ rural youths on digital skills across the Fatehpur district.",
    icon: "📱",
    accent: "card-accent-saffron",
    iconBg: "bg-[#FAEEDA] text-[#BA7517]",
    detailsHi: "<h3><strong>तकनीक के माध्यम से ग्रामीण उत्तर प्रदेश का सशक्तिकरण</strong></h3><p>फतेहपुर जिले के सुदूर क्षेत्रों के युवाओं में डिजिटल विभाजन को समाप्त करने के लिए एक व्यापक डिजिटल प्रशिक्षण अभियान की रूपरेखा तैयार कर उसे धरातल पर उतारा।</p><h4>अभियान की मुख्य विशेषताएं:</h4><ul><li><strong>मूल तकनीकी प्रशिक्षण:</strong> 5,000 से अधिक ग्रामीण युवाओं को कंप्यूटर के बुनियादी उपयोग, इंटरनेट नेविगेशन, सुरक्षित ऑनलाइन बैंकिंग और आधुनिक डिजिटल उपकरणों का व्यावहारिक प्रशिक्षण।</li><li><strong>रोजगार के अवसर:</strong> प्रशिक्षित युवाओं को उभरते हुए डिजिटल रोजगार, कॉल सेंटर भूमिकाओं और जन सेवा केंद्र (CSC) के संचालन से जोड़ा।</li></ul>",
    detailsEn: "<h3><strong>Empowering Rural Uttar Pradesh through Technology</strong></h3><p>Designed and executed a mass digital training framework targeted at youth in the remote parts of Fatehpur District to bridge the tech divide.</p><h4>Initiative Highlights:</h4><ul><li><strong>Core Tech Training:</strong> Taught basic computing, internet navigation, online banking safety, and standard digital tools to over 5,000 young individuals.</li><li><strong>Employment Opportunities:</strong> Linked trainees with emerging digital jobs, call center roles, and e-governance service operators (CSC).</li><li><strong>Mobile Learning Labs:</strong> Deployed vans with laptop systems to provide hands-on experience directly at their village centers.</li></ul>"
  },
  {
    titleHi: "मतदाता जागरूकता अभियान",
    titleEn: "Voter Awareness Drive",
    beneficiariesHi: "12,000+ पंजीकृत नागरिक",
    beneficiariesEn: "12,000+ Registered Citizens",
    areaHi: "बिन्दकी तहसील",
    areaEn: "Bindki Tehsil",
    year: "2024",
    descHi: "बिन्दकी तहसील में 12,000+ से अधिक नए मतदाताओं को लोकतांत्रिक प्रक्रिया से जोड़ने हेतु वृहद जन-जागरण अभियान।",
    descEn: "Empowered and registered 12,000+ citizens in Bindki Tehsil to build a robust electoral footprint.",
    icon: "🤝",
    accent: "card-accent-green",
    iconBg: "bg-[#E1F5EE] text-[#1D9E75]",
    detailsHi: "<h3><strong>लोकतांत्रिक नींव का सुदृढ़ीकरण</strong></h3><p>उत्तर प्रदेश की चुनावी प्रक्रियाओं में मतदाताओं की अधिकतम भागीदारी और डिजिटल पंजीकरण सुनिश्चित करने के लिए एक वृहद गैर-पक्षपाती अभियान।</p><h4>मुख्य प्रभाव और परिणाम:</h4><ul><li><strong>वृहद पंजीकरण:</strong> राष्ट्रीय मतदाता सेवा पोर्टल (NVSP) के माध्यम से 12,000 से अधिक नए और युवा मतदाताओं के पंजीकरण और सत्यापन में सहायता।</li><li><strong>युवा संवाद:</strong> मतदान के महत्व को रेखांकित करने के लिए विभिन्न शैक्षणिक संस्थानों में 50 से अधिक कार्यशालाएं, वाद-विवाद प्रतियोगिताएं आयोजित कीं।</li></ul>",
    detailsEn: "<h3><strong>Strengthening Democratic Foundations</strong></h3><p>A non-partisan citizen engagement initiative designed to maximize voter participation and digital registration in UP's electoral processes.</p><h4>Key Impact Metrics:</h4><ul><li><strong>Mass Registrations:</strong> Successfully helped register and verify over 12,000 new and young voters using the digital NVSP portal.</li><li><strong>Youth Forums:</strong> Organized over 50 campus workshops, debate sessions, and awareness matches to stress the value of voting.</li><li><strong>Booth-Level Coordination:</strong> Mobilized volunteers to help elderly and disabled citizens reach polling centers safely.</li></ul>"
  },
  {
    titleHi: "निःशुल्क कानूनी सहायता अभियान",
    titleEn: "Free Legal Aid Initiative",
    beneficiariesHi: "800+ वंचित वर्ग",
    beneficiariesEn: "800+ Underprivileged",
    areaHi: "खानपुर कदीम",
    areaEn: "Khanpur Kadim",
    year: "2023",
    descHi: "800 से अधिक जरूरतमंद नागरिकों को आवश्यक कानूनी सलाह और मार्गदर्शन प्राप्त करने में सहायता प्रदान की।",
    descEn: "Helped over 800 citizens access essential legal consultation and resolution guidance.",
    icon: "⚖️",
    accent: "card-accent-blue",
    iconBg: "bg-[#E6F1FB] text-[#185FA5]",
    detailsHi: "<h3><strong>वंचित वर्गों के लिए न्याय की सुलभता</strong></h3><p>आर्थिक रूप से कमजोर वर्गों को कानूनी जटिलताओं से राहत दिलाने और त्वरित समाधान खोजने के लिए कानूनी विशेषज्ञों की एक टीम के साथ परामर्श अभियान।</p><h4>मुख्य उपलब्धियां:</h4><ul><li><strong>त्वरित परामर्श:</strong> बुनियादी संपत्ति विवादों, पारिवारिक मामलों और सरकारी लाभों की फाइलिंग से जुड़े मामलों के निवारण के लिए 24 विशेष परामर्श शिविरों का आयोजन।</li><li><strong>कानूनी साक्षरता:</strong> 10 से अधिक ग्रामीण क्षेत्रों में कानूनी जागरूकता पुस्तिकाएं वितरित कर जनचेतना का प्रसार।</li></ul>",
    detailsEn: "<h3><strong>Access to Justice for Underprivileged Sections</strong></h3><p>An advisory drive organized with certified legal professionals to support the economically weaker groups with legal clarity and conflict resolutions.</p><h4>Key Impact Metrics:</h4><ul><li><strong>Direct Resolutions:</strong> Conducted 24 consultation drives addressing basic property disputes, familial matters, and governmental benefit filings.</li><li><strong>Legal Literacy:</strong> Disseminated legal rights booklets in simple Hindi text to improve general legal literacy in over 10 surrounding villages.</li></ul>"
  },
  {
    titleHi: "स्वास्थ्य एवं कल्याण शिविर",
    titleEn: "Health & Wellness Camps",
    beneficiariesHi: "3,000+ ग्रामीण नागरिक",
    beneficiariesEn: "3,000+ Rural Citizens",
    areaHi: "फतेहपुर तहसील",
    areaEn: "Fatehpur Tehsil",
    year: "2023–24",
    descHi: "फतेहपुर के ग्रामीण क्षेत्रों में निःशुल्क स्वास्थ्य जाँच, परामर्श और दवा वितरण शिविरों का आयोजन।",
    descEn: "Organised free health checkups, physician consultations, and medicine distribution camps across Fatehpur villages.",
    icon: "🏥",
    accent: "card-accent-blue",
    iconBg: "bg-[#E6F1FB] text-[#185FA5]",
    detailsHi: "<h3><strong>ग्रामीण स्वास्थ्य सेवा सुधार अभियान</strong></h3><p>ग्रामीण क्षेत्रों में स्वास्थ्य सुविधाओं की सुगम पहुँच सुनिश्चित करने के लिए चिकित्सा विशेषज्ञों के सहयोग से निःशुल्क स्वास्थ्य शिविरों का सफल आयोजन।</p><h4>मुख्य प्रभाव:</h4><ul><li><strong>निःशुल्क जाँच व परामर्श:</strong> 3,000 से अधिक ग्रामीणों की जाँच और निःशुल्क औषधियों का वितरण।</li><li><strong>विशेषज्ञ परामर्श:</strong> हृदय रोग, नेत्र रोग और सामान्य चिकित्सा के वरिष्ठ डॉक्टरों द्वारा परामर्श।</li></ul>",
    detailsEn: "<h3><strong>Rural Health Service Improvement Campaign</strong></h3><p>Successfully organized free medical camps in cooperation with healthcare specialists to ensure accessible diagnostics in remote villages.</p><h4>Key Milestones:</h4><ul><li><strong>Diagnostics & Care:</strong> Provided free health checkups and distributed essential medicines to over 3,000 rural residents.</li><li><strong>Specialist Consultations:</strong> Brought cardiologists, ophthalmologists, and general physicians directly to rural sub-centers.</li></ul>"
  },
  {
    titleHi: "पर्यावरण संरक्षण एवं वृक्षारोपण",
    titleEn: "Environment Protection & Greenery Drive",
    beneficiariesHi: "10,000+ पौधे रोपित",
    beneficiariesEn: "10,000+ Saplings Planted",
    areaHi: "फतेहपुर जनपद",
    areaEn: "Fatehpur District",
    year: "2024",
    descHi: "पर्यावरण संरक्षण हेतु वृहद वृक्षारोपण अभियान और जल संरक्षण जागरूकता गोष्ठियों का आयोजन।",
    descEn: "Led a mass tree plantation drive and organized water conservation awareness workshops in Bindki and Fatehpur.",
    icon: "🌱",
    accent: "card-accent-green",
    iconBg: "bg-[#E1F5EE] text-[#1D9E75]",
    detailsHi: "<h3><strong>हरित फतेहपुर अभियान</strong></h3><p>जलवायु परिवर्तन की चुनौतियों से निपटने और हरित आवरण बढ़ाने के लिए स्थानीय स्कूलों, सामाजिक संस्थाओं और कार्यकर्ताओं के सहयोग से वृहद अभियान।</p><h4>मुख्य उपलब्धियां:</h4><ul><li><strong>वृक्षारोपण:</strong> फतेहपुर जनपद के विभिन्न गांवों और सड़कों के किनारे 10,000 से अधिक छायादार और फलदार पौधों का रोपण।</li><li><strong>जल संरक्षण:</strong> जल संचयन और तालाबों के पुनरुद्धार हेतु जनजागरण अभियान।</li></ul>",
    detailsEn: "<h3><strong>Green Fatehpur Campaign</strong></h3><p>A community-driven greening movement organized in collaboration with local schools, NGOs, and youth clubs to combat environmental degradation.</p><h4>Key Achievements:</h4><ul><li><strong>Mass Plantation:</strong> Planted over 10,000 shade and fruit-bearing saplings along village paths and school premises.</li><li><strong>Conservation Workshops:</strong> Educated citizens on rain-water harvesting methods and pond restoration techniques.</li></ul>"
  },
  {
    titleHi: "जल संरक्षण एवं तालाब पुनरुद्धार अभियान",
    titleEn: "Water Conservation & Pond Revival Campaign",
    beneficiariesHi: "4,000+ ग्रामीण परिवार",
    beneficiariesEn: "4,000+ Rural Families",
    areaHi: "बिन्दकी एवं फतेहपुर ब्लॉक",
    areaEn: "Bindki & Fatehpur Blocks",
    year: "2024–Present",
    descHi: "पारंपरिक तालाबों के पुनरुद्धार, जल संचयन प्रणालियों की स्थापना और ग्रामीण क्षेत्रों में जल स्तर सुधारने का अभियान।",
    descEn: "A community drive to restore traditional water bodies and set up rain-water harvesting systems for rural farming.",
    icon: "💧",
    accent: "card-accent-blue",
    iconBg: "bg-[#E6F1FB] text-[#185FA5]",
    detailsHi: "<h3><strong>जल संचयन और भूजल स्तर सुधार पहल</strong></h3><p>फतेहपुर जिले में गिरते भूजल स्तर की समस्या के समाधान के लिए स्थानीय किसानों और स्वयंसेवकों के सहयोग से तालाबों का जीर्णोद्धार किया गया।</p><h4>मुख्य परिणाम:</h4><ul><li><strong>तालाब पुनरुद्धार:</strong> 12 प्राचीन तालाबों की सिल्ट निकालकर उन्हें जल संग्रहण के अनुकूल बनाया गया।</li><li><strong>वर्षा जल संचयन:</strong> 15 ग्रामीण सरकारी स्कूलों में वॉटर हार्वेस्टिंग सिस्टम की स्थापना।</li></ul>",
    detailsEn: "<h3><strong>Water Conservation & Groundwater Rejuvenation</strong></h3><p>Initiated a volunteer-led scheme to address the depleting water table in Fatehpur by reviving community water reservoirs.</p><h4>Key Results:</h4><ul><li><strong>Pond Revival:</strong> Successfully de-silted and revived 12 historic village ponds to retain monsoon runoff.</li><li><strong>School Systems:</strong> Set up rooftop rainwater harvesting units in 15 rural state schools.</li></ul>"
  },
  {
    titleHi: "स्वदेशी रोजगार मेला",
    titleEn: "Swadeshi Employment Fair",
    beneficiariesHi: "1,500+ स्थानीय युवा",
    beneficiariesEn: "1,500+ Local Youths",
    areaHi: "फतेहपुर जनपद",
    areaEn: "Fatehpur District",
    year: "2023",
    descHi: "स्थानीय उद्योगों, कुटीर उद्योगों और कौशल विकास संस्थानों को युवाओं से जोड़कर रोजगार के नवीन अवसरों का सृजन।",
    descEn: "Connecting local crafts, cottage industries, and skill development bodies with rural youth to generate jobs.",
    icon: "💼",
    accent: "card-accent-saffron",
    iconBg: "bg-[#FAEEDA] text-[#BA7517]",
    detailsHi: "<h3><strong>आत्मनिर्भर फतेहपुर की दिशा में एक कदम</strong></h3><p>प्रधानमंत्री के आत्मनिर्भर भारत अभियान से प्रेरित होकर स्थानीय स्तर पर कौशल विकास और रोजगार मेला आयोजित किया गया।</p><h4>मुख्य विशेषताएं:</h4><ul><li><strong>उद्योगों का समन्वय:</strong> 30 से अधिक स्थानीय लघु उद्योगों और हस्तशिल्प समितियों ने मेले में सहभागिता की।</li><li><strong>कौशल पंजीकरण:</strong> 1,500 से अधिक युवाओं को विभिन्न कौशल प्रशिक्षण कार्यक्रमों के लिए नामांकित किया गया।</li></ul>",
    detailsEn: "<h3><strong>Steps towards a Self-Reliant Fatehpur</strong></h3><p>Inspired by the 'Atmanirbhar Bharat' vision, this fair aimed at promoting local cottage industries and providing job options in UP.</p><h4>Key Highlights:</h4><ul><li><strong>Industry Linkage:</strong> Collaborated with 30+ regional micro-enterprises and handicraft cooperative bodies.</li><li><strong>Skill Enrollment:</strong> Enrolled over 1,500 candidates into certified vocational and digital skill development courses.</li></ul>"
  }
];

const DOCUMENTS = [
  { name: "Degree Certificate — M.O.M.C.", cat: "certificate", date: "2024-01-01", pub: true },
  { name: "Appointment Order — UP Home Dept.", cat: "appointment", date: "2023-06-15", pub: false },
  { name: "J&K Research Report 2020", cat: "research", date: "2020-03-01", pub: true },
  { name: "Aadhaar Card", cat: "id", date: "2022-01-01", pub: false },
  { name: "Party Membership Certificate — BJP", cat: "certificate", date: "2021-01-01", pub: true }
];

const GALLERY = [
  { src: "/gallery_field_visit.png", cat: "field", captionHi: "फील्ड विजिट — ग्रामीण क्षेत्र का निरीक्षण", captionEn: "Field Visit — Rural Area Inspection" },
  { src: "/gallery_meeting.png", cat: "meeting", captionHi: "संगठनात्मक बैठक — कार्यकर्ताओं के साथ संवाद", captionEn: "Organizational Meeting — Discussion with Workers" },
  { src: "/gallery_public_interaction.png", cat: "public", captionHi: "जन संपर्क — जन कल्याण एवं जन-सुनवाई", captionEn: "Public Interaction — Community welfare and hearings" },
  { src: "/gallery_learning.png", cat: "learning", captionHi: "सीखने के पल — शासकीय व नीति अनुसंधान", captionEn: "Learning Moments — Governance & Policy Research" },
  { src: "/gallery_field_visit.png", cat: "field", captionHi: "फील्ड विजिट — किसान संवाद एवं जन-सुनवाई", captionEn: "Field Visit — Farmer Interactions & Grievance Redressal" },
  { src: "/gallery_meeting.png", cat: "meeting", captionHi: "जिला स्तरीय समीक्षा बैठक — प्रशासनिक अधिकारियों के साथ", captionEn: "District Review Meeting — With Administrative Officers" },
  { src: "/gallery_public_interaction.png", cat: "public", captionHi: "जन संपर्क — बिन्दकी तहसील में नागरिक संवाद", captionEn: "Public Interaction — Citizen Dialogues in Bindki Tehsil" },
  { src: "/gallery_learning.png", cat: "learning", captionHi: "नीति अनुसंधान — राष्ट्रीय सुरक्षा और डिजिटल मीडिया संगोष्ठी", captionEn: "Policy Research — National Security & Digital Media Seminar" },
  { src: "/gallery_field_visit.png", cat: "field", captionHi: "फतेहपुर ग्रामीण विकास परियोजनाओं का निरीक्षण", captionEn: "Inspection of Fatehpur Rural Development Projects" },
  { src: "/gallery_meeting.png", cat: "meeting", captionHi: "बीजेपी युवा मोर्चा सांगठनिक बैठक", captionEn: "BJP Youth Wing Organizational Meeting" },
  { src: "/gallery_public_interaction.png", cat: "public", captionHi: "जन संपर्क — मतदाता पंजीकरण शिविर फतेहपुर", captionEn: "Public Interaction — Voter Registration Camp Fatehpur" },
  { src: "/gallery_learning.png", cat: "learning", captionHi: "शोध अध्ययन — जम्मू-कश्मीर अध्ययन केंद्र संगोष्ठी", captionEn: "Research Study — J&K Study Centre Symposium" }
];

const ORGANIZATIONAL = [
  { titleHi: "संघ के वरिष्ठ प्रचारक श्री रामचंद्र पांडेय जी के सानिध्य में संगठनात्मक कार्य किया।", titleEn: "Conducted organizational work under the guidance of senior RSS Pracharak Shri Ramchandra Pandey Ji." },
  { titleHi: "संघ के वरिष्ठ प्रचारक श्री दादा रामगोपाल अवस्थी जी के सानिध्य में प्रज्ञा प्रवाह के कार्यों में सक्रिय सहभागिता निभाई।", titleEn: "Actively participated in Pragya Pravah initiatives under the leadership of senior RSS Pracharak Shri Dada Ramgopal Awasthi Ji." },
  { titleHi: "संघ के वरिष्ठ प्रचारक रहे श्री के. एन. गोविंदाचार्य जी के सानिध्य में गंगा संरक्षण एवं पर्यावरण बचाओ अभियान हेतु कार्य किया।", titleEn: "Served in the Ganga Conservation & Save Environment Campaign under the mentorship of senior RSS Pracharak Shri K. N. Govindacharya Ji." },
  { titleHi: "संघ के वरिष्ठ प्रचारक रहे श्री सूर्यकांत केलकर जी के साथ नागरिकता संशोधन अधिनियम (CAA) एवं NRC के समर्थन में कार्य किया।", titleEn: "Collaborated with senior RSS Pracharak Shri Suryakant Kelkar Ji in support of the Citizenship Amendment Act (CAA) and NRC." },
  { titleHi: "संघ के वरिष्ठ प्रचारक श्री लक्ष्मी नारायण भाला जी के सानिध्य में हिन्दुस्थान समाचार के लिए कार्य किया।", titleEn: "Worked for Hindusthan Samachar under the guidance of senior RSS Pracharak Shri Lakshmi Narayan Bhala Ji." },
  { titleHi: "संघ के वरिष्ठ प्रचारक श्री जे. नंद कुमार जी के सानिध्य में प्रज्ञा प्रवाह के लिए कार्य किया।", titleEn: "Contributed to Pragya Pravah under the mentorship of senior RSS Pracharak Shri J. Nand Kumar Ji." },
  { titleHi: "संघ के वरिष्ठ प्रचारक श्री पवन कुमार जी के सानिध्य में भारतीय मजदूर संघ के लिए कार्य किया।", titleEn: "Worked for the Bharatiya Mazdoor Sangh (BMS) under the guidance of senior RSS Pracharak Shri Pawan Kumar Ji." },
  { titleHi: "संघ के वरिष्ठ प्रचारक एवं भारतीय मजदूर संघ के राष्ट्रीय संगठन मंत्री श्री बी. सुरेंद्रन जी के सानिध्य में संगठनात्मक कार्य किया।", titleEn: "Performed organizational tasks under the leadership of senior RSS Pracharak and BMS National Organizing Secretary Shri B. Surendran Ji." },
  { titleHi: "संघ के वरिष्ठ प्रचारक श्री कश्मीरी लाल जी के सानिध्य में स्वदेशी जागरण मंच के राष्ट्रीय कार्यक्रमों में सहभागिता निभाई।", titleEn: "Participated in national programs of Swadeshi Jagran Manch under the guidance of senior RSS Pracharak Shri Kashmiri Lal Ji." },
  { titleHi: "संघ के वरिष्ठ प्रचारक श्री इंद्रेश कुमार जी के सानिध्य में तीन तलाक एवं समान नागरिक संहिता (Uniform Civil Code) के समर्थन में कार्य किया।", titleEn: "Supported initiatives against Triple Talaq and for the Uniform Civil Code (UCC) under the mentorship of senior RSS Pracharak Shri Indresh Kumar Ji." },
  { titleHi: "संघ के वरिष्ठ प्रचारक श्री चम्पत राय जी के सानिध्य में श्रीराम जन्मभूमि मंदिर निर्माण हेतु कार्य किया।", titleEn: "Contributed to the Shri Ram Janmabhoomi Temple construction drive under the leadership of senior RSS Pracharak Shri Champat Rai Ji." },
  { titleHi: "संघ के वरिष्ठ प्रचारक श्री सुधीर जी के सानिध्य में सेवा भारती के लिए कार्य किया।", titleEn: "Worked for Seva Bharati under the mentorship of senior RSS Pracharak Shri Sudhir Ji." },
  { titleHi: "संघ के अखिल भारतीय सह-प्रचार प्रमुख श्री नरेंद्र ठाकुर जी के सानिध्य में प्रचार विभाग के कार्यों में योगदान दिया।", titleEn: "Contributed to the RSS Publicity Department under All India Joint Publicity Chief Shri Narendra Thakur Ji." },
  { titleHi: "संघ के वरिष्ठ प्रचारक श्री मुकुल कानिटकर जी के सानिध्य में भारतीय शिक्षण मंडल के लिए कार्य किया।", titleEn: "Served the Bharatiya Shikshan Mandal under the leadership of senior RSS Pracharak Shri Mukul Kanitkar Ji." },
  { titleHi: "राष्ट्रीय स्वयंसेवक संघ के सह-सरकार्यवाह श्री अरुण कुमार जी के सानिध्य में अनुच्छेद 35A एवं अनुच्छेद 370 से संबंधित विषयों पर कार्य किया।", titleEn: "Worked on matters regarding Article 35A and Article 370 under RSS Joint General Secretary Shri Arun Kumar Ji." },
  { titleHi: "संघ के वरिष्ठ प्रचारक एवं पद्मश्री सम्मानित बाबा योगेन्द्र जी के सानिध्य में संस्कार भारती के लिए कार्य किया।", titleEn: "Served Sanskar Bharati under the mentorship of senior RSS Pracharak and Padma Shri awardee Baba Yogendra Ji." },
  { titleHi: "संघ के वरिष्ठ प्रचारक एवं संस्कार भारती के राष्ट्रीय महामंत्री श्री अमीर चंद जी के सानिध्य में संस्कार भारती के कार्यों के साथ-साथ राष्ट्रीय एवं अंतरराष्ट्रीय कलाकारों के सहयोग से विभिन्न राष्ट्रीय कार्यक्रमों का समन्वय किया।", titleEn: "Coordinated national programs involving national and international artists for Sanskar Bharati under RSS Pracharak and BMS General Secretary Shri Amir Chand Ji." },
  { titleHi: "संघ के वरिष्ठ प्रचारक श्री प्रेम कुमार जी के सानिध्य में राष्ट्रीय स्वयंसेवक संघ के कार्यों में सक्रिय भूमिका निभाई।", titleEn: "Played an active role in RSS initiatives under the guidance of senior RSS Pracharak Shri Prem Kumar Ji." },
  { titleHi: "संघ एवं विचार परिवार की पत्रिकाओं पांचजन्य, ऑर्गनाइजर एवं राष्ट्रधर्म के लिए समय-समय पर लेखन कार्य किया।", titleEn: "Authored periodic essays and articles for resentment review in Sangh family magazines like Panchjanya, Organiser, and Rashtradharam." },
  { titleHi: "इसके अतिरिक्त, संघ के विभिन्न थिंक टैंक एवं वैचारिक संगठनों के साथ भी सक्रिय रूप से कार्य किया।", titleEn: "Collaborated actively with various nationalist think-tanks and ideological organizations." }
];

// ── Helpers ─────────────────────────────────────────────────

async function cleanCollection(collectionName) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  for (const snapDoc of querySnapshot.docs) {
    await deleteDoc(doc(db, collectionName, snapDoc.id));
  }
}

async function seedSingleDoc(collectionName, docId, data) {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, data);
  console.log(`  ✅ Seeded ${collectionName}/${docId}`);
}

async function seedCollection(collectionName, items) {
  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    const dataWithId = { id: idx + 1, ...item };
    await addDoc(collection(db, collectionName), dataWithId);
  }
  console.log(`  ✅ Seeded collection '${collectionName}' (${items.length} documents)`);
}

// ── Main Seeder ──────────────────────────────────────────────
async function seedAll() {
  console.log('\n🌸 Raghvendra Saini Campaign Portal — In-Memory Firebase Seeder');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`📡 Project: ${firebaseConfig.projectId}\n`);

  console.log('🧹 Clearing legacy Firestore collections to prevent duplicates...');
  await cleanCollection('thoughts');
  await cleanCollection('timeline');
  await cleanCollection('media');
  await cleanCollection('community');
  await cleanCollection('documents');
  await cleanCollection('gallery');
  await cleanCollection('organizational');
  console.log('🧹 Cleanup completed successfully.\n');

  console.log('🚀 Seeding datasets...');
  
  // 1. Single Document endpoints
  await seedSingleDoc('profile', 'main', PROFILE);
  await seedSingleDoc('settings', 'main', SETTINGS);
  await seedSingleDoc('analytics', 'main', ANALYTICS);

  // 2. Collection endpoints
  await seedCollection('thoughts', THOUGHTS);
  await seedCollection('timeline', TIMELINE);
  await seedCollection('media', MEDIA);
  await seedCollection('community', COMMUNITY);
  await seedCollection('documents', DOCUMENTS);
  await seedCollection('gallery', GALLERY);
  await seedCollection('organizational', ORGANIZATIONAL);

  console.log('\n───────────────────────────────────────────────────────────────');
  console.log('🎉 Seeding complete! Database successfully populated in Firestore.\n');
  process.exit(0);
}

seedAll().catch(err => {
  console.error('\n❌ Seeding failed:', err.message);
  process.exit(1);
});
