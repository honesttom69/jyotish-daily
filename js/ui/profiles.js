// ============================================================
// Profile List Screen
// ============================================================

import {
  loadProfiles, getActiveProfileId, setActiveProfileId,
  deleteProfile, isPremium,
} from '../data/storage.js';
import { canAddProfile, verifyLicense } from '../data/premium.js';

let callbacks = {};

/**
 * Initialize the profiles screen.
 * @param {Object} cbs - Callback functions from app.js
 * @param {Function} cbs.onSwitch - (profileId) => switch active profile
 * @param {Function} cbs.onEdit - (profileId) => open setup form in edit mode
 * @param {Function} cbs.onAdd - () => open setup form in add mode
 */
export function initProfilesScreen(cbs) {
  callbacks = cbs;

  // Add profile button
  const addBtn = document.getElementById('add-profile-btn');
  if (addBtn) {
    addBtn.addEventListener('click', handleAddProfile);
  }

  // License verification
  const verifyBtn = document.getElementById('verify-license-btn');
  if (verifyBtn) {
    verifyBtn.addEventListener('click', handleVerifyLicense);
  }

  // Allow Enter key in license input
  const licenseInput = document.getElementById('license-key-input');
  if (licenseInput) {
    licenseInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleVerifyLicense();
      }
    });
  }
}

/**
 * Render the profile list. Call this whenever profiles change.
 */
export function renderProfileList() {
  const listEl = document.getElementById('profile-list');
  const badgeEl = document.getElementById('profile-count-badge');
  const gateEl = document.getElementById('premium-gate');
  const addBtn = document.getElementById('add-profile-btn');
  if (!listEl) return;

  const profiles = loadProfiles();
  const activeId = getActiveProfileId();
  const premium = isPremium();

  // Badge
  if (badgeEl) badgeEl.textContent = `${profiles.length} / 5`;

  // Render rows
  listEl.innerHTML = '';
  for (const p of profiles) {
    const row = document.createElement('div');
    row.className = `profile-row${p.id === activeId ? ' active' : ''}`;

    // Avatar
    const avatar = document.createElement('div');
    avatar.className = 'profile-row-avatar';
    avatar.textContent = (p.name || '?')
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    row.appendChild(avatar);

    // Info
    const info = document.createElement('div');
    info.className = 'profile-row-info';
    const name = document.createElement('div');
    name.className = 'profile-row-name';
    name.textContent = p.name || 'Unnamed';
    info.appendChild(name);
    const meta = document.createElement('div');
    meta.className = 'profile-row-meta';
    meta.textContent = formatProfileMeta(p);
    info.appendChild(meta);
    row.appendChild(info);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'profile-row-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'profile-action-btn';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (callbacks.onEdit) callbacks.onEdit(p.id);
    });
    actions.appendChild(editBtn);

    // Don't allow deleting the only profile
    if (profiles.length > 1) {
      const delBtn = document.createElement('button');
      delBtn.className = 'profile-action-btn delete';
      delBtn.textContent = 'Del';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleDeleteProfile(p.id, p.name);
      });
      actions.appendChild(delBtn);
    }

    row.appendChild(actions);

    // Tap row to switch
    row.addEventListener('click', () => {
      if (p.id !== activeId && callbacks.onSwitch) {
        callbacks.onSwitch(p.id);
      }
    });

    listEl.appendChild(row);
  }

  // Show/hide add button and premium gate
  if (addBtn) {
    addBtn.style.display = profiles.length >= 5 ? 'none' : 'block';
  }
  if (gateEl) {
    // Show premium gate if not premium and already have 1+ profiles
    gateEl.style.display = (!premium && profiles.length >= 1) ? 'block' : 'none';
  }
}

function handleAddProfile() {
  const profiles = loadProfiles();
  if (!canAddProfile(profiles.length)) {
    // Scroll to premium gate
    const gateEl = document.getElementById('premium-gate');
    if (gateEl) gateEl.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  if (callbacks.onAdd) callbacks.onAdd();
}

function handleDeleteProfile(profileId, profileName) {
  const confirmed = confirm(`Delete profile "${profileName || 'Unnamed'}"? This cannot be undone.`);
  if (!confirmed) return;
  deleteProfile(profileId);
  renderProfileList();
  // If we deleted the active one, callbacks.onSwitch for the new active
  const activeId = getActiveProfileId();
  if (activeId && callbacks.onSwitch) {
    callbacks.onSwitch(activeId);
  }
}

async function handleVerifyLicense() {
  const input = document.getElementById('license-key-input');
  const statusEl = document.getElementById('license-status');
  const verifyBtn = document.getElementById('verify-license-btn');
  if (!input) return;

  const key = input.value.trim();
  if (!key) {
    if (statusEl) statusEl.textContent = 'Please enter a license key.';
    return;
  }

  if (verifyBtn) {
    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Verifying...';
  }

  const result = await verifyLicense(key);

  if (verifyBtn) {
    verifyBtn.disabled = false;
    verifyBtn.textContent = 'Unlock';
  }

  if (result.success) {
    if (statusEl) {
      statusEl.style.color = 'var(--positive)';
      statusEl.textContent = 'Premium unlocked! You can now add up to 5 profiles.';
    }
    // Re-render to hide the gate
    renderProfileList();
  } else {
    if (statusEl) {
      statusEl.style.color = 'var(--negative)';
      statusEl.textContent = result.error;
    }
  }
}

function formatProfileMeta(profile) {
  const parts = [];
  if (profile.birthDate) {
    const [y, m, d] = profile.birthDate.split('-');
    parts.push(`${m}/${d}/${y}`);
  }
  if (profile.birthPlace) {
    // Shorten place name
    const short = profile.birthPlace.split(',')[0];
    parts.push(short);
  }
  return parts.join(' \u2022 ') || 'No birth data';
}
