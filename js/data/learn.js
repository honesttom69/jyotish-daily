/**
 * Educational reference data for the Learn screen and chart tooltips.
 */

export const HOUSE_INFO = {
  1: {
    name: '1st House (Lagna)',
    keywords: ['Self', 'Body', 'Personality', 'Appearance'],
    description: 'The ascendant or rising sign. Represents your physical body, overall health, personality, and how others perceive you. The most important house in the chart — it colors your entire life experience.',
  },
  2: {
    name: '2nd House (Dhana)',
    keywords: ['Wealth', 'Speech', 'Family', 'Food'],
    description: 'Governs accumulated wealth, family of origin, speech and voice, food preferences, and early education. Also relates to the right eye and face. A strong 2nd house supports material security.',
  },
  3: {
    name: '3rd House (Sahaja)',
    keywords: ['Courage', 'Siblings', 'Communication', 'Short Travels'],
    description: 'The house of effort, courage, and willpower. Rules younger siblings, short journeys, writing, and communication skills. An upachaya (growth) house — malefics here can actually do well.',
  },
  4: {
    name: '4th House (Sukha)',
    keywords: ['Home', 'Mother', 'Emotions', 'Property'],
    description: 'Represents your emotional foundation, home environment, mother, vehicles, landed property, and inner peace. One of the kendra (angular) houses, giving stability and comfort.',
  },
  5: {
    name: '5th House (Putra)',
    keywords: ['Children', 'Creativity', 'Intelligence', 'Romance'],
    description: 'The house of creative intelligence, children, romance, speculation, and past-life merit (purva punya). A trine house — one of the most auspicious positions. Planets here express joyfully.',
  },
  6: {
    name: '6th House (Shatru)',
    keywords: ['Enemies', 'Disease', 'Service', 'Daily Work'],
    description: 'Governs obstacles, enemies, illness, debts, and daily labor. Also relates to service, healing, and overcoming challenges. A dusthana (difficult) house, but malefics can thrive here by defeating opposition.',
  },
  7: {
    name: '7th House (Kalatra)',
    keywords: ['Marriage', 'Partnership', 'Business', 'Public'],
    description: 'The house of marriage, committed partnerships, and one-on-one relationships. Also governs business partnerships, open enemies, and your public dealings. A kendra house of great importance.',
  },
  8: {
    name: '8th House (Ayur)',
    keywords: ['Transformation', 'Longevity', 'Hidden', 'Occult'],
    description: 'Rules transformation, death and rebirth, hidden knowledge, inheritance, and chronic conditions. A dusthana house associated with sudden changes, research, and the mysteries of life.',
  },
  9: {
    name: '9th House (Dharma)',
    keywords: ['Fortune', 'Father', 'Guru', 'Higher Learning'],
    description: 'The most auspicious trine house. Represents luck, dharma (life purpose), father, guru, higher education, philosophy, long-distance travel, and spiritual wisdom.',
  },
  10: {
    name: '10th House (Karma)',
    keywords: ['Career', 'Status', 'Authority', 'Public Image'],
    description: 'The house of career, profession, public reputation, and achievements. The highest point in the chart. A powerful kendra house — planets here have strong visibility and impact on your worldly standing.',
  },
  11: {
    name: '11th House (Labha)',
    keywords: ['Gains', 'Friends', 'Wishes', 'Income'],
    description: 'The house of gains, income, elder siblings, social networks, and fulfillment of desires. An upachaya house where both benefics and malefics can produce good results over time.',
  },
  12: {
    name: '12th House (Vyaya)',
    keywords: ['Loss', 'Spirituality', 'Foreign', 'Liberation'],
    description: 'Governs expenses, losses, isolation, foreign lands, sleep, and spiritual liberation (moksha). A dusthana house, but also deeply spiritual — it represents letting go and transcending the material world.',
  },
};

export const PLANET_INFO = {
  Su: {
    name: 'Sun (Surya)',
    nature: 'Mild Malefic',
    signifies: 'Soul, self-confidence, father, authority, government, vitality',
    rules: 'Leo',
    exalted: 'Aries (10\u00B0)',
    debilitated: 'Libra (10\u00B0)',
    description: 'The king of the planetary cabinet. Represents your soul, ego, willpower, and sense of purpose. A strong Sun gives leadership ability, confidence, and good health. When afflicted, it can bring arrogance or issues with authority figures.',
  },
  Mo: {
    name: 'Moon (Chandra)',
    nature: 'Benefic',
    signifies: 'Mind, emotions, mother, nurturing, public, fluids',
    rules: 'Cancer',
    exalted: 'Taurus (3\u00B0)',
    debilitated: 'Scorpio (3\u00B0)',
    description: 'The queen — governs your mind, emotions, and inner world. The Moon\'s nakshatra determines your Vimshottari dasha sequence. A strong Moon brings emotional stability, good memory, and public favor. The most important planet for day-to-day experience.',
  },
  Ma: {
    name: 'Mars (Mangal)',
    nature: 'Malefic',
    signifies: 'Energy, courage, siblings, property, surgery, competition',
    rules: 'Aries & Scorpio',
    exalted: 'Capricorn (28\u00B0)',
    debilitated: 'Cancer (28\u00B0)',
    description: 'The commander-in-chief. Represents raw energy, courage, physical strength, and the drive to take action. Mars gives athletic ability and competitive spirit. When poorly placed, it can bring aggression, accidents, or conflicts.',
  },
  Me: {
    name: 'Mercury (Budha)',
    nature: 'Benefic (if unafflicted)',
    signifies: 'Intellect, communication, commerce, humor, adaptability',
    rules: 'Gemini & Virgo',
    exalted: 'Virgo (15\u00B0)',
    debilitated: 'Pisces (15\u00B0)',
    description: 'The prince and messenger. Governs intelligence, speech, writing, business acumen, and analytical thinking. Mercury is impressionable — it takes on the nature of planets it associates with. Strong Mercury gives sharp wit and communication skills.',
  },
  Ju: {
    name: 'Jupiter (Guru)',
    nature: 'Greater Benefic',
    signifies: 'Wisdom, expansion, children, wealth, dharma, teaching',
    rules: 'Sagittarius & Pisces',
    exalted: 'Cancer (5\u00B0)',
    debilitated: 'Capricorn (5\u00B0)',
    description: 'The great teacher and minister. The most benefic planet, bringing wisdom, generosity, good fortune, and spiritual growth. Jupiter\'s transit through houses is one of the most significant timing factors. Its blessings expand whatever it touches.',
  },
  Ve: {
    name: 'Venus (Shukra)',
    nature: 'Greater Benefic',
    signifies: 'Love, beauty, art, luxury, marriage, vehicles',
    rules: 'Taurus & Libra',
    exalted: 'Pisces (27\u00B0)',
    debilitated: 'Virgo (27\u00B0)',
    description: 'The minister of pleasure and refinement. Governs love, relationships, beauty, art, comfort, and material enjoyment. A strong Venus brings charm, artistic talent, and harmonious relationships. Also significant for marriage timing.',
  },
  Sa: {
    name: 'Saturn (Shani)',
    nature: 'Greater Malefic',
    signifies: 'Discipline, karma, delays, longevity, service, sorrow',
    rules: 'Capricorn & Aquarius',
    exalted: 'Libra (20\u00B0)',
    debilitated: 'Aries (20\u00B0)',
    description: 'The strict teacher and servant. Saturn brings discipline through restriction and delay. Its lessons are hard but lasting. Saturn transits are the most impactful long-term influences, especially Sade Sati (7.5 year Saturn transit over natal Moon). A well-placed Saturn gives perseverance and eventual success.',
  },
  Ra: {
    name: 'Rahu (North Node)',
    nature: 'Malefic',
    signifies: 'Obsession, foreign, unconventional, illusion, ambition',
    rules: 'Co-rules Aquarius',
    exalted: 'Taurus/Gemini',
    debilitated: 'Scorpio/Sagittarius',
    description: 'The north lunar node — a shadow planet representing worldly desires, obsession, and the unfamiliar. Rahu amplifies and distorts whatever it touches. It drives you toward new experiences and can bring sudden gains or confusion. Its house placement shows where you crave growth in this lifetime.',
  },
  Ke: {
    name: 'Ketu (South Node)',
    nature: 'Malefic',
    signifies: 'Detachment, spirituality, past lives, liberation, loss',
    rules: 'Co-rules Scorpio',
    exalted: 'Scorpio/Sagittarius',
    debilitated: 'Taurus/Gemini',
    description: 'The south lunar node — a shadow planet representing past-life mastery, detachment, and spiritual insight. Ketu strips away attachment to whatever it touches. It can bring psychic abilities, sudden losses, or deep spiritual experiences. Where Ketu sits, you already have innate skill but little worldly interest.',
  },
};

export const ASPECT_INFO = {
  overview: {
    name: 'What Are Aspects?',
    keywords: ['Drishti', 'Glance', 'Influence', 'Whole-sign'],
    description: 'In Vedic astrology, aspects are called "drishti" — literally meaning "glance" or "sight." When a planet aspects another planet or house, it casts its influence there. Unlike Western astrology which uses exact degree-based aspects (trine, square, sextile), Vedic aspects are whole-sign: if a planet is in a sign, it aspects entire other signs regardless of the exact degree. This makes them simpler to calculate but no less powerful. In this app, aspect tags (marked with \u26B9) show which of your natal planets are receiving the gaze of a transiting planet.',
  },
  seventh: {
    name: '7th Aspect (All Planets)',
    keywords: ['Opposition', 'Universal', 'Strongest'],
    description: 'Every planet aspects the sign directly opposite it — 7 signs away. This is the most fundamental and powerful aspect in Vedic astrology. It creates a direct axis of influence between two areas of life. For example, a planet in your 1st house (self) aspects your 7th house (partnerships), linking your identity to your relationships. The 7th aspect is always the strongest drishti.',
  },
  mars: {
    name: 'Mars: 4th, 7th & 8th Aspects',
    keywords: ['Forward drive', 'Aggressive', 'Action-oriented'],
    description: 'Mars has three aspects: the universal 7th, plus special aspects on the 4th and 8th houses from its position. The 4th aspect reaches backward to where Mars has been, showing lingering assertive energy. The 8th aspect reaches forward past the opposition, projecting Mars\'s combative and transformative force. Mars aspects bring energy, urgency, and sometimes conflict to the houses and planets they touch.',
  },
  jupiter: {
    name: 'Jupiter: 5th, 7th & 9th Aspects',
    keywords: ['Protective', 'Expansive', 'Trinal'],
    description: 'Jupiter\'s special aspects hit the 5th and 9th houses from its position — both trine houses — in addition to the standard 7th. This is why Jupiter is called the "Great Protector": its glance reaches the most auspicious houses in the chart. Jupiter\'s aspects bring wisdom, growth, optimism, and opportunities wherever they land. Having Jupiter aspect a natal planet is generally a blessing.',
  },
  saturn: {
    name: 'Saturn: 3rd, 7th & 10th Aspects',
    keywords: ['Disciplined', 'Restrictive', 'Karmic'],
    description: 'Saturn\'s special aspects hit the 3rd and 10th houses from its position, plus the standard 7th. The 3rd aspect casts discipline on effort and courage. The 10th aspect brings structure and accountability to career and public standing. Saturn\'s aspects bring pressure, responsibility, and long-term lessons. They slow things down but create lasting foundations.',
  },
  rahuKetu: {
    name: 'Rahu & Ketu: 5th, 7th & 9th Aspects',
    keywords: ['Shadow', 'Obsessive', 'Karmic nodes'],
    description: 'The lunar nodes share Jupiter\'s aspect pattern (5th, 7th, 9th) but with very different energy. Rahu\'s aspects amplify desire, confusion, and unconventional approaches in the houses they touch. Ketu\'s aspects bring detachment, spiritual insight, or a sense of "been there, done that." Since Rahu and Ketu are always opposite each other, their combined aspects cover much of the chart.',
  },
  reading: {
    name: 'Reading Aspects in This App',
    keywords: ['Tags', 'Gold badges', 'Transit list'],
    description: 'In the transit list, aspect tags appear as gold-bordered badges marked with \u26B9, showing which natal planet is aspected and the type (e.g., "7th asp" or "5th asp"). These appear alongside conjunction tags (\u260C). The key difference: a conjunction means the transit planet is in the same sign as your natal planet, while an aspect means it\'s influencing from a distance. Both matter, but conjunctions are generally more intense. The daily guidance text also factors in significant aspects when composing your daily reading.',
  },
};

export const SIGN_INFO = {
  Aries: {
    element: 'Fire',
    quality: 'Cardinal (Chara)',
    ruler: 'Mars',
    symbol: '\u2648',
    description: 'The first sign — pioneering, assertive, and action-oriented. Aries energy is direct, courageous, and initiating. Can be impulsive or impatient when challenged.',
  },
  Taurus: {
    element: 'Earth',
    quality: 'Fixed (Sthira)',
    ruler: 'Venus',
    symbol: '\u2649',
    description: 'Stable, sensual, and security-focused. Taurus values comfort, beauty, and material stability. Patient and determined, but can be stubborn or possessive.',
  },
  Gemini: {
    element: 'Air',
    quality: 'Dual (Dwiswabhava)',
    ruler: 'Mercury',
    symbol: '\u264A',
    description: 'Curious, communicative, and adaptable. Gemini energy loves learning, variety, and social exchange. Quick-witted but can scatter its focus.',
  },
  Cancer: {
    element: 'Water',
    quality: 'Cardinal (Chara)',
    ruler: 'Moon',
    symbol: '\u264B',
    description: 'Nurturing, emotional, and protective. Cancer energy is deeply intuitive, caring, and tied to home and family. Sensitive and loyal, but can be moody or clingy.',
  },
  Leo: {
    element: 'Fire',
    quality: 'Fixed (Sthira)',
    ruler: 'Sun',
    symbol: '\u264C',
    description: 'Regal, creative, and generous. Leo energy radiates confidence, warmth, and leadership. Loves recognition and self-expression. Can be proud or domineering.',
  },
  Virgo: {
    element: 'Earth',
    quality: 'Dual (Dwiswabhava)',
    ruler: 'Mercury',
    symbol: '\u264D',
    description: 'Analytical, service-oriented, and detail-focused. Virgo energy excels at problem-solving, health matters, and practical improvement. Can be overly critical or anxious.',
  },
  Libra: {
    element: 'Air',
    quality: 'Cardinal (Chara)',
    ruler: 'Venus',
    symbol: '\u264E',
    description: 'Balanced, diplomatic, and relationship-oriented. Libra energy seeks harmony, fairness, and beauty in all things. Charming but can be indecisive or people-pleasing.',
  },
  Scorpio: {
    element: 'Water',
    quality: 'Fixed (Sthira)',
    ruler: 'Mars',
    symbol: '\u264F',
    description: 'Intense, transformative, and deeply perceptive. Scorpio energy penetrates to the core of matters. Powerful and magnetic, but can be secretive or controlling.',
  },
  Sagittarius: {
    element: 'Fire',
    quality: 'Dual (Dwiswabhava)',
    ruler: 'Jupiter',
    symbol: '\u2650',
    description: 'Expansive, philosophical, and freedom-loving. Sagittarius energy seeks truth, meaning, and adventure. Optimistic and generous, but can be dogmatic or restless.',
  },
  Capricorn: {
    element: 'Earth',
    quality: 'Cardinal (Chara)',
    ruler: 'Saturn',
    symbol: '\u2651',
    description: 'Ambitious, disciplined, and pragmatic. Capricorn energy builds lasting structures through patience and hard work. Responsible and determined, but can be rigid or overly serious.',
  },
  Aquarius: {
    element: 'Air',
    quality: 'Fixed (Sthira)',
    ruler: 'Saturn',
    symbol: '\u2652',
    description: 'Innovative, humanitarian, and independent. Aquarius energy thinks broadly about society and the future. Original and progressive, but can be detached or eccentric.',
  },
  Pisces: {
    element: 'Water',
    quality: 'Dual (Dwiswabhava)',
    ruler: 'Jupiter',
    symbol: '\u2653',
    description: 'Compassionate, intuitive, and transcendent. Pisces energy dissolves boundaries and connects to the spiritual realm. Empathic and creative, but can be escapist or overly impressionable.',
  },
};
