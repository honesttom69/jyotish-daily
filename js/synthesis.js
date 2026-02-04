// ============================================================
// Daily Guidance Synthesis Algorithm
// ============================================================

import {
  TRANSIT_HOUSE,
  CONJUNCTION_TRANSIT_ACTION,
  CONJUNCTION_NATAL_DOMAIN,
  CONJUNCTION_OVERRIDE,
  ASPECT_ACTION,
  ASPECT_OVERRIDE,
  MAHA_DASHA,
  ANTAR_MODIFIER,
  ASCENDANT_TEXT,
  MOON_SIGN_TEXT,
  SUN_SIGN_TEXT,
  PLANET_IN_HOUSE_NATAL,
} from './data/interpretations.js';

// Slow-moving planets get priority weighting
const SLOW_MOVERS = new Set(['Sa', 'Ju', 'Ra', 'Ke']);

/**
 * Get conjunction interpretation text.
 * Returns override if available, otherwise composes from action + domain.
 *
 * @param {string} transitKey - Transiting planet key (e.g. "Sa")
 * @param {string} natalKey - Natal planet key (e.g. "Mo")
 * @returns {string} Conjunction interpretation sentence
 */
export function getConjunctionText(transitKey, natalKey) {
  const overrideKey = `${transitKey}_${natalKey}`;
  if (CONJUNCTION_OVERRIDE[overrideKey]) {
    return CONJUNCTION_OVERRIDE[overrideKey];
  }

  const action = CONJUNCTION_TRANSIT_ACTION[transitKey];
  const domain = CONJUNCTION_NATAL_DOMAIN[natalKey];
  if (action && domain) {
    const planetNames = {
      Su: 'Sun', Mo: 'Moon', Ma: 'Mars', Me: 'Mercury',
      Ju: 'Jupiter', Ve: 'Venus', Sa: 'Saturn', Ra: 'Rahu', Ke: 'Ketu',
    };
    const name = planetNames[transitKey] || transitKey;
    return `Transiting ${name} ${action} ${domain}.`;
  }

  return '';
}

/**
 * Get aspect interpretation text.
 * Returns override if available, otherwise composes from action + domain.
 *
 * @param {string} transitKey - Transiting planet key
 * @param {string} natalKey - Natal planet key
 * @returns {string} Aspect interpretation sentence
 */
export function getAspectText(transitKey, natalKey) {
  const overrideKey = `${transitKey}_${natalKey}`;
  if (ASPECT_OVERRIDE[overrideKey]) {
    return ASPECT_OVERRIDE[overrideKey];
  }

  const action = ASPECT_ACTION[transitKey];
  const domain = CONJUNCTION_NATAL_DOMAIN[natalKey];
  if (action && domain) {
    const planetNames = {
      Su: 'Sun', Mo: 'Moon', Ma: 'Mars', Me: 'Mercury',
      Ju: 'Jupiter', Ve: 'Venus', Sa: 'Saturn', Ra: 'Rahu', Ke: 'Ketu',
    };
    const name = planetNames[transitKey] || transitKey;
    return `${name} ${action} ${domain}.`;
  }

  return '';
}

/**
 * Get combined Maha + Antar Dasha interpretation text.
 *
 * @param {string} mahaKey - Maha Dasha planet key (e.g. "Sa")
 * @param {string} antarKey - Antar Dasha planet key (e.g. "Ju")
 * @returns {string} Combined dasha interpretation
 */
export function getDashaText(mahaKey, antarKey) {
  const maha = MAHA_DASHA[mahaKey];
  const antar = ANTAR_MODIFIER[antarKey];
  if (!maha) return '';
  if (!antar) return maha.text;
  return `${maha.text} Currently, ${antar}.`;
}

/**
 * Synthesize a coherent 3-5 sentence daily guidance paragraph.
 *
 * @param {Array} transits - Array of transit objects from calculateTransits()
 * @param {{ maha: { planet: string }, antar: { planet: string } }|null} currentDasha - Current dasha period
 * @returns {string} Synthesized guidance paragraph
 */
export function synthesizeDailyGuidance(transits, currentDasha) {
  // Filter out Moon (too fast) and score remaining transits
  const scored = transits
    .filter(t => t.planet !== 'Mo')
    .map(t => {
      let score = 0;
      if (SLOW_MOVERS.has(t.planet)) score += 2;
      if (t.conjunctions && t.conjunctions.length > 0) score += 3;
      if (t.aspects && t.aspects.length > 0) {
        for (const asp of t.aspects) {
          score += asp.distance === 7 ? 2 : 1;
        }
      }
      if (t.quality !== 'neutral') score += 1;
      return { transit: t, score };
    })
    .sort((a, b) => b.score - a.score);

  const sentences = [];

  // Take top 2-3 transits
  const top = scored.slice(0, 3);

  for (const { transit: t } of top) {
    const houseKey = `${t.planet}_${t.house}`;
    const houseInterp = TRANSIT_HOUSE[houseKey];
    if (houseInterp) {
      sentences.push(houseInterp.text);
    }

    // Add conjunction text for the first conjunction (if any)
    if (t.conjunctions && t.conjunctions.length > 0) {
      const conjText = getConjunctionText(t.planet, t.conjunctions[0].natalPlanet);
      if (conjText) {
        sentences.push(conjText);
      }
    }

    // Add aspect text for the first aspect (if any, and no conjunction already added)
    if (t.aspects && t.aspects.length > 0 && (!t.conjunctions || t.conjunctions.length === 0)) {
      const aspText = getAspectText(t.planet, t.aspects[0].natalPlanet);
      if (aspText) {
        sentences.push(aspText);
      }
    }

    if (sentences.length >= 4) break;
  }

  // Append dasha context as closing sentence
  if (currentDasha?.maha?.planet && currentDasha?.antar?.planet) {
    const dashaClosing = getDashaSummary(currentDasha.maha.planet, currentDasha.antar.planet);
    if (dashaClosing && sentences.length < 5) {
      sentences.push(dashaClosing);
    }
  }

  return sentences.slice(0, 5).join(' ') || 'Calculating your guidance...';
}

/**
 * Short dasha context sentence for daily guidance.
 */
function getDashaSummary(mahaKey, antarKey) {
  const antar = ANTAR_MODIFIER[antarKey];
  const planetNames = {
    Su: 'Sun', Mo: 'Moon', Ma: 'Mars', Me: 'Mercury',
    Ju: 'Jupiter', Ve: 'Venus', Sa: 'Saturn', Ra: 'Rahu', Ke: 'Ketu',
  };
  const mahaName = planetNames[mahaKey] || mahaKey;
  if (antar) {
    return `In your ${mahaName} Dasha, ${antar}.`;
  }
  return '';
}

// ============================================================
// Natal Chart Overview Synthesis
// ============================================================

/**
 * Generate a natal chart overview paragraph from the natal chart data.
 * Covers: ascendant, Moon sign, Sun sign, and 1-2 notable placements.
 *
 * @param {Object} natalChart - { ascendantSign, planets: [...] }
 * @param {Function} getHouseNumber - (sign, ascSign) => house number
 * @returns {Object} { summary: string, highlights: Array<{label, text}> }
 */
export function synthesizeChartOverview(natalChart, getHouseNumber) {
  const highlights = [];

  // 1. Ascendant
  const ascText = ASCENDANT_TEXT[natalChart.ascendantSign];
  if (ascText) {
    highlights.push({
      label: `${natalChart.ascendantSign} Rising`,
      text: ascText,
    });
  }

  // 2. Moon sign
  const moon = natalChart.planets.find(p => p.key === 'Mo');
  if (moon) {
    const moonText = MOON_SIGN_TEXT[moon.sign];
    if (moonText) {
      highlights.push({
        label: `Moon in ${moon.sign}`,
        text: moonText,
      });
    }
  }

  // 3. Sun sign
  const sun = natalChart.planets.find(p => p.key === 'Su');
  if (sun) {
    const sunText = SUN_SIGN_TEXT[sun.sign];
    if (sunText) {
      highlights.push({
        label: `Sun in ${sun.sign}`,
        text: sunText,
      });
    }
  }

  // 4. Notable natal placements (check key planets in key houses)
  const notablePlanets = ['Ju', 'Sa', 'Ve', 'Ma', 'Ra', 'Ke'];
  for (const p of natalChart.planets) {
    if (!notablePlanets.includes(p.key)) continue;
    const house = getHouseNumber(p.sign, natalChart.ascendantSign);
    const key = `${p.key}_${house}`;
    const interp = PLANET_IN_HOUSE_NATAL[key];
    if (interp) {
      const planetNames = {
        Ju: 'Jupiter', Sa: 'Saturn', Ve: 'Venus',
        Ma: 'Mars', Ra: 'Rahu', Ke: 'Ketu',
      };
      highlights.push({
        label: `${planetNames[p.key]} in ${getOrdinal(house)} House`,
        text: interp,
      });
    }
    if (highlights.length >= 5) break;
  }

  // Build summary (first 2 sentences from ascendant + moon)
  const summaryParts = [];
  if (ascText) {
    summaryParts.push(ascText.split('.')[0] + '.');
  }
  if (moon && MOON_SIGN_TEXT[moon.sign]) {
    summaryParts.push(MOON_SIGN_TEXT[moon.sign].split('.')[0] + '.');
  }

  return {
    summary: summaryParts.join(' ') || 'Your chart overview is being prepared.',
    highlights,
  };
}

function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
