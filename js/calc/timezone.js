/**
 * Populate a <select> element with IANA timezone options,
 * defaulting to the user's browser timezone.
 * @param {HTMLSelectElement} selectEl
 * @param {string} [defaultTz] - timezone to pre-select (falls back to browser tz)
 */
export function populateTimezoneSelect(selectEl, defaultTz) {
  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const selected = defaultTz || browserTz;

  let zones;
  try {
    zones = Intl.supportedValuesOf('timeZone');
  } catch {
    // Fallback for older browsers that don't support supportedValuesOf
    zones = COMMON_TIMEZONES;
  }

  selectEl.innerHTML = '';
  for (const tz of zones) {
    const opt = document.createElement('option');
    opt.value = tz;
    opt.textContent = tz.replace(/_/g, ' ');
    if (tz === selected) opt.selected = true;
    selectEl.appendChild(opt);
  }
}

/**
 * Get the UTC offset in hours for a given timezone on a specific date.
 * Handles DST correctly for historical dates.
 * @param {string} timezone - IANA timezone name (e.g. "America/New_York")
 * @param {number} year
 * @param {number} month - 1-indexed (January = 1)
 * @param {number} day
 * @param {number} hours
 * @param {number} minutes
 * @returns {number} UTC offset in hours (e.g. -5 for EST, -4 for EDT)
 */
export function getUtcOffset(timezone, year, month, day, hours, minutes) {
  // Create a date string in the target timezone and compare to UTC
  // to determine the offset
  const dt = new Date(Date.UTC(year, month - 1, day, hours, minutes));

  const utcStr = dt.toLocaleString('en-US', { timeZone: 'UTC' });
  const localStr = dt.toLocaleString('en-US', { timeZone: timezone });

  const utcDate = new Date(utcStr);
  const localDate = new Date(localStr);

  return (localDate - utcDate) / 3600000;
}

/**
 * Convert a local date/time in a given timezone to a UTC Date object.
 * Uses an iterative approach to handle DST transitions correctly:
 * the offset is looked up at the estimated UTC time, then refined.
 * @param {string} timezone - IANA timezone name
 * @param {number} year
 * @param {number} month - 1-indexed
 * @param {number} day
 * @param {number} hours
 * @param {number} minutes
 * @returns {Date} UTC Date object
 */
export function localToUtc(timezone, year, month, day, hours, minutes) {
  // First estimate: treat local time as UTC
  let utcGuess = new Date(Date.UTC(year, month - 1, day, hours, minutes));

  // Find offset at that UTC instant
  let offset = getUtcOffset(timezone, year, month, day, hours, minutes);

  // Better estimate: subtract offset from local time
  utcGuess = new Date(Date.UTC(year, month - 1, day, hours - offset, minutes));

  // Re-check offset at the corrected UTC time
  const utcH = utcGuess.getUTCHours();
  const utcM = utcGuess.getUTCMinutes();
  const utcD = utcGuess.getUTCDate();
  const utcMo = utcGuess.getUTCMonth() + 1;
  const utcY = utcGuess.getUTCFullYear();
  const offset2 = getUtcOffset(timezone, utcY, utcMo, utcD, utcH, utcM);

  // If offset changed (DST boundary crossed), use the refined offset
  if (offset2 !== offset) {
    utcGuess = new Date(Date.UTC(year, month - 1, day, hours - offset2, minutes));
  }

  return utcGuess;
}

/**
 * Try to guess timezone from lat/lng using a free API.
 * Falls back to null if the lookup fails.
 * @param {number} lat
 * @param {number} lng
 * @returns {Promise<string|null>} IANA timezone name or null
 */
export async function lookupTimezone(lat, lng) {
  try {
    const res = await fetch(
      `https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lng}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.timeZone || null;
  } catch {
    return null;
  }
}

// Fallback list for browsers without Intl.supportedValuesOf
const COMMON_TIMEZONES = [
  'Pacific/Honolulu', 'America/Anchorage', 'America/Los_Angeles',
  'America/Denver', 'America/Chicago', 'America/New_York',
  'America/Sao_Paulo', 'Atlantic/Reykjavik', 'Europe/London',
  'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow',
  'Asia/Dubai', 'Asia/Kolkata', 'Asia/Bangkok',
  'Asia/Shanghai', 'Asia/Tokyo', 'Australia/Sydney',
  'Pacific/Auckland',
];
