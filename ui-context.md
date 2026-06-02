# UI Context

## Design Identity

### Theme
**"Authoritative yet Accessible"** — Inspired by saffron-and-green BJP branding combined with the gravitas of a government official portal. Clean, trustworthy, mobile-first.

### Color Palette
| Name | Hex | Usage |
|---|---|---|
| Saffron | `#EF9F27` | Primary accent, CTA buttons, highlights |
| BJP Green | `#1D9E75` | Success states, active badges, timelines |
| Navy Blue | `#185FA5` | Links, government sections, info states |
| Deep Saffron | `#BA7517` | Hover state on saffron elements |
| Off-White | `#FAFAF7` | Page background |
| Dark Charcoal | `#2C2C2A` | Body text |
| Muted Gray | `#888780` | Secondary text, labels |

### Typography
| Role | Font | Weight |
|---|---|---|
| Hindi headings | Hind / Noto Sans Devanagari | 600 |
| English headings | Playfair Display | 500 |
| Body (both langs) | Inter / Noto Sans | 400 |
| Labels & badges | Inter | 500, uppercase |

### Iconography
- Library: **Tabler Icons** (outline style)
- Size: 18px inline, 24px for section headers
- Color: inherits from context (saffron on dark, navy on light)

---

## Layout System

### Public Portfolio Pages
```
[Sticky Navbar — Name + Nav links + Lang toggle]
[Hero — Photo, Name, Designation, Social links]
[Section: Political Journey (Timeline)]
[Section: Government Work (Cards)]
[Section: My Thoughts (Blog cards)]
[Section: Media Coverage (Press grid)]
[Section: Community Work]
[Footer — Contact + Party logo]
```

### Admin Portal Layout
```
[Sidebar — 240px fixed]
  └── Dashboard
  └── Profile
  └── My Thoughts
  └── Political History
  └── Government
  └── Media
  └── Documents
  └── Community
  └── Analytics
  └── Settings

[Main Content Area — fluid]
  └── Page header (breadcrumb + actions)
  └── Content cards
  └── Action buttons (Save / Publish / Preview)
```

---

## Key UI Components

### My Thoughts Editor
- Rich text editor (TipTap or Quill)
- Fields: Title (HI + EN), Body, Tags, Cover image, Visibility toggle
- Status: Draft / Published / Scheduled
- AI Assist button → generates draft from bullet points

### Profile Card (Public)
- Circular photo with saffron border
- Name in Hindi (large) + English (small)
- Current designation badge
- Quick contact icons (phone, email, social)

### Timeline Component
- Vertical timeline, left-aligned on mobile
- Year marker in saffron pill
- Role title bold, org name muted
- Active role highlighted with green dot

### Document Vault (Admin)
- Grid of document cards
- Category filter: Certificate / ID / Appointment / Research / Media
- Each card: filename, upload date, visibility badge, download + delete actions
- Drag-and-drop upload zone

### Social Media Widget
- Linked platforms: Twitter/X, Facebook, YouTube, Instagram, WhatsApp Channel
- Live follower count (via API or manual entry)
- Last 7-day engagement summary
- Post scheduler (manual approval required)

### Analytics Panel (Admin)
- Profile page views (daily/weekly/monthly chart)
- Top viewed sections
- Document download count
- Geographic breakdown (UP districts heatmap)

---

## Mobile Considerations
- Primary users in UP likely on Android (Chrome)
- Font size minimum: 14px body, 18px headings
- All touch targets: minimum 44px height
- Hindi text rendering: test on low-end Android devices
- Offline-friendly: cache profile data with service worker

---

## Accessibility
- All images have `alt` text in Hindi
- Form fields have visible `<label>` elements
- Focus ring: 2px saffron outline
- Color contrast: minimum 4.5:1 for body text
- Screen reader support for timeline and document vault

---

## Brand Assets (To Collect from Client)
- [ ] Professional photo (high-res, formal)
- [ ] BJP logo (official SVG)
- [ ] Signature (for certificates/letters)
- [ ] Party flag / banner images
- [ ] Awards & certificates scans
