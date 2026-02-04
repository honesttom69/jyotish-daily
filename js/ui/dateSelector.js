import { MONTH_NAMES, WEEKDAY_NAMES } from '../utils/constants.js';

let currentDate = new Date();
let onDateChangeCallback = null;

/**
 * Get the currently selected date.
 * @returns {Date}
 */
export function getSelectedDate() {
  return new Date(currentDate);
}

/**
 * Register a callback for when the date changes.
 * @param {function} callback - receives the new Date
 */
export function onDateChange(callback) {
  onDateChangeCallback = callback;
}

/**
 * Initialize the date selector, wiring up prev/next/today buttons.
 */
export function initDateSelector() {
  updateDisplay();

  const prevBtn = document.getElementById('date-prev');
  const nextBtn = document.getElementById('date-next');
  const todayBtn = document.getElementById('date-today');

  if (prevBtn) prevBtn.addEventListener('click', () => changeDate(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => changeDate(1));
  if (todayBtn) todayBtn.addEventListener('click', goToToday);
}

function changeDate(delta) {
  currentDate.setDate(currentDate.getDate() + delta);
  updateDisplay();
  if (onDateChangeCallback) onDateChangeCallback(getSelectedDate());
}

function goToToday() {
  currentDate = new Date();
  updateDisplay();
  if (onDateChangeCallback) onDateChangeCallback(getSelectedDate());
}

function updateDisplay() {
  const dayLabel = document.getElementById('date-day-label');
  const fullDate = document.getElementById('date-full');

  if (!dayLabel || !fullDate) return;

  const today = new Date();
  const isToday =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getDate() === today.getDate();

  dayLabel.textContent = isToday ? 'Today' : currentDate.getDate();

  const weekday = WEEKDAY_NAMES[currentDate.getDay()];
  const month = MONTH_NAMES[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  fullDate.textContent = `${weekday}, ${month} ${day}, ${year}`;
}
