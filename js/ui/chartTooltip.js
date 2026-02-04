import { HOUSE_INFO, PLANET_INFO, SIGN_INFO } from '../data/learn.js';
import { HOUSE_DOMAIN } from '../data/interpretations.js';
import { PLANETS } from '../utils/constants.js';

let backdrop = null;

/**
 * Show a bottom-sheet tooltip for a chart cell.
 * @param {number} houseNum - 1-12
 * @param {string} signName - full sign name
 * @param {string[]} natalKeys - natal planet keys in this cell (e.g. ['Ju', 'Mo'])
 * @param {string[]} transitSymbols - transit planet symbols in this cell
 * @param {Object[]} allTransitPositions - full transit positions array for reverse-lookup
 */
export function showChartTooltip(houseNum, signName, natalKeys, transitSymbols, allTransitPositions) {
  dismiss();

  backdrop = document.createElement('div');
  backdrop.className = 'chart-tooltip-backdrop';
  backdrop.addEventListener('click', dismiss);

  const sheet = document.createElement('div');
  sheet.className = 'chart-tooltip';

  // Handle
  const handle = document.createElement('div');
  handle.className = 'chart-tooltip-handle';
  sheet.appendChild(handle);

  // House title
  const houseInfo = HOUSE_INFO[houseNum];
  const h3 = document.createElement('h3');
  h3.textContent = houseInfo ? houseInfo.name : `House ${houseNum}`;
  sheet.appendChild(h3);

  // House domain
  const domainKey = HOUSE_DOMAIN[houseNum];
  if (domainKey || houseInfo) {
    const domainDiv = document.createElement('div');
    domainDiv.className = 'tt-section';
    const domainLabel = document.createElement('div');
    domainLabel.className = 'tt-label';
    domainLabel.textContent = 'House Domain';
    domainDiv.appendChild(domainLabel);
    const domainText = document.createElement('div');
    domainText.className = 'tt-text';
    domainText.textContent = houseInfo ? houseInfo.keywords.join(', ') : (domainKey || '');
    domainDiv.appendChild(domainText);
    sheet.appendChild(domainDiv);
  }

  // Sign info
  const signInfo = SIGN_INFO[signName];
  if (signInfo) {
    const signDiv = document.createElement('div');
    signDiv.className = 'tt-section';
    const signLabel = document.createElement('div');
    signLabel.className = 'tt-label';
    signLabel.textContent = 'Sign';
    signDiv.appendChild(signLabel);
    const signText = document.createElement('div');
    signText.className = 'tt-text';
    signText.textContent = `${signInfo.symbol} ${signName} \u2022 ${signInfo.element} \u2022 ${signInfo.quality} \u2022 Ruler: ${signInfo.ruler}`;
    signDiv.appendChild(signText);
    sheet.appendChild(signDiv);
  }

  // Natal planets
  if (natalKeys && natalKeys.length > 0) {
    const natalDiv = document.createElement('div');
    natalDiv.className = 'tt-section';
    const natalLabel = document.createElement('div');
    natalLabel.className = 'tt-label';
    natalLabel.textContent = 'Natal Planets';
    natalDiv.appendChild(natalLabel);

    for (const key of natalKeys) {
      if (key === 'As') continue; // Skip ascendant marker
      const pInfo = PLANET_INFO[key];
      if (pInfo) {
        const pDiv = document.createElement('div');
        pDiv.className = 'tt-planet';
        pDiv.textContent = `${PLANETS[key]?.symbol || ''} ${pInfo.name} \u2014 ${pInfo.signifies.split(',').slice(0, 3).join(',')}`;
        natalDiv.appendChild(pDiv);
      }
    }
    sheet.appendChild(natalDiv);
  }

  // Transit planets
  if (transitSymbols && transitSymbols.length > 0) {
    const transitDiv = document.createElement('div');
    transitDiv.className = 'tt-section';
    const transitLabel = document.createElement('div');
    transitLabel.className = 'tt-label';
    transitLabel.textContent = 'Transiting Planets';
    transitDiv.appendChild(transitLabel);

    // Reverse-lookup symbol to key
    const symbolToKey = {};
    for (const [k, v] of Object.entries(PLANETS)) {
      symbolToKey[v.symbol] = k;
    }

    for (const sym of transitSymbols) {
      const key = symbolToKey[sym] || sym;
      const pInfo = PLANET_INFO[key];
      if (pInfo) {
        const pDiv = document.createElement('div');
        pDiv.className = 'tt-planet';
        pDiv.textContent = `${sym} ${pInfo.name} transiting here`;
        transitDiv.appendChild(pDiv);
      }
    }
    sheet.appendChild(transitDiv);
  }

  backdrop.appendChild(sheet);
  document.body.appendChild(backdrop);
}

export function dismiss() {
  if (backdrop) {
    backdrop.remove();
    backdrop = null;
  }
}
