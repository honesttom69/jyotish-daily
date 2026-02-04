import { DAY_NAMES, MONTH_NAMES } from '../utils/constants.js';

let displayMonth; // 0-indexed
let displayYear;
let selectedDay = null;
let onDaySelectCallback = null;
let qualityFunction = null;

/**
 * Register a callback for day selection.
 * @param {function} callback - receives { year, month, day }
 */
export function onDaySelect(callback) {
  onDaySelectCallback = callback;
}

/**
 * Set the quality scoring function for calendar dots.
 * @param {function} fn - receives (year, month, day) → 'good' | 'mixed' | 'challenging'
 */
export function setQualityFunction(fn) {
  qualityFunction = fn;
}

/**
 * Re-render the calendar (call after quality function changes).
 */
export function refreshCalendar() {
  renderCalendar();
}

/**
 * Initialize the calendar with the current month.
 */
export function initCalendar() {
  const now = new Date();
  displayMonth = now.getMonth();
  displayYear = now.getFullYear();
  selectedDay = now.getDate();

  const prevBtn = document.getElementById('cal-prev');
  const nextBtn = document.getElementById('cal-next');

  if (prevBtn) prevBtn.addEventListener('click', () => navigateMonth(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateMonth(1));

  renderCalendar();
}

function navigateMonth(delta) {
  displayMonth += delta;
  if (displayMonth < 0) {
    displayMonth = 11;
    displayYear--;
  } else if (displayMonth > 11) {
    displayMonth = 0;
    displayYear++;
  }
  selectedDay = null;
  renderCalendar();
}

function renderCalendar() {
  const titleEl = document.getElementById('cal-title');
  const gridEl = document.getElementById('cal-grid');
  if (!titleEl || !gridEl) return;

  titleEl.textContent = `${MONTH_NAMES[displayMonth]} ${displayYear}`;

  gridEl.innerHTML = '';

  // Day-of-week headers
  DAY_NAMES.forEach(name => {
    const header = document.createElement('div');
    header.className = 'calendar-header-cell';
    header.textContent = name;
    gridEl.appendChild(header);
  });

  const firstDay = new Date(displayYear, displayMonth, 1).getDay();
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(displayYear, displayMonth, 0).getDate();

  const today = new Date();
  const isCurrentMonth =
    displayYear === today.getFullYear() && displayMonth === today.getMonth();

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const cell = createDayCell(daysInPrevMonth - i, true);
    gridEl.appendChild(cell);
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = isCurrentMonth && d === today.getDate();
    const isSelected = d === selectedDay;
    const cell = createDayCell(d, false, isToday, isSelected);

    cell.addEventListener('click', () => {
      selectedDay = d;
      renderCalendar();
      if (onDaySelectCallback) {
        onDaySelectCallback({ year: displayYear, month: displayMonth, day: d });
      }
    });

    gridEl.appendChild(cell);
  }

  // Next month leading days to fill the grid
  const totalCells = gridEl.children.length;
  const remaining = (7 - (totalCells % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const cell = createDayCell(d, true);
    gridEl.appendChild(cell);
  }
}

function createDayCell(day, isOtherMonth, isToday = false, isSelected = false) {
  const cell = document.createElement('div');
  cell.className = 'calendar-day';
  if (isOtherMonth) cell.classList.add('other-month');
  if (isToday) cell.classList.add('today');
  if (isSelected) cell.classList.add('selected');

  cell.textContent = day;

  if (!isOtherMonth) {
    const dot = document.createElement('div');
    dot.className = 'quality-dot';
    if (qualityFunction) {
      dot.classList.add(qualityFunction(displayYear, displayMonth, day));
    } else {
      dot.classList.add('mixed');
    }
    cell.appendChild(dot);
  }

  return cell;
}
