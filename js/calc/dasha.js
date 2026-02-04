import { NAKSHATRAS } from '../utils/constants.js';

// Vimshottari Dasha sequence: planet key, name, total years
export const DASHA_SEQUENCE = [
  { planet: 'Ke', name: 'Ketu',    years: 7 },
  { planet: 'Ve', name: 'Venus',   years: 20 },
  { planet: 'Su', name: 'Sun',     years: 6 },
  { planet: 'Mo', name: 'Moon',    years: 10 },
  { planet: 'Ma', name: 'Mars',    years: 7 },
  { planet: 'Ra', name: 'Rahu',    years: 18 },
  { planet: 'Ju', name: 'Jupiter', years: 16 },
  { planet: 'Sa', name: 'Saturn',  years: 19 },
  { planet: 'Me', name: 'Mercury', years: 17 },
];

const TOTAL_YEARS = 120; // Sum of all dasha years

// Maps each nakshatra (by index 0-26) to its ruling planet key
// Nakshatra rulers repeat in groups of 9 matching the dasha sequence
export const NAKSHATRA_RULERS = [
  'Ke', // 0  Ashwini
  'Ve', // 1  Bharani
  'Su', // 2  Krittika
  'Mo', // 3  Rohini
  'Ma', // 4  Mrigashira
  'Ra', // 5  Ardra
  'Ju', // 6  Punarvasu
  'Sa', // 7  Pushya
  'Me', // 8  Ashlesha
  'Ke', // 9  Magha
  'Ve', // 10 Purva Phalguni
  'Su', // 11 Uttara Phalguni
  'Mo', // 12 Hasta
  'Ma', // 13 Chitra
  'Ra', // 14 Swati
  'Ju', // 15 Vishakha
  'Sa', // 16 Anuradha
  'Me', // 17 Jyeshtha
  'Ke', // 18 Moola
  'Ve', // 19 Purva Ashadha
  'Su', // 20 Uttara Ashadha
  'Mo', // 21 Shravana
  'Ma', // 22 Dhanishta
  'Ra', // 23 Shatabhisha
  'Ju', // 24 Purva Bhadrapada
  'Sa', // 25 Uttara Bhadrapada
  'Me', // 26 Revati
];

/**
 * Add a fractional number of years to a Date, returning a new Date.
 */
function addYears(date, years) {
  const ms = years * 365.25 * 24 * 60 * 60 * 1000;
  return new Date(date.getTime() + ms);
}

/**
 * Calculate the full Vimshottari Dasha timeline.
 *
 * @param {number} moonLongitude - Sidereal longitude of the Moon (0-360)
 * @param {Date} birthDate - Date object for the birth moment
 * @returns {{ mahaDashas: Array }} Full dasha timeline
 */
export function calculateDashas(moonLongitude, birthDate) {
  const nakshatraSpan = 360 / 27; // 13.3333...°

  // Which nakshatra is the Moon in?
  const nakshatraIndex = Math.floor(moonLongitude / nakshatraSpan);
  const nakshatraStart = nakshatraIndex * nakshatraSpan;

  // How far through the nakshatra has the Moon progressed (0 to 1)
  const fraction = (moonLongitude - nakshatraStart) / nakshatraSpan;

  // The ruler of this nakshatra determines the starting Maha Dasha
  const ruler = NAKSHATRA_RULERS[nakshatraIndex];

  // Find the index in DASHA_SEQUENCE for this ruler
  const startIdx = DASHA_SEQUENCE.findIndex(d => d.planet === ruler);

  // The elapsed portion of the first Maha Dasha
  // If Moon is 40% through the nakshatra, 40% of that dasha has already elapsed at birth
  const firstDashaTotal = DASHA_SEQUENCE[startIdx].years;
  const elapsedYears = fraction * firstDashaTotal;
  const remainingYears = firstDashaTotal - elapsedYears;

  // Build all 9 Maha Dasha periods
  const mahaDashas = [];
  let cursor = addYears(birthDate, -elapsedYears); // Start of the first (partial) dasha

  for (let i = 0; i < 9; i++) {
    const idx = (startIdx + i) % 9;
    const seq = DASHA_SEQUENCE[idx];
    const startDate = new Date(cursor);
    const endDate = addYears(cursor, seq.years);

    // Compute Antar Dashas within this Maha Dasha
    const antarDashas = computeAntarDashas(idx, startDate, seq.years);

    mahaDashas.push({
      planet: seq.planet,
      planetName: seq.name,
      startDate,
      endDate,
      years: seq.years,
      antarDashas,
    });

    cursor = endDate;
  }

  return { mahaDashas };
}

/**
 * Compute the 9 Antar Dasha sub-periods within a Maha Dasha.
 *
 * @param {number} mahaIdx - Index in DASHA_SEQUENCE for the Maha Dasha lord
 * @param {Date} mahaStart - Start date of the Maha Dasha
 * @param {number} mahaYears - Total years of the Maha Dasha
 * @returns {Array} Array of 9 antar dasha objects
 */
function computeAntarDashas(mahaIdx, mahaStart, mahaYears) {
  const antarDashas = [];
  let cursor = new Date(mahaStart);

  for (let i = 0; i < 9; i++) {
    const idx = (mahaIdx + i) % 9;
    const seq = DASHA_SEQUENCE[idx];

    // Antar Dasha duration = (Maha years * Antar years) / Total years
    const antarYears = (mahaYears * seq.years) / TOTAL_YEARS;

    const startDate = new Date(cursor);
    const endDate = addYears(cursor, antarYears);

    antarDashas.push({
      planet: seq.planet,
      planetName: seq.name,
      startDate,
      endDate,
    });

    cursor = endDate;
  }

  return antarDashas;
}

/**
 * Find which Maha Dasha and Antar Dasha is active on a given date.
 *
 * @param {{ mahaDashas: Array }} dashas - Result from calculateDashas()
 * @param {Date} date - The date to check
 * @returns {{ maha, antar, mahaIndex, antarIndex } | null}
 */
export function getCurrentDasha(dashas, date) {
  const t = date.getTime();

  for (let mi = 0; mi < dashas.mahaDashas.length; mi++) {
    const maha = dashas.mahaDashas[mi];
    if (t >= maha.startDate.getTime() && t < maha.endDate.getTime()) {
      // Find active Antar Dasha
      for (let ai = 0; ai < maha.antarDashas.length; ai++) {
        const antar = maha.antarDashas[ai];
        if (t >= antar.startDate.getTime() && t < antar.endDate.getTime()) {
          return {
            maha: {
              planet: maha.planet,
              planetName: maha.planetName,
              startDate: maha.startDate,
              endDate: maha.endDate,
              years: maha.years,
            },
            antar: {
              planet: antar.planet,
              planetName: antar.planetName,
              startDate: antar.startDate,
              endDate: antar.endDate,
            },
            mahaIndex: mi,
            antarIndex: ai,
          };
        }
      }
      // Date is in this maha but past the last antar (edge case with rounding)
      const lastAntar = maha.antarDashas[maha.antarDashas.length - 1];
      return {
        maha: {
          planet: maha.planet,
          planetName: maha.planetName,
          startDate: maha.startDate,
          endDate: maha.endDate,
          years: maha.years,
        },
        antar: {
          planet: lastAntar.planet,
          planetName: lastAntar.planetName,
          startDate: lastAntar.startDate,
          endDate: lastAntar.endDate,
        },
        mahaIndex: mi,
        antarIndex: maha.antarDashas.length - 1,
      };
    }
  }

  return null;
}
