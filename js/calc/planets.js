import { tropicalToSidereal, longitudeToSign, longitudeToNakshatra } from './sidereal.js';

/* global Astronomy */

// Map of Vedic graha keys to astronomy-engine Body names
const BODY_MAP = {
  Su: null,     // Sun uses SunPosition() - EclipticLongitude throws for Sun
  Mo: null,     // Moon uses EclipticGeoMoon()
  Ma: 'Mars',
  Me: 'Mercury',
  Ju: 'Jupiter',
  Ve: 'Venus',
  Sa: 'Saturn',
};

/**
 * Get the geocentric tropical ecliptic longitude for a planet.
 * Uses GeoVector + Ecliptic to get earth-centered coordinates,
 * which is what astrology requires (not heliocentric EclipticLongitude).
 * @param {string} bodyName - astronomy-engine body name
 * @param {Date} date
 * @returns {number} Tropical ecliptic longitude in degrees [0, 360)
 */
function getTropicalLongitude(bodyName, date) {
  const geo = Astronomy.GeoVector(bodyName, date, true);
  const eclip = Astronomy.Ecliptic(geo);
  let lon = eclip.elon;
  if (lon < 0) lon += 360;
  return lon;
}

/**
 * Get the Moon's tropical ecliptic longitude.
 * @param {Date} date
 * @returns {number} Tropical ecliptic longitude in degrees [0, 360)
 */
function getMoonTropicalLongitude(date) {
  const moon = Astronomy.EclipticGeoMoon(date);
  let lon = moon.lon;
  if (lon < 0) lon += 360;
  return lon;
}

/**
 * Get the Sun's tropical ecliptic longitude.
 * EclipticLongitude() throws for 'Sun', so we use SunPosition() instead.
 * @param {Date} date
 * @returns {number} Tropical ecliptic longitude in degrees [0, 360)
 */
function getSunTropicalLongitude(date) {
  const sun = Astronomy.SunPosition(date);
  let lon = sun.elon;
  if (lon < 0) lon += 360;
  return lon;
}

/**
 * Calculate Rahu (True lunar node) tropical longitude.
 * Uses the mean node (Meeus) plus periodic correction terms
 * from the Delaunay arguments to approximate the osculating
 * (true) node, matching Jagannatha Hora's default setting.
 *
 * @param {Date} date
 * @returns {number} Rahu tropical longitude in degrees [0, 360)
 */
function getRahuTropicalLongitude(date) {
  const j2000 = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
  const daysDiff = (date.getTime() - j2000.getTime()) / 86400000;
  const T = daysDiff / 36525;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T2 * T2;
  const DEG2RAD = Math.PI / 180;

  // Mean longitude of ascending node (Meeus, Astronomical Algorithms)
  let omega = 125.0445479
    - 1934.1362891 * T
    + 0.0020754 * T2
    + T3 / 467441
    - T4 / 60616000;

  // Delaunay arguments for periodic corrections
  // D = Moon's mean elongation from Sun
  const D = DEG2RAD * (297.8501921 + 445267.1114034 * T
    - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000);
  // M = Sun's mean anomaly
  const M = DEG2RAD * (357.5291092 + 35999.0502909 * T
    - 0.0001536 * T2 + T3 / 24490000);
  // M' = Moon's mean anomaly
  const Mp = DEG2RAD * (134.9633964 + 477198.8675055 * T
    + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000);
  // F = Moon's argument of latitude
  const F = DEG2RAD * (93.2720950 + 483202.0175233 * T
    - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000);

  // Periodic corrections to convert mean node → true node (degrees)
  const correction =
    - 1.4979 * Math.sin(2 * (D - F))
    - 0.1500 * Math.sin(M)
    - 0.1226 * Math.sin(2 * D)
    + 0.1176 * Math.sin(2 * F)
    - 0.0801 * Math.sin(2 * (Mp - F));

  omega += correction;
  omega = ((omega % 360) + 360) % 360;
  return omega;
}

/**
 * Calculate positions for all 9 Vedic grahas (planets + nodes).
 * @param {Date} date
 * @returns {Object[]} Array of planet position objects
 */
export function getPlanetPositions(date) {
  const positions = [];

  // Sun through Saturn
  for (const [key, bodyName] of Object.entries(BODY_MAP)) {
    let tropLon;
    if (key === 'Su') {
      tropLon = getSunTropicalLongitude(date);
    } else if (key === 'Mo') {
      tropLon = getMoonTropicalLongitude(date);
    } else {
      tropLon = getTropicalLongitude(bodyName, date);
    }

    const sidLon = tropicalToSidereal(tropLon, date);
    const signInfo = longitudeToSign(sidLon);
    const nakInfo = longitudeToNakshatra(sidLon);

    positions.push({
      key,
      longitude: sidLon,
      tropicalLongitude: tropLon,
      sign: signInfo.sign,
      signIndex: signInfo.signIndex,
      degree: signInfo.degree,
      minute: signInfo.minute,
      nakshatra: nakInfo.nakshatra,
      pada: nakInfo.pada,
    });
  }

  // Rahu (north node)
  const rahuTrop = getRahuTropicalLongitude(date);
  const rahuSid = tropicalToSidereal(rahuTrop, date);
  const rahuSign = longitudeToSign(rahuSid);
  const rahuNak = longitudeToNakshatra(rahuSid);
  positions.push({
    key: 'Ra',
    longitude: rahuSid,
    tropicalLongitude: rahuTrop,
    sign: rahuSign.sign,
    signIndex: rahuSign.signIndex,
    degree: rahuSign.degree,
    minute: rahuSign.minute,
    nakshatra: rahuNak.nakshatra,
    pada: rahuNak.pada,
  });

  // Ketu (south node) = Rahu + 180°
  const ketuTrop = (rahuTrop + 180) % 360;
  const ketuSid = tropicalToSidereal(ketuTrop, date);
  const ketuSign = longitudeToSign(ketuSid);
  const ketuNak = longitudeToNakshatra(ketuSid);
  positions.push({
    key: 'Ke',
    longitude: ketuSid,
    tropicalLongitude: ketuTrop,
    sign: ketuSign.sign,
    signIndex: ketuSign.signIndex,
    degree: ketuSign.degree,
    minute: ketuSign.minute,
    nakshatra: ketuNak.nakshatra,
    pada: ketuNak.pada,
  });

  return positions;
}

/**
 * Convert planet positions array into a sign-grouped object for chart rendering.
 * @param {Object[]} positions - from getPlanetPositions()
 * @param {boolean} useSymbols - if true, use unicode symbols; if false, use abbreviations
 * @returns {Object} { [signName]: string[] }
 */
export function groupBySign(positions, useSymbols = false) {
  const SYMBOLS = {
    Su: '\u2609', Mo: '\u263D', Ma: '\u2642', Me: '\u263F',
    Ju: '\u2643', Ve: '\u2640', Sa: '\u2644', Ra: '\u260A', Ke: '\u260B',
  };

  const grouped = {};
  for (const p of positions) {
    if (!grouped[p.sign]) grouped[p.sign] = [];
    grouped[p.sign].push(useSymbols ? SYMBOLS[p.key] : p.key);
  }
  return grouped;
}
