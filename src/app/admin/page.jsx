"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const COLOR = {
  saffron: "#EF9F27",
  saffronDark: "#BA7517",
  saffronLight: "#FAEEDA",
  green: "#1D9E75",
  greenLight: "#E1F5EE",
  navy: "#185FA5",
  navyLight: "#E6F1FB",
  red: "#E24B4A",
  redLight: "#FCEBEB",
  purple: "#534AB7",
  purpleLight: "#EEEDFE",
};

// ── Smart Auto-Detection & Markdown Engines ──────────────────────────────────
const autoDetectAndFormatHTML = (text) => {
  if (!text) return "";
  
  // Normalize line endings
  let lines = text.split("\n");
  let formattedLines = [];
  let inList = false;
  let inNumList = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Skip empty lines, but close any open lists
    if (line === "") {
      if (inList) { formattedLines.push("</ul>"); inList = false; }
      if (inNumList) { formattedLines.push("</ol>"); inNumList = false; }
      continue;
    }
    
    // Auto-detect headings (### heading -> <h3>heading</h3>)
    if (line.startsWith("### ")) {
      if (inList) { formattedLines.push("</ul>"); inList = false; }
      if (inNumList) { formattedLines.push("</ol>"); inNumList = false; }
      const content = line.substring(4);
      formattedLines.push(`<h3>${content}</h3>`);
      continue;
    }
    if (line.startsWith("#### ")) {
      if (inList) { formattedLines.push("</ul>"); inList = false; }
      if (inNumList) { formattedLines.push("</ol>"); inNumList = false; }
      const content = line.substring(5);
      formattedLines.push(`<h4>${content}</h4>`);
      continue;
    }
    
    // Auto-detect bullet list (* item or - item -> <ul><li>item</li></ul>)
    if (line.startsWith("* ") || line.startsWith("- ")) {
      if (inNumList) { formattedLines.push("</ol>"); inNumList = false; }
      if (!inList) { formattedLines.push("<ul class='list-disc pl-5 mb-4 space-y-1'>"); inList = true; }
      const content = line.substring(2);
      formattedLines.push(`  <li>${content}</li>`);
      continue;
    }
    
    // Auto-detect numbered list (1. item -> <ol><li>item</li></ol>)
    if (/^\d+\.\s/.test(line)) {
      if (inList) { formattedLines.push("</ul>"); inList = false; }
      if (!inNumList) { formattedLines.push("<ol class='list-decimal pl-5 mb-4 space-y-1'>"); inNumList = true; }
      const content = line.replace(/^\d+\.\s/, "");
      formattedLines.push(`  <li>${content}</li>`);
      continue;
    }
    
    // Standard paragraph
    if (inList) { formattedLines.push("</ul>"); inList = false; }
    if (inNumList) { formattedLines.push("</ol>"); inNumList = false; }
    formattedLines.push(`<p>${line}</p>`);
  }
  
  // Close any unclosed list at the end
  if (inList) formattedLines.push("</ul>");
  if (inNumList) formattedLines.push("</ol>");
  
  let html = formattedLines.join("\n");
  
  // Auto-detect bold (**text** or __text__ -> <strong>text</strong>)
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");
  
  // Auto-detect italics (*text* or _text_ -> <em>text</em>)
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");
  
  // Auto-detect links: https://... -> <a href="..." target="_blank" class="...">...</a>
  const urlRegex = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  html = html.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" class="text-[#EF9F27] hover:underline font-semibold">${url}</a>`;
  });
  
  return html;
};

const htmlToEasyText = (html) => {
  if (!html) return "";
  let text = html;
  
  // Replace lists
  text = text.replace(/<ul.*?>/g, "");
  text = text.replace(/<\/ul>/g, "\n");
  text = text.replace(/<ol.*?>/g, "");
  text = text.replace(/<\/ol>/g, "\n");
  text = text.replace(/<li.*?>/g, "* ");
  text = text.replace(/<\/li>/g, "\n");
  
  // Replace headings
  text = text.replace(/<h3>(.*?)<\/h3>/g, "### $1\n");
  text = text.replace(/<h4>(.*?)<\/h4>/g, "#### $1\n");
  
  // Replace paragraphs
  text = text.replace(/<p>&nbsp;<\/p>/g, "\n");
  text = text.replace(/<p.*?>/g, "");
  text = text.replace(/<\/p>/g, "\n");
  
  // Replace formatting
  text = text.replace(/<strong.*?>(.*?)<\/strong>/g, "**$1**");
  text = text.replace(/<em.*?>(.*?)<\/em>/g, "*$1*");
  
  // Replace links
  text = text.replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/g, "$1");
  
  // Remove misc tags
  text = text.replace(/<div.*?>/g, "");
  text = text.replace(/<\/div>/g, "\n");
  text = text.replace(/<br.*?>/g, "\n");
  
  // Normalize
  text = text.split("\n").map(l => l.trim()).join("\n").replace(/\n{3,}/g, "\n\n");
  return text.trim();
};

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "thoughts", label: "My Thoughts", icon: "💭" },
  { id: "political", label: "Journey & RSS", icon: "🏛️" },
  { id: "rss_work", label: "RSS Org Work", icon: "🌸" },
  { id: "media", label: "Media Coverage", icon: "📰" },
  { id: "community", label: "Community", icon: "🤝" },
  { id: "documents", label: "Documents", icon: "📁" },
  { id: "analytics", label: "Analytics", icon: "📊" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

const Badge = ({ children, color = "green" }) => {
  const map = {
    green: { bg: COLOR.greenLight, text: COLOR.green },
    amber: { bg: COLOR.saffronLight, text: COLOR.saffronDark },
    blue: { bg: COLOR.navyLight, text: COLOR.navy },
    red: { bg: COLOR.redLight, text: COLOR.red },
    purple: { bg: COLOR.purpleLight, text: COLOR.purple },
    gray: { bg: "#F1EFE8", text: "#5F5E5A" },
  };
  const c = map[color] || map.green;
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, display: "inline-block" }}>
      {children}
    </span>
  );
};

const StatCard = ({ icon, label, value, sub, color = COLOR.saffron }) => (
  <div style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: "16px 18px", flex: 1, minWidth: 140 }}>
    <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
    <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A", marginTop: 2 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: "#888780", marginTop: 2 }}>{sub}</div>}
  </div>
);

const SectionHeader = ({ title, action, actionLabel }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
    <div style={{ fontSize: 15, fontWeight: 600, color: "#2C2C2A" }}>{title}</div>
    {action && (
      <button onClick={action} style={{ fontSize: 12, background: COLOR.saffron, color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontWeight: 600 }}>
        + {actionLabel}
      </button>
    )}
  </div>
);

// ── DASHBOARD SCREEN ───────────────────────────────────────────────────────────
const Dashboard = ({ profile, thoughts, media, docs }) => {
  const publishedThoughts = thoughts.filter(t => t.status === "published").length;
  const draftThoughts = thoughts.filter(t => t.status === "draft").length;
  const mediaCount = media.length;
  const docsCount = docs.length;
  const privateDocs = docs.filter(d => !d.pub).length;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#2C2C2A" }}>नमस्ते, {profile?.nameEn || "Raghvendra"} जी 🙏</div>
        <div style={{ fontSize: 13, color: "#888780", marginTop: 3 }}>Here's your dynamic campaign cell overview for today</div>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon="👁️" label="Profile Views" value="17,020" sub="Combined analytics" color={COLOR.saffron} />
        <StatCard icon="💭" label="Thoughts Published" value={publishedThoughts} sub={`${draftThoughts} drafts pending`} color={COLOR.navy} />
        <StatCard icon="📰" label="Media Mentions" value={mediaCount} sub="Last 6 months" color={COLOR.green} />
        <StatCard icon="📁" label="Documents" value={docsCount} sub={`${privateDocs} private vault`} color={COLOR.purple} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: "16px 18px" }}>
          <SectionHeader title="Recent Thoughts" />
          {thoughts.slice(0, 3).map(t => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "0.5px solid #f0ede5" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A" }}>{t.titleHi}</div>
                <div style={{ fontSize: 11, color: "#888780", marginTop: 2 }}>{t.date}</div>
              </div>
              <Badge color={t.status === "published" ? "green" : t.status === "draft" ? "amber" : "blue"}>
                {t.status}
              </Badge>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: "16px 18px" }}>
          <SectionHeader title="Social Media Snapshot" />
          {[
            { platform: "Twitter / X", handle: "@sainiraghvendra", followers: "12.4K", color: "#185FA5" },
            { platform: "Facebook", handle: "Raghvendra Saini BJP", followers: "28.1K", color: "#1877F2" },
            { platform: "YouTube", handle: "Raghvendra Saini", followers: "6.8K", color: "#E24B4A" },
            { platform: "WhatsApp Channel", handle: "Official Channel", followers: "9.2K", color: "#1D9E75" },
          ].map(s => (
            <div key={s.platform} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "0.5px solid #f0ede5" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 13, color: "#2C2C2A" }}>{s.platform}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.followers}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${COLOR.saffronLight}, ${COLOR.navyLight})`, border: `0.5px solid ${COLOR.saffron}40`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 28 }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#2C2C2A" }}>AI Assistant Connected</div>
          <div style={{ fontSize: 12, color: "#5F5E5A", marginTop: 2 }}>Ready to generate live blog/thought drafts in Hindi for Raghvendra Ji.</div>
        </div>
      </div>
    </div>
  );
};

// ── PROFILE SCREEN ─────────────────────────────────────────────────────────────
const Profile = ({ profile, onSaveProfile }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const fields = [
    { label: "Name (Hindi)", key: "nameHi" },
    { label: "Name (English)", key: "nameEn" },
    { label: "Education (Hindi)", key: "educationHi" },
    { label: "Education (English)", key: "educationEn" },
    { label: "Current Role (Hindi)", key: "currentRoleHi" },
    { label: "Current Role (English)", key: "currentRoleEn" },
    { label: "Party Affiliation (Hindi)", key: "partyAffiliationHi" },
    { label: "Party Affiliation (English)", key: "partyAffiliationEn" },
    { label: "Sangh Experience (Hindi)", key: "sanghExperienceHi" },
    { label: "Sangh Experience (English)", key: "sanghExperienceEn" },
    { label: "Contact", key: "contact" },
    { label: "Email", key: "email" },
  ];

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async ev => {
        const base64 = ev.target.result;
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file: base64 })
          });
          const data = await res.json();
          if (data.url) {
            handleInputChange("profileImage", data.url);
          } else {
            alert("Upload failed: " + (data.error || "Unknown error"));
          }
        } catch (err) {
          console.error("Upload fetch error:", err);
          alert("Upload failed: Network error");
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Image loading error:", err);
      alert("Failed to read image file.");
      setUploading(false);
    }
  };

  const handleSave = async () => {
    await onSaveProfile(formData);
    setEditing(false);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: 20 }}>
        {/* Avatar — shows real image if set, else initials */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          {formData.profileImage ? (
            <img
              src={formData.profileImage}
              alt={formData.nameEn || "Profile"}
              style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: `3px solid ${COLOR.saffron}`, boxShadow: "0 4px 12px rgba(239,159,39,0.25)", opacity: uploading ? 0.5 : 1 }}
              onError={e => { e.target.style.display = "none"; }}
            />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: COLOR.saffronLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: COLOR.saffronDark, border: `3px solid ${COLOR.saffron}`, opacity: uploading ? 0.5 : 1 }}>RS</div>
          )}
          {uploading && (
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}>⏳</div>
          )}
          {editing && !uploading && (
            <label
              title="Upload from device"
              style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: "50%", background: COLOR.saffron, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
            >
              📷
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={e => handleImageUpload(e.target.files[0])}
              />
            </label>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#2C2C2A" }}>{profile?.nameHi || "राघवेन्द्र सैनी"}</div>
          <div style={{ fontSize: 13, color: "#5F5E5A", marginTop: 2 }}>{profile?.currentRoleEn || "Coordinator, Social Media Monitoring Cell · UP Govt."}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            <Badge color="amber">BJP</Badge>
            <Badge color="blue">UP Government</Badge>
            <Badge color="green">Active</Badge>
          </div>
        </div>
        <button onClick={editing ? handleSave : () => setEditing(true)} style={{ background: editing ? COLOR.green : "#f5f4f0", color: editing ? "#fff" : "#2C2C2A", border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
          {editing ? "✓ Save Profile" : "✏️ Edit Profile"}
        </button>
      </div>

      {/* Profile Image URL / Upload */}
      {editing && (
        <div style={{ background: "#fff", border: `1.5px solid ${COLOR.saffron}30`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#2C2C2A", marginBottom: 10 }}>📸 Profile Image</div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Preview */}
            <div style={{ width: 90, height: 90, borderRadius: 10, overflow: "hidden", border: `2px solid ${COLOR.saffron}40`, flexShrink: 0, background: COLOR.saffronLight, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: uploading ? 0.5 : 1 }} />
              ) : (
                <span style={{ fontSize: 28, opacity: 0.4 }}>👤</span>
              )}
              {uploading && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>⏳ Uploading...</div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>PASTE IMAGE URL</label>
              <input
                type="url"
                value={formData.profileImage || ""}
                onChange={e => handleInputChange("profileImage", e.target.value)}
                placeholder="https://example.com/photo.jpg"
                disabled={uploading}
                style={{ width: "100%", fontSize: 12, border: `1.5px solid ${COLOR.saffron}`, borderRadius: 8, padding: "7px 10px", outline: "none", boxSizing: "border-box", marginBottom: 8, background: uploading ? "#f5f4f0" : "#fff" }}
              />
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>OR UPLOAD FROM DEVICE</label>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 6, background: COLOR.saffronLight, color: COLOR.saffronDark, border: `1px solid ${COLOR.saffron}40`, borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.6 : 1 }}>
                {uploading ? "⏳ Uploading..." : "📁 Choose Photo"}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  style={{ display: "none" }}
                  onChange={e => handleImageUpload(e.target.files[0])}
                />
              </label>
              {formData.profileImage && !uploading && (
                <button
                  onClick={() => handleInputChange("profileImage", "")}
                  style={{ marginLeft: 8, fontSize: 11, color: COLOR.red, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  ✕ Remove
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: 20 }}>
        <SectionHeader title="Personal Information" />
        {fields.map(f => (
          <div key={f.key} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "0.5px solid #f0ede5", alignItems: "flex-start" }}>
            <div style={{ minWidth: 180, fontSize: 13, color: "#888780" }}>{f.label}</div>
            {editing
              ? <input value={formData[f.key] || ""} onChange={e => handleInputChange(f.key, e.target.value)} style={{ flex: 1, fontSize: 13, border: `1.5px solid ${COLOR.saffron}`, borderRadius: 6, padding: "4px 8px", outline: "none" }} />
              : <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A", flex: 1 }}>{profile?.[f.key] || "—"}</div>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

// ── MY THOUGHTS SCREEN ─────────────────────────────────────────────────────────
const Thoughts = ({ thoughts, onSaveThought, onDeleteThought }) => {
  const [view, setView] = useState("list");
  const [filter, setFilter] = useState("all");
  
  // Form states
  const [editingId, setEditingId] = useState(null);
  const [titleHi, setTitleHi] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descHi, setDescHi] = useState("");
  const [descEn, setDescEn] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState("draft");

  // Easy Writer Mode states
  const [writeModeHi, setWriteModeHi] = useState("easy"); // "easy" or "html"
  const [writeModeEn, setWriteModeEn] = useState("easy"); // "easy" or "html"
  const [descHiDraft, setDescHiDraft] = useState("");
  const [descEnDraft, setDescEnDraft] = useState("");

  const handleDescHiDraftChange = (val) => {
    setDescHiDraft(val);
    setDescHi(autoDetectAndFormatHTML(val));
  };

  const handleDescEnDraftChange = (val) => {
    setDescEnDraft(val);
    setDescEn(autoDetectAndFormatHTML(val));
  };

  const insertTag = (id, openTag, closeTag) => {
    const textarea = document.getElementById(id);
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = openTag + selected + (closeTag || "");
    const updatedValue = text.substring(0, start) + replacement + text.substring(end);
    
    if (id === "thoughtDescHi-textarea") {
      setDescHi(updatedValue);
      setDescHiDraft(htmlToEasyText(updatedValue));
    } else if (id === "thoughtDescEn-textarea") {
      setDescEn(updatedValue);
      setDescEnDraft(htmlToEasyText(updatedValue));
    }
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
    }, 50);
  };

  const filtered = filter === "all" ? thoughts : thoughts.filter(t => t.status === filter);

  const startWriteNew = () => {
    setEditingId(null);
    setTitleHi("");
    setTitleEn("");
    setDescHi("");
    setDescEn("");
    setDescHiDraft("");
    setDescEnDraft("");
    setWriteModeHi("easy");
    setWriteModeEn("easy");
    setTagsInput("");
    setStatus("draft");
    setView("write");
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setTitleHi(t.titleHi);
    setTitleEn(t.titleEn || "");
    setDescHi(t.descHi || "");
    setDescEn(t.descEn || "");
    setDescHiDraft(htmlToEasyText(t.descHi || ""));
    setDescEnDraft(htmlToEasyText(t.descEn || ""));
    setWriteModeHi("easy");
    setWriteModeEn("easy");
    setTagsInput(t.tags ? t.tags.join(", ") : "");
    setStatus(t.status);
    setView("write");
  };

  const handleSave = async (customStatus) => {
    const finalStatus = customStatus || status;
    const finalTags = tagsInput.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    const thoughtPayload = {
      titleHi,
      titleEn,
      descHi,
      descEn,
      status: finalStatus,
      tags: finalTags,
      date: new Date().toISOString().split('T')[0]
    };
    
    if (editingId) {
      thoughtPayload.id = editingId;
    }
    
    await onSaveThought(thoughtPayload);
    setView("list");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this thought?")) {
      await onDeleteThought(id);
    }
  };

  if (view === "write") return (
    <div>
      <button onClick={() => setView("list")} style={{ fontSize: 12, color: COLOR.navy, background: "none", border: "none", cursor: "pointer", marginBottom: 16, fontWeight: 600 }}>← Back to list</button>
      <div style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: "#2C2C2A" }}>{editingId ? "✏️ Edit Thought" : "✍️ Write Thought"}</div>
        
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>TITLE (HINDI)</label>
          <input value={titleHi} onChange={e => setTitleHi(e.target.value)} placeholder="पोस्ट का शीर्षक लिखें..." style={{ width: "100%", fontSize: 15, border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "8px 12px", outline: "none", boxSizing: "border-box" }} />
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>TITLE (ENGLISH)</label>
          <input value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder="English title..." style={{ width: "100%", fontSize: 14, border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "8px 12px", outline: "none", boxSizing: "border-box" }} />
        </div>

        {/* Hindi Description Editor */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#888780]">CONTENT (HINDI DESCRIPTION - HINDI / हिंदी)</label>
            <div className="flex bg-[#f0ede5] p-0.5 rounded-lg gap-1 border border-[#d3d1c7] scale-90 origin-right">
              <button type="button" onClick={() => setWriteModeHi("easy")} className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${writeModeHi === "easy" ? "bg-[#EF9F27] text-white shadow" : "text-[#5F5E5A] hover:bg-[#e2dfd5]"}`}>📝 Easy Writer</button>
              <button type="button" onClick={() => setWriteModeHi("html")} className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${writeModeHi === "html" ? "bg-[#185FA5] text-white shadow" : "text-[#5F5E5A] hover:bg-[#e2dfd5]"}`}>💻 HTML Code</button>
            </div>
          </div>

          {writeModeHi === "easy" ? (
            <div>
              <textarea
                rows={20}
                value={descHiDraft}
                onChange={e => handleDescHiDraftChange(e.target.value)}
                placeholder="अपने विचार यहाँ सामान्य भाषा में लिखें... (जैसे: बुलेट सूची के लिए * का उपयोग करें, या लिंक को सीधे पेस्ट करें)"
                className="w-full text-sm border border-[#d3d1c7] rounded-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-white block"
              />
              <div className="mt-1.5 p-2 bg-[#E1F5EE] border border-[#1D9E75]/20 rounded-lg flex items-start gap-2">
                <span className="text-xs">💡</span>
                <span className="text-[10px] font-bold text-[#1D9E75] leading-relaxed">
                  Tip: Type <b>*</b> for bullets, <b>1.</b> for lists, <b>###</b> for headings, and paste URLs directly. We automatically detect and format everything into premium Tailwind elements!
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex gap-1.5 p-2 bg-[#f0ede5] border border-[#d3d1c7] border-b-0 rounded-t-xl">
                <button type="button" onClick={() => insertTag("thoughtDescHi-textarea", "<strong>", "</strong>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">B</button>
                <button type="button" onClick={() => insertTag("thoughtDescHi-textarea", "<em>", "</em>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">I</button>
                <button type="button" onClick={() => insertTag("thoughtDescHi-textarea", "<h3>", "</h3>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">H3</button>
                <button type="button" onClick={() => insertTag("thoughtDescHi-textarea", "<h4>", "</h4>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">H4</button>
                <button type="button" onClick={() => insertTag("thoughtDescHi-textarea", "<p>", "</p>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">P</button>
                <button type="button" onClick={() => insertTag("thoughtDescHi-textarea", "<ul>\n  <li>", "</li>\n</ul>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">List</button>
                <button type="button" onClick={() => insertTag("thoughtDescHi-textarea", "<li>", "</li>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">Item</button>
              </div>
              <textarea
                id="thoughtDescHi-textarea"
                rows={20}
                value={descHi}
                onChange={e => { setDescHi(e.target.value); setDescHiDraft(htmlToEasyText(e.target.value)); }}
                placeholder="अपने विचार यहाँ हिंदी HTML में लिखें..."
                className="w-full text-sm border border-[#d3d1c7] rounded-b-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-[#faf9f5] resize-y font-mono leading-relaxed block"
              />
            </div>
          )}

          <div className="mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#BA7517]">Live Content Preview (Hindi):</span>
            <div dangerouslySetInnerHTML={{ __html: descHi || "<i>हिंदी प्रीव्यू...</i>" }} className="rich-preview-pane-bilingual bg-[#FAFAF7] border border-dashed border-[#d3d1c7] rounded-xl p-4 text-xs text-[#2C2C2A] max-h-36 overflow-y-auto leading-relaxed mt-1 animate-pulse-glow" />
          </div>
        </div>

        {/* English Description Editor */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#888780]">CONTENT (ENGLISH DESCRIPTION)</label>
            <div className="flex bg-[#f0ede5] p-0.5 rounded-lg gap-1 border border-[#d3d1c7] scale-90 origin-right">
              <button type="button" onClick={() => setWriteModeEn("easy")} className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${writeModeEn === "easy" ? "bg-[#EF9F27] text-white shadow" : "text-[#5F5E5A] hover:bg-[#e2dfd5]"}`}>📝 Easy Writer</button>
              <button type="button" onClick={() => setWriteModeEn("html")} className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${writeModeEn === "html" ? "bg-[#185FA5] text-white shadow" : "text-[#5F5E5A] hover:bg-[#e2dfd5]"}`}>💻 HTML Code</button>
            </div>
          </div>

          {writeModeEn === "easy" ? (
            <div>
              <textarea
                rows={20}
                value={descEnDraft}
                onChange={e => handleDescEnDraftChange(e.target.value)}
                placeholder="Write your thoughts easily... (e.g. use * for bullet lists, 1. for lists, or paste links directly)"
                className="w-full text-sm border border-[#d3d1c7] rounded-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-white block"
              />
              <div className="mt-1.5 p-2 bg-[#E1F5EE] border border-[#1D9E75]/20 rounded-lg flex items-start gap-2">
                <span className="text-xs">💡</span>
                <span className="text-[10px] font-bold text-[#1D9E75] leading-relaxed">
                  Tip: Type <b>*</b> for bullets, <b>1.</b> for lists, <b>###</b> for headings, and paste URLs directly. We automatically detect and format everything into premium Tailwind elements!
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex gap-1.5 p-2 bg-[#f0ede5] border border-[#d3d1c7] border-b-0 rounded-t-xl">
                <button type="button" onClick={() => insertTag("thoughtDescEn-textarea", "<strong>", "</strong>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">B</button>
                <button type="button" onClick={() => insertTag("thoughtDescEn-textarea", "<em>", "</em>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">I</button>
                <button type="button" onClick={() => insertTag("thoughtDescEn-textarea", "<h3>", "</h3>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">H3</button>
                <button type="button" onClick={() => insertTag("thoughtDescEn-textarea", "<h4>", "</h4>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">H4</button>
                <button type="button" onClick={() => insertTag("thoughtDescEn-textarea", "<p>", "</p>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">P</button>
                <button type="button" onClick={() => insertTag("thoughtDescEn-textarea", "<ul>\n  <li>", "</li>\n</ul>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">List</button>
                <button type="button" onClick={() => insertTag("thoughtDescEn-textarea", "<li>", "</li>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">Item</button>
              </div>
              <textarea
                id="thoughtDescEn-textarea"
                rows={20}
                value={descEn}
                onChange={e => { setDescEn(e.target.value); setDescEnDraft(htmlToEasyText(e.target.value)); }}
                placeholder="Write English translation in HTML here..."
                className="w-full text-sm border border-[#d3d1c7] rounded-b-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-[#faf9f5] resize-y font-mono leading-relaxed block"
              />
            </div>
          )}

          <div className="mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#BA7517]">Live Content Preview (English):</span>
            <div dangerouslySetInnerHTML={{ __html: descEn || "<i>English preview...</i>" }} className="rich-preview-pane-bilingual bg-[#FAFAF7] border border-dashed border-[#d3d1c7] rounded-xl p-4 text-xs text-[#2C2C2A] max-h-36 overflow-y-auto leading-relaxed mt-1 animate-pulse-glow" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>TAGS (comma-separated)</label>
            <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="politics, UP, digital..." style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "8px 12px", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>STATUS</label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "8px 12px", outline: "none", height: "40px" }}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => handleSave("draft")} style={{ background: "#f5f4f0", color: "#2C2C2A", border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>💾 Save Draft</button>
          <button onClick={() => handleSave("published")} style={{ background: COLOR.green, color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🌐 Publish</button>
          <button onClick={() => handleSave("scheduled")} style={{ background: COLOR.navy, color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>📅 Schedule</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#2C2C2A" }}>My Thoughts — मेरे विचार</div>
        <button onClick={startWriteNew} style={{ background: COLOR.saffron, color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ New Post</button>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {["all", "published", "draft", "scheduled"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 8, border: "0.5px solid", borderColor: filter === f ? COLOR.saffron : "#d3d1c7", background: filter === f ? COLOR.saffronLight : "#fff", color: filter === f ? COLOR.saffronDark : "#5F5E5A", cursor: "pointer", fontWeight: filter === f ? 600 : 400, textTransform: "capitalize" }}>{f}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(t => (
          <div key={t.id} style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#2C2C2A" }}>{t.titleHi}</div>
              <div style={{ fontSize: 12, color: "#888780", marginTop: 2 }}>{t.titleEn} · {t.date}</div>
              {t.descHi && <div style={{ fontSize: 12, color: "#5F5E5A", marginTop: 6, lineHeight: 1.5 }}>{t.descHi}</div>}
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {t.tags && t.tags.map(tag => <Badge key={tag} color="gray">{tag}</Badge>)}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <Badge color={t.status === "published" ? "green" : t.status === "draft" ? "amber" : "blue"}>{t.status}</Badge>
              {t.views > 0 && <div style={{ fontSize: 11, color: "#888780" }}>👁 {t.views.toLocaleString()}</div>}
              <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                <button onClick={() => startEdit(t)} style={{ background: "#f5f4f0", border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}>✏️</button>
                <button onClick={() => handleDelete(t.id)} style={{ background: "#FCEBEB", border: "0.5px solid #f7c1c1", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: COLOR.red, cursor: "pointer" }}>🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── JOURNEY & RSS TIMELINE SCREEN ──────────────────────────────────────────────
const Political = ({ timeline, onSaveRole, onDeleteRole }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [year, setYear] = useState("");
  const [roleHi, setRoleHi] = useState("");
  const [roleEn, setRoleEn] = useState("");
  const [orgHi, setOrgHi] = useState("");
  const [orgEn, setOrgEn] = useState("");
  const [cat, setCat] = useState("political");
  const [active, setActive] = useState(false);

  const handleAdd = async () => {
    if (!year || !roleHi || !orgHi) {
      alert("Please fill year, role (Hindi), and organization (Hindi)");
      return;
    }
    const rolePayload = {
      year,
      roleHi,
      roleEn: roleEn || roleHi,
      orgHi,
      orgEn: orgEn || orgHi,
      cat,
      active
    };
    await onSaveRole(rolePayload);
    // Clear form
    setYear("");
    setRoleHi("");
    setRoleEn("");
    setOrgHi("");
    setOrgEn("");
    setCat("political");
    setActive(false);
    setShowAddForm(false);
  };

  const handleDelete = async (index) => {
    if (window.confirm("Are you sure you want to delete this organizational role?")) {
      await onDeleteRole(index);
    }
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Sangh Years", val: "20+", icon: "📅" },
          { label: "Org. Roles", val: timeline.length.toString(), icon: "🏛️" },
          { label: "States Worked", val: "4", icon: "🗺️" },
          { label: "Research Projects", val: "2", icon: "📑" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: COLOR.saffron }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "#5F5E5A" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <SectionHeader title="➕ Add Timeline Role" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780" }}>YEAR / SPAN</label>
              <input value={year} onChange={e => setYear(e.target.value)} placeholder="e.g. 2017–20 / Present" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780" }}>ROLE TYPE</label>
              <select value={cat} onChange={e => setCat(e.target.value)} style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", height: "32px" }}>
                <option value="political">Political / RSS</option>
                <option value="govt">Government</option>
                <option value="education">Education / Research</option>
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780" }}>ROLE NAME (HINDI)</label>
              <input value={roleHi} onChange={e => setRoleHi(e.target.value)} placeholder="e.g. मीडिया प्रभारी" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780" }}>ROLE NAME (ENGLISH)</label>
              <input value={roleEn} onChange={e => setRoleEn(e.target.value)} placeholder="e.g. Media Coordinator" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780" }}>ORGANIZATION (HINDI)</label>
              <input value={orgHi} onChange={e => setOrgHi(e.target.value)} placeholder="e.g. जम्मू कश्मीर अध्ययन केंद्र" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780" }}>ORGANIZATION (ENGLISH)</label>
              <input value={orgEn} onChange={e => setOrgEn(e.target.value)} placeholder="e.g. J&K Study Centre" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} id="active-checkbox" />
            <label htmlFor="active-checkbox" style={{ fontSize: 12, fontWeight: 600, color: "#2C2C2A" }}>Mark as Active / Current Role</label>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={handleAdd} style={{ background: COLOR.green, color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Save Role</button>
            <button onClick={() => setShowAddForm(false)} style={{ background: "#f5f4f0", border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: 20 }}>
        <SectionHeader title="Organizational Timeline" actionLabel="Add Role" action={() => setShowAddForm(true)} />
        {timeline.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 14, paddingBottom: 14, borderBottom: i < timeline.length - 1 ? "0.5px solid #f0ede5" : "none", paddingTop: i > 0 ? 14 : 0 }}>
            <div style={{ minWidth: 68, fontSize: 12, fontWeight: 600, color: "#888780", paddingTop: 2 }}>{t.year}</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.active ? COLOR.saffron : COLOR.green, border: `2px solid ${t.active ? COLOR.saffronLight : COLOR.greenLight}`, flexShrink: 0 }} />
              {i < timeline.length - 1 && <div style={{ width: 1.5, flex: 1, background: "#e5e3dc", minHeight: 20 }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#2C2C2A" }}>{t.roleHi} · {t.roleEn}</div>
                  <div style={{ fontSize: 12, color: "#888780", marginTop: 2 }}>{t.orgHi} ({t.orgEn})</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <Badge color="gray">{t.cat}</Badge>
                    {t.active && <Badge color="amber">Current Role</Badge>}
                  </div>
                </div>
                <button onClick={() => handleDelete(i)} style={{ background: "#FCEBEB", border: "0.5px solid #f7c1c1", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: COLOR.red, cursor: "pointer" }}>🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── MEDIA COVERAGE SCREEN ──────────────────────────────────────────────────────
const Media = ({ media, onSaveMedia, onDeleteMedia }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [outlet, setOutlet] = useState("");
  const [type, setType] = useState("interview");
  const [date, setDate] = useState("");

  const handleAdd = async () => {
    if (!title || !outlet) {
      alert("Please fill title and media outlet name");
      return;
    }
    const mediaPayload = {
      title,
      outlet,
      type,
      date: date || new Date().toISOString().split('T')[0]
    };
    await onSaveMedia(mediaPayload);
    setTitle("");
    setOutlet("");
    setType("interview");
    setDate("");
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this media mention?")) {
      await onDeleteMedia(id);
    }
  };

  return (
    <div>
      <SectionHeader title="Media Coverage" actionLabel="Add Coverage" action={() => setShowAddForm(true)} />
      
      {showAddForm && (
        <div style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <SectionHeader title="📰 Add Media Mention" />
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#888780" }}>COVERAGE TITLE</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. UP सरकार की डिजिटल नीति पर विशेष साक्षात्कार" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780" }}>MEDIA OUTLET</label>
              <input value={outlet} onChange={e => setOutlet(e.target.value)} placeholder="e.g. Dainik Jagran / Aaj Tak" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780" }}>TYPE</label>
              <select value={type} onChange={e => setType(e.target.value)} style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", height: "32px" }}>
                <option value="interview">Interview</option>
                <option value="article">Article</option>
                <option value="video">Video Broadcast</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#888780" }}>PUBLICATION DATE</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={handleAdd} style={{ background: COLOR.green, color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Save Coverage</button>
            <button onClick={() => setShowAddForm(false)} style={{ background: "#f5f4f0", border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {media.map(m => (
          <div key={m.id} style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 20 }}>{m.type === "video" ? "🎥" : m.type === "interview" ? "🎙️" : "📰"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#2C2C2A" }}>{m.title}</div>
              <div style={{ fontSize: 12, color: "#888780", marginTop: 2 }}>{m.outlet} · {m.date}</div>
            </div>
            <Badge color={m.type === "video" ? "red" : m.type === "interview" ? "purple" : "blue"}>{m.type}</Badge>
            <button onClick={() => handleDelete(m.id)} style={{ background: "#FCEBEB", border: "0.5px solid #f7c1c1", borderRadius: 6, padding: "4px 8px", fontSize: 11, color: COLOR.red, cursor: "pointer" }}>🗑</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── COMMUNITY INITIATIVES SCREEN ───────────────────────────────────────────────
const Community = ({ community, onSaveCommunity, onDeleteCommunity }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [titleHi, setTitleHi] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [beneficiariesHi, setBeneficiariesHi] = useState("");
  const [beneficiariesEn, setBeneficiariesEn] = useState("");
  const [areaHi, setAreaHi] = useState("");
  const [areaEn, setAreaEn] = useState("");
  const [year, setYear] = useState("");
  
  const [descHi, setDescHi] = useState("");
  const [descEn, setDescEn] = useState("");
  const [detailsHi, setDetailsHi] = useState("");
  const [detailsEn, setDetailsEn] = useState("");
  const [icon, setIcon] = useState("🤝");
  const [accent, setAccent] = useState("card-accent-green");
  const [iconBg, setIconBg] = useState("bg-[#E1F5EE] text-[#1D9E75]");

  // Easy Writer Mode states
  const [writeModeDescHi, setWriteModeDescHi] = useState("easy"); // "easy" or "html"
  const [writeModeDescEn, setWriteModeDescEn] = useState("easy"); // "easy" or "html"
  const [writeModeDetailsHi, setWriteModeDetailsHi] = useState("easy"); // "easy" or "html"
  const [writeModeDetailsEn, setWriteModeDetailsEn] = useState("easy"); // "easy" or "html"

  const [descHiDraft, setDescHiDraft] = useState("");
  const [descEnDraft, setDescEnDraft] = useState("");
  const [detailsHiDraft, setDetailsHiDraft] = useState("");
  const [detailsEnDraft, setDetailsEnDraft] = useState("");

  const handleDescHiDraftChange = (val) => {
    setDescHiDraft(val);
    setDescHi(autoDetectAndFormatHTML(val));
  };

  const handleDescEnDraftChange = (val) => {
    setDescEnDraft(val);
    setDescEn(autoDetectAndFormatHTML(val));
  };

  const handleDetailsHiDraftChange = (val) => {
    setDetailsHiDraft(val);
    setDetailsHi(autoDetectAndFormatHTML(val));
  };

  const handleDetailsEnDraftChange = (val) => {
    setDetailsEnDraft(val);
    setDetailsEn(autoDetectAndFormatHTML(val));
  };

  const startWriteNew = () => {
    setEditingId(null);
    setTitleHi("");
    setTitleEn("");
    setBeneficiariesHi("");
    setBeneficiariesEn("");
    setAreaHi("");
    setAreaEn("");
    setYear("");
    setDescHi("");
    setDescEn("");
    setDetailsHi("");
    setDetailsEn("");
    setDescHiDraft("");
    setDescEnDraft("");
    setDetailsHiDraft("");
    setDetailsEnDraft("");
    setWriteModeDescHi("easy");
    setWriteModeDescEn("easy");
    setWriteModeDetailsHi("easy");
    setWriteModeDetailsEn("easy");
    setIcon("🤝");
    setAccent("card-accent-green");
    setIconBg("bg-[#E1F5EE] text-[#1D9E75]");
    setShowAddForm(true);
  };

  const startEdit = (c) => {
    setEditingId(c.firestoreId || c.id);
    setTitleHi(c.titleHi || "");
    setTitleEn(c.titleEn || "");
    setBeneficiariesHi(c.beneficiariesHi || "");
    setBeneficiariesEn(c.beneficiariesEn || "");
    setAreaHi(c.areaHi || "");
    setAreaEn(c.areaEn || "");
    setYear(c.year || "");
    setDescHi(c.descHi || "");
    setDescEn(c.descEn || "");
    setDetailsHi(c.detailsHi || "");
    setDetailsEn(c.detailsEn || "");
    setDescHiDraft(htmlToEasyText(c.descHi || ""));
    setDescEnDraft(htmlToEasyText(c.descEn || ""));
    setDetailsHiDraft(htmlToEasyText(c.detailsHi || ""));
    setDetailsEnDraft(htmlToEasyText(c.detailsEn || ""));
    setWriteModeDescHi("easy");
    setWriteModeDescEn("easy");
    setWriteModeDetailsHi("easy");
    setWriteModeDetailsEn("easy");
    setIcon(c.icon || "🤝");
    setAccent(c.accent || "card-accent-green");
    setIconBg(c.iconBg || "bg-[#E1F5EE] text-[#1D9E75]");
    setShowAddForm(true);
  };

  const handleSave = async () => {
    if (!titleHi || !titleEn || !areaHi || !areaEn) {
      alert("Please fill Hindi and English Title and Area fields");
      return;
    }
    const itemPayload = {
      titleHi,
      titleEn,
      beneficiariesHi: beneficiariesHi || "0+",
      beneficiariesEn: beneficiariesEn || "0+",
      areaHi,
      areaEn,
      year: year || new Date().getFullYear().toString(),
      descHi,
      descEn,
      detailsHi,
      detailsEn,
      icon,
      accent,
      iconBg
    };
    if (editingId) {
      itemPayload.firestoreId = editingId;
      itemPayload.id = editingId;
    }
    await onSaveCommunity(itemPayload);
    
    // Clear and hide
    setTitleHi("");
    setTitleEn("");
    setBeneficiariesHi("");
    setBeneficiariesEn("");
    setAreaHi("");
    setAreaEn("");
    setYear("");
    setDescHi("");
    setDescEn("");
    setDetailsHi("");
    setDetailsEn("");
    setDescHiDraft("");
    setDescEnDraft("");
    setDetailsHiDraft("");
    setDetailsEnDraft("");
    setIcon("🤝");
    setAccent("card-accent-green");
    setIconBg("bg-[#E1F5EE] text-[#1D9E75]");
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this community work item?")) {
      await onDeleteCommunity(id);
    }
  };

  const insertTag = (id, openTag, closeTag) => {
    const textarea = document.getElementById(id);
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = openTag + selected + (closeTag || "");
    const updatedValue = text.substring(0, start) + replacement + text.substring(end);
    
    if (id === "detailsHi-textarea") {
      setDetailsHi(updatedValue);
      setDetailsHiDraft(htmlToEasyText(updatedValue));
    } else if (id === "detailsEn-textarea") {
      setDetailsEn(updatedValue);
      setDetailsEnDraft(htmlToEasyText(updatedValue));
    } else if (id === "descHi-textarea") {
      setDescHi(updatedValue);
      setDescHiDraft(htmlToEasyText(updatedValue));
    } else if (id === "descEn-textarea") {
      setDescEn(updatedValue);
      setDescEnDraft(htmlToEasyText(updatedValue));
    }
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
    }, 50);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#2C2C2A" }}>Scope of Work & Social Initiatives — समाज सेवा कार्य</div>
        <button onClick={startWriteNew} style={{ background: COLOR.saffron, color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add Initiative</button>
      </div>
      
      {showAddForm && (
        <div style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <SectionHeader title={editingId ? "✏️ Edit Community Work" : "🤝 Add Community Work"} />
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>INITIATIVE TITLE (HINDI / हिंदी)</label>
              <input value={titleHi} onChange={e => setTitleHi(e.target.value)} placeholder="e.g. मतदाता जागरूकता अभियान" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>INITIATIVE TITLE (ENGLISH)</label>
              <input value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder="e.g. Voter Awareness Drive" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>ICON (EMOJI)</label>
              <select value={icon} onChange={e => {
                const map = {
                  "⚖️": { bg: "bg-[#E6F1FB] text-[#185FA5]", acc: "card-accent-blue" },
                  "📱": { bg: "bg-[#FAEEDA] text-[#BA7517]", acc: "card-accent-saffron" },
                  "🤝": { bg: "bg-[#E1F5EE] text-[#1D9E75]", acc: "card-accent-green" },
                  "🏢": { bg: "bg-[#EEEDFE] text-[#534AB7]", acc: "card-accent-purple" },
                  "📢": { bg: "bg-[#FCEBEB] text-[#E24B4A]", acc: "card-accent-red" }
                };
                const val = e.target.value;
                setIcon(val);
                if (map[val]) {
                  setIconBg(map[val].bg);
                  setAccent(map[val].acc);
                }
              }} style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", height: "31px" }}>
                <option value="🤝">🤝 Help/Community</option>
                <option value="📱">📱 Tech/Mobile</option>
                <option value="⚖️">⚖️ Legal/Justice</option>
                <option value="🏢">🏢 Government</option>
                <option value="📢">📢 Campaign/PR</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>YEAR / TERM</label>
              <input value={year} onChange={e => setYear(e.target.value)} placeholder="e.g. 2024 / 2022–23" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>BENEFICIARIES (HINDI / हिंदी)</label>
              <input value={beneficiariesHi} onChange={e => setBeneficiariesHi(e.target.value)} placeholder="e.g. 12,000+ पंजीकृत नागरिक" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>BENEFICIARIES (ENGLISH)</label>
              <input value={beneficiariesEn} onChange={e => setBeneficiariesEn(e.target.value)} placeholder="e.g. 12,000+ Registered Citizens" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>GEOGRAPHICAL AREA (HINDI / हिंदी)</label>
              <input value={areaHi} onChange={e => setAreaHi(e.target.value)} placeholder="e.g. बिन्दकी तहसील" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>GEOGRAPHICAL AREA (ENGLISH)</label>
              <input value={areaEn} onChange={e => setAreaEn(e.target.value)} placeholder="e.g. Bindki Tehsil" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-4">
            {/* Hindi Short Description Editor */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#888780]">SHORT DESCRIPTION (HINDI / हिंदी)</label>
                <div className="flex bg-[#f0ede5] p-0.5 rounded-lg gap-1 border border-[#d3d1c7] scale-90 origin-right">
                  <button type="button" onClick={() => setWriteModeDescHi("easy")} className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${writeModeDescHi === "easy" ? "bg-[#EF9F27] text-white shadow" : "text-[#5F5E5A] hover:bg-[#e2dfd5]"}`}>📝 Easy Writer</button>
                  <button type="button" onClick={() => setWriteModeDescHi("html")} className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${writeModeDescHi === "html" ? "bg-[#185FA5] text-white shadow" : "text-[#5F5E5A] hover:bg-[#e2dfd5]"}`}>💻 HTML Code</button>
                </div>
              </div>

              {writeModeDescHi === "easy" ? (
                <div>
                  <textarea
                    rows={10}
                    value={descHiDraft}
                    onChange={e => handleDescHiDraftChange(e.target.value)}
                    placeholder="बिन्दकी तहसील में 12,000+ से अधिक नए मतदाताओं को..."
                    className="w-full text-sm border border-[#d3d1c7] rounded-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-white block"
                  />
                  <div className="mt-1.5 p-2 bg-[#E1F5EE] border border-[#1D9E75]/20 rounded-lg flex items-start gap-2">
                    <span className="text-xs">💡</span>
                    <span className="text-[10px] font-bold text-[#1D9E75] leading-relaxed">
                      Tip: Type <b>*</b> for bullets, <b>1.</b> for lists, <b>###</b> for headings, and paste URLs directly. We format everything automatically!
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex gap-1.5 p-2 bg-[#f0ede5] border border-[#d3d1c7] border-b-0 rounded-t-xl">
                    <button type="button" onClick={() => insertTag("descHi-textarea", "<strong>", "</strong>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">B</button>
                    <button type="button" onClick={() => insertTag("descHi-textarea", "<em>", "</em>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">I</button>
                    <button type="button" onClick={() => insertTag("descHi-textarea", "<p>", "</p>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">P</button>
                  </div>
                  <textarea
                    id="descHi-textarea"
                    rows={10}
                    value={descHi}
                    onChange={e => { setDescHi(e.target.value); setDescHiDraft(htmlToEasyText(e.target.value)); }}
                    placeholder="बिन्दकी तहसील में 12,000+ से अधिक नए मतदाताओं को..."
                    className="w-full text-sm border border-[#d3d1c7] rounded-b-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-[#faf9f5] resize-y font-mono leading-relaxed block"
                  />
                </div>
              )}
              <div className="mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BA7517]">Live Description Preview (Hindi):</span>
                <div dangerouslySetInnerHTML={{ __html: descHi || "<i>हिंदी प्रीव्यू...</i>" }} className="rich-preview-pane-bilingual bg-[#FAFAF7] border border-dashed border-[#d3d1c7] rounded-xl p-4 text-xs text-[#2C2C2A] max-h-24 overflow-y-auto leading-relaxed mt-1" />
              </div>
            </div>

            {/* English Short Description Editor */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#888780]">SHORT DESCRIPTION (ENGLISH)</label>
                <div className="flex bg-[#f0ede5] p-0.5 rounded-lg gap-1 border border-[#d3d1c7] scale-90 origin-right">
                  <button type="button" onClick={() => setWriteModeDescEn("easy")} className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${writeModeDescEn === "easy" ? "bg-[#EF9F27] text-white shadow" : "text-[#5F5E5A] hover:bg-[#e2dfd5]"}`}>📝 Easy Writer</button>
                  <button type="button" onClick={() => setWriteModeDescEn("html")} className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${writeModeDescEn === "html" ? "bg-[#185FA5] text-white shadow" : "text-[#5F5E5A] hover:bg-[#e2dfd5]"}`}>💻 HTML Code</button>
                </div>
              </div>

              {writeModeDescEn === "easy" ? (
                <div>
                  <textarea
                    rows={10}
                    value={descEnDraft}
                    onChange={e => handleDescEnDraftChange(e.target.value)}
                    placeholder="Empowered and registered 12,000+ voters in Bindki..."
                    className="w-full text-sm border border-[#d3d1c7] rounded-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-white block"
                  />
                  <div className="mt-1.5 p-2 bg-[#E1F5EE] border border-[#1D9E75]/20 rounded-lg flex items-start gap-2">
                    <span className="text-xs">💡</span>
                    <span className="text-[10px] font-bold text-[#1D9E75] leading-relaxed">
                      Tip: Type <b>*</b> for bullets, <b>1.</b> for lists, <b>###</b> for headings, and paste URLs directly. We format everything automatically!
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex gap-1.5 p-2 bg-[#f0ede5] border border-[#d3d1c7] border-b-0 rounded-t-xl">
                    <button type="button" onClick={() => insertTag("descEn-textarea", "<strong>", "</strong>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">B</button>
                    <button type="button" onClick={() => insertTag("descEn-textarea", "<em>", "</em>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">I</button>
                    <button type="button" onClick={() => insertTag("descEn-textarea", "<p>", "</p>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">P</button>
                  </div>
                  <textarea
                    id="descEn-textarea"
                    rows={10}
                    value={descEn}
                    onChange={e => { setDescEn(e.target.value); setDescEnDraft(htmlToEasyText(e.target.value)); }}
                    placeholder="Empowered and registered 12,000+ voters in Bindki..."
                    className="w-full text-sm border border-[#d3d1c7] rounded-b-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-[#faf9f5] resize-y font-mono leading-relaxed block"
                  />
                </div>
              )}
              <div className="mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BA7517]">Live Description Preview (English):</span>
                <div dangerouslySetInnerHTML={{ __html: descEn || "<i>English preview...</i>" }} className="rich-preview-pane-bilingual bg-[#FAFAF7] border border-dashed border-[#d3d1c7] rounded-xl p-4 text-xs text-[#2C2C2A] max-h-24 overflow-y-auto leading-relaxed mt-1" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-4">
            {/* Hindi Details Editor */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#888780]">DETAILED REPORT (HINDI / हिंदी)</label>
                <div className="flex bg-[#f0ede5] p-0.5 rounded-lg gap-1 border border-[#d3d1c7] scale-90 origin-right">
                  <button type="button" onClick={() => setWriteModeDetailsHi("easy")} className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${writeModeDetailsHi === "easy" ? "bg-[#EF9F27] text-white shadow" : "text-[#5F5E5A] hover:bg-[#e2dfd5]"}`}>📝 Easy Writer</button>
                  <button type="button" onClick={() => setWriteModeDetailsHi("html")} className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${writeModeDetailsHi === "html" ? "bg-[#185FA5] text-white shadow" : "text-[#5F5E5A] hover:bg-[#e2dfd5]"}`}>💻 HTML Code</button>
                </div>
              </div>

              {writeModeDetailsHi === "easy" ? (
                <div>
                  <textarea
                    rows={18}
                    value={detailsHiDraft}
                    onChange={e => handleDetailsHiDraftChange(e.target.value)}
                    placeholder="<h3><strong>विस्तृत रिपोर्ट</strong></h3><p>यहाँ हिंदी में विवरण लिखें...</p>"
                    className="w-full text-sm border border-[#d3d1c7] rounded-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-white block"
                  />
                  <div className="mt-1.5 p-2 bg-[#E1F5EE] border border-[#1D9E75]/20 rounded-lg flex items-start gap-2">
                    <span className="text-xs">💡</span>
                    <span className="text-[10px] font-bold text-[#1D9E75] leading-relaxed">
                      Tip: Type <b>*</b> for bullets, <b>1.</b> for lists, <b>###</b> for headings, and paste URLs directly. We format everything automatically!
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex gap-1.5 p-2 bg-[#f0ede5] border border-[#d3d1c7] border-b-0 rounded-t-xl">
                    <button type="button" onClick={() => insertTag("detailsHi-textarea", "<strong>", "</strong>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">B</button>
                    <button type="button" onClick={() => insertTag("detailsHi-textarea", "<em>", "</em>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">I</button>
                    <button type="button" onClick={() => insertTag("detailsHi-textarea", "<h3>", "</h3>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">H3</button>
                    <button type="button" onClick={() => insertTag("detailsHi-textarea", "<h4>", "</h4>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">H4</button>
                    <button type="button" onClick={() => insertTag("detailsHi-textarea", "<p>", "</p>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">P</button>
                    <button type="button" onClick={() => insertTag("detailsHi-textarea", "<ul>\n  <li>", "</li>\n</ul>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">List</button>
                    <button type="button" onClick={() => insertTag("detailsHi-textarea", "<li>", "</li>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">Item</button>
                  </div>
                  <textarea
                    id="detailsHi-textarea"
                    rows={18}
                    value={detailsHi}
                    onChange={e => { setDetailsHi(e.target.value); setDetailsHiDraft(htmlToEasyText(e.target.value)); }}
                    placeholder="<h3><strong>विस्तृत रिपोर्ट</strong></h3><p>यहाँ हिंदी HTML लिखें...</p>"
                    className="w-full text-sm border border-[#d3d1c7] rounded-b-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-[#faf9f5] resize-y font-mono leading-relaxed block"
                  />
                </div>
              )}
              <div className="mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BA7517]">Live Preview (Hindi):</span>
                <div dangerouslySetInnerHTML={{ __html: detailsHi || "<i>हिंदी प्रीव्यू...</i>" }} className="rich-preview-pane-bilingual bg-[#FAFAF7] border border-dashed border-[#d3d1c7] rounded-xl p-4 text-xs text-[#2C2C2A] max-h-28 overflow-y-auto leading-relaxed mt-1" />
              </div>
            </div>

            {/* English Details Editor */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#888780]">DETAILED REPORT (ENGLISH)</label>
                <div className="flex bg-[#f0ede5] p-0.5 rounded-lg gap-1 border border-[#d3d1c7] scale-90 origin-right">
                  <button type="button" onClick={() => setWriteModeDetailsEn("easy")} className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${writeModeDetailsEn === "easy" ? "bg-[#EF9F27] text-white shadow" : "text-[#5F5E5A] hover:bg-[#e2dfd5]"}`}>📝 Easy Writer</button>
                  <button type="button" onClick={() => setWriteModeDetailsEn("html")} className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${writeModeDetailsEn === "html" ? "bg-[#185FA5] text-white shadow" : "text-[#5F5E5A] hover:bg-[#e2dfd5]"}`}>💻 HTML Code</button>
                </div>
              </div>

              {writeModeDetailsEn === "easy" ? (
                <div>
                  <textarea
                    rows={18}
                    value={detailsEnDraft}
                    onChange={e => handleDetailsEnDraftChange(e.target.value)}
                    placeholder="<h3><strong>Detailed Report</strong></h3><p>Write detailed report here...</p>"
                    className="w-full text-sm border border-[#d3d1c7] rounded-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-white block"
                  />
                  <div className="mt-1.5 p-2 bg-[#E1F5EE] border border-[#1D9E75]/20 rounded-lg flex items-start gap-2">
                    <span className="text-xs">💡</span>
                    <span className="text-[10px] font-bold text-[#1D9E75] leading-relaxed">
                      Tip: Type <b>*</b> for bullets, <b>1.</b> for lists, <b>###</b> for headings, and paste URLs directly. We format everything automatically!
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex gap-1.5 p-2 bg-[#f0ede5] border border-[#d3d1c7] border-b-0 rounded-t-xl">
                    <button type="button" onClick={() => insertTag("detailsEn-textarea", "<strong>", "</strong>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">B</button>
                    <button type="button" onClick={() => insertTag("detailsEn-textarea", "<em>", "</em>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">I</button>
                    <button type="button" onClick={() => insertTag("detailsEn-textarea", "<h3>", "</h3>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">H3</button>
                    <button type="button" onClick={() => insertTag("detailsEn-textarea", "<h4>", "</h4>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">H4</button>
                    <button type="button" onClick={() => insertTag("detailsEn-textarea", "<p>", "</p>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">P</button>
                    <button type="button" onClick={() => insertTag("detailsEn-textarea", "<ul>\n  <li>", "</li>\n</ul>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">List</button>
                    <button type="button" onClick={() => insertTag("detailsEn-textarea", "<li>", "</li>")} className="px-3 py-1 text-[11px] font-bold text-[#5F5E5A] bg-white border border-[#d3d1c7] hover:bg-[#e2dfd5]/60 hover:text-[#2c2c2a] rounded-md transition-all cursor-pointer shadow-sm active:scale-95">Item</button>
                  </div>
                  <textarea
                    id="detailsEn-textarea"
                    rows={18}
                    value={detailsEn}
                    onChange={e => { setDetailsEn(e.target.value); setDetailsEnDraft(htmlToEasyText(e.target.value)); }}
                    placeholder="<h3><strong>Detailed Report</strong></h3><p>Write English HTML here...</p>"
                    className="w-full text-sm border border-[#d3d1c7] rounded-b-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-[#faf9f5] resize-y font-mono leading-relaxed block"
                  />
                </div>
              )}
              <div className="mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BA7517]">Live Preview (English):</span>
                <div dangerouslySetInnerHTML={{ __html: detailsEn || "<i>English preview...</i>" }} className="rich-preview-pane-bilingual bg-[#FAFAF7] border border-dashed border-[#d3d1c7] rounded-xl p-4 text-xs text-[#2C2C2A] max-h-28 overflow-y-auto leading-relaxed mt-1" />
              </div>
            </div>
          </div>
          
          <style>{`
            .rich-preview-pane-bilingual h3 { font-size: 1rem; font-weight: 700; color: #2C2C2A; margin: 4px 0; }
            .rich-preview-pane-bilingual h4 { font-size: 0.9rem; font-weight: 600; color: #BA7517; margin: 3px 0; }
            .rich-preview-pane-bilingual p { margin: 0 0 4px 0; }
            .rich-preview-pane-bilingual ul { padding-left: 12px; margin: 0 0 4px 0; }
            .rich-preview-pane-bilingual li { margin-bottom: 1px; }
          `}</style>
          
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={handleSave} style={{ background: COLOR.green, color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>{editingId ? "✓ Save Changes" : "Save Initiative"}</button>
            <button onClick={() => { setShowAddForm(false); setEditingId(null); }} style={{ background: "#f5f4f0", border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "8px 14px", fontSize: 12, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}
 
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {community.map((c, i) => (
          <div key={c.id || i} style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderLeft: `4.5px solid ${c.accent === "card-accent-blue" ? COLOR.navy : c.accent === "card-accent-saffron" ? COLOR.saffron : COLOR.green}`, borderRadius: "0 12px 12px 0", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginRight: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{c.icon || "🤝"}</span>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#2C2C2A" }}>{c.titleHi} · {c.titleEn}</div>
                </div>
                <Badge color={c.accent === "card-accent-blue" ? "blue" : c.accent === "card-accent-saffron" ? "amber" : "green"}>{c.year}</Badge>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: "#888780", flexWrap: "wrap" }}>
                <span>👥 {c.beneficiariesHi} ({c.beneficiariesEn})</span>
                <span>📍 {c.areaHi} ({c.areaEn})</span>
                {c.descHi && <span style={{ color: "#5F5E5A" }}>· {c.descHi}</span>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => startEdit(c)} style={{ background: "#f5f4f0", border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "5px 9px", fontSize: 12, cursor: "pointer" }}>✏️</button>
              <button onClick={() => handleDelete(c.firestoreId || c.id)} style={{ background: "#FCEBEB", border: "0.5px solid #f7c1c1", borderRadius: 6, padding: "5px 9px", fontSize: 12, color: COLOR.red, cursor: "pointer" }}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── DOCUMENTS VAULT SCREEN ─────────────────────────────────────────────────────
const Documents = ({ docs, onSaveDoc, onDeleteDoc }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [cat, setCat] = useState("certificate");
  const [pub, setPub] = useState(true);

  const handleAdd = async () => {
    if (!name) {
      alert("Please fill document name");
      return;
    }
    const docPayload = {
      name,
      cat,
      pub,
      date: new Date().toISOString().split('T')[0]
    };
    await onSaveDoc(docPayload);
    setName("");
    setCat("certificate");
    setPub(true);
    setShowAddForm(false);
  };

  const handleTogglePublic = async (d) => {
    const updatedPayload = {
      id: d.id,
      pub: !d.pub
    };
    await onSaveDoc(updatedPayload);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document from the vault?")) {
      await onDeleteDoc(id);
    }
  };

  return (
    <div>
      <SectionHeader title="Document Vault" actionLabel="Upload Doc" action={() => setShowAddForm(true)} />
      
      {showAddForm && (
        <div style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <SectionHeader title="📄 Upload/Register Document" />
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#888780" }}>DOCUMENT NAME</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Appointment Order — UP Home Dept.pdf" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780" }}>CATEGORY</label>
              <select value={cat} onChange={e => setCat(e.target.value)} style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", height: "32px" }}>
                <option value="certificate">Degree/Certificate</option>
                <option value="appointment">Appointment Letter</option>
                <option value="research">Research / Reports</option>
                <option value="id">ID Credentials</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780" }}>INITIAL VISIBILITY</label>
              <select value={pub ? "yes" : "no"} onChange={e => setPub(e.target.value === "yes")} style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", height: "32px" }}>
                <option value="yes">Public on Website</option>
                <option value="no">Private Vault Only</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={handleAdd} style={{ background: COLOR.green, color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Save Document</button>
            <button onClick={() => setShowAddForm(false)} style={{ background: "#f5f4f0", border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ border: `2px dashed ${COLOR.saffron}60`, borderRadius: 12, padding: 20, textAlign: "center", marginBottom: 16, background: COLOR.saffronLight }}>
        <div style={{ fontSize: 24, marginBottom: 6 }}>📤</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: COLOR.saffronDark }}>Drag & drop files here</div>
        <div style={{ fontSize: 11, color: "#888780", marginTop: 3 }}>PDF, JPG, PNG, DOCX · Max 10MB each</div>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {docs.map(d => (
          <div key={d.id} style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 18 }}>📄</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A" }}>{d.name}</div>
              <div style={{ fontSize: 11, color: "#888780", marginTop: 2 }}>{d.cat} · {d.date}</div>
            </div>
            <button onClick={() => handleTogglePublic(d)} style={{ border: "none", background: "none", padding: 0, cursor: "pointer" }}>
              <Badge color={d.pub ? "green" : "gray"}>{d.pub ? "Public" : "Private"}</Badge>
            </button>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "0.5px solid #d3d1c7", background: "#f5f4f0", cursor: "pointer" }}>⬇ Download</button>
              <button onClick={() => handleDelete(d.id)} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "0.5px solid #f7c1c1", background: "#FCEBEB", color: COLOR.red, cursor: "pointer" }}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── ANALYTICS SCREEN ───────────────────────────────────────────────────────────
const Analytics = ({ analytics }) => {
  const months = analytics?.months || ["Jan", "Feb", "Mar", "Apr", "May"];
  const views = analytics?.views || [2100, 2800, 3200, 4100, 4820];
  const maxV = Math.max(...views);

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        {[
          { label: "Total Views", val: analytics?.totalViews.toLocaleString() || "17,020", delta: "+18%", color: COLOR.saffron },
          { label: "Avg. Time on Page", val: analytics?.avgTime || "2m 34s", delta: "+5%", color: COLOR.navy },
          { label: "Top Section", val: analytics?.topSection || "Timeline", delta: "—", color: COLOR.green },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: "14px 18px", flex: 1, minWidth: 140 }}>
            <div style={{ fontSize: 12, color: "#888780" }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, margin: "4px 0" }}>{s.val}</div>
            <div style={{ fontSize: 11, color: s.delta.startsWith("+") ? COLOR.green : "#888780" }}>{s.delta} this month</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#2C2C2A", marginBottom: 16 }}>Profile Views — 2026</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120, paddingBottom: 4 }}>
          {months.map((m, i) => (
            <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 10, color: "#888780" }}>{views[i].toLocaleString()}</div>
              <div style={{ width: "100%", background: i === months.length - 1 ? COLOR.saffron : "#E1F5EE", borderRadius: "4px 4px 0 0", height: `${(views[i] / maxV) * 90}px`, transition: "height 0.3s" }} />
              <div style={{ fontSize: 11, color: "#888780" }}>{m}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── SETTINGS SCREEN ────────────────────────────────────────────────────────────
const Settings = ({ settings, onSaveSettings }) => {
  const [lang, setLang] = useState(settings?.lang || "hindi");
  const [privacyProfile, setPrivacyProfile] = useState(settings?.privacyProfile !== undefined ? settings.privacyProfile : true);
  const [privacyDocs, setPrivacyDocs] = useState(settings?.privacyDocs !== undefined ? settings.privacyDocs : false);

  const handleLangChange = async (l) => {
    setLang(l);
    await onSaveSettings({
      ...settings,
      lang: l
    });
  };

  const handleToggle = async (key, currentVal) => {
    const updatedVal = !currentVal;
    if (key === "privacyProfile") setPrivacyProfile(updatedVal);
    if (key === "privacyDocs") setPrivacyDocs(updatedVal);

    await onSaveSettings({
      ...settings,
      lang,
      privacyProfile,
      privacyDocs,
      [key]: updatedVal
    });
  };

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{ width: 40, height: 22, borderRadius: 11, background: on ? COLOR.green : "#d3d1c7", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: on ? 20 : 2, transition: "left 0.2s" }} />
    </div>
  );

  return (
    <div>
      <div style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#2C2C2A", marginBottom: 14 }}>🌐 Language & Display</div>
        <div style={{ display: "flex", gap: 8 }}>
          {["hindi", "english", "both"].map(l => (
            <button key={l} onClick={() => handleLangChange(l)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${lang === l ? COLOR.saffron : "#d3d1c7"}`, background: lang === l ? COLOR.saffronLight : "#fff", color: lang === l ? COLOR.saffronDark : "#5F5E5A", fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize" }}>{l === "both" ? "Both" : l === "hindi" ? "हिंदी" : "English"}</button>
          ))}
        </div>
      </div>
      <div style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#2C2C2A", marginBottom: 14 }}>🔒 Privacy Controls</div>
        {[
          { label: "Show profile publicly", sub: "Name, photo, bio visible to all", on: privacyProfile, tog: () => handleToggle("privacyProfile", privacyProfile) },
          { label: "Show documents publicly", sub: "Only approved docs shown", on: privacyDocs, tog: () => handleToggle("privacyDocs", privacyDocs) },
          { label: "Show contact details", sub: "Phone & email on public page", on: settings?.showContact || true, tog: () => handleToggle("showContact", settings?.showContact || true) },
        ].map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "0.5px solid #f0ede5" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A" }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "#888780", marginTop: 1 }}>{s.sub}</div>
            </div>
            <Toggle on={s.on} onToggle={s.tog} />
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#2C2C2A", marginBottom: 10 }}>📋 Export & Backup</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={{ background: COLOR.navy, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>📄 Export Biodata PDF</button>
          <button style={{ background: "#f5f4f0", color: "#2C2C2A", border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>📦 Backup All Data</button>
        </div>
      </div>
    </div>
  );
};

// ── RSS ORGANIZATIONAL WORK SCREEN ─────────────────────────────────────────────
const RSSWork = ({ orgWork, onSaveOrgWork, onDeleteOrgWork }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [titleHi, setTitleHi] = useState("");
  const [titleEn, setTitleEn] = useState("");

  const startWriteNew = () => {
    setEditingId(null);
    setTitleHi("");
    setTitleEn("");
    setShowAddForm(true);
  };

  const startEdit = (item) => {
    setEditingId(item.firestoreId || item.id);
    setTitleHi(item.titleHi || "");
    setTitleEn(item.titleEn || "");
    setShowAddForm(true);
  };

  const handleSave = async () => {
    if (!titleHi || !titleEn) {
      alert("Please fill both Hindi and English fields.");
      return;
    }
    const payload = {
      titleHi,
      titleEn,
    };
    if (editingId) {
      payload.firestoreId = editingId;
      payload.id = editingId;
    }
    await onSaveOrgWork(payload);
    // Reset
    setTitleHi("");
    setTitleEn("");
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this organizational work achievement?")) {
      await onDeleteOrgWork(id);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#2C2C2A" }}>RSS & Organizational Achievements — सांगठनिक कार्य</div>
        <button onClick={startWriteNew} style={{ background: COLOR.saffron, color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ New Achievement</button>
      </div>

      {showAddForm && (
        <div style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <SectionHeader title={editingId ? "✏️ Edit Organizational Achievement" : "🌸 Add Organizational Achievement"} />
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>ACHIEVEMENT (HINDI / हिंदी)</label>
            <textarea rows={8} value={titleHi} onChange={e => setTitleHi(e.target.value)} placeholder="e.g. संघ के वरिष्ठ प्रचारक श्री रामचंद्र पांडेय जी के सानिध्य में संगठनात्मक कार्य किया।" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "8px 12px", outline: "none", boxSizing: "border-box", resize: "vertical" }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>ACHIEVEMENT (ENGLISH / अंग्रेजी)</label>
            <textarea rows={8} value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder="e.g. Conducted organizational work under the guidance of senior RSS Pracharak Shri Ramchandra Pandey Ji." style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "8px 12px", outline: "none", boxSizing: "border-box", resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={handleSave} style={{ background: COLOR.green, color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Save Achievement</button>
            <button onClick={() => setShowAddForm(false)} style={{ background: "#f5f4f0", border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "8px 14px", fontSize: 12, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {orgWork.map((item, idx) => (
          <div key={item.id || idx} style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: COLOR.saffronDark }}>#{idx + 1}</span>
                <Badge color="amber">RSS Contribution</Badge>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#2C2C2A", marginTop: 8 }}>{item.titleHi}</div>
              <div style={{ fontSize: 12, color: "#5F5E5A", marginTop: 4, fontStyle: "italic" }}>{item.titleEn}</div>
            </div>
            <div style={{ display: "flex", gap: 6, alignSelf: "center" }}>
              <button onClick={() => startEdit(item)} style={{ background: "#f5f4f0", border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>✏️</button>
              <button onClick={() => handleDelete(item.firestoreId || item.id)} style={{ background: "#FCEBEB", border: "0.5px solid #f7c1c1", borderRadius: 6, padding: "6px 10px", fontSize: 12, color: COLOR.red, cursor: "pointer" }}>🗑</button>
            </div>
          </div>
        ))}
        {orgWork.length === 0 && (
          <div style={{ textAlign: "center", color: "#888780", padding: "40px 0" }}>No organizational work achievements found. Click '+ New Achievement' to add one.</div>
        )}
      </div>
    </div>
  );
};

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Secure Authentication States
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Live Database States
  const [profile, setProfile] = useState(null);
  const [thoughts, setThoughts] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [orgWork, setOrgWork] = useState([]);
  const [media, setMedia] = useState([]);
  const [community, setCommunity] = useState([]);
  const [docs, setDocs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const [
        profileRes,
        thoughtsRes,
        timelineRes,
        mediaRes,
        communityRes,
        docsRes,
        analyticsRes,
        settingsRes,
        orgWorkRes
      ] = await Promise.all([
        fetch("/api/profile").then(r => r.json()),
        fetch("/api/thoughts").then(r => r.json()),
        fetch("/api/timeline").then(r => r.json()),
        fetch("/api/media").then(r => r.json()),
        fetch("/api/community").then(r => r.json()),
        fetch("/api/documents").then(r => r.json()),
        fetch("/api/analytics").then(r => r.json()),
        fetch("/api/settings").then(r => r.json()),
        fetch("/api/organizational").then(r => r.json())
      ]);

      setProfile(profileRes);
      setThoughts(Array.isArray(thoughtsRes) ? thoughtsRes : []);
      setTimeline(Array.isArray(timelineRes) ? timelineRes : []);
      setMedia(Array.isArray(mediaRes) ? mediaRes : []);
      setCommunity(Array.isArray(communityRes) ? communityRes : []);
      setDocs(Array.isArray(docsRes) ? docsRes : []);
      setAnalytics(analyticsRes);
      setSettings(settingsRes);
      setOrgWork(Array.isArray(orgWorkRes) ? orgWorkRes : []);
    } catch (error) {
      console.error("Error fetching campaign portal database:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auth Guard protection on mount
  useEffect(() => {
    let unsubscribe = () => {};
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (usr) => {
        if (usr) {
          setUser(usr);
          setAuthChecking(false);
          fetchAllData();
        } else {
          // Check local storage mock fallback
          const mockAuth = localStorage.getItem("mock_admin_auth");
          if (mockAuth === "true") {
            setAuthChecking(false);
            fetchAllData();
          } else {
            router.push("/login");
          }
        }
      });
    } else {
      // If Firebase is not configured, check local storage mock auth
      const mockAuth = localStorage.getItem("mock_admin_auth");
      if (mockAuth === "true") {
        setAuthChecking(false);
        fetchAllData();
      } else {
        router.push("/login");
      }
    }
    return () => unsubscribe();
  }, [router]);

  // CRUD operation callbacks linked to Route Handlers
  const handleSaveProfile = async (updatedProfile) => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile)
      });
      const data = await res.json();
      setProfile(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveThought = async (thought) => {
    try {
      const res = await fetch("/api/thoughts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(thought)
      });
      const data = await res.json();
      setThoughts(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteThought = async (id) => {
    try {
      const res = await fetch(`/api/thoughts?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      setThoughts(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveRole = async (role) => {
    try {
      const res = await fetch("/api/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(role)
      });
      const data = await res.json();
      setTimeline(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteRole = async (index) => {
    try {
      const res = await fetch(`/api/timeline?index=${index}`, {
        method: "DELETE"
      });
      const data = await res.json();
      setTimeline(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveOrgWork = async (item) => {
    try {
      const res = await fetch("/api/organizational", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        const freshRes = await fetch("/api/organizational");
        const freshData = await freshRes.json();
        setOrgWork(Array.isArray(freshData) ? freshData : []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteOrgWork = async (id) => {
    try {
      const res = await fetch(`/api/organizational?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const freshRes = await fetch("/api/organizational");
        const freshData = await freshRes.json();
        setOrgWork(Array.isArray(freshData) ? freshData : []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveMedia = async (item) => {
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      const data = await res.json();
      setMedia(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMedia = async (id) => {
    try {
      const res = await fetch(`/api/media?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      setMedia(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveCommunity = async (item) => {
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        const freshRes = await fetch("/api/community");
        const freshData = await freshRes.json();
        setCommunity(Array.isArray(freshData) ? freshData : []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCommunity = async (id) => {
    try {
      const res = await fetch(`/api/community?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const freshRes = await fetch("/api/community");
        const freshData = await freshRes.json();
        setCommunity(Array.isArray(freshData) ? freshData : []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveDoc = async (doc) => {
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc)
      });
      const data = await res.json();
      setDocs(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDoc = async (id) => {
    try {
      const res = await fetch(`/api/documents?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      setDocs(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSettings = async (updatedSettings) => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings)
      });
      const data = await res.json();
      setSettings(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const SCREENS = {
    dashboard: () => <Dashboard profile={profile} thoughts={thoughts} media={media} docs={docs} />,
    profile: () => <Profile profile={profile} onSaveProfile={handleSaveProfile} />,
    thoughts: () => <Thoughts thoughts={thoughts} onSaveThought={handleSaveThought} onDeleteThought={handleDeleteThought} />,
    political: () => <Political timeline={timeline} onSaveRole={handleSaveRole} onDeleteRole={handleDeleteRole} />,
    rss_work: () => <RSSWork orgWork={orgWork} onSaveOrgWork={handleSaveOrgWork} onDeleteOrgWork={handleDeleteOrgWork} />,
    media: () => <Media media={media} onSaveMedia={handleSaveMedia} onDeleteMedia={handleDeleteMedia} />,
    community: () => <Community community={community} onSaveCommunity={handleSaveCommunity} onDeleteCommunity={handleDeleteCommunity} />,
    documents: () => <Documents docs={docs} onSaveDoc={handleSaveDoc} onDeleteDoc={handleDeleteDoc} />,
    analytics: () => <Analytics analytics={analytics} />,
    settings: () => <Settings settings={settings} onSaveSettings={handleSaveSettings} />
  };

  const Screen = SCREENS[activeTab] || (() => <Dashboard profile={profile} thoughts={thoughts} media={media} docs={docs} />);

  if (authChecking) {
    return (
      <div style={{ display: "flex", height: "100vh", width: "100vw", alignItems: "center", justifyContent: "center", background: "#F8F7F2", flexDirection: "column", gap: 14 }}>
        <div style={{ width: 44, height: 44, border: `3.5px solid ${COLOR.saffron}30`, borderTopColor: COLOR.saffron, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.saffronDark, letterSpacing: "0.08em", textTransform: "uppercase" }}>सुरक्षित सत्यापन · Checking Session...</div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", width: "100vw", alignItems: "center", justifyContent: "center", background: "#F8F7F2", flexDirection: "column", gap: 14 }}>
        <div style={{ width: 44, height: 44, border: `3.5px solid ${COLOR.saffron}30`, borderTopColor: COLOR.saffron, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.saffronDark, letterSpacing: "0.08em", textTransform: "uppercase" }}>Loading Campaign Cell...</div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#F8F7F2", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? 220 : 60, background: "#1a1a18", transition: "width 0.25s", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
        <div style={{ padding: sidebarOpen ? "18px 16px 12px" : "18px 10px 12px", borderBottom: "0.5px solid #333330" }}>
          {sidebarOpen ? (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.saffron, letterSpacing: "0.04em" }}>RAGHVENDRA SAINI</div>
              <div style={{ fontSize: 10, color: "#888780", marginTop: 2 }}>Admin Portal Cell</div>
            </div>
          ) : (
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: COLOR.saffronLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: COLOR.saffronDark }}>RS</div>
          )}
        </div>
        <nav style={{ flex: 1, padding: "8px 0", overflowY: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: sidebarOpen ? "9px 16px" : "9px 0", justifyContent: sidebarOpen ? "flex-start" : "center", background: activeTab === t.id ? "#2c2c29" : "none", border: "none", cursor: "pointer", textAlign: "left", position: "relative" }}>
              {activeTab === t.id && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: COLOR.saffron, borderRadius: "0 2px 2px 0" }} />}
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              {sidebarOpen && <span style={{ fontSize: 13, color: activeTab === t.id ? "#fff" : "#888780", fontWeight: activeTab === t.id ? 600 : 400 }}>{t.label}</span>}
            </button>
          ))}
        </nav>
        {/* Logout Button in Sidebar */}
        <button
          onClick={async () => {
            if (auth) {
              await signOut(auth);
            }
            localStorage.removeItem("mock_admin_auth");
            router.push("/login");
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: sidebarOpen ? "12px 16px" : "12px 0",
            justifyContent: sidebarOpen ? "flex-start" : "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            borderTop: "0.5px solid #333330",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2c2c29";
            const span = e.currentTarget.querySelector('.logout-text');
            if (span) span.style.color = COLOR.red;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            const span = e.currentTarget.querySelector('.logout-text');
            if (span) span.style.color = "#888780";
          }}
        >
          <span style={{ fontSize: 16 }}>🔒</span>
          {sidebarOpen && (
            <span
              className="logout-text"
              style={{
                fontSize: 13,
                color: "#888780",
                fontWeight: 600,
                transition: "color 0.2s"
              }}
            >
              Log Out
            </span>
          )}
        </button>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ padding: "12px 0", background: "none", border: "none", cursor: "pointer", color: "#888780", fontSize: 16, borderTop: "0.5px solid #333330" }}>
          {sidebarOpen ? "◀" : "▶"}
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <div style={{ background: "#fff", borderBottom: "0.5px solid #e5e3dc", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#2C2C2A" }}>{TABS.find(t => t.id === activeTab)?.icon} {TABS.find(t => t.id === activeTab)?.label}</div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 11, background: COLOR.greenLight, color: COLOR.green, padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>● Live Cell</span>
            <span style={{ fontSize: 11, background: COLOR.saffronLight, color: COLOR.saffronDark, padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>HI / EN</span>
            <button
              onClick={async () => {
                if (auth) {
                  await signOut(auth);
                }
                localStorage.removeItem("mock_admin_auth");
                router.push("/login");
              }}
              style={{
                fontSize: 11,
                background: COLOR.redLight,
                color: COLOR.red,
                border: `1px solid ${COLOR.red}40`,
                padding: "5px 12px",
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              🔒 Log Out
            </button>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: COLOR.saffronLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: COLOR.saffronDark }}>RS</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <Screen />
        </div>
      </div>
    </div>
  );
}
