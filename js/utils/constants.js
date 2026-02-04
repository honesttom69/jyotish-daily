// Zodiac signs in order (sidereal)
export const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Planet data: key, name, abbreviation, unicode symbol
export const PLANETS = {
  Su: { name: 'Sun',     symbol: '☉' },
  Mo: { name: 'Moon',    symbol: '☽' },
  Ma: { name: 'Mars',    symbol: '♂' },
  Me: { name: 'Mercury', symbol: '☿' },
  Ju: { name: 'Jupiter', symbol: '♃' },
  Ve: { name: 'Venus',   symbol: '♀' },
  Sa: { name: 'Saturn',  symbol: '♄' },
  Ra: { name: 'Rahu',    symbol: '☊' },
  Ke: { name: 'Ketu',    symbol: '☋' },
};

// South Indian chart layout: fixed sign positions in a 4x4 grid
// null = empty center cell
export const SOUTH_INDIAN_LAYOUT = [
  'Pisces',      'Aries',       'Taurus',      'Gemini',
  'Aquarius',    null,          null,          'Cancer',
  'Capricorn',   null,          null,          'Leo',
  'Sagittarius', 'Scorpio',     'Libra',       'Virgo',
];

// North Indian chart layout: houses are FIXED in position, signs rotate.
// Each house is a full-size overlay div clipped to its polygon region.
// Coordinates are percentages of the container (100x100).
// The chart: outer square + inscribed diamond + 4 lines from corners to center.
// 4 corner trapezoids (houses 1,4,7,10) + 8 inner triangles (2,3,5,6,8,9,11,12).
export const NORTH_INDIAN_HOUSES = [
  { house: 1,  clip: '0% 0%, 50% 0%, 25% 25%, 0% 50%',              cx: 19, cy: 19 },
  { house: 2,  clip: '25% 25%, 50% 50%, 0% 50%',                     cx: 25, cy: 42 },
  { house: 3,  clip: '0% 50%, 50% 50%, 25% 75%',                     cx: 25, cy: 58 },
  { house: 4,  clip: '0% 50%, 25% 75%, 50% 100%, 0% 100%',           cx: 19, cy: 81 },
  { house: 5,  clip: '25% 75%, 50% 50%, 50% 100%',                   cx: 42, cy: 75 },
  { house: 6,  clip: '50% 50%, 75% 75%, 50% 100%',                   cx: 58, cy: 75 },
  { house: 7,  clip: '75% 75%, 100% 50%, 100% 100%, 50% 100%',       cx: 81, cy: 81 },
  { house: 8,  clip: '50% 50%, 100% 50%, 75% 75%',                   cx: 75, cy: 58 },
  { house: 9,  clip: '75% 25%, 100% 50%, 50% 50%',                   cx: 75, cy: 42 },
  { house: 10, clip: '50% 0%, 100% 0%, 100% 50%, 75% 25%',           cx: 81, cy: 19 },
  { house: 11, clip: '50% 0%, 75% 25%, 50% 50%',                     cx: 58, cy: 25 },
  { house: 12, clip: '50% 0%, 50% 50%, 25% 25%',                     cx: 42, cy: 25 },
];

// Vedic aspects (drishti): houses aspected from a planet's position.
// All planets aspect the 7th. Mars, Jupiter, Saturn, Rahu, Ketu have special aspects.
export const VEDIC_ASPECTS = {
  Su: [7],
  Mo: [7],
  Ma: [4, 7, 8],
  Me: [7],
  Ju: [5, 7, 9],
  Ve: [7],
  Sa: [3, 7, 10],
  Ra: [5, 7, 9],
  Ke: [5, 7, 9],
};

// Day names for calendar
export const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Month names
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Weekday names (full)
export const WEEKDAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday'
];

// 27 Nakshatras in order (each spans 13°20')
export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
  'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
  'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
  'Vishakha', 'Anuradha', 'Jyeshtha', 'Moola', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];
