// ============================================================
// Multi-profile storage with base64 encoding
// ============================================================

const PROFILES_KEY = 'jyotish_profiles';
const ACTIVE_KEY = 'jyotish_active';
const PREMIUM_KEY = 'jyotish_premium';
const OLD_KEY = 'jyotish_birth_data';
const MAX_PROFILES = 5;

// --- Encoding helpers (obfuscate data in localStorage) ---

function encode(obj) {
  const json = JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(json)));
}

function decode(str) {
  try {
    const json = decodeURIComponent(escape(atob(str)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function generateId() {
  const rand = Math.random().toString(36).slice(2, 5);
  return `p_${Date.now()}_${rand}`;
}

// --- Migration ---

/**
 * Migrate v1 single-profile data to v2 multi-profile format.
 * Safe to call multiple times — only runs once.
 */
export function migrateIfNeeded() {
  if (localStorage.getItem(PROFILES_KEY)) return; // already migrated
  const raw = localStorage.getItem(OLD_KEY);
  if (!raw) return; // no old data

  try {
    const oldData = JSON.parse(raw);
    if (oldData && oldData.birthDate) {
      const profile = {
        id: generateId(),
        ...oldData,
        createdAt: Date.now(),
      };
      saveProfiles([profile]);
      setActiveProfileId(profile.id);
      localStorage.removeItem(OLD_KEY);
    }
  } catch {
    // Corrupt old data — ignore
  }
}

// --- Profile CRUD ---

export function loadProfiles() {
  const raw = localStorage.getItem(PROFILES_KEY);
  if (!raw) return [];
  const profiles = decode(raw);
  return Array.isArray(profiles) ? profiles : [];
}

export function saveProfiles(profiles) {
  localStorage.setItem(PROFILES_KEY, encode(profiles));
}

export function getActiveProfileId() {
  return localStorage.getItem(ACTIVE_KEY) || null;
}

export function setActiveProfileId(id) {
  if (id) {
    localStorage.setItem(ACTIVE_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_KEY);
  }
}

export function getActiveProfile() {
  const id = getActiveProfileId();
  if (!id) return null;
  const profiles = loadProfiles();
  return profiles.find(p => p.id === id) || null;
}

/**
 * Add a new profile. Returns the created profile object.
 */
export function addProfile(data) {
  const profiles = loadProfiles();
  if (profiles.length >= MAX_PROFILES) {
    throw new Error(`Maximum of ${MAX_PROFILES} profiles reached.`);
  }
  const profile = {
    id: generateId(),
    ...data,
    createdAt: Date.now(),
  };
  profiles.push(profile);
  saveProfiles(profiles);
  return profile;
}

/**
 * Update an existing profile by id.
 */
export function updateProfile(id, data) {
  const profiles = loadProfiles();
  const idx = profiles.findIndex(p => p.id === id);
  if (idx === -1) return null;
  // Preserve id and createdAt
  profiles[idx] = { ...profiles[idx], ...data, id: profiles[idx].id, createdAt: profiles[idx].createdAt };
  saveProfiles(profiles);
  return profiles[idx];
}

/**
 * Delete a profile by id. Returns remaining profiles.
 */
export function deleteProfile(id) {
  let profiles = loadProfiles();
  profiles = profiles.filter(p => p.id !== id);
  saveProfiles(profiles);
  // If deleted the active profile, switch to first remaining
  if (getActiveProfileId() === id) {
    setActiveProfileId(profiles.length > 0 ? profiles[0].id : null);
  }
  return profiles;
}

// --- Premium ---

export function loadPremiumStatus() {
  try {
    const raw = localStorage.getItem(PREMIUM_KEY);
    return raw ? JSON.parse(raw) : { isPremium: false };
  } catch {
    return { isPremium: false };
  }
}

export function savePremiumStatus(obj) {
  localStorage.setItem(PREMIUM_KEY, JSON.stringify(obj));
}

export function isPremium() {
  return loadPremiumStatus().isPremium === true;
}

// --- Backward compatibility (thin wrappers) ---

export function saveBirthData(data) {
  const id = getActiveProfileId();
  if (id) {
    updateProfile(id, data);
  } else {
    const profile = addProfile(data);
    setActiveProfileId(profile.id);
  }
}

export function loadBirthData() {
  return getActiveProfile();
}

export function hasBirthData() {
  return getActiveProfileId() !== null && getActiveProfile() !== null;
}

export function clearBirthData() {
  const id = getActiveProfileId();
  if (id) deleteProfile(id);
}
