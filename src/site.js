import { initForms } from './forms.js';
import { initExamples } from './examples.js';
import { initWheelScroll } from './wheel-scroll.js';
import { initUI } from './ui.js';
import { initHero } from './hero.js';
import { initGuide } from './guide.js';
import { initHovers, initReveals, initAnchorScroll } from './motion.js';

// Each enhancement is isolated: one decorative failure cannot disable navigation.
for (const initialize of [initForms, initExamples, initWheelScroll, initUI, initHero, initGuide, initHovers, initReveals, initAnchorScroll]) {
  try { initialize(); } catch (error) { console.error(`HYS: ${initialize.name} could not initialize`, error); }
}
document.documentElement.dataset.motionEngine = 'framer-motion';
