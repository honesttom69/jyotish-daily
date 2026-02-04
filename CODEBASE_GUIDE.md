# Jyotish Daily - Codebase Guide

A complete reference for understanding the code behind this Vedic astrology transit app. Written for someone who vibe-coded the project and wants to understand what every piece does, why it's there, and how it all fits together.

---

## Table of Contents

1. [Glossary](#glossary)
2. [How the App Works (Big Picture)](#how-the-app-works)
3. [Project Structure](#project-structure)
4. [The Calculation Engine](#the-calculation-engine)
5. [The UI Layer](#the-ui-layer)
6. [The Data Layer](#the-data-layer)
7. [App Orchestration (app.js)](#app-orchestration)
8. [Styling](#styling)
9. [PWA & Offline](#pwa--offline)
10. [Premium & Payments](#premium--payments)
11. [Key Data Structures](#key-data-structures)
12. [Common Patterns in the Code](#common-patterns)
13. [How to Change Things](#how-to-change-things)

---

## Glossary

### Web Development Terms

| Term | Meaning |
|------|---------|
| **ES6 Modules** | JavaScript's `import`/`export` system. Each `.js` file is a module that explicitly declares what it shares (`export`) and what it needs from others (`import`). The browser loads them via `<script type="module">`. |
| **SPA** | Single Page Application. The entire app is one HTML file (`index.html`). "Screens" are just `<div>` sections that get shown/hidden with CSS (`display: none` vs `display: block`). No page reloads. |
| **PWA** | Progressive Web App. A website that can be "installed" on your phone or desktop like a native app. Requires a `manifest.json` (app metadata) and a service worker (`sw.js`) for offline caching. |
| **Service Worker** | A script (`sw.js`) that runs in the background between your app and the network. It intercepts fetch requests and can serve cached files when offline. |
| **localStorage** | Browser storage that persists between sessions. Key-value pairs of strings. Our birth data lives here. |
| **base64** | An encoding scheme that converts binary/text data into a string of ASCII characters. We use it to make birth data unreadable at a glance in DevTools (it's obfuscation, not encryption). |
| **Event Delegation** | Instead of adding a click listener to every button, you add one listener to a parent element and check which child was clicked. Used for chart cell clicks. |
| **CSS Custom Properties** | Variables defined in CSS like `--accent: #c9a227` and used as `color: var(--accent)`. Makes theming consistent. |
| **clip-path** | CSS property that clips an element to a polygon shape. Used for the North Indian chart's triangular house regions. |
| **async/await** | JavaScript syntax for handling asynchronous operations (network requests, etc.) without callback hell. `await` pauses until the operation completes. |

### Vedic Astrology Terms

| Term | Meaning | In the Code |
|------|---------|-------------|
| **Sidereal** | The zodiac system based on actual star positions (used in Vedic). Different from Western/tropical by ~24 degrees. | `sidereal.js` handles the conversion |
| **Ayanamsha** | The angular difference between tropical and sidereal zodiacs. We use the Lahiri ayanamsha (~24 degrees in 2024). | Constant in `sidereal.js` |
| **Ascendant (Lagna)** | The zodiac sign rising on the eastern horizon at the moment of birth. Determines which sign = which house. | Calculated in `houses.js` |
| **House** | One of 12 divisions of the chart. House 1 = the ascendant sign, house 2 = the next sign, etc. (whole-sign houses). | `getHouseNumber()` in `houses.js` |
| **Transit** | The current position of a planet in the sky. When a slow planet moves through one of your houses, that's a "transit." | `transits.js` |
| **Conjunction** | When a transiting planet is in the same zodiac sign and close in degrees (within 8 degrees) to one of your natal planets. | Detected in `calculateTransits()` |
| **Aspect (Drishti)** | A planet's "gaze" on other houses. All planets aspect the 7th house from them. Mars, Jupiter, Saturn, Rahu, and Ketu have special extra aspects. | `VEDIC_ASPECTS` in `constants.js` |
| **Nakshatra** | One of 27 lunar mansions, each spanning 13 degrees 20 minutes. Your Moon's nakshatra determines your dasha sequence. | Listed in `constants.js`, calculated in `sidereal.js` |
| **Dasha** | A planetary period system. Vimshottari dashas are a 120-year cycle where each planet "rules" a period of your life. | `dasha.js` |
| **Maha Dasha** | The main planetary period (e.g., "Saturn Maha Dasha" = 19 years of Saturn's themes). | `dasha.js` |
| **Antar Dasha** | A sub-period within a Maha Dasha. Saturn-Jupiter means Saturn's main period with Jupiter's sub-theme. | `dasha.js` |
| **Benefic** | Planets considered naturally helpful: Jupiter, Venus, Mercury (when unafflicted), Moon. | `NATURAL_BENEFICS` in `transits.js` |
| **Malefic** | Planets considered naturally challenging: Saturn, Mars, Rahu, Ketu, Sun. | `NATURAL_MALEFICS` in `transits.js` |
| **Upachaya** | Growth houses (3, 6, 10, 11) where even malefic planets can do well over time. | Referenced in `assessTransitQuality()` |
| **Dusthana** | Difficult houses (6, 8, 12) associated with obstacles, transformation, and loss. | `DIFFICULT_HOUSES` in `transits.js` |

---

## How the App Works

### The 30-Second Version

1. User enters their birth details (date, time, place)
2. App geocodes the place to get latitude/longitude
3. App calculates where all 9 Vedic planets were at that exact moment (the "natal chart")
4. App calculates where all 9 planets are *today* (the "transits")
5. App compares today's positions to the natal chart and generates interpretations
6. This repeats whenever the user changes the date

### The Full Flow

```
User opens app
    |
    v
migrateIfNeeded()          -- converts old single-profile data if needed
    |
    v
getActiveProfile()         -- loads birth data from localStorage
    |
    v
calculateNatalChart()      -- the big one-time calculation:
    |   1. Parse birth date/time
    |   2. Convert local time to UTC using timezone
    |   3. Calculate planet positions (tropical) using astronomy-engine
    |   4. Convert tropical to sidereal (subtract ayanamsha)
    |   5. Calculate ascendant from birth time + location
    |   6. Calculate Vimshottari dasha timeline from Moon's nakshatra
    |   7. Store everything in the `natalChart` variable
    |
    v
updateForDate(today)       -- runs every time the date changes:
    |   1. Calculate planet positions for the selected date
    |   2. Compare each transit planet to the natal chart:
    |       - Which house is it transiting? (based on ascendant)
    |       - Is it conjunct any natal planets? (within 8 degrees)
    |       - Does it aspect any natal planets? (Vedic drishti rules)
    |       - Is this transit positive, negative, or neutral?
    |   3. Calculate timing (when did this transit start, when does it end)
    |   4. Generate interpretive text from the interpretations database
    |   5. Render the chart, transit list, and daily insight
    |
    v
User sees their personalized transit analysis
```

---

## Project Structure

```
VedicTransitApp/
|
|-- index.html              The single HTML page (all 6 screens)
|-- css/styles.css          All styling (~1300 lines)
|-- manifest.json           PWA metadata (name, icons, theme)
|-- sw.js                   Service worker (offline caching)
|-- start.bat               Launches Python HTTP server on port 8000
|
|-- icons/
|   |-- icon.svg            Gold sun symbol (source artwork)
|   |-- icon-192.png        App icon 192x192
|   |-- icon-512.png        App icon 512x512
|   |-- icon-512-maskable.png  Maskable icon for Android
|   |-- generate.html       Utility to regenerate PNGs from SVG
|
|-- js/
|   |-- app.js              MAIN ORCHESTRATOR - wires everything together
|   |-- synthesis.js         Generates daily guidance text from transit data
|   |
|   |-- calc/               CALCULATION ENGINE (the math)
|   |   |-- astronomy-engine.js   External library (planetary ephemeris)
|   |   |-- planets.js            Get planet positions for any date
|   |   |-- houses.js             Calculate ascendant and house numbers
|   |   |-- sidereal.js           Tropical-to-sidereal conversion
|   |   |-- transits.js           Analyze transits vs natal chart
|   |   |-- transitTiming.js      Find when transits start/end
|   |   |-- dasha.js              Vimshottari dasha timeline
|   |   |-- geocoding.js          Place name to lat/lng
|   |   |-- timezone.js           Timezone conversions
|   |
|   |-- ui/                 USER INTERFACE (rendering & interaction)
|   |   |-- screens.js            Show/hide screens, update nav
|   |   |-- dateSelector.js       Date picker controls
|   |   |-- chart.js              South & North Indian chart rendering
|   |   |-- calendar.js           Monthly calendar with quality dots
|   |   |-- dashas.js             Dasha timeline UI
|   |   |-- profiles.js           Multi-profile list & management
|   |   |-- learn.js              Educational content tabs
|   |   |-- chartTooltip.js       Chart cell popup
|   |
|   |-- data/               STATIC DATA & STORAGE
|   |   |-- storage.js            Read/write profiles to localStorage
|   |   |-- premium.js            Gumroad license verification
|   |   |-- interpretations.js    108 transit texts + conjunction/aspect texts
|   |   |-- learn.js              Educational reference content
|   |
|   |-- utils/
|       |-- constants.js          Zodiac signs, planets, nakshatras, aspects, layouts
```

---

## The Calculation Engine

These files do the astronomy and astrology math. They don't touch the DOM or UI at all.

### `astronomy-engine.js` (External Library)

This is the only file we didn't write. It's an open-source ephemeris library that can calculate the exact position of any planet at any date/time. We use `Astronomy.GeoVector()` + `Astronomy.Ecliptic()` to get geocentric ecliptic longitude for planets, `Astronomy.SunPosition()` for the Sun, and `Astronomy.EclipticGeoMoon()` for the Moon.

**Important:** The library's `EclipticLongitude()` function returns *heliocentric* (sun-centered) positions, which is wrong for astrology. We must use `GeoVector()` (earth-centered) instead. This was a critical bug fix — heliocentric vs geocentric can differ by 30+ degrees for inner planets like Mercury and Venus.

### `planets.js` - Planet Position Calculator

**What it does:** Given a date, returns the position of all 9 Vedic planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, plus Rahu and Ketu which are the Moon's nodes).

**Key function:** `getPlanetPositions(date)` returns an array of objects, each with:
- `key` - Planet abbreviation (Su, Mo, Ma, Me, Ju, Ve, Sa, Ra, Ke)
- `longitude` - Absolute position in degrees (0-360) in the *sidereal* zodiac
- `sign` - Which zodiac sign (e.g., "Pisces")
- `degree` / `minute` - Position within that sign (0-29 degrees)
- `nakshatra` - Which of the 27 lunar mansions

**How it works:**
1. Calls astronomy-engine's `GeoVector()` + `Ecliptic()` to get *geocentric tropical* longitude (earth-centered, Western zodiac). Sun and Moon use dedicated functions (`SunPosition()`, `EclipticGeoMoon()`).
2. Calls `sidereal.js` to subtract the ayanamsha, converting to *sidereal* (Vedic zodiac)
3. Rahu is calculated as the Moon's true ascending node (mean node + Delaunay periodic corrections for ±1.5° oscillation); Ketu is always exactly opposite (Rahu + 180 degrees)

**Also exports:** `groupBySign(planets, isTransit)` - Groups planets by their zodiac sign for chart rendering.

### `sidereal.js` - Sidereal Conversion

**What it does:** Converts tropical (Western) positions to sidereal (Vedic) positions.

**The key concept:** Western and Vedic astrology use different starting points for the zodiac. They diverge by about 24 degrees (the "ayanamsha"), and this gap grows by about 50 arc-seconds per year due to the precession of the equinoxes. We use the Swiss Ephemeris Lahiri value (24.0417° at J2000.0 epoch), which matches Jagannatha Hora's default.

**Key functions:**
- `getLahiriAyanamsha(date)` - Calculates the exact ayanamsha for any date
- `tropicalToSidereal(tropicalLon, date)` - Subtracts the ayanamsha
- `longitudeToSign(lon)` - Converts a 0-360 degree longitude to a sign name
- `longitudeToNakshatra(lon)` - Converts to one of 27 nakshatras (each is 13.333 degrees)

### `houses.js` - Ascendant & House Calculation

**What it does:** Calculates the ascendant (rising sign) from birth time and location, and determines house numbers.

**The ascendant calculation** is the most complex astronomical formula in the app:
1. Calculate Greenwich Apparent Sidereal Time (GAST) for the birth moment
2. Add the observer's longitude to get Local Sidereal Time (LST)
3. Convert LST to Right Ascension of the Midheaven (RAMC)
4. Apply the ascendant formula using RAMC, obliquity of the ecliptic, and geographic latitude
5. Convert from tropical to sidereal

**Key functions:**
- `calculateAscendant(utcDate, lat, lng)` - Returns the ascendant sign, degree, and nakshatra
- `getHouseNumber(sign, ascendantSign)` - Given any sign and the ascendant, returns which house number (1-12) that sign represents. In whole-sign houses, it's simply counting signs from the ascendant.

### `transits.js` - Transit Analysis

**What it does:** The core astrology logic. Compares current planet positions against the natal chart.

**Key function:** `calculateTransits(natalChart, transitPositions)` does this for each transiting planet:

1. **House placement:** Which of the 12 houses is this planet transiting? (Based on the natal ascendant)
2. **Quality assessment:** Is this transit positive, negative, or neutral?
   - Benefic planet + favorable house (1,5,9,11) = positive
   - Malefic planet + difficult house (6,8,12) = negative
   - Malefic in upachaya house (3,6,11) = positive (they do well there)
   - Everything else = neutral
3. **Conjunctions:** Is this planet within 8 degrees of any natal planet? If so, record the conjunction and its orb (how close).
4. **Aspects (Drishti):** Does this planet's Vedic aspect reach any natal planet?
   - All planets aspect the 7th house from their position
   - Mars also aspects the 4th and 8th
   - Jupiter also aspects the 5th and 9th
   - Saturn also aspects the 3rd and 10th
   - Rahu/Ketu also aspect the 5th and 9th

**Other key functions:**
- `getDayQuality(natalChart, transitPositions)` - Returns 'good', 'mixed', or 'challenging' for calendar coloring
- `calculateTransitsWithTiming(...)` - Same as above but adds entry/exit dates and conjunction timing

### `transitTiming.js` - When Transits Start & End

**What it does:** For each planet, finds the date it entered its current sign and the date it will leave.

**The challenge:** Planets don't move at constant speeds and can go retrograde (appear to move backward). You can't just divide 360 by speed to get sign duration.

**The approach:**
1. Start from the reference date and scan backward/forward in steps (planet-specific step sizes: Saturn = 21 days, Moon = 1 day)
2. At each step, check the planet's sign. When it changes, you've found the approximate boundary.
3. Use binary search to narrow down to the exact day.
4. Handle retrograde motion (a planet can re-enter a sign it already left).

### `dasha.js` - Vimshottari Dasha Timeline

**What it does:** Calculates the full 120-year dasha timeline from the Moon's birth position.

**How it works:**
1. The Moon's nakshatra at birth determines which planet's dasha you were born into
2. Each nakshatra has a ruling planet: Ketu (7yr), Venus (20yr), Sun (6yr), Moon (10yr), Mars (7yr), Rahu (18yr), Jupiter (16yr), Saturn (19yr), Mercury (17yr)
3. How far through the nakshatra the Moon has traveled determines how much of that first dasha remains
4. The remaining dashas follow in fixed order, each with sub-periods (antar dashas) in the same proportional order

### `geocoding.js` - Place Name to Coordinates

**What it does:** Takes a place name like "Pottsville, Pennsylvania" and returns latitude/longitude using the OpenStreetMap Nominatim API.

### `timezone.js` - Timezone Handling

**What it does:** Converts between local birth time and UTC, handling daylight saving time correctly.

**Key functions:**
- `populateTimezoneSelect(selectEl, defaultTz)` - Fills a `<select>` dropdown with all IANA timezones
- `localToUtc(timezone, year, month, day, hours, minutes)` - Converts local time to UTC using an iterative approach that correctly handles DST transitions (estimates UTC, checks offset, refines if the offset changed)
- `getUtcOffset(timezone, year, month, day, hours, minutes)` - Gets the UTC offset in hours for a timezone at a given moment
- `lookupTimezone(lat, lng)` - Guesses the timezone from coordinates using the timeapi.io API

---

## The UI Layer

These files render things to the screen and handle user interaction. They don't do calculations.

### `screens.js` - Navigation

Dead simple. The app has 6 screens (`<div id="xxx-screen" class="screen">`). Only one is visible at a time. `showScreen('main')` hides all screens, shows the target, and highlights the correct bottom nav button.

The `SCREEN_NAV_MAP` maps screen names to bottom nav button indices:
```js
{ main: 0, calendar: 1, dashas: 2, learn: 3, profiles: 4 }
```

The `setup` screen is intentionally NOT in this map -- it's a sub-screen reached from the profiles screen, so no nav button highlights for it.

### `dateSelector.js` - Date Picker

Controls the prev/next/today buttons on the main screen. Keeps track of the selected date and fires a callback whenever it changes, which triggers `updateForDate()` in app.js.

### `chart.js` - Chart Rendering

Renders two styles of Vedic chart:

**South Indian (default):** A 4x4 CSS grid where signs are in fixed positions (Pisces top-left, Aries next, etc. going clockwise). The center 4 cells are empty. Each cell shows the sign name, house number, natal planets, and transit planets.

**North Indian:** A diamond-inscribed-in-a-square layout where houses are in fixed positions (house 1 = top-left trapezoid) but signs rotate based on the ascendant. Uses CSS `clip-path: polygon()` to create the triangular and trapezoidal house regions, with an SVG overlay for the diamond lines.

Both renderers add `data-house` and `data-sign` attributes to each cell for the tooltip system.

### `calendar.js` - Monthly Calendar

A standard month grid (7 columns for days of the week). Each day cell gets a colored dot based on `getDayQuality()` from the transit engine -- green for favorable, gold for mixed, red for challenging. Clicking a day fires a callback that shows transit details below the calendar.

### `dashas.js` - Dasha Timeline

Renders the Vimshottari dasha timeline as a vertical list of cards. The current Maha Dasha gets a prominent card with progress bars. Each Maha Dasha can be expanded to show its Antar Dasha sub-periods. Uses color coding and progress bars to show where you are in the timeline.

### `profiles.js` - Profile Management

Renders the profile list screen. Each profile is a row with avatar initials, name, birth info, and edit/delete buttons. The active profile has a gold border. Tapping a non-active profile switches to it. The "Add Profile" button is gated behind premium (1 free, 2-5 require license).

Uses a **callbacks pattern** to avoid circular imports -- app.js passes in `{ onSwitch, onEdit, onAdd }` callbacks, so profiles.js never needs to import app.js.

### `learn.js` - Educational Content

Four-tab screen (Houses, Planets, Signs, Aspects) rendering expandable cards from the reference data in `data/learn.js`. Each card shows a title, keywords, and a description that expands on tap.

### `chartTooltip.js` - Chart Cell Popup

A bottom-sheet popup that appears when you tap a chart cell. Shows the house name, sign, educational info, and lists which natal and transit planets are in that cell. Dismissed by tapping the backdrop.

---

## The Data Layer

### `storage.js` - Profile Storage

Manages reading and writing birth data to localStorage. Profiles are stored as a base64-encoded JSON array under the key `jyotish_profiles`. The active profile's ID is stored under `jyotish_active`.

**Why base64?** Birth data (dates, locations) is sensitive. Base64 encoding means someone casually opening DevTools won't see your data in plain text. It's not true encryption -- anyone with the source code can decode it -- but it's a reasonable tradeoff for a client-only app.

**Migration:** When a user who had the old single-profile format (`jyotish_birth_data` key) opens the new version, `migrateIfNeeded()` automatically wraps their data in the new multi-profile format and deletes the old key.

**Key exports:**
- `loadProfiles()` / `saveProfiles(array)` - Read/write the full profiles array
- `getActiveProfile()` - Returns the currently selected profile
- `addProfile(data)` / `updateProfile(id, data)` / `deleteProfile(id)` - CRUD operations
- `isPremium()` - Check if user has unlocked premium
- `saveBirthData()` / `loadBirthData()` / `hasBirthData()` - Backward-compatible wrappers

### `premium.js` - Gumroad License Verification

Handles the premium unlock flow. When a user enters a license key:
1. POSTs to `https://api.gumroad.com/v2/licenses/verify` with the product ID and key
2. If Gumroad says it's valid, stores `{ isPremium: true, licenseKey, verifiedAt }` in localStorage
3. From then on, `isPremium()` returns true and the user can add up to 5 profiles

The product ID is currently set to `'PLACEHOLDER'` -- you need to replace this with your actual Gumroad product ID after creating the product.

### `interpretations.js` - Astrological Text Database

The largest data file. Contains all the interpretive text the app uses:

- **`TRANSIT_HOUSE`** (108 entries) - One interpretation for each planet-in-house combination. E.g., "Saturn in the 8th house demands patience with deep transformation processes..."
- **`CONJUNCTION_TRANSIT_ACTION`** (9 entries) - How each transiting planet acts in a conjunction. E.g., Saturn "demands patience from", Jupiter "expands and blesses"
- **`CONJUNCTION_NATAL_DOMAIN`** (9 entries) - What each natal planet represents. E.g., Moon = "your emotional security", Venus = "your relationships and pleasures"
- **`CONJUNCTION_OVERRIDE`** (12 entries) - Hand-written texts for the most important conjunction pairs (e.g., Saturn conjunct Moon)
- **`ASPECT_ACTION`** (9 entries) - How each planet's aspect acts. E.g., Saturn "casts a disciplined gaze upon"
- **`ASPECT_OVERRIDE`** (12 entries) - Hand-written texts for important aspect pairs
- **`MAHA_DASHA`** (9 entries) - Interpretation text for each planetary period
- **`ANTAR_MODIFIER`** (9 entries) - How each sub-period modifies the main theme
- **`HOUSE_DOMAIN`** (12 entries) - Short labels for each house's life area
- **`ASCENDANT_TEXT`** (12 entries) - Personality descriptions for each ascendant sign
- **`MOON_SIGN_TEXT`** (12 entries) - Emotional nature descriptions for each Moon sign
- **`SUN_SIGN_TEXT`** (12 entries) - Core identity descriptions for each Sun sign
- **`PLANET_IN_HOUSE_NATAL`** (18 entries) - Notable natal placement descriptions (e.g., Jupiter in 8th, Saturn in 4th)

### `learn.js` - Educational Reference Data

Content for the Learn screen:
- **`HOUSE_INFO`** - Name, keywords, and description for each of the 12 houses
- **`PLANET_INFO`** - Name, nature (benefic/malefic), significations, rulership, exaltation, debilitation, description for each of 9 planets
- **`SIGN_INFO`** - Element, quality, ruler, symbol, description for each of 12 signs
- **`ASPECT_INFO`** - Educational explanations of Vedic aspects (what they are, how each planet's aspects work, how to read them in the app)

### `constants.js` - Static Reference Data

The backbone constants used everywhere:
- **`SIGNS`** - Array of 12 zodiac signs in order
- **`PLANETS`** - Object mapping keys (Su, Mo, etc.) to names and Unicode symbols
- **`NAKSHATRAS`** - Array of 27 lunar mansions in order
- **`VEDIC_ASPECTS`** - Which houses each planet aspects
- **`SOUTH_INDIAN_LAYOUT`** - Fixed sign positions in the 4x4 grid
- **`NORTH_INDIAN_HOUSES`** - Clip-path polygons and centroids for the diamond chart
- Day/month/weekday name arrays for display

---

## App Orchestration

### `app.js` - The Conductor

This is the main file that wires everything together. It doesn't contain much logic of its own -- it imports from all the other modules and connects them.

**What it does on startup (`initApp()`):**
1. Calls `migrateIfNeeded()` to handle old data format
2. Attaches click handlers to all `[data-screen]` elements for navigation
3. Initializes all UI modules (date selector, chart toggle, calendar, learn screen, profiles)
4. Loads the active profile and calculates the natal chart
5. Calls `updateForDate(new Date())` to render today's transits

**Key state:** `natalChart` is the single in-memory variable holding the calculated natal chart. When you switch profiles, it gets recalculated.

**The setup form** has two modes:
- **Add mode:** Creating a new profile (form is blank)
- **Edit mode:** Updating an existing profile (form is pre-filled)

The `editingProfileId` variable tracks which mode we're in. On submit, it either calls `addProfile()` or `updateProfile()`.

### `synthesis.js` - Daily Guidance Generator

Takes the raw transit data and generates a coherent 3-5 sentence paragraph:
1. Scores each transit by importance (slow-movers get more weight, conjunctions and aspects add points)
2. Takes the top 2-3 transits
3. For each, pulls interpretive text from the interpretations database
4. Adds conjunction or aspect text if applicable
5. Appends a dasha context sentence
6. Joins everything into a paragraph

**Also exports:** `synthesizeChartOverview(natalChart, getHouseNumber)` - Generates a natal chart personality summary using ascendant text, Moon sign text, Sun sign text, and notable natal placements. Returns `{ summary, highlights }` for the chart overview section on the main screen.

**Composition system:** Rather than writing 486 unique interpretations for every planet-aspecting-every-other-planet, we compose sentences from parts. "Saturn" + "casts a disciplined gaze upon" + "your emotional security" = a Saturn-aspecting-Moon interpretation. Override entries exist for the most important combinations.

---

## Styling

### CSS Architecture

All styles are in a single `css/styles.css` file (~1300 lines), organized into clear sections with comment headers. The app uses CSS custom properties (variables) defined on `:root` for consistent theming.

### Color Palette

```
Background:     #0d1117  (near black)
Surface:        #161b22  (dark gray)
Elevated:       #21262d  (medium gray)
Gold accent:    #c9a227  (primary actions, highlights)
Gold dim:       #8b7355  (secondary accent, aspect tags)
Positive:       #3fb950  (green - good transits, favorable days)
Negative:       #f85149  (red - challenging transits)
Text:           #e6edf3  (light gray)
Muted text:     #8b949e  (secondary text)
Border:         #30363d  (subtle dividers)
```

### Layout

- Mobile-first, max-width 600px centered container
- Fixed header at top, fixed bottom nav at bottom
- Content scrolls between them with padding to avoid overlap
- 5-button bottom nav with icons and labels

---

## PWA & Offline

### `manifest.json`

Tells the browser this is an installable app:
- Name: "Jyotish Daily - Vedic Transit App"
- Display: `standalone` (no browser chrome when installed)
- Theme color: `#0d1117` (matches the dark background)
- Icons at 192x192 and 512x512 for different contexts

### `sw.js` - Service Worker

**Install phase:** Pre-caches all 34+ app files (HTML, CSS, JS, icons) into a versioned cache (`jyotish-v7`).

**Fetch phase:** Cache-first strategy for same-origin requests. If a file is in the cache, serve it immediately (fast, works offline). If not, fetch from network and cache the response for next time. External requests (like geocoding API) are network-only.

**Activate phase:** When a new cache version is deployed, the old cache is deleted.

**Cache versioning:** The `CACHE_NAME` constant (`jyotish-v7`) is bumped every time files change. This forces the service worker to re-download everything. If you change any file, bump this version number.

### Updating the app

When you change code:
1. Bump `CACHE_NAME` in `sw.js` (e.g., `jyotish-v7` to `jyotish-v8`)
2. If you added new files, add them to the `SHELL_ASSETS` array in `sw.js`
3. Users will get the update on their next visit (the service worker checks for changes)

**For development:** Use incognito mode or manually clear the cache. The service worker's aggressive caching can serve stale files otherwise.

---

## Premium & Payments

### How It Works

1. You create a product on Gumroad with "Generate a unique license key per sale" enabled
2. Customer buys the product and receives a license key
3. Customer opens Jyotish Daily, goes to Profiles, taps "Add Profile" (if they already have 1)
4. The premium gate appears with a license key input field
5. Customer pastes their key and taps "Unlock"
6. The app POSTs to Gumroad's API to verify the key
7. If valid, premium status is saved to localStorage
8. Customer can now add up to 5 profiles

### Setup Steps

1. Create a Gumroad account and product
2. Enable license keys on the product
3. In `js/data/premium.js`, replace `'PLACEHOLDER'` with your Gumroad product ID
4. In `index.html`, update the `#gumroad-link` href to point to your product page

### What's Free vs Premium

- **Free:** 1 profile, all features (chart, transits, dashas, calendar, learn)
- **Premium:** Up to 5 profiles (for tracking family members, friends, etc.)

---

## Key Data Structures

### Profile (stored in localStorage)
```js
{
  id: "p_1706745600000_a3f",    // auto-generated unique ID
  name: "Tom Hinkle",
  birthDate: "1987-12-01",       // YYYY-MM-DD format
  birthTime: "00:05",            // HH:MM 24-hour format
  birthPlace: "Pottsville, Pennsylvania, USA",
  timeUncertain: false,
  timezone: "America/New_York",  // IANA timezone
  lat: 40.6856,                  // latitude
  lng: -76.1955,                 // longitude
  createdAt: 1706745600000       // timestamp
}
```

### Natal Chart (in memory)
```js
{
  ascendantSign: "Leo",
  ascendantDegree: 15,
  ascendantMinute: 30,
  ascendantNakshatra: "Magha",
  planets: [
    { key: "Su", sign: "Scorpio", degree: 14, minute: 22,
      longitude: 224.37, nakshatra: "Anuradha" },
    { key: "Mo", sign: "Pisces", degree: 28, minute: 45,
      longitude: 358.75, nakshatra: "Revati" },
    // ... 7 more planets
  ],
  birthData: { /* the profile object */ },
  dashas: { /* the full dasha timeline */ }
}
```

### Transit Object
```js
{
  planet: "Sa",
  planetName: "Saturn",
  planetSymbol: "♄",
  sign: "Pisces",
  house: 8,
  degree: 12,
  minute: 20,
  nakshatra: "Uttara Bhadrapada",
  quality: "negative",           // or "positive" or "neutral"
  conjunctions: [
    { natalPlanet: "Mo", natalPlanetName: "Moon", orb: 3.2,
      isApplying: true, exactDate: Date, exactFormatted: "Feb 14" }
  ],
  aspects: [
    { natalPlanet: "Ju", natalPlanetName: "Jupiter",
      aspectType: "3rd", distance: 3, targetHouse: 10 }
  ],
  timing: {
    entryFormatted: "Jan 26", exitFormatted: "Mar 15",
    progressPct: 42, daysRemaining: 31
  },
  description: "Transiting Pisces - Conjunct natal Moon"
}
```

---

## Common Patterns

### Callback Pattern (avoiding circular imports)

Several UI modules need to trigger actions in `app.js`, but importing `app.js` from a UI module would create a circular dependency. Solution: `app.js` passes callback functions when initializing the module.

```js
// In app.js:
initProfilesScreen({
  onSwitch: (id) => { switchProfile(id); showScreen('main'); },
  onEdit: (id) => { startSetupForm('edit', id); },
  onAdd: () => { startSetupForm('add'); },
});

// In profiles.js:
export function initProfilesScreen(callbacks) {
  // Store callbacks, use them when buttons are clicked
}
```

### Screen Management

All screens are `<div class="screen">` elements. Only one has the `active` class at a time. CSS: `.screen { display: none; }` and `.screen.active { display: block; }`.

Navigation buttons use `data-screen="main"` attributes. A single event delegation loop in `initApp()` handles all of them.

### Composed Interpretations

Rather than writing unique text for every possible planet combination (which would be hundreds), interpretation text is composed from reusable parts:

```
[transit planet action] + [natal planet domain]
= "Saturn casts a disciplined gaze upon your emotional security."
```

A small set of hand-written overrides covers the most important combinations.

---

## How to Change Things

### Add a new transit interpretation

Edit `js/data/interpretations.js`. Find `TRANSIT_HOUSE` and add/modify entries:
```js
TRANSIT_HOUSE['Sa_8'] = { text: "Your new text here.", theme: "keyword" };
```

### Change the chart appearance

Edit `css/styles.css`. Chart styles are under the `CHART DISPLAY` section. South Indian cells are `.chart-cell`, North Indian houses are `.ni-house`.

### Add a new Learn topic

1. Add data to `js/data/learn.js` (export a new `YOUR_TOPIC_INFO` object)
2. Add a tab button in `index.html` inside `.learn-tabs`
3. Add a rendering branch in `js/ui/learn.js` inside `renderTopic()`

### Change the premium gate (free profile count, max profiles)

- Free profile limit: `canAddProfile()` in `js/data/premium.js` (currently `currentCount < 1`)
- Max profiles: `MAX_PROFILES` constant in `js/data/storage.js` (currently 5)

### Update after code changes

1. Bump `CACHE_NAME` in `sw.js` (e.g., `'jyotish-v7'` to `'jyotish-v8'`)
2. If you added new JS files, add them to `SHELL_ASSETS` in `sw.js`
3. Test in incognito to bypass the old cache

### Set up Gumroad for real

1. Create a Gumroad account at gumroad.com
2. Create a product, enable "License keys"
3. Copy the product ID (visible in the product URL or API settings)
4. Replace `'PLACEHOLDER'` in `js/data/premium.js` with your product ID
5. Update the `#gumroad-link` href in `index.html` to your product page URL
