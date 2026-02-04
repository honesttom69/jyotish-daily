import { PLANETS } from '../utils/constants.js';
import { getCurrentDasha } from '../calc/dasha.js';
import { MAHA_DASHA } from '../data/interpretations.js';
import { getDashaText } from '../synthesis.js';

/**
 * Render the Dasha screen with timeline, current period, and expandable sub-periods.
 *
 * @param {{ mahaDashas: Array }} dashas - Full dasha timeline
 * @param {Date} currentDate - The current date
 */
export function renderDashaScreen(dashas, currentDate) {
  const container = document.getElementById('dasha-container');
  if (!container || !dashas) return;

  const current = getCurrentDasha(dashas, currentDate);
  container.innerHTML = '';

  // Current period card
  if (current) {
    container.appendChild(buildCurrentCard(current, currentDate));
  }

  // Timeline heading
  const heading = document.createElement('div');
  heading.className = 'dasha-timeline-heading';
  heading.textContent = 'Maha Dasha Timeline';
  container.appendChild(heading);

  // Timeline list
  const timeline = document.createElement('div');
  timeline.className = 'dasha-timeline';

  for (let i = 0; i < dashas.mahaDashas.length; i++) {
    const maha = dashas.mahaDashas[i];
    const isActive = current && current.mahaIndex === i;
    const isPast = currentDate.getTime() >= maha.endDate.getTime();
    const item = buildMahaItem(maha, i, isActive, isPast, current);
    timeline.appendChild(item);
  }

  container.appendChild(timeline);
}

function buildCurrentCard(current, currentDate) {
  const card = document.createElement('div');
  card.className = 'dasha-current-card';

  // Progress through Maha Dasha
  const mahaTotal = current.maha.endDate.getTime() - current.maha.startDate.getTime();
  const mahaElapsed = currentDate.getTime() - current.maha.startDate.getTime();
  const mahaProgress = Math.min(1, Math.max(0, mahaElapsed / mahaTotal));

  // Progress through Antar Dasha
  const antarTotal = current.antar.endDate.getTime() - current.antar.startDate.getTime();
  const antarElapsed = currentDate.getTime() - current.antar.startDate.getTime();
  const antarProgress = Math.min(1, Math.max(0, antarElapsed / antarTotal));

  const mahaSymbol = PLANETS[current.maha.planet]?.symbol || '';
  const antarSymbol = PLANETS[current.antar.planet]?.symbol || '';

  card.innerHTML = `
    <div class="dasha-current-label">Current Period</div>
    <div class="dasha-current-maha">
      <span class="dasha-current-symbol">${mahaSymbol}</span>
      <span class="dasha-current-name">${current.maha.planetName} Maha Dasha</span>
    </div>
    <div class="dasha-current-dates">${formatDate(current.maha.startDate)} — ${formatDate(current.maha.endDate)}</div>
    <div class="dasha-progress-bar">
      <div class="dasha-progress-fill" style="width: ${(mahaProgress * 100).toFixed(1)}%"></div>
    </div>
    <div class="dasha-current-antar">
      <span class="dasha-antar-label">Sub-period:</span>
      <span class="dasha-antar-symbol">${antarSymbol}</span>
      <span class="dasha-antar-name">${current.antar.planetName}</span>
      <span class="dasha-antar-dates">${formatDate(current.antar.startDate)} — ${formatDate(current.antar.endDate)}</span>
    </div>
    <div class="dasha-progress-bar dasha-progress-bar-sm">
      <div class="dasha-progress-fill antar" style="width: ${(antarProgress * 100).toFixed(1)}%"></div>
    </div>
    <div class="dasha-current-interp">
      ${getDashaText(current.maha.planet, current.antar.planet)}
    </div>
  `;

  return card;
}

function buildMahaItem(maha, index, isActive, isPast, current) {
  const item = document.createElement('div');
  let cls = 'dasha-maha-item';
  if (isActive) cls += ' active';
  if (isPast) cls += ' past';
  item.className = cls;

  const symbol = PLANETS[maha.planet]?.symbol || '';

  const header = document.createElement('div');
  header.className = 'dasha-maha-header';
  header.innerHTML = `
    <div class="dasha-maha-left">
      <span class="dasha-maha-symbol">${symbol}</span>
      <span class="dasha-maha-name">${maha.planetName}</span>
      <span class="dasha-maha-years">${maha.years}y</span>
    </div>
    <div class="dasha-maha-right">
      <span class="dasha-maha-dates">${formatDate(maha.startDate)} — ${formatDate(maha.endDate)}</span>
      <span class="dasha-maha-chevron">&#x25BC;</span>
    </div>
  `;

  const antarContainer = document.createElement('div');
  antarContainer.className = 'dasha-antar-container';
  if (isActive) antarContainer.classList.add('expanded');

  for (let ai = 0; ai < maha.antarDashas.length; ai++) {
    const antar = maha.antarDashas[ai];
    const antarIsActive = isActive && current && current.antarIndex === ai;
    const antarIsPast = new Date().getTime() >= antar.endDate.getTime();

    const antarEl = document.createElement('div');
    let antarCls = 'dasha-antar-item';
    if (antarIsActive) antarCls += ' active';
    if (antarIsPast) antarCls += ' past';
    antarEl.className = antarCls;

    const antarSym = PLANETS[antar.planet]?.symbol || '';
    antarEl.innerHTML = `
      <span class="dasha-antar-sym">${antarSym}</span>
      <span class="dasha-antar-nm">${antar.planetName}</span>
      <span class="dasha-antar-dt">${formatDate(antar.startDate)} — ${formatDate(antar.endDate)}</span>
    `;
    antarContainer.appendChild(antarEl);
  }

  item.appendChild(header);

  const mahaDesc = MAHA_DASHA[maha.planet];
  if (mahaDesc) {
    const descEl = document.createElement('div');
    descEl.className = 'dasha-maha-desc';
    descEl.textContent = mahaDesc.text;
    item.appendChild(descEl);
  }

  item.appendChild(antarContainer);

  // Toggle expand/collapse on header click
  header.addEventListener('click', () => {
    const isExpanded = antarContainer.classList.contains('expanded');
    // Collapse all
    document.querySelectorAll('.dasha-antar-container.expanded').forEach(el => {
      el.classList.remove('expanded');
      el.parentElement.querySelector('.dasha-maha-chevron').innerHTML = '&#x25BC;';
    });
    // Expand this one if it was collapsed
    if (!isExpanded) {
      antarContainer.classList.add('expanded');
      header.querySelector('.dasha-maha-chevron').innerHTML = '&#x25B2;';
    }
  });

  // Set chevron state for initially expanded
  if (isActive) {
    header.querySelector('.dasha-maha-chevron').innerHTML = '&#x25B2;';
  }

  return item;
}

function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}
