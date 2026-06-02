"use client";

import { useState, useEffect } from "react";

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

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "thoughts", label: "My Thoughts", icon: "💭" },
  { id: "political", label: "Journey & RSS", icon: "🏛️" },
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

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const fields = [
    { label: "Name (Hindi)", key: "nameHi" },
    { label: "Name (English)", key: "nameEn" },
    { label: "Date of Birth", key: "dob" },
    { label: "Father's Name", key: "fatherName" },
    { label: "Caste / Category", key: "caste" },
    { label: "Education", key: "education" },
    { label: "Permanent Address", key: "address" },
    { label: "Contact", key: "contact" },
    { label: "Email", key: "email" },
    { label: "Current Role", key: "currentRole" },
    { label: "Party Affiliation", key: "partyAffiliation" },
    { label: "Sangh Experience", key: "sanghExperience" },
  ];

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    await onSaveProfile(formData);
    setEditing(false);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: 20 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: COLOR.saffronLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: COLOR.saffronDark, border: `3px solid ${COLOR.saffron}` }}>RS</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#2C2C2A" }}>{profile?.nameHi || "राघवेन्द्र सैनी"}</div>
          <div style={{ fontSize: 13, color: "#5F5E5A", marginTop: 2 }}>{profile?.currentRole || "Coordinator, Social Media Monitoring Cell · UP Govt."}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            <Badge color="amber">BJP</Badge>
            <Badge color="blue">UP Government</Badge>
            <Badge color="green">Active</Badge>
            <Badge color="gray">OBC</Badge>
          </div>
        </div>
        <button onClick={editing ? handleSave : () => setEditing(true)} style={{ background: editing ? COLOR.green : "#f5f4f0", color: editing ? "#fff" : "#2C2C2A", border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
          {editing ? "✓ Save Profile" : "✏️ Edit Profile"}
        </button>
      </div>

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

  const filtered = filter === "all" ? thoughts : thoughts.filter(t => t.status === filter);

  const startWriteNew = () => {
    setEditingId(null);
    setTitleHi("");
    setTitleEn("");
    setDescHi("");
    setDescEn("");
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

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>CONTENT (HINDI DESCRIPTION)</label>
          <textarea rows={6} value={descHi} onChange={e => setDescHi(e.target.value)} placeholder="अपने विचार यहाँ लिखें..." style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "8px 12px", outline: "none", boxSizing: "border-box", lineHeight: 1.8, resize: "vertical" }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#888780", display: "block", marginBottom: 4 }}>CONTENT (ENGLISH DESCRIPTION)</label>
          <textarea rows={4} value={descEn} onChange={e => setDescEn(e.target.value)} placeholder="Write English translation here..." style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "8px 12px", outline: "none", boxSizing: "border-box", lineHeight: 1.8, resize: "vertical" }} />
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
  const [title, setTitle] = useState("");
  const [beneficiaries, setBeneficiaries] = useState("");
  const [area, setArea] = useState("");
  const [year, setYear] = useState("");

  const handleAdd = async () => {
    if (!title || !area) {
      alert("Please fill title and geographical area");
      return;
    }
    const itemPayload = {
      title,
      beneficiaries: beneficiaries || "0+",
      area,
      year: year || new Date().getFullYear().toString()
    };
    await onSaveCommunity(itemPayload);
    setTitle("");
    setBeneficiaries("");
    setArea("");
    setYear("");
    setShowAddForm(false);
  };

  const handleDelete = async (index) => {
    if (window.confirm("Are you sure you want to delete this community work item?")) {
      await onDeleteCommunity(index);
    }
  };

  return (
    <div>
      <SectionHeader title="Community Work" actionLabel="Add Initiative" action={() => setShowAddForm(true)} />
      
      {showAddForm && (
        <div style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <SectionHeader title="🤝 Add Community Work" />
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#888780" }}>INITIATIVE TITLE</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Voter Awareness Drive" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780" }}>BENEFICIARIES COUNT</label>
              <input value={beneficiaries} onChange={e => setBeneficiaries(e.target.value)} placeholder="e.g. 5,000+ / 12,000+" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#888780" }}>YEAR / TERM</label>
              <input value={year} onChange={e => setYear(e.target.value)} placeholder="e.g. 2024 / 2022–23" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#888780" }}>GEOGRAPHICAL AREA</label>
            <input value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. Bindki Tehsil / Fatehpur District" style={{ width: "100%", fontSize: 13, border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 10px", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={handleAdd} style={{ background: COLOR.green, color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Save Initiative</button>
            <button onClick={() => setShowAddForm(false)} style={{ background: "#f5f4f0", border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {community.map((c, i) => (
          <div key={i} style={{ background: "#fff", border: "0.5px solid #e5e3dc", borderLeft: `3px solid ${COLOR.green}`, borderRadius: "0 12px 12px 0", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginRight: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#2C2C2A" }}>{c.title}</div>
                <Badge color="green">{c.year}</Badge>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: "#888780" }}>
                <span>👥 {c.beneficiaries} beneficiaries</span>
                <span>📍 {c.area}</span>
              </div>
            </div>
            <button onClick={() => handleDelete(i)} style={{ background: "#FCEBEB", border: "0.5px solid #f7c1c1", borderRadius: 6, padding: "4px 8px", fontSize: 11, color: COLOR.red, cursor: "pointer" }}>🗑</button>
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

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Live Database States
  const [profile, setProfile] = useState(null);
  const [thoughts, setThoughts] = useState([]);
  const [timeline, setTimeline] = useState([]);
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
        settingsRes
      ] = await Promise.all([
        fetch("/api/profile").then(r => r.json()),
        fetch("/api/thoughts").then(r => r.json()),
        fetch("/api/timeline").then(r => r.json()),
        fetch("/api/media").then(r => r.json()),
        fetch("/api/community").then(r => r.json()),
        fetch("/api/documents").then(r => r.json()),
        fetch("/api/analytics").then(r => r.json()),
        fetch("/api/settings").then(r => r.json())
      ]);

      setProfile(profileRes);
      setThoughts(thoughtsRes);
      setTimeline(timelineRes);
      setMedia(mediaRes);
      setCommunity(communityRes);
      setDocs(docsRes);
      setAnalytics(analyticsRes);
      setSettings(settingsRes);
    } catch (error) {
      console.error("Error fetching campaign portal database:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

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
      setThoughts(data.data);
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
      setThoughts(data.data);
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
      setTimeline(data.data);
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
      setTimeline(data.data);
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
      setMedia(data.data);
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
      setMedia(data.data);
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
      const data = await res.json();
      setCommunity(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCommunity = async (index) => {
    try {
      const res = await fetch(`/api/community?index=${index}`, {
        method: "DELETE"
      });
      const data = await res.json();
      setCommunity(data.data);
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
      setDocs(data.data);
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
      setDocs(data.data);
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
    media: () => <Media media={media} onSaveMedia={handleSaveMedia} onDeleteMedia={handleDeleteMedia} />,
    community: () => <Community community={community} onSaveCommunity={handleSaveCommunity} onDeleteCommunity={handleDeleteCommunity} />,
    documents: () => <Documents docs={docs} onSaveDoc={handleSaveDoc} onDeleteDoc={handleDeleteDoc} />,
    analytics: () => <Analytics analytics={analytics} />,
    settings: () => <Settings settings={settings} onSaveSettings={handleSaveSettings} />
  };

  const Screen = SCREENS[activeTab] || (() => <Dashboard profile={profile} thoughts={thoughts} media={media} docs={docs} />);

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
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 11, background: COLOR.greenLight, color: COLOR.green, padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>● Live Cell</span>
            <span style={{ fontSize: 11, background: COLOR.saffronLight, color: COLOR.saffronDark, padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>HI / EN</span>
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
