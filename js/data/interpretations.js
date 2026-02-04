// ============================================================
// Vedic Transit Interpretation Text Content
// Tone: practical, concise, modern psychological, growth-oriented
// ============================================================

/**
 * TRANSIT_HOUSE — Planet-in-house interpretations
 * Keys: "{planet}_{house}" e.g. "Sa_8"
 * Each entry: { text: string, theme: string }
 * 108 entries (9 planets x 12 houses)
 */
export const TRANSIT_HOUSE = {
  // ---- Saturn (Sa) ----
  Sa_1:  { text: "Saturn in your 1st house asks you to take yourself more seriously and build discipline around identity and self-presentation.", theme: "Self-discipline" },
  Sa_2:  { text: "Saturn pressures your finances and values, encouraging careful resource management and a more grounded relationship with money.", theme: "Financial caution" },
  Sa_3:  { text: "Saturn in the 3rd sharpens your communication with a more serious tone; effort in daily tasks and sibling relationships pays off.", theme: "Deliberate effort" },
  Sa_4:  { text: "Saturn transiting the 4th brings focus to home and inner security, sometimes through challenges that build emotional resilience.", theme: "Inner foundations" },
  Sa_5:  { text: "Saturn in your 5th house asks for maturity in creative expression and romance; structured effort yields lasting results.", theme: "Mature creativity" },
  Sa_6:  { text: "Saturn in the 6th strengthens your capacity to handle routine, health, and obstacles through disciplined daily practice.", theme: "Steady endurance" },
  Sa_7:  { text: "Saturn transiting the 7th tests relationships and partnerships, revealing where commitment and boundaries need attention.", theme: "Relationship lessons" },
  Sa_8:  { text: "Saturn in the 8th demands patience through transformation; deep psychological work and letting go of control are key themes.", theme: "Deep restructuring" },
  Sa_9:  { text: "Saturn in the 9th grounds your beliefs and long-term vision, rewarding practical wisdom over idealism.", theme: "Grounded wisdom" },
  Sa_10: { text: "Saturn transiting your 10th brings career pressure but also the opportunity to build lasting professional achievements.", theme: "Career building" },
  Sa_11: { text: "Saturn in the 11th restructures your social network and goals; genuine friendships and realistic aspirations are favored.", theme: "Network refinement" },
  Sa_12: { text: "Saturn in the 12th asks for solitude and inner work; releasing old patterns creates space for eventual renewal.", theme: "Quiet release" },

  // ---- Jupiter (Ju) ----
  Ju_1:  { text: "Jupiter in your 1st house expands your confidence and presence, opening doors through optimism and personal growth.", theme: "Personal expansion" },
  Ju_2:  { text: "Jupiter blesses the 2nd house with opportunities to grow wealth and develop a more generous relationship with resources.", theme: "Growing abundance" },
  Ju_3:  { text: "Jupiter in the 3rd expands your communication reach and learning; new ideas and connections flow more easily.", theme: "Expanded horizons" },
  Ju_4:  { text: "Jupiter transiting the 4th brings warmth and growth to home life, emotional well-being, and sense of belonging.", theme: "Domestic blessings" },
  Ju_5:  { text: "Jupiter in the 5th inspires creative joy, romance, and a playful approach to self-expression and children.", theme: "Creative joy" },
  Ju_6:  { text: "Jupiter in the 6th helps you overcome obstacles and improve health routines with a positive, solution-oriented mindset.", theme: "Overcoming obstacles" },
  Ju_7:  { text: "Jupiter transiting the 7th brings growth and opportunity through partnerships, both personal and professional.", theme: "Partnership growth" },
  Ju_8:  { text: "Jupiter in the 8th eases transformation and brings insight into shared resources and deeper psychological patterns.", theme: "Transformative insight" },
  Ju_9:  { text: "Jupiter in the 9th amplifies your quest for meaning, supporting higher learning, travel, and philosophical growth.", theme: "Seeking meaning" },
  Ju_10: { text: "Jupiter transiting the 10th elevates career prospects and public reputation; professional recognition is possible.", theme: "Career uplift" },
  Ju_11: { text: "Jupiter in the 11th expands your social circle and helps manifest long-held goals through community and collaboration.", theme: "Goals and gains" },
  Ju_12: { text: "Jupiter in the 12th supports spiritual growth, charitable giving, and finding peace through letting go.", theme: "Spiritual growth" },

  // ---- Rahu (Ra) ----
  Ra_1:  { text: "Rahu in the 1st amplifies your desire for reinvention; be mindful of obsessive self-focus while embracing bold changes.", theme: "Bold reinvention" },
  Ra_2:  { text: "Rahu in the 2nd intensifies desires around money and possessions; unconventional income sources may appear.", theme: "Material desires" },
  Ra_3:  { text: "Rahu in the 3rd drives restless communication and bold initiatives; channel the intensity into strategic action.", theme: "Restless ambition" },
  Ra_4:  { text: "Rahu transiting the 4th stirs inner restlessness and unconventional changes at home; seek grounding practices.", theme: "Inner disruption" },
  Ra_5:  { text: "Rahu in the 5th magnifies creative urges and romantic intensity; inspired ideas flow but discernment is needed.", theme: "Intense creativity" },
  Ra_6:  { text: "Rahu in the 6th gives unusual power over adversaries and health challenges; unconventional methods work well.", theme: "Unconventional solutions" },
  Ra_7:  { text: "Rahu transiting the 7th intensifies relationship dynamics and may attract unusual or foreign partnerships.", theme: "Magnetic connections" },
  Ra_8:  { text: "Rahu in the 8th deepens fascination with hidden matters; powerful transformation is possible but avoid obsessive tendencies.", theme: "Obsessive depth" },
  Ra_9:  { text: "Rahu in the 9th draws you toward unconventional philosophies and foreign connections; question inherited beliefs.", theme: "Questioning beliefs" },
  Ra_10: { text: "Rahu transiting the 10th amplifies career ambition and public visibility; success comes through innovation.", theme: "Ambitious visibility" },
  Ra_11: { text: "Rahu in the 11th powerfully drives goal attainment and social networking; large gains are possible through bold moves.", theme: "Amplified gains" },
  Ra_12: { text: "Rahu in the 12th intensifies subconscious patterns and may bring foreign travel or spiritual experiences outside your comfort zone.", theme: "Hidden currents" },

  // ---- Ketu (Ke) ----
  Ke_1:  { text: "Ketu in the 1st loosens attachment to ego and identity, supporting spiritual growth through self-surrender.", theme: "Ego release" },
  Ke_2:  { text: "Ketu in the 2nd detaches you from material concerns; financial surprises teach non-attachment to possessions.", theme: "Material detachment" },
  Ke_3:  { text: "Ketu in the 3rd quiets restless mental activity and may bring intuitive communication or disinterest in surface-level interactions.", theme: "Intuitive insight" },
  Ke_4:  { text: "Ketu transiting the 4th creates emotional detachment from home routines, pointing toward inner rather than outer security.", theme: "Inner withdrawal" },
  Ke_5:  { text: "Ketu in the 5th brings a spiritual quality to creativity and may reduce interest in conventional romance or entertainment.", theme: "Spiritual creativity" },
  Ke_6:  { text: "Ketu in the 6th dissolves obstacles in unexpected ways; health and routine matters resolve through release rather than effort.", theme: "Effortless resolution" },
  Ke_7:  { text: "Ketu transiting the 7th reduces attachment to partnership outcomes; relationships teach lessons about independence.", theme: "Detached relating" },
  Ke_8:  { text: "Ketu in the 8th supports deep spiritual insight and detachment from fear; transformation happens through surrender.", theme: "Fearless surrender" },
  Ke_9:  { text: "Ketu in the 9th dissolves rigid beliefs, fostering a more intuitive, less dogmatic approach to truth and meaning.", theme: "Dissolving dogma" },
  Ke_10: { text: "Ketu transiting the 10th loosens career attachment and worldly ambition; fulfillment comes from purpose, not status.", theme: "Purpose over status" },
  Ke_11: { text: "Ketu in the 11th detaches from social expectations and gains; quality of connections matters more than quantity.", theme: "Selective connections" },
  Ke_12: { text: "Ketu in the 12th is spiritually potent, supporting meditation, withdrawal from worldly distractions, and liberation themes.", theme: "Liberation" },

  // ---- Mars (Ma) ----
  Ma_1:  { text: "Mars in your 1st house boosts energy, assertiveness, and drive; channel this into physical activity and decisive action.", theme: "Bold energy" },
  Ma_2:  { text: "Mars in the 2nd brings assertive energy around finances; direct speech and financial initiative are heightened.", theme: "Financial drive" },
  Ma_3:  { text: "Mars in the 3rd fuels courage and initiative in communication; great for taking action on short-term goals.", theme: "Courageous action" },
  Ma_4:  { text: "Mars transiting the 4th stirs energy at home; physical projects around the house are favored, but watch for domestic tension.", theme: "Domestic energy" },
  Ma_5:  { text: "Mars in the 5th fires up creative passion and competitive spirit; good for sports, bold artistic work, and romantic pursuit.", theme: "Creative fire" },
  Ma_6:  { text: "Mars in the 6th is powerful for overcoming competition and tackling health goals with vigor and determination.", theme: "Competitive edge" },
  Ma_7:  { text: "Mars transiting the 7th intensifies relationship dynamics; direct communication helps, but guard against unnecessary conflict.", theme: "Assertive relating" },
  Ma_8:  { text: "Mars in the 8th drives intense investigation and transformation; powerful for research but avoid power struggles.", theme: "Intense probing" },
  Ma_9:  { text: "Mars in the 9th energizes pursuit of knowledge and adventure; strong convictions drive action on your beliefs.", theme: "Energized beliefs" },
  Ma_10: { text: "Mars transiting the 10th amplifies career ambition and executive energy; take bold professional action.", theme: "Career ambition" },
  Ma_11: { text: "Mars in the 11th energizes goal pursuit and social activism; group leadership opportunities may arise.", theme: "Goal drive" },
  Ma_12: { text: "Mars in the 12th requires directing energy inward; hidden frustrations surface but can fuel spiritual discipline.", theme: "Hidden fire" },

  // ---- Venus (Ve) ----
  Ve_1:  { text: "Venus in your 1st house enhances personal charm and attractiveness; social opportunities and aesthetic pleasures increase.", theme: "Personal charm" },
  Ve_2:  { text: "Venus in the 2nd favors financial comfort and enjoyment of good food, art, and sensory pleasures.", theme: "Sensory pleasure" },
  Ve_3:  { text: "Venus in the 3rd brings grace to communication and pleasant interactions with siblings and neighbors.", theme: "Graceful expression" },
  Ve_4:  { text: "Venus transiting the 4th brings comfort and beauty to home life; a wonderful time for decorating or entertaining at home.", theme: "Domestic harmony" },
  Ve_5:  { text: "Venus in the 5th inspires romantic attraction, creative expression, and enjoyment of arts and entertainment.", theme: "Romantic creativity" },
  Ve_6:  { text: "Venus in the 6th smooths workplace relationships and helps resolve conflicts through diplomacy and compromise.", theme: "Workplace harmony" },
  Ve_7:  { text: "Venus transiting the 7th is excellent for relationships, bringing harmony, attraction, and partnership opportunities.", theme: "Love and partnership" },
  Ve_8:  { text: "Venus in the 8th deepens intimacy and attraction to hidden beauty; financial benefits through partnership are possible.", theme: "Deep intimacy" },
  Ve_9:  { text: "Venus in the 9th brings pleasure through travel, philosophy, and cross-cultural experiences; love expands your worldview.", theme: "Adventurous love" },
  Ve_10: { text: "Venus transiting the 10th enhances your public image and brings creative or diplomatic energy to career matters.", theme: "Professional grace" },
  Ve_11: { text: "Venus in the 11th brings enjoyable social connections and may help attract resources through your network.", theme: "Social enjoyment" },
  Ve_12: { text: "Venus in the 12th favors private pleasures, spiritual devotion, and finding beauty in solitude and inner life.", theme: "Private beauty" },

  // ---- Sun (Su) ----
  Su_1:  { text: "The Sun in your 1st house strengthens vitality, confidence, and self-expression; step into leadership roles.", theme: "Confident self" },
  Su_2:  { text: "The Sun in the 2nd highlights earning power and self-worth; a good time to assess what you truly value.", theme: "Self-worth" },
  Su_3:  { text: "The Sun in the 3rd illuminates your communication and learning; express your ideas with authority and clarity.", theme: "Clear expression" },
  Su_4:  { text: "The Sun transiting the 4th turns attention to home, roots, and inner emotional life; nurture your foundations.", theme: "Home focus" },
  Su_5:  { text: "The Sun in the 5th spotlights creativity, self-expression, and children; lead with heart and playfulness.", theme: "Creative spotlight" },
  Su_6:  { text: "The Sun in the 6th empowers you to tackle health, work, and daily routines with renewed purpose.", theme: "Purposeful routine" },
  Su_7:  { text: "The Sun transiting the 7th illuminates partnerships; balance between self and other is the key lesson.", theme: "Partnership awareness" },
  Su_8:  { text: "The Sun in the 8th shines light on hidden matters and shared resources; face what needs transformation.", theme: "Revealing depth" },
  Su_9:  { text: "The Sun in the 9th boosts confidence in your worldview, supporting higher learning and meaningful pursuits.", theme: "Philosophical confidence" },
  Su_10: { text: "The Sun transiting the 10th puts you in the public eye; career achievements and recognition are highlighted.", theme: "Public recognition" },
  Su_11: { text: "The Sun in the 11th energizes friendships and long-term goals; leadership within groups is favored.", theme: "Social leadership" },
  Su_12: { text: "The Sun in the 12th turns energy inward, favoring rest, reflection, and behind-the-scenes work.", theme: "Inner reflection" },

  // ---- Mercury (Me) ----
  Me_1:  { text: "Mercury in your 1st house sharpens your thinking and communication skills; a great time for learning and self-expression.", theme: "Sharp mind" },
  Me_2:  { text: "Mercury in the 2nd brings financial ideas and business acumen; good for negotiations and money planning.", theme: "Financial thinking" },
  Me_3:  { text: "Mercury in the 3rd is in its element — writing, learning, short trips, and lively conversations thrive.", theme: "Active mind" },
  Me_4:  { text: "Mercury transiting the 4th stimulates thinking about home, family history, and emotional understanding.", theme: "Thoughtful roots" },
  Me_5:  { text: "Mercury in the 5th brings wit and intellectual creativity; good for writing, games, and playful communication.", theme: "Playful intellect" },
  Me_6:  { text: "Mercury in the 6th sharpens your analytical skills for work and health matters; problem-solving comes easily.", theme: "Analytical focus" },
  Me_7:  { text: "Mercury transiting the 7th enhances communication in partnerships; negotiations and agreements are well-starred.", theme: "Partnership dialogue" },
  Me_8:  { text: "Mercury in the 8th deepens research and investigative thinking; good for uncovering hidden information.", theme: "Deep research" },
  Me_9:  { text: "Mercury in the 9th stimulates philosophical inquiry and cross-cultural communication; expand your intellectual horizons.", theme: "Broad thinking" },
  Me_10: { text: "Mercury transiting the 10th supports professional communication, presentations, and strategic career planning.", theme: "Professional communication" },
  Me_11: { text: "Mercury in the 11th connects you with like-minded people and stimulates brainstorming about future goals.", theme: "Network ideas" },
  Me_12: { text: "Mercury in the 12th turns the mind inward; journaling, meditation, and intuitive thinking are supported.", theme: "Inner dialogue" },

  // ---- Moon (Mo) ----
  Mo_1:  { text: "The Moon in your 1st house heightens emotional sensitivity and personal awareness; honor your feelings today.", theme: "Emotional presence" },
  Mo_2:  { text: "The Moon in the 2nd brings focus to comfort, food, and financial security; nurture what sustains you.", theme: "Comfort needs" },
  Mo_3:  { text: "The Moon in the 3rd stirs emotional communication; good for heartfelt conversations and short outings.", theme: "Heartfelt words" },
  Mo_4:  { text: "The Moon transiting the 4th is at home here — rest, family connection, and emotional nourishment are favored.", theme: "Emotional home" },
  Mo_5:  { text: "The Moon in the 5th opens the heart to joy, play, and romantic feelings; follow what feels alive.", theme: "Heart opening" },
  Mo_6:  { text: "The Moon in the 6th may bring emotional sensitivity to work and health; gentle self-care helps.", theme: "Gentle care" },
  Mo_7:  { text: "The Moon transiting the 7th heightens emotional awareness in relationships; seek connection and mutual understanding.", theme: "Relational feelings" },
  Mo_8:  { text: "The Moon in the 8th stirs deep emotions and vulnerability; honor what surfaces without judgment.", theme: "Emotional depth" },
  Mo_9:  { text: "The Moon in the 9th inspires emotional connection to meaning and exploration; follow your sense of wonder.", theme: "Inspired seeking" },
  Mo_10: { text: "The Moon transiting the 10th brings public attention to your emotional state; lead with empathy.", theme: "Public feeling" },
  Mo_11: { text: "The Moon in the 11th warms social connections; community and friendship provide emotional nourishment.", theme: "Social warmth" },
  Mo_12: { text: "The Moon in the 12th invites solitude and inner reflection; dreams and intuition are heightened.", theme: "Quiet intuition" },
};

/**
 * CONJUNCTION_TRANSIT_ACTION — What each transiting planet *does*
 * Used to compose conjunction sentences: "[transit action] [natal domain]"
 */
export const CONJUNCTION_TRANSIT_ACTION = {
  Sa: "pressures and restructures",
  Ju: "expands and blesses",
  Ra: "intensifies and disrupts",
  Ke: "dissolves and spiritualizes",
  Ma: "activates and challenges",
  Ve: "harmonizes and attracts",
  Su: "illuminates and energizes",
  Me: "analyzes and communicates about",
  Mo: "emotionally sensitizes",
};

/**
 * CONJUNCTION_NATAL_DOMAIN — What each natal planet *represents*
 * The natal planet receiving the transit aspect
 */
export const CONJUNCTION_NATAL_DOMAIN = {
  Su: "your sense of self and vitality",
  Mo: "your emotional life and inner needs",
  Ma: "your drive, ambition, and assertiveness",
  Me: "your thinking, communication, and adaptability",
  Ju: "your wisdom, growth, and sense of purpose",
  Ve: "your relationships, pleasures, and values",
  Sa: "your discipline, responsibilities, and long-term structures",
  Ra: "your worldly ambitions and desires",
  Ke: "your spiritual path and letting-go process",
};

/**
 * CONJUNCTION_OVERRIDE — Custom sentences for high-impact transit-natal conjunctions
 * Keys: "{transitPlanet}_{natalPlanet}" e.g. "Sa_Mo"
 */
export const CONJUNCTION_OVERRIDE = {
  Sa_Mo: "Saturn conjunct your natal Moon is one of the most emotionally demanding transits — practice patience, self-compassion, and allow space for heaviness to pass.",
  Sa_Su: "Saturn conjunct your natal Sun tests your confidence and vitality; persevere through limitations and you'll emerge with more authentic authority.",
  Sa_Ve: "Saturn conjunct your natal Venus challenges relationships and pleasures; commitment is tested but deepened through honest reckoning.",
  Sa_Ma: "Saturn conjunct your natal Mars frustrates direct action; strategic patience and disciplined effort replace brute force.",
  Ju_Su: "Jupiter conjunct your natal Sun is a powerful period of confidence, growth, and opportunity — step fully into your potential.",
  Ju_Mo: "Jupiter conjunct your natal Moon brings emotional optimism, generosity, and a deep sense of well-being and belonging.",
  Ju_Ve: "Jupiter conjunct your natal Venus expands love, pleasure, and creative abundance; enjoy this generous period.",
  Ju_Sa: "Jupiter conjunct your natal Saturn balances expansion with discipline, helping you build something lasting and meaningful.",
  Ra_Mo: "Rahu conjunct your natal Moon creates intense emotional turbulence and obsessive thinking — grounding practices and mindfulness are essential.",
  Ra_Su: "Rahu conjunct your natal Sun amplifies ego and ambition dramatically; use this energy for bold moves while staying honest with yourself.",
  Ra_Ve: "Rahu conjunct your natal Venus intensifies desire and attraction; relationships may take unusual or unconventional turns.",
  Ke_Mo: "Ketu conjunct your natal Moon brings emotional detachment and inner withdrawal; spiritual practices help navigate this introspective period.",
  Ke_Su: "Ketu conjunct your natal Sun loosens ego attachment and worldly identity; purpose is found through surrender rather than assertion.",
  Ma_Sa: "Mars conjunct your natal Saturn creates tension between action and restriction; frustration transforms into discipline when handled maturely.",
  Ma_Mo: "Mars conjunct your natal Moon stirs emotional intensity and reactivity; physical activity is the best outlet for this charged energy.",
};

/**
 * MAHA_DASHA — Maha Dasha lord descriptions
 * Themes of each major period
 */
export const MAHA_DASHA = {
  Su: { text: "The Sun period emphasizes self-expression, authority, and finding your place in the world. Leadership, vitality, and relationship with father figures are central themes." },
  Mo: { text: "The Moon period centers on emotional development, nurturing, and connection to family and inner life. Comfort, intuition, and care for others define this time." },
  Ma: { text: "The Mars period activates courage, ambition, and physical energy. This is a time for taking initiative, competitive pursuits, and building strength." },
  Me: { text: "The Mercury period highlights intellect, communication, and commerce. Learning, networking, writing, and adaptability are the key themes." },
  Ju: { text: "The Jupiter period brings expansion, wisdom, and good fortune. Spiritual growth, education, mentorship, and ethical development are emphasized." },
  Ve: { text: "The Venus period emphasizes relationships, creativity, and material comfort. Love, art, luxury, and enjoyment of life's pleasures take center stage." },
  Sa: { text: "The Saturn period demands discipline, responsibility, and perseverance. Hard work, maturity, and confronting limitations build lasting foundations." },
  Ra: { text: "The Rahu period drives worldly ambition, unconventional experiences, and rapid change. Innovation, foreign connections, and breaking boundaries define this time." },
  Ke: { text: "The Ketu period turns attention inward toward spiritual growth and detachment. Past-life themes, liberation, and letting go of material attachments are central." },
};

/**
 * ANTAR_MODIFIER — Antar Dasha modifying phrases
 * Appended to maha description: "[maha text] Currently [antar modifier]."
 */
export const ANTAR_MODIFIER = {
  Su: "the sub-period highlights confidence, visibility, and personal authority",
  Mo: "the sub-period brings emotional sensitivity and focus on nurturing and home",
  Ma: "the sub-period adds urgency, drive, and a push toward action",
  Me: "the sub-period sharpens thinking, communication, and practical decision-making",
  Ju: "the sub-period adds optimism, growth opportunities, and philosophical perspective",
  Ve: "the sub-period emphasizes relationships, creativity, and enjoyment",
  Sa: "the sub-period brings added responsibility, patience, and hard-won progress",
  Ra: "the sub-period intensifies worldly desires and unconventional experiences",
  Ke: "the sub-period deepens introspection, spiritual interest, and detachment",
};

/**
 * HOUSE_DOMAIN — Short domain labels for each house
 */
export const HOUSE_DOMAIN = {
  1:  "self and identity",
  2:  "finances and values",
  3:  "communication and initiative",
  4:  "home and emotional foundations",
  5:  "creativity and romance",
  6:  "health and daily routines",
  7:  "partnerships and relationships",
  8:  "transformation and shared resources",
  9:  "beliefs and higher learning",
  10: "career and public reputation",
  11: "friendships and long-term goals",
  12: "spirituality and solitude",
};

/**
 * ASPECT_ACTION — How each transiting planet's aspect acts.
 * Used with CONJUNCTION_NATAL_DOMAIN to compose aspect descriptions.
 */
export const ASPECT_ACTION = {
  Su: "brings focused awareness to",
  Mo: "casts an emotional influence on",
  Ma: "directs assertive energy toward",
  Me: "brings analytical attention to",
  Ju: "bestows protective grace upon",
  Ve: "sends harmonious energy toward",
  Sa: "casts a disciplined gaze upon",
  Ra: "projects intense desire toward",
  Ke: "sends a detaching influence toward",
};

/**
 * ASPECT_OVERRIDE — Hand-crafted text for high-impact aspect combinations.
 * Keys: "{transitPlanet}_{natalPlanet}"
 */
export const ASPECT_OVERRIDE = {
  Sa_Mo: "Saturn's aspect on your natal Moon brings emotional sobriety; practice patience with your inner world and avoid isolating yourself.",
  Sa_Su: "Saturn's gaze on your natal Sun challenges your confidence; earned authority and humility lead to lasting recognition.",
  Sa_Ma: "Saturn aspecting natal Mars restrains impulsive energy; channel frustration into disciplined, sustained effort.",
  Sa_Ve: "Saturn's aspect on natal Venus tests relationships and pleasures; commitments deepen but comfort may feel restricted.",
  Ju_Mo: "Jupiter's aspect on your natal Moon uplifts emotional life; generosity of spirit, optimism, and family blessings flow more easily.",
  Ju_Su: "Jupiter's benevolent gaze on your natal Sun boosts confidence, reputation, and opportunities through wisdom and integrity.",
  Ju_Ve: "Jupiter aspecting natal Venus expands love, beauty, and harmony; relationships and creative pursuits flourish.",
  Ju_Sa: "Jupiter's aspect on natal Saturn eases burdens and brings philosophical perspective to responsibilities and long-term work.",
  Ma_Sa: "Mars aspecting natal Saturn creates friction between urgency and patience; managed well, this builds tremendous resilience.",
  Ra_Mo: "Rahu's aspect on natal Moon amplifies emotional intensity and restlessness; ground yourself and avoid impulsive reactions.",
  Ra_Su: "Rahu aspecting natal Sun inflates ambition and ego drives; pursue goals but watch for overreach or self-deception.",
  Ke_Ju: "Ketu's aspect on natal Jupiter detaches from conventional wisdom; unconventional spiritual insights may emerge.",
};

// ============================================================
// Natal Chart Overview Interpretations
// ============================================================

/**
 * ASCENDANT_TEXT — Personality overview by rising sign.
 */
export const ASCENDANT_TEXT = {
  Aries: "With Aries rising, you project confidence, initiative, and a pioneering spirit. You lead with action and instinct, preferring to learn by doing rather than waiting. Mars rules your chart, giving you physical vitality and a direct approach to life.",
  Taurus: "With Taurus rising, you carry a steady, grounded presence. You value stability, beauty, and material security. Venus rules your chart, giving you an appreciation for comfort and an ability to build lasting things through patience.",
  Gemini: "With Gemini rising, you come across as curious, communicative, and mentally agile. You process life through ideas and conversation. Mercury rules your chart, making you adaptable and quick-witted, though sometimes scattered.",
  Cancer: "With Cancer rising, you lead with emotional intelligence and a nurturing instinct. You're deeply attuned to moods and environments. The Moon rules your chart, making your emotional state the lens through which you experience everything.",
  Leo: "With Leo rising, you carry natural authority and warmth. You're drawn to creative expression and leadership. The Sun rules your chart, giving you a strong sense of purpose and a need to be seen and appreciated for who you are.",
  Virgo: "With Virgo rising, you approach life with precision, analysis, and a desire to improve. You notice details others miss. Mercury rules your chart, orienting you toward practical problem-solving and service to others.",
  Libra: "With Libra rising, you project grace, diplomacy, and a desire for harmony. Relationships are central to your life path. Venus rules your chart, giving you aesthetic sensibility and a talent for finding balance.",
  Scorpio: "With Scorpio rising, you carry depth, intensity, and a penetrating awareness. You're drawn to truth beneath surfaces. Mars rules your chart, giving you resilience, determination, and the ability to transform through crisis.",
  Sagittarius: "With Sagittarius rising, you project optimism, philosophical depth, and a love of freedom. You're a natural teacher and explorer. Jupiter rules your chart, giving you an expansive worldview and faith in life's possibilities.",
  Capricorn: "With Capricorn rising, you approach life with ambition, discipline, and long-term vision. You build slowly but permanently. Saturn rules your chart, giving you patience, responsibility, and a drive to earn your achievements.",
  Aquarius: "With Aquarius rising, you project independence, originality, and a humanitarian outlook. You think in terms of systems and the collective. Saturn rules your chart, combining unconventional ideas with structured execution.",
  Pisces: "With Pisces rising, you carry sensitivity, compassion, and spiritual awareness. You absorb the energy around you and process life through intuition and feeling. Jupiter rules your chart, giving you faith, imagination, and a connection to something larger.",
};

/**
 * MOON_SIGN_TEXT — Emotional nature by Moon sign.
 */
export const MOON_SIGN_TEXT = {
  Aries: "Your Moon in Aries gives you quick, fiery emotions. You process feelings through action and need independence in your inner life. Emotional needs: autonomy, honesty, momentum.",
  Taurus: "Your Moon in Taurus creates deep emotional stability. You find comfort through sensory pleasures, routine, and the familiar. Emotional needs: security, consistency, beauty.",
  Gemini: "Your Moon in Gemini means you process emotions through conversation and mental activity. You need variety and stimulation to feel alive. Emotional needs: communication, learning, social connection.",
  Cancer: "Your Moon in Cancer is in its own sign — your emotions are powerful, intuitive, and deeply tied to home and family. You feel everything intensely. Emotional needs: belonging, nurturing, emotional safety.",
  Leo: "Your Moon in Leo gives you a warm, generous emotional nature. You need creative outlets and recognition for your inner self. Emotional needs: appreciation, self-expression, loyalty.",
  Virgo: "Your Moon in Virgo processes emotions analytically. You find comfort in being useful, organized, and improving things. Emotional needs: order, purpose, health.",
  Libra: "Your Moon in Libra seeks emotional balance through relationships and beauty. You process feelings through dialogue and shared experiences. Emotional needs: harmony, partnership, fairness.",
  Scorpio: "Your Moon in Scorpio gives you intense, transformative emotions. You feel deeply and don't do anything halfway emotionally. Emotional needs: depth, trust, emotional honesty.",
  Sagittarius: "Your Moon in Sagittarius needs freedom and meaning in your emotional life. You process feelings through philosophy, travel, and big-picture thinking. Emotional needs: adventure, growth, faith.",
  Capricorn: "Your Moon in Capricorn gives you controlled, pragmatic emotions. You process feelings through structure and achievement. Emotional needs: respect, accomplishment, stability.",
  Aquarius: "Your Moon in Aquarius creates a detached, independent emotional nature. You process feelings through ideas and social causes. Emotional needs: freedom, intellectual stimulation, community.",
  Pisces: "Your Moon in Pisces gives you boundless empathy and spiritual sensitivity. You absorb others' emotions easily and need creative or spiritual outlets. Emotional needs: solitude, imagination, transcendence.",
};

/**
 * SUN_SIGN_TEXT — Core identity / vitality by Sun sign.
 */
export const SUN_SIGN_TEXT = {
  Aries: "Your Sun in Aries fuels your core identity with courage, initiative, and a need to pioneer. You come alive when starting new things and taking action.",
  Taurus: "Your Sun in Taurus grounds your identity in stability, patience, and material mastery. You thrive through building, sustaining, and enjoying life's pleasures.",
  Gemini: "Your Sun in Gemini makes communication and learning central to who you are. Your vitality comes through ideas, variety, and connecting with others.",
  Cancer: "Your Sun in Cancer places home, family, and emotional connection at the heart of your identity. You shine through nurturing and protecting what you love.",
  Leo: "Your Sun in Leo — its own sign — gives you powerful self-expression, creativity, and natural authority. You're at your best when leading from the heart.",
  Virgo: "Your Sun in Virgo makes service, analysis, and continuous improvement central to your identity. You shine through practical contribution and attention to detail.",
  Libra: "Your Sun in Libra places relationships, aesthetics, and justice at the center of who you are. You thrive in partnership and collaborative environments.",
  Scorpio: "Your Sun in Scorpio gives you intensity, depth, and transformative power at your core. You shine through emotional courage and the willingness to face hard truths.",
  Sagittarius: "Your Sun in Sagittarius makes you a seeker — your identity is built around growth, exploration, and the pursuit of meaning. You shine through teaching and inspiring others.",
  Capricorn: "Your Sun in Capricorn makes discipline, achievement, and long-term planning central to who you are. You shine through competence and earning your place.",
  Aquarius: "Your Sun in Aquarius places innovation, independence, and social vision at the core of your identity. You shine when breaking conventions for the greater good.",
  Pisces: "Your Sun in Pisces gives you a compassionate, imaginative core identity. You shine through creativity, spiritual connection, and dissolving boundaries between people.",
};

/**
 * PLANET_IN_HOUSE_NATAL — Brief natal planet-in-house meanings (key placements only).
 * Used for chart overview highlights.
 */
export const PLANET_IN_HOUSE_NATAL = {
  Ju_1: "Jupiter in your 1st house gives you natural optimism, wisdom, and a generous personality.",
  Ju_4: "Jupiter in the 4th blesses your home life, emotional foundations, and relationship with your mother.",
  Ju_5: "Jupiter in the 5th is one of the best placements — it expands creativity, intelligence, and good fortune.",
  Ju_7: "Jupiter in the 7th brings blessings to partnerships and marriage; you attract wise, generous partners.",
  Ju_9: "Jupiter in the 9th — its joy — amplifies fortune, higher learning, and spiritual wisdom.",
  Ju_10: "Jupiter in the 10th elevates your career and public standing through wisdom and ethical leadership.",
  Sa_1: "Saturn in your 1st house builds character through early life challenges; you grow more confident with age.",
  Sa_7: "Saturn in the 7th brings serious, committed relationships but may delay marriage or test partnerships.",
  Sa_10: "Saturn in the 10th is powerful for career — it demands hard work but delivers lasting professional achievement.",
  Ve_1: "Venus in your 1st house gives you charm, attractiveness, and an appreciation for beauty in all forms.",
  Ve_4: "Venus in the 4th blesses your home with comfort, beauty, and domestic happiness.",
  Ve_7: "Venus in the 7th is excellent for relationships — you attract harmonious, loving partnerships.",
  Ma_1: "Mars in your 1st house gives you physical energy, assertiveness, and a competitive edge.",
  Ma_10: "Mars in the 10th drives ambitious career action; you excel in leadership and competitive fields.",
  Ra_1: "Rahu in the 1st amplifies your personality with unusual ambitions and a magnetic, unconventional presence.",
  Ra_10: "Rahu in the 10th drives intense worldly ambition; career may involve technology, foreign connections, or unconventional paths.",
  Ke_12: "Ketu in the 12th is a spiritually powerful placement — natural inclination toward meditation, dreams, and letting go.",
  Ke_1: "Ketu in the 1st can make you seem detached or otherworldly; you have past-life mastery but may struggle with self-identity.",
};
