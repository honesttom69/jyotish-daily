import { SIGNS, NAKSHATRAS } from '../utils/constants.js';

// Lahiri ayanamsha (Swiss Ephemeris definition, matches Jagannatha Hora)
// Precession rate: ~50.2888"/year (IAU 2006)
const LAHIRI_J2000 = 24.0417;  // degrees at J2000.0 epoch
const PRECESSION_RATE = 50.2888 / 3600; // degrees per year

/**
 * Calculate the Lahiri ayanamsha for a given date.
 * Uses a linear approximation from J2000.0 epoch.
 * @param {Date} date
 * @returns {number} Ayanamsha in degrees
 */
export function getLahiriAyanamsha(date) {
  const j2000 = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
  const daysDiff = (date.getTime() - j2000.getTime()) / 86400000;
  const years = daysDiff / 365.25;
  return LAHIRI_J2000 + (PRECESSION_RATE * years);
}

/**
 * Convert a tropical ecliptic longitude to sidereal (Lahiri).
 * @param {number} tropicalLongitude - degrees [0, 360)
 * @param {Date} date
 * @returns {number} Sidereal longitude in degrees [0, 360)
 */
export function tropicalToSidereal(tropicalLongitude, date) {
  const ayanamsha = getLahiriAyanamsha(date);
  let sidereal = tropicalLongitude - ayanamsha;
  if (sidereal < 0) sidereal += 360;
  if (sidereal >= 360) sidereal -= 360;
  return sidereal;
}

/**
 * Convert a sidereal longitude to sign, degree, and minute.
 * @param {number} longitude - sidereal longitude in degrees [0, 360)
 * @returns {{ sign: string, signIndex: number, degree: number, minute: number }}
 */
export function longitudeToSign(longitude) {
  const norm = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(norm / 30);
  const inSign = norm - (signIndex * 30);
  const degree = Math.floor(inSign);
  const minute = Math.round((inSign - degree) * 60);
  return {
    sign: SIGNS[signIndex],
    signIndex,
    degree,
    minute,
  };
}

/**
 * Convert a sidereal longitude to nakshatra and pada.
 * Each nakshatra spans 13°20' (13.3333°), each pada spans 3°20'.
 * @param {number} longitude - sidereal longitude in degrees [0, 360)
 * @returns {{ nakshatra: string, nakshatraIndex: number, pada: number }}
 */
export function longitudeToNakshatra(longitude) {
  const norm = ((longitude % 360) + 360) % 360;
  const nakshatraSpan = 360 / 27; // 13.3333°
  const nakshatraIndex = Math.floor(norm / nakshatraSpan);
  const inNakshatra = norm - (nakshatraIndex * nakshatraSpan);
  const pada = Math.floor(inNakshatra / (nakshatraSpan / 4)) + 1;
  return {
    nakshatra: NAKSHATRAS[nakshatraIndex],
    nakshatraIndex,
    pada,
  };
}
