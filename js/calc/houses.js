import { SIGNS } from '../utils/constants.js';
import { tropicalToSidereal, longitudeToSign, longitudeToNakshatra } from './sidereal.js';

/* global Astronomy */

/**
 * Calculate the ascendant (lagna) for a given date/time and location.
 *
 * The ascendant is the ecliptic degree rising on the eastern horizon.
 * Formula: tan(ASC) = cos(RAMC) / -(sin(RAMC) * cos(obliquity) + tan(lat) * sin(obliquity))
 * where RAMC = local sidereal time in degrees
 *
 * @param {Date} date - birth date/time in UTC
 * @param {number} lat - latitude in degrees (north positive)
 * @param {number} lng - longitude in degrees (east positive)
 * @returns {{ ascendantSign: string, ascendantDegree: number, ascendantMinute: number,
 *             ascendantLongitude: number, ascendantNakshatra: string, ascendantPada: number }}
 */
export function calculateAscendant(date, lat, lng) {
  // Get Greenwich Apparent Sidereal Time in hours
  const gastHours = Astronomy.SiderealTime(date);

  // Local sidereal time = GAST + longitude/15 (convert degrees to hours)
  let lstHours = gastHours + lng / 15;
  lstHours = ((lstHours % 24) + 24) % 24;

  // Convert LST to degrees (RAMC = Right Ascension of Medium Coeli)
  const ramc = lstHours * 15; // degrees

  // Get obliquity of the ecliptic
  const time = Astronomy.MakeTime(date);
  const tilt = Astronomy.e_tilt(time);
  const obliquity = tilt.tobl; // true obliquity in degrees

  // Convert to radians
  const ramcRad = ramc * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;
  const latRad = lat * Math.PI / 180;

  // Calculate ascendant using the standard formula
  const y = Math.cos(ramcRad);
  const x = -(Math.sin(ramcRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad));
  let ascTropical = Math.atan2(y, x) * 180 / Math.PI;

  // atan2 returns [-180, 180], normalize to [0, 360)
  ascTropical = ((ascTropical % 360) + 360) % 360;

  // Convert to sidereal
  const ascSidereal = tropicalToSidereal(ascTropical, date);
  const signInfo = longitudeToSign(ascSidereal);
  const nakInfo = longitudeToNakshatra(ascSidereal);

  return {
    ascendantSign: signInfo.sign,
    ascendantSignIndex: signInfo.signIndex,
    ascendantDegree: signInfo.degree,
    ascendantMinute: signInfo.minute,
    ascendantLongitude: ascSidereal,
    ascendantNakshatra: nakInfo.nakshatra,
    ascendantPada: nakInfo.pada,
  };
}

/**
 * Get the house number for a planet given the ascendant sign (whole sign houses).
 * @param {string} planetSign - the sign the planet is in
 * @param {string} ascendantSign - the ascendant sign (= 1st house)
 * @returns {number} House number (1-12)
 */
export function getHouseNumber(planetSign, ascendantSign) {
  const ascIndex = SIGNS.indexOf(ascendantSign);
  const planetIndex = SIGNS.indexOf(planetSign);
  return ((planetIndex - ascIndex + 12) % 12) + 1;
}
