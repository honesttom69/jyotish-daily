const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

/**
 * Geocode a place name to latitude/longitude using OpenStreetMap Nominatim.
 * @param {string} placeString - e.g. "Pottsville, Pennsylvania, USA"
 * @returns {Promise<{ lat: number, lng: number, displayName: string } | null>}
 */
export async function geocodePlace(placeString) {
  if (!placeString || !placeString.trim()) return null;

  const params = new URLSearchParams({
    q: placeString.trim(),
    format: 'json',
    limit: '1',
  });

  try {
    const response = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: {
        'User-Agent': 'JyotishDaily/1.0',
      },
    });

    if (!response.ok) return null;

    const results = await response.json();
    if (!results || results.length === 0) return null;

    return {
      lat: parseFloat(results[0].lat),
      lng: parseFloat(results[0].lon),
      displayName: results[0].display_name,
    };
  } catch {
    return null;
  }
}
