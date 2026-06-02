# Code Standards

## General Principles
- Write clean, readable code over clever code
- Every component must work in both **Hindi** and **English** (i18n-ready)
- Mobile-first responsive design (most users are on mobile in UP)
- Accessibility: minimum WCAG AA compliance

## React Standards

### Component Naming
```jsx
// ✅ Correct — PascalCase, descriptive
const ThoughtsEditor = () => {}
const DocumentVault = () => {}

// ❌ Wrong
const comp1 = () => {}
const editor = () => {}
```

### File Structure per Component
```
ComponentName/
├── index.jsx       # Main component
├── styles.css      # Component-specific styles (if needed)
└── ComponentName.test.jsx
```

### Props
- Always define PropTypes or use TypeScript interfaces
- Destructure props at the top of the function
- Provide default values for optional props

```jsx
const ThoughtsCard = ({ title, content, date, isPublic = false }) => {
  // ...
}
```

## Styling (Tailwind CSS)
- Use Tailwind utility classes; avoid inline styles
- Custom colors via `tailwind.config.js` using the brand palette:
  ```js
  colors: {
    saffron: '#EF9F27',
    bjpGreen: '#1D9E75',
    bjpNavy: '#185FA5',
  }
  ```
- Dark mode via `class` strategy (not media query)
- Responsive breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)

## State Management
- Local UI state → `useState`
- Shared app state → Zustand store
- Server state → React Query (TanStack)
- Do NOT use Redux unless team size demands it

## API Calls
```js
// ✅ Use a centralized api.js
import { supabase } from '../lib/supabase'

export const getThoughts = async (isAdmin = false) => {
  const query = supabase.from('thoughts').select('*')
  if (!isAdmin) query.eq('is_public', true)
  return await query.order('published_at', { ascending: false })
}
```

## Hindi / English (i18n)
- Store bilingual content in DB: `title_hi`, `title_en`
- Use `useLanguage()` hook to get current language
- Never hardcode Hindi text in JSX — always fetch from DB or i18n file

```jsx
const { lang } = useLanguage()
return <h1>{item[`title_${lang}`]}</h1>
```

## Git Conventions
```
feat: add thoughts editor with draft support
fix: resolve OTP timeout on slow networks
docs: update architecture diagram
style: adjust saffron button hover state
refactor: extract DocumentVault into smaller components
```

## Security
- Never expose Supabase service role key in frontend
- Sanitize all rich-text inputs (use DOMPurify)
- Validate file uploads: max 10MB, allowed types: PDF, JPG, PNG, DOCX
- Rate-limit OTP endpoint: max 3 attempts per 10 minutes
