import { HOUSE_INFO, PLANET_INFO, SIGN_INFO, ASPECT_INFO } from '../data/learn.js';

/**
 * Initialize the Learn screen: wire tab buttons and render default topic.
 */
export function initLearnScreen() {
  const tabs = document.querySelectorAll('.learn-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTopic(tab.dataset.topic);
    });
  });

  // Render default
  renderTopic('houses');
}

function renderTopic(topic) {
  const container = document.getElementById('learn-content');
  if (!container) return;
  container.innerHTML = '';

  if (topic === 'houses') {
    for (let i = 1; i <= 12; i++) {
      const info = HOUSE_INFO[i];
      container.appendChild(buildCard(info.name, info.keywords, info.description));
    }
  } else if (topic === 'planets') {
    const order = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke'];
    for (const key of order) {
      const info = PLANET_INFO[key];
      const meta = `${info.nature} \u2022 Rules ${info.rules} \u2022 Exalted ${info.exalted}`;
      container.appendChild(buildCard(info.name, [info.signifies], info.description, meta));
    }
  } else if (topic === 'signs') {
    const signs = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
    ];
    for (const name of signs) {
      const info = SIGN_INFO[name];
      const title = `${info.symbol} ${name}`;
      const meta = `${info.element} \u2022 ${info.quality} \u2022 Ruler: ${info.ruler}`;
      container.appendChild(buildCard(title, [meta], info.description));
    }
  } else if (topic === 'aspects') {
    const order = ['overview', 'seventh', 'mars', 'jupiter', 'saturn', 'rahuKetu', 'reading'];
    for (const key of order) {
      const info = ASPECT_INFO[key];
      container.appendChild(buildCard(info.name, info.keywords, info.description));
    }
  }
}

function buildCard(title, keywords, body, meta) {
  const card = document.createElement('div');
  card.className = 'learn-card';

  const titleEl = document.createElement('div');
  titleEl.className = 'learn-card-title';
  titleEl.textContent = title;
  card.appendChild(titleEl);

  if (meta) {
    const metaEl = document.createElement('div');
    metaEl.className = 'learn-card-meta';
    metaEl.textContent = meta;
    card.appendChild(metaEl);
  }

  const kwEl = document.createElement('div');
  kwEl.className = 'learn-card-keywords';
  kwEl.textContent = keywords.join(' \u2022 ');
  card.appendChild(kwEl);

  const bodyEl = document.createElement('div');
  bodyEl.className = 'learn-card-body';
  bodyEl.textContent = body;
  card.appendChild(bodyEl);

  card.addEventListener('click', () => {
    card.classList.toggle('expanded');
  });

  return card;
}
