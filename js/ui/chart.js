import { SIGNS, SOUTH_INDIAN_LAYOUT, NORTH_INDIAN_HOUSES } from '../utils/constants.js';

let currentStyle = 'south';
let styleChangeCallback = null;

/**
 * Render the South Indian style chart into the given container.
 * @param {HTMLElement} container - the .chart-grid element
 * @param {Object} chartData - { ascendantSign, natalPlanets, transitPlanets }
 */
export function renderSouthIndianChart(container, chartData) {
  container.innerHTML = '';
  container.className = 'chart-grid';

  const ascIndex = SIGNS.indexOf(chartData.ascendantSign);

  SOUTH_INDIAN_LAYOUT.forEach(sign => {
    const cell = document.createElement('div');
    cell.className = 'chart-cell';

    if (sign === null) {
      cell.className = 'chart-cell empty';
      container.appendChild(cell);
      return;
    }

    const signIndex = SIGNS.indexOf(sign);
    const houseNum = ((signIndex - ascIndex + 12) % 12) + 1;

    cell.dataset.house = houseNum;
    cell.dataset.sign = sign;

    // Sign label
    const signLabel = document.createElement('span');
    signLabel.className = 'sign';
    signLabel.textContent = sign;
    cell.appendChild(signLabel);

    // House number
    const houseLabel = document.createElement('span');
    houseLabel.className = 'house-num';
    houseLabel.textContent = houseNum;
    cell.appendChild(houseLabel);

    // Planets
    const planetsDiv = document.createElement('div');
    planetsDiv.className = 'planets';

    const natal = chartData.natalPlanets[sign];
    if (natal && natal.length > 0) {
      const natalSpan = document.createElement('span');
      natalSpan.className = 'natal';
      natalSpan.textContent = natal.join(' ');
      planetsDiv.appendChild(natalSpan);
    }

    const transit = chartData.transitPlanets[sign];
    if (transit && transit.length > 0) {
      if (natal && natal.length > 0) {
        planetsDiv.appendChild(document.createElement('br'));
      }
      const transitSpan = document.createElement('span');
      transitSpan.className = 'transit';
      transitSpan.textContent = transit.join(' ');
      planetsDiv.appendChild(transitSpan);
    }

    cell.appendChild(planetsDiv);
    container.appendChild(cell);
  });
}

/**
 * Render the North Indian style chart into the given container.
 * Diamond layout: houses are fixed in position, signs rotate based on ascendant.
 * @param {HTMLElement} container
 * @param {Object} chartData - { ascendantSign, natalPlanets, transitPlanets }
 */
export function renderNorthIndianChart(container, chartData) {
  container.innerHTML = '';
  container.className = 'chart-north';

  const ascIndex = SIGNS.indexOf(chartData.ascendantSign);

  // Create house divs — each is full-size with clip-path
  for (const h of NORTH_INDIAN_HOUSES) {
    const sign = SIGNS[(ascIndex + h.house - 1) % 12];

    const div = document.createElement('div');
    div.className = 'ni-house';
    div.dataset.house = h.house;
    div.dataset.sign = sign;
    div.style.clipPath = `polygon(${h.clip})`;

    // Inner content positioned at centroid
    const inner = document.createElement('div');
    inner.className = 'ni-house-inner';
    inner.style.left = h.cx + '%';
    inner.style.top = h.cy + '%';

    // Sign abbreviation
    const signLabel = document.createElement('span');
    signLabel.className = 'sign';
    signLabel.textContent = sign.slice(0, 3);
    inner.appendChild(signLabel);

    // Planets
    const planetsDiv = document.createElement('div');
    planetsDiv.className = 'planets';

    const natal = chartData.natalPlanets[sign];
    if (natal && natal.length > 0) {
      const natalSpan = document.createElement('span');
      natalSpan.className = 'natal';
      natalSpan.textContent = natal.join(' ');
      planetsDiv.appendChild(natalSpan);
    }

    const transit = chartData.transitPlanets[sign];
    if (transit && transit.length > 0) {
      if (natal && natal.length > 0) {
        planetsDiv.appendChild(document.createTextNode(' '));
      }
      const transitSpan = document.createElement('span');
      transitSpan.className = 'transit';
      transitSpan.textContent = transit.join(' ');
      planetsDiv.appendChild(transitSpan);
    }

    inner.appendChild(planetsDiv);
    div.appendChild(inner);
    container.appendChild(div);
  }

  // SVG overlay for diamond lines
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.classList.add('ni-lines');

  const strokeColor = 'var(--border)';
  const strokeWidth = '0.5';

  // Outer border
  const rect = document.createElementNS(svgNS, 'rect');
  rect.setAttribute('x', '0');
  rect.setAttribute('y', '0');
  rect.setAttribute('width', '100');
  rect.setAttribute('height', '100');
  rect.setAttribute('fill', 'none');
  rect.setAttribute('stroke', strokeColor);
  rect.setAttribute('stroke-width', strokeWidth);
  svg.appendChild(rect);

  // Diamond
  const diamond = document.createElementNS(svgNS, 'polygon');
  diamond.setAttribute('points', '50,0 100,50 50,100 0,50');
  diamond.setAttribute('fill', 'none');
  diamond.setAttribute('stroke', strokeColor);
  diamond.setAttribute('stroke-width', strokeWidth);
  svg.appendChild(diamond);

  // Corner diagonals (X through center)
  const lines = [
    [0, 0, 50, 50],
    [100, 0, 50, 50],
    [0, 100, 50, 50],
    [100, 100, 50, 50],
  ];
  for (const [x1, y1, x2, y2] of lines) {
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', strokeColor);
    line.setAttribute('stroke-width', strokeWidth);
    svg.appendChild(line);
  }

  container.appendChild(svg);
}

/**
 * Get current chart style.
 * @returns {'south' | 'north'}
 */
export function getChartStyle() {
  return currentStyle;
}

/**
 * Register callback for chart style changes.
 * @param {Function} callback
 */
export function onChartStyleChange(callback) {
  styleChangeCallback = callback;
}

/**
 * Initialize chart toggle buttons (South/North).
 */
export function initChartToggle() {
  const toggleBtns = document.querySelectorAll('.chart-toggle .toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const newStyle = btn.dataset.style;
      if (newStyle === currentStyle) return;

      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStyle = newStyle;

      if (styleChangeCallback) {
        styleChangeCallback(currentStyle);
      }
    });
  });
}
