const SCREEN_NAV_MAP = {
  main: 0,
  calendar: 1,
  dashas: 2,
  learn: 3,
  profiles: 4,
};

/**
 * Switch the visible screen and update bottom nav active state.
 * @param {string} screenName - 'main' | 'setup' | 'calendar' | 'dashas'
 */
export function showScreen(screenName) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

  const target = document.getElementById(screenName + '-screen');
  if (target) {
    target.classList.add('active');
  }

  // Update nav active state
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(n => n.classList.remove('active'));
  const navIndex = SCREEN_NAV_MAP[screenName];
  if (navIndex !== undefined && navItems[navIndex]) {
    navItems[navIndex].classList.add('active');
  }
}
