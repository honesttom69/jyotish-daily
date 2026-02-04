# Vedic Transit App - Product Vision & Design Document

**Created:** January 27, 2026
**Author:** Tom Hinkle + Claude
**Status:** Feature-complete MVP — ready for UAT & polish
**Last Updated:** February 2, 2026

---

## Executive Summary

A simple, modern Vedic astrology transit app that brings the accuracy of traditional Jyotish to a mobile-friendly interface. Think "Natal Charts with Transits" (Allen Edwall's app) but for Vedic/sidereal astrology.

**Core differentiator:** Sidereal zodiac + plain English guidance + modern UX + one-time purchase (no subscriptions, no ads, no accounts)

---

## The Problem

Vedic astrology is powerful but inaccessible:

| Current Option | Strength | Weakness |
|----------------|----------|----------|
| **Jagannatha Hora** | Deep, accurate, free | Ugly, complex, Windows-only |
| **Natal Charts with Transits** | Simple, functional | Western/Tropical only - no Vedic |
| **Time Nomad** | Sidereal support, polished | iOS only, complex, overwhelming |
| **Astrology Master** | Sidereal, Android | Ad-heavy, cluttered |
| **Professional readings** | Personal, nuanced | Expensive ($100-500), one-time |

**The gap:** No tool combines *accurate Vedic calculations* with *personalized, understandable daily guidance* in a *modern interface* with a *simple business model*.

---

## Target Audience

### Primary: "Curious Seekers"
- Know their Sun sign, maybe discovered their Moon sign
- Interested in astrology but intimidated by Vedic complexity
- Want guidance, not just data
- Willing to pay for quality insights
- Age 25-45, digitally native

### Secondary: "Dedicated Students"
- Actively studying Vedic astrology
- Use JH or similar but want a cleaner daily driver
- Want to track transits without opening desktop software

### Tertiary: "Practitioners"
- Professional or semi-professional astrologers
- Need client chart management
- Want a tool to share with clients

---

## Core Value Proposition

> **"Your personal Vedic astrologer, available daily."**

We translate the ancient science into actionable daily guidance - without dumbing it down.

**Not:** "Mercury is transiting your 4th house at 15°32' in Vishakha nakshatra"

**Instead:** "Mercury is moving through your home & emotions sector this week. Good time for important conversations with family, paperwork related to property, or finally organizing that space. Your mind wants to nest."

---

## Competitive Positioning

| vs. This | Our Advantage |
|----------|---------------|
| Natal Charts with Transits | We have Vedic/sidereal, they don't |
| Time Nomad | We're simpler, web-based, not iOS-only |
| Astrology Master | No ads, cleaner UX |
| Jagannatha Hora | Modern, mobile-friendly, plain English |
| Paid subscriptions | One-time $2, done forever |

---

## Key Differentiators

### 1. Actually Vedic
- Sidereal zodiac (Lahiri ayanamsha)
- Nakshatras included
- Dasha system, not just transits
- Ashtakavarga scoring
- Proper Vedic aspects (drishti)

### 2. Personalized, Not Generic
- Every insight tied to YOUR natal chart
- "Saturn is transiting your 8th house" not "Saturn in Pisces means..."
- Knows your weak planets and highlights when they're activated

### 3. Plain Language + Depth Available
- Default view: Clear, actionable guidance
- Tap to expand: See the technical details
- Learn mode: Explains WHY this interpretation

### 4. Beautiful & Modern
- Clean, minimal interface
- Dark mode (astrology users love dark mode)
- Thoughtful typography
- No clutter, no ads

### 5. Simple Business Model
- No accounts required
- No subscriptions
- No ads, ever
- One-time purchase unlocks full features

---

## Feature Set

### MVP (Version 1.0)

| Feature | Description |
|---------|-------------|
| **Birth data entry** | Date, time, place with timezone auto-detect |
| **Natal chart display** | South Indian style (with North/Wheel toggle) |
| **Today's transits** | Overlay on natal chart + list view |
| **Transit list** | "Saturn in Pisces → your 8th house" format |
| **Date picker** | Check any past/future date |
| **Daily guidance** | Personalized paragraph interpretation |
| **Sidereal (Lahiri)** | The key differentiator |
| **Save locally** | localStorage, no account needed |

### Version 1.1

| Feature | Description |
|---------|-------------|
| **Dasha display** | Current Maha/Antar dasha with dates |
| **Nakshatra positions** | Moon nakshatra, planet nakshatras |
| **Calendar view** | Month view with color-coded days |
| **Multiple charts** | Save 3-5 people |

### Version 2.0

| Feature | Description |
|---------|-------------|
| **Push notifications** | Major transit alerts |
| **Muhurta** | Good/bad day picker for activities |
| **Remedies** | Suggestions based on challenging transits |
| **Transit journal** | Track how transits manifested |

---

## User Experience

### First Launch Flow
1. **Welcome** - "Let's set up your cosmic profile"
2. **Birth data entry** - Date, time (with "I'm not sure" option), location
3. **Chart calculation** - Brief loading with educational content
4. **Your chart revealed** - Beautiful natal chart display
5. **Quick tour** - "Here's what we'll show you daily"
6. **First reading** - Today's personalized guidance

### Daily Use Pattern

**Morning:**
- Open app → Immediately see today's guidance
- Glanceable summary
- Tap for details on any transit

**Throughout Day:**
- Check specific questions
- Reference chart for decisions
- Quick muhurta check (v2)

**Evening:**
- Preview tomorrow
- Optional reflection

### Design Principles
1. **Calm over chaotic** - No mystical clutter
2. **Guidance over data** - Lead with insight
3. **Warm over cold** - Supportive tone
4. **Accurate over approximate** - Real calculations
5. **Empowering over dependent** - Teach the user

---

## Business Model

### Freemium Without Account

**Free Tier:**
- Birth chart display
- Basic daily overview (1-2 sentences)
- Current dasha period display
- Limited transit calendar (3 days)

**Premium ($1.99 - $2.99 one-time):**
- Full daily guidance (detailed paragraphs)
- Complete transit calendar (unlimited)
- Multiple charts (up to 5)
- All interpretations unlocked

### Why One-Time Purchase
- No recurring revenue pressure
- User trust (not trying to extract money)
- Simpler implementation (no auth, no subscription management)
- Differentiation from ad-supported competitors

### Payment Implementation Options
- Gumroad (simple, takes ~10%)
- Stripe Payment Links (lower fees)
- Ko-fi (tip jar model)
- Unlock code system (generate codes, user enters to unlock)

---

## Technical Architecture

### Platform Strategy

**Phase 1: Progressive Web App (PWA)**
- Single HTML file (like AllSorts!)
- Works on all devices immediately
- No app store approval needed
- Can install to home screen
- Faster iteration

**Phase 2: Native Apps (Future)**
- iOS and Android
- Better notifications
- App store presence

### Calculation Engine Options

| Option | Pros | Cons |
|--------|------|------|
| **Swiss Ephemeris (JS port)** | Gold standard accuracy | Complex integration |
| **Astronomical algorithms** | Full control, no dependencies | More work upfront |
| **API service** | Fastest to market | Ongoing cost, dependency |

**Recommendation:** Start with API for MVP speed, build toward Swiss Ephemeris for independence.

### Data Storage
- localStorage for birth data (no account)
- Optional: Export/import JSON for backup
- No server-side storage needed for MVP

### Key Technical Components
1. **Planetary position calculator** - Current positions for any date
2. **Ayanamsha converter** - Tropical to Sidereal (Lahiri)
3. **House calculator** - Whole sign houses from ascendant
4. **Aspect detector** - Identify transits hitting natal planets
5. **Interpretation engine** - Map positions to text

---

## UI Design

### Color Scheme (Dark Mode)
```css
--bg-primary: #0d1117;      /* Main background */
--bg-secondary: #161b22;    /* Cards */
--bg-tertiary: #21262d;     /* Elevated elements */
--text-primary: #e6edf3;    /* Main text */
--text-secondary: #8b949e;  /* Secondary text */
--accent: #c9a227;          /* Gold - cosmic/premium */
--positive: #3fb950;        /* Green - favorable */
--negative: #f85149;        /* Red - challenging */
--neutral: #8b949e;         /* Gray - neutral */
```

### Typography
- System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', etc.)
- Clean, readable
- Proper hierarchy (titles, body, details)

### Chart Display
- South Indian style default (signs fixed, planets placed)
- North Indian toggle available
- Western wheel toggle available
- Natal planets in gold/accent color
- Transit planets in green

### Screen Structure

**Main Screen:**
1. Header with logo and settings
2. Date selector (arrows + today button)
3. Profile card (name, asc, moon, current dasha)
4. Daily guidance box (prominent)
5. Transit list (scrollable)
6. Chart display (below fold)
7. Bottom navigation

**Calendar Screen:**
1. Month/year header with navigation
2. 7-column grid of days
3. Color-coded dots (green/gold/red)
4. Selected day detail panel

**Setup Screen:**
1. Welcome text
2. Name input
3. Birth date input
4. Birth time input (with uncertainty checkbox)
5. Birth place input (with geocoding)
6. Calculate button

---

## Naming Ideas

| Name | Vibe |
|------|------|
| **Jyotish Daily** | Direct, clear, uses Sanskrit term |
| **Vedic Sky** | Accessible, poetic |
| **Nakshatra** | Sanskrit, mysterious |
| **Graha** | Sanskrit for "planet" |
| **Transit Jyotish** | Functional, searchable |
| **Cosmic Mirror** | Poetic, Western-friendly |
| **Sidereal** | Technical, accurate |

**Current placeholder:** Jyotish Daily

---

## MVP Success Criteria

1. **Personal utility** - Tom finds it genuinely useful daily
2. **Accuracy** - Calculations verified against Jagannatha Hora
3. **Simplicity** - New user can get value in < 2 minutes
4. **Beta feedback** - 3-5 testers say "I'd pay for this"

---

## Development Roadmap

### Phase 1: Prototype (Week 1-2)
- [ ] Finalize UI mockup based on feedback
- [ ] Implement planetary calculations (or integrate API)
- [ ] Build natal chart display
- [ ] Add transit overlay
- [ ] Basic interpretation text

### Phase 2: MVP (Week 3-4)
- [x] Date picker functionality
- [x] Full interpretation database
- [x] Local storage for birth data
- [ ] Responsive design polish
- [ ] Beta testing with 5-10 users

### Phase 2.5: UAT & Release Readiness
- [ ] Execute full UAT script (`UAT_TestPlan.md` — 139+ tests across 16 modules)
- [x] Fix all P0 calculation accuracy bugs (ayanamsha, geocentric positions, true node)
- [x] Verify calculation accuracy against Jagannatha Hora (all houses match)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsive testing (375px, 768px, 1200px)
- [ ] Get sign-off from 2+ beta testers
- [ ] Log defects and verify fixes in defect log

### Phase 3: Launch (Week 5-6)
- [x] Payment integration (Gumroad license verification — product ID placeholder needs replacing)
- [ ] Landing page
- [ ] Launch on Product Hunt
- [ ] Post to r/vedicastrology, r/astrology
- [ ] Gather feedback, iterate

### Phase 4: Growth (Ongoing)
- [x] Add dasha display
- [x] Multiple charts (up to 5 profiles, Gumroad paywall for 2-5)
- [x] Calendar view
- [x] Vedic aspects (drishti) — detection + display + Learn tab
- [x] Chart overview — natal chart personality summary
- [x] Learn screen — Houses, Planets, Signs, Aspects tabs
- [ ] Consider native apps

---

## Files Created

| File | Purpose |
|------|---------|
| `VedicTransitApp_Vision.md` | This document - full product vision |
| `CODEBASE_GUIDE.md` | Comprehensive codebase reference (glossary, architecture, every file explained) |
| `UAT_TestPlan.md` | Full user acceptance testing script (139+ tests, 16 modules) |
| `mockup_v1.html` | Interactive UI mockup with 3 screens (original prototype) |

---

## Reference: Tom's Chart (Test Data)

Used for mockup and testing:

- **Name:** Tom Hinkle
- **Birth:** December 1, 1987, 00:05 AM
- **Location:** Pottsville, Pennsylvania, USA
- **Ascendant:** Leo 20°07' (Poorva Phalguni)
- **Moon:** Pisces 25°11' (Revati)
- **Sun:** Scorpio 14°46' (Anuradha)

**Key placements:**
- Jupiter (R) in Pisces 8th (own sign)
- Saturn combust in Scorpio 4th
- Venus in Sagittarius 5th (Moola)
- Mars debilitated in Libra 3rd
- Ketu in Virgo 2nd, Rahu in Pisces 8th

**Current dasha:** Moon (verify in JH)

---

## Appendix: Astrology Reading Notes

### Relationship Analysis (House 8)
- 7th house Aquarius, lord Saturn combust in 4th
- Venus in 5th (romantic) in Moola (transformative)
- Partners: serious, mature, connected to home/family
- 8th house emphasis: deep soulful connections

### Wealth Analysis (House 10)
- Ketu in 2nd: irregular relationship with money
- Mercury (2nd/11th lord) combust: wealth potential overshadowed
- Jupiter in own sign: protective, won't be destitute
- Best: creative income, real estate, consulting, occult/healing fields

### Spiritual Path (House 11)
- Saturn as Atmakaraka: discipline, service, patience lessons
- Jupiter-Moon-Rahu in 8th: natural meditation ability, occult pull
- Moon in Revati: compassion, healing, guiding others
- 9th lord Mars debilitated: must actively seek spiritual path

### Past Life Indicators (House 18)
- Ketu in Virgo 2nd: past life healer/analyst/servant
- Rahu in Pisces 8th: this life toward spiritual surrender, occult
- Karmic journey: from material security to transformative surrender

### Remedies (House 19)
- **Mars (priority):** Hanuman Chalisa Tuesdays, physical exercise, red coral (caution)
- **Saturn:** Service to elderly, Saturday fasting, patience practices
- **Mercury:** Wednesday green, learning, Vishnu sahasranama
- **Sun (chart lord):** Gayatri mantra at sunrise, ruby gemstone

---

## Sprint History (Changelog)

### Sprint 1-2: Core MVP
- Birth data entry with geocoding (OpenStreetMap Nominatim)
- Natal chart calculation (ascendant, all 9 planets, nakshatras)
- Tropical-to-sidereal conversion (Lahiri ayanamsha)
- South Indian chart display
- Transit calculations with house placement
- Daily guidance text synthesis
- localStorage persistence
- PWA with service worker caching

### Sprint 3: Calendar + Dashas
- Monthly calendar view with color-coded day quality dots
- Vimshottari dasha timeline with Maha/Antar periods
- Dasha interpretation text
- Date selector (forward/back/today)

### Sprint 4: North Indian Chart + Tooltips
- North Indian diamond chart style with clip-path polygons
- Chart style toggle (South/North)
- Chart cell tooltip popup with house/sign/planet details

### Sprint 5: Transit Timing + Conjunctions
- Transit entry/exit date calculation (binary search approach)
- Conjunction detection (within 8 degrees)
- Conjunction interpretation text (composed + override system)
- Transit timing progress bars

### Sprint 6: Vedic Aspects (Drishti) + Learn Screen
- Vedic aspect detection (7th for all, special for Mars/Jupiter/Saturn/Rahu/Ketu)
- Aspect tags in transit list UI
- Aspect interpretation text (composed + override)
- Learn screen with 4 tabs: Houses, Planets, Signs, Aspects
- Educational content for all topics

### Sprint 7: Multiple Profiles + Gumroad Paywall
- Multi-profile support (up to 5 profiles with CRUD)
- Profile list/switcher screen with callbacks pattern
- Gumroad license key verification (1 free, 2-5 require license)
- Base64 data encoding in localStorage (obfuscation, not encryption)
- Migration from old single-profile format
- Setup form add/edit modes
- Profile card clickable to navigate to profiles

### Sprint 8: Chart Overview + Calculation Accuracy Fixes
- Natal chart personality summary section (ascendant, Moon sign, Sun sign, notable placements)
- `synthesizeChartOverview()` in synthesis.js
- ASCENDANT_TEXT, MOON_SIGN_TEXT, SUN_SIGN_TEXT, PLANET_IN_HOUSE_NATAL in interpretations.js
- **Critical fix:** Changed from heliocentric (`EclipticLongitude`) to geocentric (`GeoVector` + `Ecliptic`) planet positions — Mercury was off by ~29 degrees, Venus by ~36 degrees
- **Fix:** Updated Lahiri ayanamsha base value from 23.853 to 24.0417 (Swiss Ephemeris, matches JH)
- **Fix:** Rahu/Ketu now uses true node (mean + Delaunay periodic corrections) instead of mean node
- **Fix:** `localToUtc()` uses iterative refinement to handle DST transitions correctly
- All natal houses verified to match Jagannatha Hora for test chart

---

## Remaining TODO

### Before Release
- [ ] Replace `'PLACEHOLDER'` in `js/data/premium.js` with actual Gumroad product ID
- [ ] Update `#gumroad-link` href in `index.html` with actual Gumroad product page URL
- [ ] Execute full UAT (`UAT_TestPlan.md` — 181 tests across 18 modules)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsive testing
- [ ] Landing page

### Future Features
- [ ] Push notifications for major transit alerts
- [ ] Muhurta (good/bad day picker for activities)
- [ ] Remedies suggestions based on challenging transits
- [ ] Transit journal (track how transits manifested)
- [ ] Export/import profile data (JSON backup)
- [ ] Consider native apps (iOS/Android)

---

*Document last updated February 2, 2026.*
