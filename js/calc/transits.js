import { SIGNS, PLANETS, VEDIC_ASPECTS } from '../utils/constants.js';
import { getHouseNumber } from './houses.js';
import { calculateAllTimings, calculateConjunctionTiming } from './transitTiming.js';

// Benefic and malefic classifications (natural)
// Sun is traditionally "krura" but mild — treated as neutral for quality scoring
const NATURAL_BENEFICS = ['Ju', 'Ve', 'Me', 'Mo'];
const NATURAL_MALEFICS = ['Sa', 'Ma', 'Ra', 'Ke'];
const MILD_PLANETS = ['Su']; // neutral in scoring

// Difficult houses for transits
const DIFFICULT_HOUSES = [6, 8, 12];
// Favorable houses for transits
const FAVORABLE_HOUSES = [1, 5, 9, 11];

// Conjunction orb in degrees
const CONJUNCTION_ORB = 8;

// Ordinal helper for aspect labels
function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Analyze current transits against a natal chart.
 * @param {Object} natalChart - { ascendantSign, planets: [...planetPositions] }
 * @param {Object[]} transitPositions - from getPlanetPositions() for transit date
 * @returns {Object[]} Array of transit analysis objects for UI rendering
 */
export function calculateTransits(natalChart, transitPositions) {
  const transits = [];

  for (const transit of transitPositions) {
    const house = getHouseNumber(transit.sign, natalChart.ascendantSign);
    const quality = assessTransitQuality(transit.key, house);

    const transitObj = {
      planet: transit.key,
      planetName: PLANETS[transit.key]?.name || transit.key,
      planetSymbol: PLANETS[transit.key]?.symbol || transit.key,
      sign: transit.sign,
      house,
      degree: transit.degree,
      minute: transit.minute,
      nakshatra: transit.nakshatra,
      quality, // 'positive' | 'negative' | 'neutral'
      conjunctions: [],
      aspects: [],
      description: '',
    };

    // Check conjunctions with natal planets
    for (const natal of natalChart.planets) {
      const distance = angularDistance(transit.longitude, natal.longitude);
      if (distance <= CONJUNCTION_ORB) {
        transitObj.conjunctions.push({
          natalPlanet: natal.key,
          natalPlanetName: PLANETS[natal.key]?.name || natal.key,
          orb: Math.round(distance * 10) / 10,
        });
      }
    }

    // Check Vedic aspects (drishti) on natal planets
    const aspectDistances = VEDIC_ASPECTS[transit.key] || [7];
    for (const dist of aspectDistances) {
      const targetHouse = ((house - 1 + dist) % 12) + 1;
      for (const natal of natalChart.planets) {
        const natalHouse = getHouseNumber(natal.sign, natalChart.ascendantSign);
        if (natalHouse === targetHouse) {
          // Skip if already a conjunction
          const isConj = transitObj.conjunctions.some(c => c.natalPlanet === natal.key);
          if (!isConj) {
            transitObj.aspects.push({
              natalPlanet: natal.key,
              natalPlanetName: PLANETS[natal.key]?.name || natal.key,
              aspectType: dist === 7 ? '7th' : `${getOrdinal(dist)}`,
              distance: dist,
              targetHouse,
            });
          }
        }
      }
    }

    // Build description
    transitObj.description = buildTransitDescription(transitObj);

    transits.push(transitObj);
  }

  // Sort: slow movers first (Sa, Ju, Ra, Ke), then faster ones
  const ORDER = ['Sa', 'Ju', 'Ra', 'Ke', 'Ma', 'Ve', 'Su', 'Me', 'Mo'];
  transits.sort((a, b) => ORDER.indexOf(a.planet) - ORDER.indexOf(b.planet));

  return transits;
}

/**
 * Assess the quality of a transit based on planet nature and house placement.
 * @param {string} planetKey
 * @param {number} house
 * @returns {'positive' | 'negative' | 'neutral'}
 */
function assessTransitQuality(planetKey, house) {
  const isBenefic = NATURAL_BENEFICS.includes(planetKey);
  const isMalefic = NATURAL_MALEFICS.includes(planetKey);
  const isDifficultHouse = DIFFICULT_HOUSES.includes(house);
  const isFavorableHouse = FAVORABLE_HOUSES.includes(house);

  // Malefics in upachaya houses (3, 6, 11) are positive — check before difficult houses
  if (isMalefic && [3, 6, 11].includes(house)) return 'positive';

  if (isBenefic && isFavorableHouse) return 'positive';
  if (isMalefic && isDifficultHouse) return 'negative';
  if (isBenefic && isDifficultHouse) return 'neutral';

  return 'neutral';
}

/**
 * Build a human-readable description for a transit.
 */
function buildTransitDescription(transit) {
  const parts = [];
  parts.push(`Transiting ${transit.sign}`);

  if (transit.conjunctions.length > 0) {
    const names = transit.conjunctions.map(c =>
      `natal ${c.natalPlanetName}`
    ).join(', ');
    parts.push(`Conjunct ${names}`);
  }

  if (transit.aspects.length > 0) {
    const aspNames = transit.aspects.map(a =>
      `${a.aspectType} asp natal ${a.natalPlanetName}`
    ).join(', ');
    parts.push(aspNames);
  }

  return parts.join(' \u2022 ');
}

/**
 * Calculate angular distance between two longitudes (0-180°).
 * @param {number} lon1
 * @param {number} lon2
 * @returns {number} Distance in degrees (0-180)
 */
export function angularDistance(lon1, lon2) {
  let diff = Math.abs(lon1 - lon2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/**
 * Calculate a simple day quality score for calendar coloring.
 * @param {Object} natalChart - { ascendantSign, planets: [...] }
 * @param {Object[]} transitPositions - planet positions for the date
 * @returns {'good' | 'mixed' | 'challenging'}
 */
export function getDayQuality(natalChart, transitPositions) {
  let score = 0;

  for (const transit of transitPositions) {
    const house = getHouseNumber(transit.sign, natalChart.ascendantSign);
    const quality = assessTransitQuality(transit.key, house);
    const isBenefic = NATURAL_BENEFICS.includes(transit.key);
    const isMild = MILD_PLANETS.includes(transit.key);

    // Weight slow movers more heavily
    const weight = ['Sa', 'Ju', 'Ra', 'Ke'].includes(transit.key) ? 2 : 1;

    if (quality === 'positive') score += weight;
    else if (quality === 'negative' && !isMild) score -= weight;

    // Conjunctions with natal planets add weight
    // Benefic conjunctions are clearly positive; malefic ones are intense but not always bad
    for (const natal of natalChart.planets) {
      const dist = angularDistance(transit.longitude, natal.longitude);
      if (dist <= CONJUNCTION_ORB) {
        if (isBenefic) score += 1;
        else if (!isMild) score -= 0.5;
      }
    }

    // Vedic aspects add subtle weight (aspects are weaker than direct placement)
    const aspectDists = VEDIC_ASPECTS[transit.key] || [7];
    for (const aspDist of aspectDists) {
      const targetHouse = ((house - 1 + aspDist) % 12) + 1;
      for (const natal of natalChart.planets) {
        const natalHouse = getHouseNumber(natal.sign, natalChart.ascendantSign);
        if (natalHouse === targetHouse) {
          if (isBenefic) score += 0.5;
          else if (!isMild) score -= 0.25;
        }
      }
    }
  }

  if (score >= 3) return 'good';
  if (score <= -3) return 'challenging';
  return 'mixed';
}

/**
 * Calculate transits with timing data (entry/exit dates, progress, conjunction timing).
 * @param {Object} natalChart
 * @param {Object[]} transitPositions
 * @param {Date} referenceDate
 * @returns {Object[]} Transit objects with .timing and enhanced .conjunctions
 */
export function calculateTransitsWithTiming(natalChart, transitPositions, referenceDate) {
  const transits = calculateTransits(natalChart, transitPositions);
  const timings = calculateAllTimings(transitPositions, referenceDate);

  for (const t of transits) {
    if (t.planet !== 'Mo') {
      t.timing = timings.get(t.planet) || null;
    }
    // Add conjunction timing
    for (const conj of t.conjunctions) {
      const natalP = natalChart.planets.find(p => p.key === conj.natalPlanet);
      if (natalP) {
        const ct = calculateConjunctionTiming(t.planet, natalP.longitude, referenceDate);
        conj.isApplying = ct.isApplying;
        conj.exactDate = ct.exactDate;
        conj.exactFormatted = ct.exactFormatted;
      }
    }
  }

  return transits;
}
