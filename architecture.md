# Architecture

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                  PUBLIC PORTFOLIO                   │
│  (Visible to all — voters, press, party workers)   │
└──────────────────────┬──────────────────────────────┘
                       │
           ┌───────────▼───────────┐
           │     React Frontend    │
           │  (Bilingual: HI / EN) │
           └───────────┬───────────┘
                       │
           ┌───────────▼───────────┐
           │     firbase/ API    │
           │  (Auth, DB, Storage)  │
           └───────────┬───────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                   ADMIN PORTAL                      │
│       (Private — client login using gmail and passowrd)              │
└─────────────────────────────────────────────────────┘
```

## Frontend Architecture

```
src/
├── components/
│   ├── public/           # Public-facing components
│   │   ├── Hero.jsx
│   │   ├── Timeline.jsx
│   │   ├── ThoughtsCard.jsx
│   │   ├── MediaGrid.jsx
│   │   └── ContactSection.jsx
│   ├── admin/            # Admin portal components
│   │   ├── Dashboard.jsx
│   │   ├── ThoughtsEditor.jsx
│   │   ├── DocumentVault.jsx
│   │   ├── MediaManager.jsx
│   │   ├── SocialWidget.jsx
│   │   └── PrivacyToggle.jsx
│   └── shared/
│       ├── Navbar.jsx
│       ├── LanguageSwitch.jsx
│       └── Badge.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Thoughts.jsx      # Blog / Opinion
│   ├── Government.jsx
│   ├── Political.jsx
│   ├── Media.jsx
│   └── admin/
│       ├── Login.jsx
│       └── AdminDashboard.jsx
├── store/                # Zustand / Context state
├── hooks/
└── utils/
```

## Database Schema (Firebase)

### Tables
| Table | Key Fields |
|---|---|
| `profile` | name, dob, address, education, caste, contact, bio_hi, bio_en |
| `roles` | title, org, year_from, year_to, description, category (govt/political/social) |
| `thoughts` | id, title, content_hi, content_en, tags, published_at, is_public |
| `media` | id, title, outlet, type (article/video/interview), url, date, thumbnail |
| `documents` | id, name, category, file_url, is_public, uploaded_at |
| `community` | id, initiative, beneficiaries, partner_org, year, description |
| `analytics` | page, views, date |

## Auth Flow
1. Admin visits `/admin`
2. Enters registered mobile number
3. Receives OTP via SMS
4. Verified → JWT issued → Admin dashboard unlocked
5. Session expires after 8 hours (auto logout)

## Privacy Model
Each content block has a `visibility` field:
- `public` — shown on portfolio
- `party_only` — visible with party login
- `private` — admin view only

## Deployment
- Frontend → Vercel (auto-deploy on push)
- Backend → firabse (managed)
- Domain → custom .in domain recommended (e.g. `raghvendrasaini.in`)
- CDN → Cloudflare (optional, for performance)
