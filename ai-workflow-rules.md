# AI Workflow Rules

## Purpose
Rules for using AI (Claude or any LLM) to assist development and content creation for this project. These ensure consistency, safety, and efficiency.

---

## Rule 1 — Content Generation

### For "My Thoughts" (Blog/Opinion posts)
- AI may **draft** opinion posts based on bullet points provided by the client
- All AI-drafted content must be **reviewed and approved** by the client before publishing
- Maintain the client's voice: formal yet accessible, rooted in UP/Hindi political context
- Posts should reflect BJP/Sangh ideological alignment unless marked as neutral analysis

### Prompt Template for Thought Posts
```
Write a 300-word Hindi political opinion post on the topic: [TOPIC]
Tone: Respectful, assertive, grounded in ground-level UP politics
Audience: Educated voters and party workers
Author voice: Raghvendra Saini — Social Media expert, BJP worker, UP Govt official
Include: 1 opening hook, 2-3 key arguments, 1 closing call-to-action
```

---

## Rule 2 — Profile Updates

- Never auto-publish AI-generated profile changes
- Changes to designation, caste, or address require manual admin confirmation
- AI suggestions for profile improvement are shown as "Suggested Edit" — not applied directly

---

## Rule 3 — Media Monitoring (AI-Assisted)

- AI can scan news APIs for mentions of "Raghvendra Saini" or related keywords
- Flag articles for client review: `positive`, `neutral`, `negative`
- Never auto-respond to negative press — flag only
- Summarize long articles into 3-line briefs in Hindi

---

## Rule 4 — Document Handling

- AI must NOT read or parse private documents (ID proofs, personal certificates)
- AI may help categorize and label uploaded documents by name/type
- OCR/extraction only on explicitly approved documents

---

## Rule 5 — Social Media Analytics

- AI summarizes weekly trends across platforms
- Suggests optimal posting times based on engagement history
- Does NOT auto-post — all posts require manual approval

---

## Rule 6 — Security & Privacy

- AI must NEVER expose sensitive fields: Aadhaar, mobile OTP, financial data
- All AI interactions in the admin portal are logged
- AI cannot change visibility settings — only suggest

---

## Rule 7 — Language

- Default language for AI output: **Hindi** (Devanagari)
- Technical/government sections: **English**
- Mixed content: Hindi first, English in parentheses for formal terms
- Avoid transliteration (Hinglish) in published content

---

## Approved AI Use Cases Summary
| Use Case | Allowed | Requires Approval |
|---|---|---|
| Draft opinion posts | ✅ | ✅ Yes |
| Suggest profile edits | ✅ | ✅ Yes |
| Summarize news articles | ✅ | ❌ No |
| Auto-publish content | ❌ | — |
| Read private documents | ❌ | — |
| Change privacy settings | ❌ | — |
| Generate social posts | ✅ | ✅ Yes |
| Analytics reports | ✅ | ❌ No |
