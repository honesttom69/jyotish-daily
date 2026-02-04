import { showScreen } from './ui/screens.js';
import { initDateSelector, onDateChange, getSelectedDate } from './ui/dateSelector.js';
import { renderSouthIndianChart, renderNorthIndianChart, initChartToggle, getChartStyle, onChartStyleChange } from './ui/chart.js';
import { initCalendar, setQualityFunction, refreshCalendar, onDaySelect } from './ui/calendar.js';
import {
  migrateIfNeeded, loadProfiles, getActiveProfile, getActiveProfileId,
  setActiveProfileId, addProfile, updateProfile, saveBirthData, loadBirthData, hasBirthData,
} from './data/storage.js';
import { PLANETS } from './utils/constants.js';
import { getPlanetPositions, groupBySign } from './calc/planets.js';
import { calculateAscendant, getHouseNumber } from './calc/houses.js';
import { calculateTransits, calculateTransitsWithTiming, getDayQuality } from './calc/transits.js';
import { clearTimingCaches } from './calc/transitTiming.js';
import { geocodePlace } from './calc/geocoding.js';
import { populateTimezoneSelect, localToUtc, lookupTimezone } from './calc/timezone.js';
import { calculateDashas, getCurrentDasha } from './calc/dasha.js';
import { renderDashaScreen } from './ui/dashas.js';
import { TRANSIT_HOUSE } from './data/interpretations.js';
import { getConjunctionText, getAspectText, synthesizeDailyGuidance, synthesizeChartOverview } from './synthesis.js';
import { initLearnScreen } from './ui/learn.js';
import { showChartTooltip } from './ui/chartTooltip.js';
import { initProfilesScreen, renderProfileList } from './ui/profiles.js';

// In-memory natal chart (calculated once from birth data)
let natalChart = null;

// Track whether setup form is editing an existing profile or adding new
let editingProfileId = null;

function initApp() {
  // Migrate v1 → v2 storage (single profile → multi-profile)
  migrateIfNeeded();

  // Wire up navigation
  document.querySelectorAll('[data-screen]').forEach(el => {
    el.addEventListener('click', () => showScreen(el.dataset.screen));
  });

  // Date selector
  initDateSelector();
  onDateChange(date => updateForDate(date));

  // Chart toggle
  initChartToggle();
  onChartStyleChange(() => updateForDate(getSelectedDate()));

  // Learn screen
  initLearnScreen();

  // Chart tooltip (event delegation)
  const chartGrid = document.querySelector('.chart-grid');
  if (chartGrid) {
    chartGrid.addEventListener('click', handleChartClick);
  }

  // Calendar
  initCalendar();
  onDaySelect(({ year, month, day }) => {
    const date = new Date(year, month, day, 12, 0, 0);
    updateCalendarDetail(date);
  });

  // Manual coords toggle
  const manualCheck = document.getElementById('input-manual-coords');
  const coordsFields = document.getElementById('coords-fields');
  if (manualCheck && coordsFields) {
    manualCheck.addEventListener('change', () => {
      coordsFields.style.display = manualCheck.checked ? 'grid' : 'none';
    });
  }

  // Timezone selector
  const tzSelect = document.getElementById('input-timezone');
  if (tzSelect) {
    const saved = loadBirthData();
    populateTimezoneSelect(tzSelect, saved?.timezone || null);
  }

  // Profile card → navigate to profiles screen
  const profileCard = document.querySelector('.profile-card');
  if (profileCard) {
    profileCard.style.cursor = 'pointer';
    profileCard.addEventListener('click', () => {
      renderProfileList();
      showScreen('profiles');
    });
  }

  // Profiles screen
  initProfilesScreen({
    onSwitch: (profileId) => {
      switchProfile(profileId);
      showScreen('main');
    },
    onEdit: (profileId) => {
      startSetupForm('edit', profileId);
    },
    onAdd: () => {
      startSetupForm('add');
    },
  });

  // Setup form
  initSetupForm();

  // Setup back button
  const setupBack = document.getElementById('setup-back');
  if (setupBack) {
    setupBack.addEventListener('click', () => {
      renderProfileList();
      showScreen('profiles');
    });
  }

  // Load existing data and calculate
  const activeProfile = getActiveProfile();
  if (activeProfile && activeProfile.lat && activeProfile.lng) {
    calculateNatalChart(activeProfile);
    updateForDate(new Date());
    showScreen('main');
  } else if (loadProfiles().length > 0) {
    // Profiles exist but active one is incomplete
    renderProfileList();
    showScreen('profiles');
  } else {
    showScreen('setup');
  }
}

/**
 * Open the setup form in add or edit mode.
 */
function startSetupForm(mode, profileId) {
  if (mode === 'edit' && profileId) {
    editingProfileId = profileId;
    // Pre-fill form with this profile's data
    const profiles = loadProfiles();
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      prefillForm(profile);
    }
  } else {
    editingProfileId = null;
    clearForm();
  }
  showScreen('setup');
}

function prefillForm(data) {
  setFormValue('input-name', data.name || '');
  setFormValue('input-date', data.birthDate || '');
  setFormValue('input-time', data.birthTime || '');
  setFormValue('input-place', data.birthPlace || '');
  setCheckbox('input-time-uncertain', data.timeUncertain);
  if (data.lat && data.lng) {
    setFormValue('input-lat', data.lat);
    setFormValue('input-lng', data.lng);
  } else {
    setFormValue('input-lat', '');
    setFormValue('input-lng', '');
  }
  // Update timezone selector
  const tzSelect = document.getElementById('input-timezone');
  if (tzSelect) {
    populateTimezoneSelect(tzSelect, data.timezone || null);
  }
}

function clearForm() {
  setFormValue('input-name', '');
  setFormValue('input-date', '');
  setFormValue('input-time', '');
  setFormValue('input-place', '');
  setCheckbox('input-time-uncertain', false);
  setFormValue('input-lat', '');
  setFormValue('input-lng', '');
  const statusEl = document.getElementById('geocode-status');
  if (statusEl) statusEl.textContent = '';
  const tzSelect = document.getElementById('input-timezone');
  if (tzSelect) populateTimezoneSelect(tzSelect, null);
}

/**
 * Switch to a different profile.
 */
function switchProfile(profileId) {
  setActiveProfileId(profileId);
  const profile = getActiveProfile();
  if (profile && profile.lat && profile.lng) {
    calculateNatalChart(profile);
    updateForDate(getSelectedDate());
  }
}

function initSetupForm() {
  const form = document.getElementById('setup-form');
  if (!form) return;

  // Pre-fill from active profile (initial load)
  const saved = loadBirthData();
  if (saved) {
    prefillForm(saved);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    const statusEl = document.getElementById('geocode-status');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Calculating...';

    const data = {
      name: document.getElementById('input-name').value,
      birthDate: document.getElementById('input-date').value,
      birthTime: document.getElementById('input-time').value,
      birthPlace: document.getElementById('input-place').value,
      timeUncertain: document.getElementById('input-time-uncertain').checked,
      timezone: document.getElementById('input-timezone').value,
      lat: null,
      lng: null,
    };

    // Validate required fields
    if (!data.name.trim() || !data.birthDate || !data.birthTime) {
      if (statusEl) statusEl.textContent = 'Please fill in name, birth date, and birth time.';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Calculate My Chart';
      return;
    }

    // Get coordinates
    const manualCoords = document.getElementById('input-manual-coords').checked;
    if (manualCoords) {
      data.lat = parseFloat(document.getElementById('input-lat').value);
      data.lng = parseFloat(document.getElementById('input-lng').value);
    }

    if (data.lat === null || data.lng === null || isNaN(data.lat) || isNaN(data.lng)) {
      // Try geocoding
      if (statusEl) statusEl.textContent = 'Looking up location...';
      const geo = await geocodePlace(data.birthPlace);
      if (geo) {
        data.lat = geo.lat;
        data.lng = geo.lng;
        if (statusEl) statusEl.textContent = `Found: ${geo.displayName}`;

        // Try to auto-detect timezone from coordinates
        const detectedTz = await lookupTimezone(data.lat, data.lng);
        if (detectedTz) {
          data.timezone = detectedTz;
          const tzSelect = document.getElementById('input-timezone');
          if (tzSelect) tzSelect.value = detectedTz;
        }
      } else {
        if (statusEl) statusEl.textContent = 'Could not find location. Please enter coordinates manually.';
        const manualCheck = document.getElementById('input-manual-coords');
        const coordsFields = document.getElementById('coords-fields');
        if (manualCheck) manualCheck.checked = true;
        if (coordsFields) coordsFields.style.display = 'grid';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Calculate My Chart';
        return;
      }
    }

    // Save: edit existing or add new
    if (editingProfileId) {
      updateProfile(editingProfileId, data);
      // If editing the active profile, recalculate
      if (editingProfileId === getActiveProfileId()) {
        calculateNatalChart(data);
        updateForDate(new Date());
      }
    } else {
      const newProfile = addProfile(data);
      setActiveProfileId(newProfile.id);
      calculateNatalChart(data);
      updateForDate(new Date());
    }

    editingProfileId = null;
    showScreen('main');

    submitBtn.disabled = false;
    submitBtn.textContent = 'Calculate My Chart';
  });
}

/**
 * Calculate the natal chart from birth data and store in memory.
 */
function calculateNatalChart(data) {
  clearTimingCaches();
  const [year, month, day] = data.birthDate.split('-').map(Number);
  const [hours, minutes] = data.birthTime.split(':').map(Number);

  // Convert local birth time to UTC using proper timezone
  const birthDateUTC = localToUtc(data.timezone, year, month, day, hours, minutes);

  // Calculate ascendant
  const asc = calculateAscendant(birthDateUTC, data.lat, data.lng);

  // Calculate natal planet positions
  const planets = getPlanetPositions(birthDateUTC);

  // Calculate Vimshottari Dashas from Moon position
  const moon = planets.find(p => p.key === 'Mo');
  const dashas = moon ? calculateDashas(moon.longitude, birthDateUTC) : null;

  natalChart = {
    ascendantSign: asc.ascendantSign,
    ascendantDegree: asc.ascendantDegree,
    ascendantMinute: asc.ascendantMinute,
    ascendantNakshatra: asc.ascendantNakshatra,
    planets,
    birthData: data,
    dashas,
  };

  // Update profile card (includes current dasha)
  updateProfileCard();

  // Render dasha screen
  if (dashas) {
    renderDashaScreen(dashas, new Date());
  }

  // Set quality function for calendar
  setQualityFunction((y, m, d) => {
    const date = new Date(y, m, d, 12, 0, 0);
    const transitPositions = getPlanetPositions(date);
    return getDayQuality(natalChart, transitPositions);
  });
  refreshCalendar();
}

/**
 * Update all UI elements for a given date (transits, chart, insight).
 */
function updateForDate(date) {
  if (!natalChart) return;

  const transitPositions = getPlanetPositions(date);
  const transits = calculateTransitsWithTiming(natalChart, transitPositions, date);

  // Update chart
  const chartGrid = document.querySelector('.chart-grid');
  if (chartGrid) {
    const natalGrouped = groupBySign(natalChart.planets, false);
    // Add 'As' to the ascendant sign
    if (!natalGrouped[natalChart.ascendantSign]) {
      natalGrouped[natalChart.ascendantSign] = [];
    }
    natalGrouped[natalChart.ascendantSign].unshift('As');

    const transitGrouped = groupBySign(transitPositions, true);

    const chartData = {
      ascendantSign: natalChart.ascendantSign,
      natalPlanets: natalGrouped,
      transitPlanets: transitGrouped,
    };

    if (getChartStyle() === 'north') {
      renderNorthIndianChart(chartGrid, chartData);
    } else {
      renderSouthIndianChart(chartGrid, chartData);
    }
  }

  // Update transit list
  updateTransitList(transits);

  // Update insight
  updateInsight(transits);
}

/**
 * Render the transit list in the UI.
 */
function updateTransitList(transits) {
  const listEl = document.querySelector('.transit-list');
  const badgeEl = document.querySelector('.transit-section .section-badge');
  if (!listEl) return;

  const majorTransits = transits.filter(t => t.planet !== 'Mo');

  if (badgeEl) badgeEl.textContent = `${majorTransits.length} active`;

  listEl.innerHTML = '';

  for (const t of majorTransits) {
    const item = document.createElement('div');
    item.className = 'transit-item';

    const icon = document.createElement('div');
    icon.className = `transit-icon ${t.quality}`;
    icon.textContent = t.planetSymbol;
    item.appendChild(icon);

    const content = document.createElement('div');
    content.className = 'transit-content';

    const title = document.createElement('div');
    title.className = 'transit-title';

    const ordinal = getOrdinalSuffix(t.house);
    title.innerHTML = `${t.planetName} &rarr; ${t.house}${ordinal} House`;

    for (const conj of t.conjunctions) {
      const tag = document.createElement('span');
      const applying = conj.isApplying !== undefined ? conj.isApplying : true;
      tag.className = `transit-tag conjunction ${applying ? 'applying' : 'separating'}`;
      if (applying && conj.exactFormatted) {
        tag.textContent = `\u260C ${conj.natalPlanetName} \u00B7 exact ${conj.exactFormatted}`;
      } else {
        tag.textContent = `\u260C ${conj.natalPlanetName} \u00B7 separating`;
      }
      title.appendChild(document.createTextNode(' '));
      title.appendChild(tag);
    }

    for (const asp of t.aspects) {
      const tag = document.createElement('span');
      tag.className = 'transit-tag aspect';
      tag.textContent = `\u26B9 ${asp.natalPlanetName} \u00B7 ${asp.aspectType} asp`;
      title.appendChild(document.createTextNode(' '));
      title.appendChild(tag);
    }

    content.appendChild(title);

    const detail = document.createElement('div');
    detail.className = 'transit-detail';
    const houseKey = `${t.planet}_${t.house}`;
    const houseInterp = TRANSIT_HOUSE[houseKey];
    let detailText = houseInterp ? houseInterp.text : t.description;
    if (t.conjunctions.length > 0) {
      const conjText = getConjunctionText(t.planet, t.conjunctions[0].natalPlanet);
      if (conjText) {
        detailText += ' ' + conjText;
      }
    }
    if (t.aspects.length > 0 && t.conjunctions.length === 0) {
      const aspText = getAspectText(t.planet, t.aspects[0].natalPlanet);
      if (aspText) {
        detailText += ' ' + aspText;
      }
    }
    detail.textContent = detailText;
    content.appendChild(detail);

    if (t.timing) {
      const timingDiv = document.createElement('div');
      timingDiv.className = 'transit-timing';

      const bar = document.createElement('div');
      bar.className = 'transit-progress-bar';
      const fill = document.createElement('div');
      fill.className = 'transit-progress-fill';
      fill.style.width = `${t.timing.progressPct.toFixed(0)}%`;
      bar.appendChild(fill);
      timingDiv.appendChild(bar);

      const meta = document.createElement('div');
      meta.className = 'transit-timing-text';
      const dates = document.createElement('span');
      dates.textContent = `${t.timing.entryFormatted} \u2192 ${t.timing.exitFormatted}`;
      const remaining = document.createElement('span');
      remaining.className = 'transit-remaining';
      remaining.textContent = `${t.timing.daysRemaining}d left`;
      meta.appendChild(dates);
      meta.appendChild(remaining);
      timingDiv.appendChild(meta);

      content.appendChild(timingDiv);
    }

    item.appendChild(content);

    const arrow = document.createElement('div');
    arrow.className = 'transit-arrow';
    arrow.innerHTML = '&rsaquo;';
    item.appendChild(arrow);

    listEl.appendChild(item);
  }
}

/**
 * Update the daily insight section.
 */
function updateInsight(transits) {
  const textEl = document.querySelector('.insight-text');
  if (!textEl || !natalChart) return;

  const currentDasha = natalChart.dashas
    ? getCurrentDasha(natalChart.dashas, getSelectedDate())
    : null;

  textEl.textContent = synthesizeDailyGuidance(transits, currentDasha);
}

/**
 * Update the profile card with natal chart data.
 */
function updateProfileCard() {
  if (!natalChart) return;
  const data = natalChart.birthData;

  const nameEl = document.querySelector('.profile-name');
  const avatarEl = document.querySelector('.profile-avatar');
  const detailsEl = document.querySelector('.profile-details');
  const dashaEl = document.querySelector('.profile-dasha .period');

  if (nameEl) nameEl.textContent = data.name || 'Your Name';

  if (avatarEl && data.name) {
    avatarEl.textContent = data.name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  if (detailsEl) {
    const moon = natalChart.planets.find(p => p.key === 'Mo');
    const moonNak = moon ? moon.nakshatra : '';
    detailsEl.textContent =
      `${natalChart.ascendantSign} Asc \u2022 ${moon?.sign || ''} Moon \u2022 ${moonNak} \u263D`;
  }

  // Update current dasha display
  if (dashaEl && natalChart.dashas) {
    const current = getCurrentDasha(natalChart.dashas, new Date());
    if (current) {
      dashaEl.textContent = `${current.maha.planetName}-${current.antar.planetName}`;
    }
  }

  // Update chart overview
  updateChartOverview();
}

/**
 * Render the chart overview section on the main screen.
 */
function updateChartOverview() {
  const container = document.getElementById('chart-overview');
  const summaryEl = document.getElementById('chart-overview-summary');
  const detailsEl = document.getElementById('chart-overview-details');
  const toggleBtn = document.getElementById('chart-overview-toggle');
  if (!container || !summaryEl || !natalChart) return;

  const overview = synthesizeChartOverview(natalChart, getHouseNumber);
  container.style.display = 'block';
  summaryEl.textContent = overview.summary;

  // Render detail highlights
  if (detailsEl) {
    detailsEl.innerHTML = '';
    for (const h of overview.highlights) {
      const item = document.createElement('div');
      item.className = 'chart-overview-item';

      const label = document.createElement('div');
      label.className = 'chart-overview-label';
      label.textContent = h.label;
      item.appendChild(label);

      const text = document.createElement('div');
      text.className = 'chart-overview-text';
      text.textContent = h.text;
      item.appendChild(text);

      detailsEl.appendChild(item);
    }
  }

  // Toggle handler (wire once)
  if (toggleBtn && !toggleBtn._wired) {
    toggleBtn._wired = true;
    toggleBtn.addEventListener('click', () => {
      const isOpen = detailsEl.style.display !== 'none';
      detailsEl.style.display = isOpen ? 'none' : 'block';
      toggleBtn.innerHTML = isOpen ? 'Details &darr;' : 'Hide &uarr;';
    });
  }
}

/**
 * Update the calendar selected day detail panel.
 */
function updateCalendarDetail(date) {
  if (!natalChart) return;
  const labelEl = document.getElementById('cal-selected-label');
  const detailEl = document.getElementById('cal-selected-detail');
  if (!labelEl || !detailEl) return;

  const options = { month: 'long', day: 'numeric' };
  labelEl.textContent = date.toLocaleDateString('en-US', options);

  const transitPositions = getPlanetPositions(date);
  const transits = calculateTransits(natalChart, transitPositions);
  const quality = getDayQuality(natalChart, transitPositions);

  const currentDasha = natalChart.dashas
    ? getCurrentDasha(natalChart.dashas, date)
    : null;

  const synthesis = synthesizeDailyGuidance(transits, currentDasha);
  detailEl.textContent = `${capitalize(quality)} energy. ${synthesis}`;
}

/**
 * Handle click on a chart cell to show tooltip.
 */
function handleChartClick(e) {
  // Find the clicked cell (chart-cell for South, ni-house for North)
  const cell = e.target.closest('[data-house]');
  if (!cell) return;

  const houseNum = parseInt(cell.dataset.house, 10);
  const signName = cell.dataset.sign;
  if (!houseNum || !signName) return;

  // Get natal and transit planet lists from the cell's rendered content
  const natalSpan = cell.querySelector('.natal');
  const transitSpan = cell.querySelector('.transit');
  const natalKeys = natalSpan ? natalSpan.textContent.split(' ').filter(Boolean) : [];
  const transitSymbols = transitSpan ? transitSpan.textContent.split(' ').filter(Boolean) : [];

  showChartTooltip(houseNum, signName, natalKeys, transitSymbols);
}

function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function setFormValue(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) el.value = value;
}

function setCheckbox(id, checked) {
  const el = document.getElementById(id);
  if (el) el.checked = !!checked;
}

document.addEventListener('DOMContentLoaded', initApp);

// Register service worker for PWA installability and offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}
