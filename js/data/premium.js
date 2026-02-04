// ============================================================
// Gumroad License Verification
// ============================================================

import { savePremiumStatus, isPremium } from './storage.js';

const GUMROAD_PRODUCT_ID = 'ecukiv';
const VERIFY_URL = 'https://api.gumroad.com/v2/licenses/verify';

/**
 * Verify a Gumroad license key.
 * @param {string} licenseKey - The license key from the customer's purchase
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function verifyLicense(licenseKey) {
  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        product_id: GUMROAD_PRODUCT_ID,
        license_key: licenseKey.trim(),
        increment_uses_count: 'true',
      }),
    });

    const data = await response.json();

    if (data.success) {
      savePremiumStatus({
        isPremium: true,
        licenseKey: licenseKey.trim(),
        verifiedAt: Date.now(),
      });
      return { success: true };
    } else {
      return { success: false, error: data.message || 'Invalid license key.' };
    }
  } catch {
    return { success: false, error: 'Network error. Please check your connection and try again.' };
  }
}

/**
 * Check if the user can add another profile.
 * First profile is always free; additional profiles require premium.
 * @param {number} currentCount - Number of existing profiles
 * @returns {boolean}
 */
export function canAddProfile(currentCount) {
  if (currentCount < 1) return true;
  return isPremium();
}
