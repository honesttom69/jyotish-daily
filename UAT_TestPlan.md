# Jyotish Daily - User Acceptance Testing Plan

**Version:** 1.0
**Created:** February 1, 2026
**App Under Test:** Jyotish Daily (Vedic Transit App)
**Test Environment:** localhost:8000 via `start.bat`, modern browser (Chrome/Edge/Safari/Firefox)

---

## Overview

This document is the full UAT script for Jyotish Daily prior to public release. Every testable surface of the app is covered: setup, navigation, calculations, interpretations, calendar, dashas, profiles, premium/paywall, chart overview, learn screen, responsiveness, and edge cases.

**Pass criteria for release:** All P0 and P1 tests pass. P2 failures are logged but do not block release.
**Last Updated:** February 2, 2026

**Priority definitions:**
- **P0 (Blocker):** App crashes, data loss, calculation errors, blank screens
- **P1 (Major):** Broken interactions, missing text, layout breakage, incorrect interpretations
- **P2 (Minor):** Cosmetic issues, awkward wording, minor alignment, non-critical polish

---

## Prerequisites

Before starting UAT:

1. Clear browser localStorage (`localStorage.clear()` in console) to start fresh
2. Have a second device or browser window sized to 375px width (mobile) for responsive tests
3. Have Jagannatha Hora (or known reference) available for calculation verification
4. Record results in the **Result** column: PASS / FAIL / BLOCKED + notes

### Reference Test Data

**Primary test chart (Tom Hinkle):**
- Name: Tom Hinkle
- Birth Date: December 1, 1987
- Birth Time: 00:05 AM
- Birth Place: Pottsville, Pennsylvania, USA
- Timezone: America/New_York
- Lat: 40.6856, Lng: -76.1955
- Expected Ascendant: Leo
- Expected Moon: Pisces (Revati)

**Secondary test chart (edge case):**
- Name: Test User
- Birth Date: June 15, 2000
- Birth Time: 12:00 PM
- Birth Place: London, United Kingdom
- Timezone: Europe/London

---

## Module 1: First Launch & Setup Screen

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 1.1 | Fresh load shows setup | Clear localStorage, reload app | Setup screen displayed, no errors in console | P0 | |
| 1.2 | Setup form renders fully | Inspect setup screen | All fields visible: Name, Birth Date, Birth Time, Birth Place, Timezone, Manual Coords checkbox, Submit button | P0 | |
| 1.3 | Timezone dropdown populated | Click timezone dropdown | List of timezones loads, scrollable, includes America/New_York and UTC | P1 | |
| 1.4 | Time uncertain checkbox | Check "I'm not sure of the exact time" | Checkbox toggles, no error | P2 | |
| 1.5 | Manual coords toggle | Check "Enter coordinates manually" | Latitude/Longitude fields appear; uncheck hides them | P1 | |
| 1.6 | Geocoding success | Enter "Pottsville, Pennsylvania, USA", submit | Geocode status shows "Found: ..." with resolved location; form submits successfully | P0 | |
| 1.7 | Geocoding failure | Enter "xyznonexistent123", submit | Error message appears: "Could not find location. Please enter coordinates manually." Manual coords fields appear | P1 | |
| 1.8 | Manual coords submission | Check manual coords, enter Lat: 40.6856, Lng: -76.1955, submit | Form submits, chart calculates, navigates to main screen | P1 | |
| 1.9 | Empty form validation | Leave all fields empty, submit | App does not crash; either shows validation or handles gracefully | P1 | |
| 1.10 | Data persists in localStorage | Submit valid data, refresh browser | App loads directly to main screen with previously entered data | P0 | |
| 1.11 | Pre-fill on return to setup | Navigate to setup screen after initial save | Form fields pre-filled with saved data | P1 | |

---

## Module 2: Main Screen - Profile Card

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 2.1 | Profile card displays | Load main screen with valid chart | Profile card shows: avatar initials, name, ascendant sign, moon sign, moon nakshatra | P0 | |
| 2.2 | Avatar initials correct | Check avatar circle | Shows first letters of name (e.g. "TH" for Tom Hinkle) | P2 | |
| 2.3 | Ascendant displayed | Check profile details line | Shows "{Sign} Asc" matching expected ascendant | P0 | |
| 2.4 | Moon sign displayed | Check profile details line | Shows "{Sign} Moon" matching expected moon sign | P0 | |
| 2.5 | Current dasha displayed | Check dasha badge on profile card | Shows current Maha-Antar dasha (e.g. "Moon-Rahu") | P1 | |

---

## Module 3: Main Screen - Date Selector

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 3.1 | Today label on load | Load main screen | Date selector shows "Today" with current date | P0 | |
| 3.2 | Forward navigation | Click right arrow | Date advances by one day; label updates; "Today" label disappears | P0 | |
| 3.3 | Backward navigation | Click left arrow | Date goes back one day; label updates | P0 | |
| 3.4 | Today button resets | Navigate to a different date, click "TODAY" | Returns to current date; "Today" label reappears | P1 | |
| 3.5 | Transit list updates on date change | Navigate forward 30 days | Transit list, insight, and chart all update to reflect new date | P0 | |
| 3.6 | Far future date | Navigate forward 365+ days | App calculates without errors; transits display correctly | P1 | |
| 3.7 | Far past date | Navigate backward 365+ days | App calculates without errors; transits display correctly | P1 | |

---

## Module 4: Main Screen - Daily Guidance (Insight Section)

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 4.1 | Guidance paragraph displays | Load main screen with valid chart | Insight section shows a coherent multi-sentence paragraph (not bare planet positions) | P0 | |
| 4.2 | Guidance is 3-5 sentences | Read the guidance text | Contains between 3 and 5 complete sentences | P1 | |
| 4.3 | No raw position data | Read the guidance text | Does NOT contain raw text like "Transiting Pisces" or "Conjunct natal Jupiter" without interpretation context | P1 | |
| 4.4 | Dasha context included | Read the guidance text | Final sentence references the current Dasha period (e.g. "In your Moon Dasha...") | P1 | |
| 4.5 | Guidance updates with date | Navigate to a different date | Guidance text changes to reflect new transit positions | P0 | |
| 4.6 | Slow movers prioritized | Read guidance for today | Saturn, Jupiter, Rahu, or Ketu interpretations appear before Sun, Mercury, Venus | P1 | |
| 4.7 | Conjunction mentioned | If any transit has a conjunction, check guidance | Conjunction interpretation appears in the guidance paragraph | P1 | |
| 4.8 | No console errors | Open browser console, load main screen | No JavaScript errors related to imports, missing keys, or undefined lookups | P0 | |
| 4.9 | Fallback text | (Edge case) If no transits calculated | Shows fallback text "Calculating your guidance..." or similar, not blank | P1 | |

---

## Module 5: Main Screen - Transit List

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 5.1 | Transit list renders | Load main screen with valid chart | Transit list section visible with multiple transit items | P0 | |
| 5.2 | Moon excluded | Inspect transit list | Moon transit is NOT shown in the list (Moon moves too fast) | P1 | |
| 5.3 | Badge count correct | Count visible transit items | Badge text (e.g. "7 active") matches the number of displayed items | P1 | |
| 5.4 | Transit item structure | Inspect any transit item | Each item has: planet icon with quality color, planet name + house, detail text | P0 | |
| 5.5 | Quality colors correct | Inspect transit icons | Positive = green tint, Negative = red tint, Neutral = gray tint | P1 | |
| 5.6 | House interpretation text | Read the detail line of any transit item | Shows 1-2 sentence interpretation text (not just "Transiting Pisces") | P0 | |
| 5.7 | Conjunction tag displayed | Find a transit with conjunction | Orange "Natal {planet}" tag appears next to transit title | P1 | |
| 5.8 | Conjunction interpretation | Find a transit with conjunction, read detail | Detail text includes conjunction interpretation sentence in addition to house text | P1 | |
| 5.9 | All planets accounted for | Count unique planets in list | At least 7-8 planets shown (Sa, Ju, Ra, Ke, Ma, Ve, Su, Me); Moon excluded | P1 | |
| 5.10 | Transit list updates | Change date using date selector | Transit list items update to reflect new positions | P0 | |
| 5.11 | House numbers valid | Check all house numbers | Every house number is between 1 and 12 | P0 | |

---

## Module 6: Main Screen - South Indian Chart

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 6.1 | Chart renders | Load main screen | 4x4 grid chart displays with sign labels and planets | P0 | |
| 6.2 | Natal planets in gold | Inspect chart cells | Natal planet labels appear in gold/accent color | P1 | |
| 6.3 | Transit planets in green | Inspect chart cells | Transit planet labels appear in green | P1 | |
| 6.4 | Ascendant marked | Find ascendant sign cell | "As" label appears in the correct sign cell | P1 | |
| 6.5 | House numbers shown | Inspect chart cells | House numbers (1-12) appear relative to ascendant | P1 | |
| 6.6 | Chart updates with date | Change date, observe chart | Transit planet positions change in the grid | P0 | |
| 6.7 | Legend displayed | Check below chart | Legend shows "Natal" (gold) and "Transit" (green) labels | P2 | |
| 6.8 | Center cells empty | Inspect center 4 cells | Center cells are empty/blank (no sign labels or planets) | P2 | |

---

## Module 7: Calendar Screen

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 7.1 | Calendar renders | Navigate to Calendar screen | Month grid displays with day numbers, weekday headers | P0 | |
| 7.2 | Current month shown | Check calendar header | Displays current month name and year | P0 | |
| 7.3 | Quality dots appear | Inspect calendar days | Colored dots appear on days: green (favorable), gold (mixed), red (challenging) | P1 | |
| 7.4 | Today highlighted | Find today's date | Today's cell has a distinct border/highlight (accent border) | P1 | |
| 7.5 | Month navigation forward | Click right arrow | Next month displays; quality dots recalculate | P0 | |
| 7.6 | Month navigation backward | Click left arrow | Previous month displays; quality dots recalculate | P0 | |
| 7.7 | Day selection | Click on any day | Day cell gets "selected" style; detail panel below updates | P0 | |
| 7.8 | Detail panel - quality label | Click a day, read detail panel | Text starts with quality label: "Favorable energy.", "Mixed energy.", or "Challenging energy." | P1 | |
| 7.9 | Detail panel - synthesis text | Click a day, read detail panel | Shows synthesized multi-sentence guidance (not just "Saturn in 8th house" listing) | P0 | |
| 7.10 | Detail panel updates per day | Click different days | Detail text changes for each selected day | P0 | |
| 7.11 | Legend displayed | Check below calendar grid | Legend shows Favorable (green), Mixed (gold), Challenging (red) | P2 | |
| 7.12 | Other-month days dimmed | Check first/last row of grid | Days belonging to adjacent months appear with reduced opacity | P2 | |

---

## Module 8: Dasha Screen

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 8.1 | Dasha screen renders | Navigate to Dashas screen | Current period card and timeline both display | P0 | |
| 8.2 | Current period card | Inspect top card | Shows "Current Period" label, Maha Dasha planet name + symbol, date range, progress bar | P0 | |
| 8.3 | Maha progress bar | Check progress bar | Fill percentage roughly matches elapsed time through the Maha Dasha period | P1 | |
| 8.4 | Antar sub-period shown | Check below maha in current card | Sub-period label, planet name + symbol, date range, smaller progress bar | P0 | |
| 8.5 | Antar progress bar | Check sub-period progress | Fill percentage roughly matches elapsed time through the Antar Dasha period | P1 | |
| 8.6 | Current period interpretation | Check below progress bars in current card | `.dasha-current-interp` div displays combined Maha + Antar interpretation text | P0 | |
| 8.7 | Interpretation content quality | Read the current period interpretation | Text describes the Maha Dasha themes AND includes "Currently, [antar modifier]." | P1 | |
| 8.8 | Timeline heading | Check below current card | "Maha Dasha Timeline" heading visible | P2 | |
| 8.9 | All 9 maha dashas listed | Count timeline items | 9 Maha Dasha items in the timeline (one per planet in dasha sequence) | P0 | |
| 8.10 | Active maha highlighted | Find current maha dasha in timeline | Has gold left border accent and `.active` class | P1 | |
| 8.11 | Past dashas dimmed | Check completed maha dashas | Reduced opacity (0.55) for past periods | P2 | |
| 8.12 | Maha dasha description | Inspect any maha item | `.dasha-maha-desc` div shows interpretation text below the header | P0 | |
| 8.13 | Description content quality | Read a maha description | 1-2 sentences describing the themes of that planetary period (not blank, not placeholder) | P1 | |
| 8.14 | Expand/collapse | Click on a non-active maha header | Antar dasha sub-items expand below; chevron rotates | P1 | |
| 8.15 | Collapse others on expand | Click a different maha header | Previously expanded item collapses; new one expands | P1 | |
| 8.16 | Active maha auto-expanded | Load dasha screen | The current maha dasha is expanded by default showing its antar dashas | P1 | |
| 8.17 | Antar items in expanded view | Expand any maha dasha | 9 sub-period items listed with symbol, name, and date range | P1 | |
| 8.18 | Active antar highlighted | In the active maha, find current antar | Current antar sub-period has highlight style (gold tint background) | P1 | |
| 8.19 | Maha dasha years shown | Check any maha header | Duration shown (e.g. "19y" for Saturn, "20y" for Venus) | P2 | |
| 8.20 | Date ranges sensible | Check all maha date ranges | Start/end dates are sequential, no overlaps, span reasonable years | P1 | |

---

## Module 9: Navigation & Screen Management

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 9.1 | Bottom nav renders | Load app | 5 nav items: Today, Calendar, Dashas, Learn, Profile | P0 | |
| 9.2 | Today button | Click "Today" in bottom nav | Main screen displayed; nav item highlighted | P0 | |
| 9.3 | Calendar button | Click "Calendar" in bottom nav | Calendar screen displayed; nav item highlighted | P0 | |
| 9.4 | Dashas button | Click "Dashas" in bottom nav | Dasha screen displayed; nav item highlighted | P0 | |
| 9.5 | Learn button | Click "Learn" in bottom nav | Learn screen displayed; nav item highlighted | P0 | |
| 9.6 | Profile button | Click "Profile" in bottom nav | Profiles list screen displayed; nav item highlighted | P0 | |
| 9.7 | Header calendar icon | Click calendar icon in header | Calendar screen displayed | P1 | |
| 9.8 | Header settings icon | Click gear icon in header | Profiles screen displayed | P1 | |
| 9.9 | Only one screen visible | Switch between all screens | Only one screen active at a time; others hidden | P0 | |
| 9.10 | Active nav indicator | Switch screens | Active nav item has accent color; others have muted color | P2 | |
| 9.11 | Setup is sub-screen | Navigate to Profiles, click Edit or Add | Setup form appears; no bottom nav item highlighted for setup | P1 | |
| 9.12 | Setup back button | Click "Back to Profiles" in setup | Returns to profiles list screen | P1 | |

---

## Module 10: Chart Overview

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 10.1 | Chart overview renders | Load main screen with valid chart | Chart overview section visible between profile card and daily insight | P0 | |
| 10.2 | Summary text | Read the chart overview summary | Shows 1-2 sentence summary combining ascendant and Moon sign themes | P1 | |
| 10.3 | Details toggle | Click "Details" toggle | Expanded details section appears with individual highlight items | P1 | |
| 10.4 | Ascendant highlight | Expand details | Ascendant entry shows sign name and personality description | P0 | |
| 10.5 | Moon sign highlight | Expand details | Moon sign entry shows sign name and emotional nature description | P0 | |
| 10.6 | Sun sign highlight | Expand details | Sun sign entry shows sign name and core identity description | P1 | |
| 10.7 | Notable placements | Expand details, check for notable natal placements | Any planets in significant positions (e.g., Jupiter in 8th) show descriptions | P1 | |
| 10.8 | Updates on profile switch | Switch to a different profile | Chart overview updates to reflect new profile's natal chart | P0 | |

---

## Module 11: Profiles Screen

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 11.1 | Profile list renders | Navigate to Profiles screen | Profile list shows with at least one profile row | P0 | |
| 11.2 | Active profile highlighted | Check profile rows | Active profile has gold border; others do not | P1 | |
| 11.3 | Profile row content | Inspect a profile row | Shows avatar initials, name, birth info (date, place) | P1 | |
| 11.4 | Profile count badge | Check section header | Badge shows "X / 5" matching actual profile count | P1 | |
| 11.5 | Switch profile | Click a non-active profile row | Profile becomes active; app navigates to main screen; chart recalculates | P0 | |
| 11.6 | Edit profile | Click edit button on a profile row | Setup form opens pre-filled with that profile's data | P0 | |
| 11.7 | Edit submit | Change a field in edit mode, submit | Profile updates; navigates to main; chart recalculates | P0 | |
| 11.8 | Delete profile | Click delete button on a profile row | Confirmation prompt; on confirm, profile removed from list | P1 | |
| 11.9 | Delete active profile | Delete the currently active profile | Another profile becomes active, or app goes to setup if none left | P1 | |
| 11.10 | Add profile button | Click "+ Add Profile" | Setup form opens in add mode (blank fields) | P0 | |
| 11.11 | Profile card clickable | Click profile card on main screen | Navigates to profiles screen | P1 | |

---

## Module 12: Premium / Gumroad Paywall

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 12.1 | First profile free | Clear localStorage, create first profile | Profile created successfully without any paywall prompt | P0 | |
| 12.2 | Premium gate appears | With 1 profile, click "+ Add Profile" | Premium gate section becomes visible with license key input | P0 | |
| 12.3 | License input visible | Check premium gate | Has text input for license key and "Unlock" button | P1 | |
| 12.4 | Gumroad link | Check premium gate | "Get a license on Gumroad" link is present | P2 | |
| 12.5 | Invalid license | Enter a fake license key, click Unlock | Error message displayed; premium not granted | P1 | |
| 12.6 | Premium persists | After unlocking (or manually setting premium in localStorage), refresh | isPremium() returns true; can add profiles without gate | P1 | |
| 12.7 | Premium hides gate | With premium status, go to profiles | Premium gate section is hidden | P1 | |

---

## Module 13: Learn Screen

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 13.1 | Learn screen renders | Navigate to Learn screen | Four tabs visible: Houses, Planets, Signs, Aspects | P0 | |
| 13.2 | Houses tab | Click Houses tab | 12 expandable cards for each house displayed | P0 | |
| 13.3 | Planets tab | Click Planets tab | 9 planet cards displayed with nature, significations | P0 | |
| 13.4 | Signs tab | Click Signs tab | 12 sign cards displayed with element, quality, ruler | P0 | |
| 13.5 | Aspects tab | Click Aspects tab | Vedic aspect educational cards displayed | P0 | |
| 13.6 | Card expansion | Click on any learn card | Card expands to show description; click again collapses | P1 | |
| 13.7 | Tab switching | Switch between all 4 tabs | Content updates; active tab highlighted; no errors | P1 | |

---

## Module 14: Calculation Accuracy

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 14.1 | Ascendant matches reference | Compare app ascendant to Jagannatha Hora | Ascendant sign matches (degree may differ by 1-2 due to ayanamsha) | P0 | |
| 14.2 | Moon sign matches reference | Compare Moon sign to JH | Moon sign and approximate degree match | P0 | |
| 14.3 | Moon nakshatra matches | Compare Moon nakshatra to JH | Same nakshatra name | P0 | |
| 14.4 | Planet signs match | Compare all 9 planet signs to JH | All planet signs match (Sa, Ju, Ra, Ke, Ma, Ve, Su, Me, Mo) | P0 | |
| 14.5 | Sidereal zodiac used | Check sign for a slow planet vs tropical | Sign is sidereal (approx 24 degrees offset from tropical) | P0 | |
| 14.6 | House numbers correct | Verify house = sign relative to ascendant | Houses follow whole-sign system from ascendant | P1 | |
| 14.7 | Transit positions current | Check a slow planet (Saturn, Jupiter) against known current position | Within 1-2 degrees of published ephemeris position | P0 | |
| 14.8 | Conjunction detection | Find a known close conjunction, verify app detects it | App shows conjunction tag when transit planet is within 8 degrees of natal planet | P1 | |
| 14.9 | Dasha dates plausible | Check Maha Dasha dates against birth data | First Maha Dasha starts near birth; sequence totals ~120 years | P1 | |
| 14.10 | Dasha sequence correct | Check planet order in timeline | Sequence follows: Ke, Ve, Su, Mo, Ma, Ra, Ju, Sa, Me (starting from Moon's nakshatra lord) | P1 | |
| 14.11 | Geocentric positions | Verify Mercury and Venus are within expected elongation from Sun | Mercury within 28° of Sun, Venus within 47° of Sun | P0 | |
| 14.12 | True node used for Rahu | Compare Rahu position to JH (true node default) | Rahu sign and approximate degree match JH | P0 | |

---

## Module 15: Interpretation Text Quality

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 15.1 | No blank interpretations | Navigate through 7 different dates | No transit item shows blank or undefined interpretation text | P0 | |
| 15.2 | No "undefined" text | Search all visible text on every screen | No literal "undefined", "null", "NaN", or "[object Object]" displayed | P0 | |
| 15.3 | Tone consistency | Read 10+ interpretation texts | Tone is practical, concise, growth-oriented; no doom-and-gloom; no pretentious spiritual jargon | P1 | |
| 15.4 | Sentence length | Read 10+ house interpretations | Each is 1-2 sentences (not a full paragraph, not a single word) | P1 | |
| 15.5 | Conjunction override quality | Find a Saturn-Moon conjunction (navigate dates if needed) | Override text is more specific and impactful than generic composed text | P1 | |
| 15.6 | Composed conjunction grammar | Find a conjunction without an override | Sentence reads naturally: "Transiting {Planet} {action} {domain}." | P1 | |
| 15.7 | Dasha interpretation grammar | Read current period interpretation on Dasha screen | Two clear parts: maha themes + "Currently, [antar modifier]." — reads as coherent paragraph | P1 | |
| 15.8 | No duplicate sentences | Read daily guidance paragraph | No sentence appears twice in the same paragraph | P1 | |
| 15.9 | Key lookup coverage | Open console, run: `import('./js/data/interpretations.js').then(m => { const planets = ['Sa','Ju','Ra','Ke','Ma','Ve','Su','Me','Mo']; const missing = []; planets.forEach(p => { for(let h=1;h<=12;h++) { if(!m.TRANSIT_HOUSE[p+'_'+h]) missing.push(p+'_'+h); }}); console.log('Missing:', missing.length ? missing : 'none'); })` | "Missing: none" — all 108 keys present | P0 | |
| 15.10 | Aspect tag display | Find a transit with an aspect tag | Gold "Asp {planet}" tag appears; detail text includes aspect interpretation | P1 | |

---

## Module 16: Responsive Design & Cross-Browser

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 16.1 | Mobile width (375px) | Resize browser to 375px width | All screens render without horizontal scroll; text readable; buttons tappable | P0 | |
| 16.2 | Tablet width (768px) | Resize to 768px | Layout adjusts; chart cells have slightly more padding | P1 | |
| 16.3 | Desktop width (1200px) | Resize to 1200px | Content centered at max-width 600px; no stretching | P1 | |
| 16.4 | Chrome compatibility | Test full flow in Chrome | All features work; no console errors | P0 | |
| 16.5 | Firefox compatibility | Test full flow in Firefox | All features work; no console errors | P1 | |
| 16.6 | Safari compatibility | Test full flow in Safari (if available) | All features work; ES module imports work | P1 | |
| 16.7 | Edge compatibility | Test full flow in Edge | All features work | P2 | |
| 16.8 | Bottom nav not overlapping | Check on mobile width | Bottom nav does not overlap content; padding-bottom on screens provides clearance | P1 | |
| 16.9 | Transit detail text wrapping | Check long interpretation text on mobile | Text wraps properly; no overflow or clipping | P1 | |
| 16.10 | Dasha interpretation wrapping | Check dasha interp text on mobile | `.dasha-current-interp` and `.dasha-maha-desc` text wraps cleanly | P1 | |

---

## Module 17: Edge Cases & Error Handling

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 17.1 | No birth data stored | Clear localStorage, navigate to main screen | Redirects to setup screen; no crash | P0 | |
| 17.2 | Corrupted localStorage | Set `localStorage.setItem('jyotish_profiles', 'garbage')`, reload | App handles gracefully; shows setup screen or recovers | P1 | |
| 17.3 | Old format migration | Set `localStorage.setItem('jyotish_birth_data', '{"name":"Test","birthDate":"1987-12-01","birthTime":"00:05","lat":40.68,"lng":-76.19,"timezone":"America/New_York"}')`, reload | Data migrates to new multi-profile format; old key deleted; app loads normally | P0 | |
| 17.4 | Partial birth data | Store birth data without lat/lng | App shows setup screen; does not crash | P1 | |
| 17.5 | Midnight birth time | Enter birth time 00:00 | Calculates correctly; no date-off-by-one error | P1 | |
| 17.6 | Southern hemisphere | Enter birth place: Sydney, Australia (-33.87, 151.21) | Ascendant and houses calculate correctly (verify against reference) | P1 | |
| 17.7 | High latitude | Enter birth place: Reykjavik, Iceland (64.15, -21.95) | App does not crash; ascendant calculates (may be approximate) | P2 | |
| 17.8 | Date far in future | Navigate to year 2040 | App calculates; no crash; transit positions display | P1 | |
| 17.9 | Date far in past | Navigate to year 1950 | App calculates; no crash | P1 | |
| 17.10 | Rapid date clicking | Click forward arrow 20+ times quickly | App remains responsive; final state is correct | P1 | |
| 17.11 | Re-submit chart | Go to setup, change birth time, re-submit | All screens update with new chart data; no stale data visible | P0 | |
| 17.12 | Browser refresh mid-use | Refresh while on Calendar screen | App reloads, restores birth data, shows main screen | P1 | |
| 17.13 | Console error audit | Complete full test cycle, check console | No uncaught errors, no failed imports, no 404s for modules | P0 | |
| 17.14 | Data encoding | Check localStorage after saving a profile | `jyotish_profiles` value is base64-encoded, not plain-text JSON | P1 | |
| 17.15 | DST birth time | Enter birth: June 15, 2000, 02:30 AM, America/New_York | UTC conversion handles EDT correctly (offset = -4, not -5) | P1 | |

---

## Module 18: Performance

| # | Test | Steps | Expected Result | Priority | Result |
|---|------|-------|-----------------|----------|--------|
| 18.1 | Initial load | Hard refresh (Ctrl+Shift+R), observe load | Main screen renders within a few seconds; no visible jank | P1 | |
| 18.2 | Date navigation speed | Click forward arrow, observe update | Transit list + insight + chart update without perceptible lag | P1 | |
| 18.3 | Calendar render | Navigate to calendar screen | Month grid with quality dots renders smoothly | P1 | |
| 18.4 | Calendar month switch | Switch months forward/back | Quality dots recalculate; UI remains responsive | P1 | |
| 18.5 | Dasha screen render | Navigate to dasha screen | Timeline renders smoothly with all 9 maha items | P1 | |
| 18.6 | Memory over time | Navigate between screens and dates 50+ times | No memory leak symptoms (tab doesn't slow down progressively) | P2 | |

---

## UAT Execution Log

### Test Run 1: Static Code Analysis + Mobile Test

| Field | Value |
|-------|-------|
| **Tester** | Claude (static analysis) + Tom Hinkle (mobile) |
| **Date** | February 3, 2026 |
| **Browser** | N/A (code analysis) / Chrome (Android) |
| **Device / Resolution** | N/A / Pixel 10 Pro XL |
| **Build** | jyotish-v8 (sw.js cache version) |

### Static Code Analysis Results

The following tests were verified through automated code analysis:

| Test # | Test Name | Result | Notes |
|--------|-----------|--------|-------|
| 15.9 | Key lookup coverage (108 keys) | **PASS** | All 108 TRANSIT_HOUSE keys present (9 planets × 12 houses) |
| — | File integrity check | **PASS** | All 30 SHELL_ASSETS files exist |
| — | Icon files present | **PASS** | icon.svg, icon-192.png, icon-512.png, icon-512-maskable.png |
| — | manifest.json valid | **PASS** | Required fields present: name, display, icons, theme_color |
| — | Service worker present | **PASS** | sw.js with cache-first strategy |
| — | HOUSE_INFO completeness | **PASS** | 12 entries (1-12) |
| — | PLANET_INFO completeness | **PASS** | 9 entries (Su, Mo, Ma, Me, Ju, Ve, Sa, Ra, Ke) |
| — | SIGN_INFO completeness | **PASS** | 12 entries (all zodiac signs) |
| — | ASPECT_INFO completeness | **PASS** | 6 educational sections |
| — | ASCENDANT_TEXT completeness | **PASS** | 12 entries (all signs) |
| — | MOON_SIGN_TEXT completeness | **PASS** | 12 entries (all signs) |
| — | SUN_SIGN_TEXT completeness | **PASS** | 12 entries (all signs) |
| — | MAHA_DASHA completeness | **PASS** | 9 entries (all planets) |
| — | ANTAR_MODIFIER completeness | **PASS** | 9 entries (all planets) |
| — | CONJUNCTION/ASPECT actions | **PASS** | 9 entries each |

### Blocking Issues Found

| Issue | Location | Status |
|-------|----------|--------|
| Gumroad product ID is 'PLACEHOLDER' | `js/data/premium.js` line 8 | **BLOCKING** - Must replace before launch |
| Gumroad link href="#" | `index.html` line 298 | **BLOCKING** - Must add actual product URL |

### Mobile Testing (Tom Hinkle - Pixel 10 Pro XL)

| Test # | Test Name | Result | Notes |
|--------|-----------|--------|-------|
| 16.1 | Mobile width rendering | **PASS** | App renders correctly on Pixel 10 Pro XL |
| — | General functionality | **PASS** | App works on mobile Chrome Android |
| — | PWA install | **PENDING** | To be tested |

### Tablet Testing (Tom Hinkle)

| Test # | Test Name | Result | Notes |
|--------|-----------|--------|-------|
| 16.2 | Tablet width (768px) | **PENDING** | To be tested |

### Summary

| Module | Total | Pass | Fail | Blocked | Notes |
|--------|-------|------|------|---------|-------|
| 1. Setup | 11 | — | — | — | Needs manual testing |
| 2. Profile Card | 5 | — | — | — | Needs manual testing |
| 3. Date Selector | 7 | — | — | — | Needs manual testing |
| 4. Daily Guidance | 9 | — | — | — | Needs manual testing |
| 5. Transit List | 11 | — | — | — | Needs manual testing |
| 6. Chart | 8 | — | — | — | Needs manual testing |
| 7. Calendar | 12 | — | — | — | Needs manual testing |
| 8. Dasha Screen | 20 | — | — | — | Needs manual testing |
| 9. Navigation | 12 | — | — | — | Needs manual testing |
| 10. Chart Overview | 8 | — | — | — | Needs manual testing |
| 11. Profiles Screen | 11 | — | — | — | Needs manual testing |
| 12. Premium / Paywall | 7 | — | — | 2 | Gumroad not configured |
| 13. Learn Screen | 7 | — | — | — | Needs manual testing |
| 14. Calculations | 12 | — | — | — | Needs manual testing |
| 15. Text Quality | 10 | 1 | — | — | 15.9 PASS via code analysis |
| 16. Responsive | 10 | 1 | — | 1 | Mobile PASS, tablet PENDING |
| 17. Edge Cases | 15 | — | — | — | Needs manual testing |
| 18. Performance | 6 | — | — | — | Needs manual testing |
| **TOTAL** | **181** | **2** | **0** | **3** | Most tests need manual execution |

### Sign-Off

| Role | Name | Date | Verdict |
|------|------|------|---------|
| Developer | Tom Hinkle | | PENDING |
| Product Owner | Tom Hinkle | | PENDING |
| Beta Tester 1 | | | PENDING |
| Beta Tester 2 | | | PENDING |

**Release decision:** [ ] GO &nbsp;&nbsp; [x] NO-GO (Gumroad setup required)

**Notes:**
- Static code analysis passed all data completeness checks
- Mobile testing on Pixel 10 Pro XL passed
- **BLOCKING:** Must configure Gumroad product ID and link before launch
- PWA install needs to be tested on mobile and tablet
- Full manual UAT execution still required for browser testing

---

## Defect Log

| # | Module | Test # | Severity | Description | Status | Fix Notes |
|---|--------|--------|----------|-------------|--------|-----------|
| 1 | 12. Premium | 12.* | P0 | Gumroad product ID is 'PLACEHOLDER' | OPEN | Replace in js/data/premium.js |
| 2 | 12. Premium | 12.4 | P1 | Gumroad link href="#" needs real URL | OPEN | Update in index.html line 298 |

---

## Post-Release Monitoring Checklist

After release, monitor for 7 days:

- [ ] No spike in console errors from user reports
- [ ] Geocoding service remains available
- [ ] Calculations remain accurate (spot-check against ephemeris)
- [ ] localStorage persistence works across browser updates
- [ ] No reported display issues on iOS Safari, Android Chrome
