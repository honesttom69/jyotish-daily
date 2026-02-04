// ============================================================
// Transit Timing — sign entry/exit dates, progress, conjunction timing
// Uses adaptive scan + binary search with retrograde-aware verification
// ============================================================

import { getPlanetPositions } from './planets.js';
import { longitudeToSign } from './sidereal.js';

// --- Planet-specific search configuration ---
const SEARCH_CONFIG = {
  Su: { stepDays: 3,   maxDays: 40,   graceDays: 0   },
  Mo: { stepDays: 1,   maxDays: 5,    graceDays: 0   }, // included for completeness but skipped in practice
  Me: { stepDays: 2,   maxDays: 90,   graceDays: 30  },
  Ve: { stepDays: 3,   maxDays: 120,  graceDays: 50  },
  Ma: { stepDays: 5,   maxDays: 240,  graceDays: 80  },
  Ju: { stepDays: 14,  maxDays: 450,  graceDays: 150 },
  Sa: { stepDays: 21,  maxDays: 1000, graceDays: 180 },
  Ra: { stepDays: 14,  maxDays: 600,  graceDays: 0   },
  Ke: { stepDays: 14,  maxDays: 600,  graceDays: 0   },
};

const MS_PER_DAY = 86400000;

// --- Caching ---
// Timing cache: planetKey -> { signIndex, entryDate, exitDate }
const timingCache = new Map();

// Position cache: timestamp (rounded to 12h) -> positions array
const positionCache = new Map();
const POSITION_CACHE_MAX = 500;

/**
 * Clear all caches. Call when birth data changes.
 */
export function clearTimingCaches() {
  timingCache.clear();
  positionCache.clear();
}

// --- Position cache helpers ---

function roundTo12h(date) {
  const ms = date.getTime();
  return new Date(Math.round(ms / (MS_PER_DAY / 2)) * (MS_PER_DAY / 2));
}

function getCachedPositions(date) {
  const key = roundTo12h(date).getTime();
  if (positionCache.has(key)) return positionCache.get(key);

  const positions = getPlanetPositions(date);
  // Evict oldest if cache is full
  if (positionCache.size >= POSITION_CACHE_MAX) {
    const firstKey = positionCache.keys().next().value;
    positionCache.delete(firstKey);
  }
  positionCache.set(key, positions);
  return positions;
}

function getPlanetSignIndex(planetKey, date) {
  const positions = getCachedPositions(date);
  const p = positions.find(pos => pos.key === planetKey);
  return p ? p.signIndex : -1;
}

function getPlanetLongitude(planetKey, date) {
  const positions = getCachedPositions(date);
  const p = positions.find(pos => pos.key === planetKey);
  return p ? p.longitude : 0;
}

// --- Date arithmetic helpers ---

function addDays(date, days) {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

function daysBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

function formatTiming(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// --- Core algorithm ---

/**
 * Find the boundary crossing date by scanning in a direction then binary searching.
 * Returns the last date the planet was still in `targetSignIndex` (for backward)
 * or the first date it's in a different sign (for forward).
 *
 * @param {string} planetKey
 * @param {number} targetSignIndex - the sign we're currently in
 * @param {Date} startDate
 * @param {'backward'|'forward'} direction
 * @param {object} config - { stepDays, maxDays }
 * @returns {Date|null} - crossing date, or null if not found within maxDays
 */
function findBoundaryCrossing(planetKey, targetSignIndex, startDate, direction, config) {
  const sign = direction === 'backward' ? -1 : 1;
  let prevDate = startDate;
  let currDate = startDate;

  // Coarse scan
  for (let d = config.stepDays; d <= config.maxDays; d += config.stepDays) {
    currDate = addDays(startDate, sign * d);
    const signIdx = getPlanetSignIndex(planetKey, currDate);

    if (signIdx !== targetSignIndex) {
      // Bracketed: the crossing is between prevDate and currDate
      let lo = direction === 'backward' ? currDate : prevDate;
      let hi = direction === 'backward' ? prevDate : currDate;

      // Binary search to 1-day precision
      while (daysBetween(lo, hi) > 1) {
        const mid = new Date((lo.getTime() + hi.getTime()) / 2);
        const midSign = getPlanetSignIndex(planetKey, mid);
        if (midSign === targetSignIndex) {
          // mid is still in target sign; crossing is between mid and hi (forward) or lo and mid (backward)
          if (direction === 'forward') {
            lo = mid;
          } else {
            hi = mid;
          }
        } else {
          if (direction === 'forward') {
            hi = mid;
          } else {
            lo = mid;
          }
        }
      }

      // For forward: hi is the first day out of sign, lo is last day in sign
      // For backward: lo is the first day out of sign, hi is last day in sign
      return direction === 'forward' ? hi : hi;
    }

    prevDate = currDate;
  }

  return null; // boundary not found within maxDays
}

/**
 * Find the continuous sign stay for a planet, accounting for retrograde re-entries.
 *
 * @param {string} planetKey
 * @param {number} currentSignIndex
 * @param {Date} referenceDate
 * @returns {{ entryDate: Date, exitDate: Date }|null}
 */
function findContinuousSignStay(planetKey, currentSignIndex, referenceDate) {
  const config = SEARCH_CONFIG[planetKey];
  if (!config) return null;

  // --- Find entry date (scan backward) ---
  let entryDate = findBoundaryCrossing(planetKey, currentSignIndex, referenceDate, 'backward', config);

  if (!entryDate) {
    // Planet has been in this sign longer than maxDays; use maxDays ago as fallback
    entryDate = addDays(referenceDate, -config.maxDays);
  }

  // Verify continuous stay: scan forward from entryDate to referenceDate
  // If planet leaves and re-enters (retrograde), update entryDate
  if (config.graceDays > 0) {
    const verifyStep = Math.max(1, Math.floor(config.stepDays / 2));
    let checkDate = addDays(entryDate, verifyStep);
    let lastReentry = entryDate;

    while (checkDate.getTime() < referenceDate.getTime()) {
      const signIdx = getPlanetSignIndex(planetKey, checkDate);
      if (signIdx !== currentSignIndex) {
        // Planet left the sign; find when it re-enters
        let reenterDate = checkDate;
        for (let d = verifyStep; d <= config.graceDays; d += verifyStep) {
          const candidate = addDays(checkDate, d);
          if (candidate.getTime() >= referenceDate.getTime()) break;
          if (getPlanetSignIndex(planetKey, candidate) === currentSignIndex) {
            reenterDate = candidate;
            // Binary search for exact re-entry
            let lo = addDays(candidate, -verifyStep);
            let hi = candidate;
            while (daysBetween(lo, hi) > 1) {
              const mid = new Date((lo.getTime() + hi.getTime()) / 2);
              if (getPlanetSignIndex(planetKey, mid) === currentSignIndex) {
                hi = mid;
              } else {
                lo = mid;
              }
            }
            lastReentry = hi;
            checkDate = hi;
            break;
          }
        }
        if (reenterDate === checkDate) {
          // Didn't find re-entry; this shouldn't happen since planet is in sign on referenceDate
          break;
        }
      }
      checkDate = addDays(checkDate, verifyStep);
    }

    entryDate = lastReentry;
  }

  // --- Find exit date (scan forward) ---
  let exitDate = findBoundaryCrossing(planetKey, currentSignIndex, referenceDate, 'forward', config);

  if (!exitDate) {
    // Planet will be in this sign longer than maxDays; use maxDays ahead as fallback
    exitDate = addDays(referenceDate, config.maxDays);
  }

  // Verify the exit is real (planet doesn't retrograde back in)
  if (config.graceDays > 0) {
    const verifyStep = Math.max(1, Math.floor(config.stepDays / 2));
    let checkDate = addDays(exitDate, verifyStep);
    const graceEnd = addDays(exitDate, config.graceDays);

    while (checkDate.getTime() < graceEnd.getTime()) {
      const signIdx = getPlanetSignIndex(planetKey, checkDate);
      if (signIdx === currentSignIndex) {
        // Planet returned to the sign; find the true later exit
        const laterExit = findBoundaryCrossing(planetKey, currentSignIndex, checkDate, 'forward', config);
        if (laterExit) {
          exitDate = laterExit;
          // Check again from the new exit
          checkDate = addDays(exitDate, verifyStep);
          continue;
        }
      }
      checkDate = addDays(checkDate, verifyStep);
    }
  }

  return { entryDate, exitDate };
}

// --- Public API ---

/**
 * Calculate timing data for all transits (excluding Moon).
 *
 * @param {Object[]} transitPositions - from getPlanetPositions() for the reference date
 * @param {Date} referenceDate
 * @returns {Map<string, Object>} Map of planetKey -> timing data
 */
export function calculateAllTimings(transitPositions, referenceDate) {
  const results = new Map();

  for (const pos of transitPositions) {
    if (pos.key === 'Mo') continue;

    // Check timing cache
    const cached = timingCache.get(pos.key);
    if (cached && cached.signIndex === pos.signIndex) {
      // Still in same sign — reuse entry/exit, just recalculate progress
      const totalDays = daysBetween(cached.entryDate, cached.exitDate);
      const elapsed = daysBetween(cached.entryDate, referenceDate);
      const remaining = daysBetween(referenceDate, cached.exitDate);
      results.set(pos.key, {
        entryDate: cached.entryDate,
        exitDate: cached.exitDate,
        progressPct: Math.max(0, Math.min(100, totalDays > 0 ? (elapsed / totalDays) * 100 : 0)),
        totalDays,
        daysRemaining: Math.max(0, remaining),
        entryFormatted: formatTiming(cached.entryDate),
        exitFormatted: formatTiming(cached.exitDate),
      });
      continue;
    }

    // Calculate fresh
    const stay = findContinuousSignStay(pos.key, pos.signIndex, referenceDate);
    if (!stay) continue;

    // Update cache
    timingCache.set(pos.key, {
      signIndex: pos.signIndex,
      entryDate: stay.entryDate,
      exitDate: stay.exitDate,
    });

    const totalDays = daysBetween(stay.entryDate, stay.exitDate);
    const elapsed = daysBetween(stay.entryDate, referenceDate);
    const remaining = daysBetween(referenceDate, stay.exitDate);

    results.set(pos.key, {
      entryDate: stay.entryDate,
      exitDate: stay.exitDate,
      progressPct: Math.max(0, Math.min(100, totalDays > 0 ? (elapsed / totalDays) * 100 : 0)),
      totalDays,
      daysRemaining: Math.max(0, remaining),
      entryFormatted: formatTiming(stay.entryDate),
      exitFormatted: formatTiming(stay.exitDate),
    });
  }

  return results;
}

/**
 * Calculate conjunction timing: applying/separating and exact date.
 *
 * @param {string} transitPlanetKey
 * @param {number} natalLongitude - fixed natal planet sidereal longitude
 * @param {Date} referenceDate
 * @returns {{ isApplying: boolean, exactDate: Date|null, exactFormatted: string }}
 */
export function calculateConjunctionTiming(transitPlanetKey, natalLongitude, referenceDate) {
  const currentLon = getPlanetLongitude(transitPlanetKey, referenceDate);
  const currentOrb = angularDist(currentLon, natalLongitude);

  // Check 1 day prior to determine applying/separating
  const prevDate = addDays(referenceDate, -1);
  const prevLon = getPlanetLongitude(transitPlanetKey, prevDate);
  const prevOrb = angularDist(prevLon, natalLongitude);

  const isApplying = prevOrb > currentOrb;

  // Binary search for exact conjunction date
  // Search in the direction the conjunction is tightening
  const searchDir = isApplying ? 1 : -1; // forward if applying, backward if separating
  const config = SEARCH_CONFIG[transitPlanetKey];
  const maxSearch = config ? config.maxDays : 90;

  let exactDate = null;

  // Find bracket: scan until orb starts increasing
  let bestOrb = currentOrb;
  let bestDate = referenceDate;
  const step = Math.max(1, Math.floor((config?.stepDays || 3) / 2));

  for (let d = step; d <= maxSearch; d += step) {
    const checkDate = addDays(referenceDate, searchDir * d);
    const checkLon = getPlanetLongitude(transitPlanetKey, checkDate);
    const checkOrb = angularDist(checkLon, natalLongitude);

    if (checkOrb < bestOrb) {
      bestOrb = checkOrb;
      bestDate = checkDate;
    } else {
      // Orb started increasing — bracket found between previous best and this date
      let lo = searchDir > 0
        ? addDays(checkDate, -step)
        : checkDate;
      let hi = searchDir > 0
        ? checkDate
        : addDays(checkDate, step);

      // Binary search for minimum orb (1-day precision)
      for (let i = 0; i < 15; i++) {
        if (daysBetween(lo, hi) <= 1) break;
        const mid = new Date((lo.getTime() + hi.getTime()) / 2);
        const midLon = getPlanetLongitude(transitPlanetKey, mid);
        const midOrb = angularDist(midLon, natalLongitude);

        const loLon = getPlanetLongitude(transitPlanetKey, lo);
        const loOrb = angularDist(loLon, natalLongitude);

        if (loOrb < midOrb) {
          hi = mid;
        } else {
          lo = mid;
        }
      }

      exactDate = new Date((lo.getTime() + hi.getTime()) / 2);
      break;
    }
  }

  // If we never found orb increasing (conjunction keeps tightening beyond maxSearch),
  // use the best date found
  if (!exactDate && bestOrb < currentOrb) {
    exactDate = bestDate;
  }

  return {
    isApplying,
    exactDate,
    exactFormatted: exactDate ? formatTiming(exactDate) : '',
  };
}

/**
 * Angular distance between two longitudes (0-180).
 */
function angularDist(lon1, lon2) {
  let diff = Math.abs(lon1 - lon2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}
