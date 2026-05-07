import 'nes.css/css/nes.min.css';

import { metronomeState } from './state/MetronomeState.js';
import { audioEngine } from './audio/AudioEngine.js';
import { beatVisualizer } from './ui/BeatVisualizer.js';
import { tempoDisplay } from './ui/TempoDisplay.js';
import { controls } from './ui/Controls.js';
import { colorMenu } from './ui/ColorMenu.js';
import { toneMenu } from './ui/ToneMenu.js';
import { creditsMenu } from './ui/CreditsMenu.js';

function initFullscreen() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || navigator.standalone;
  if (isStandalone) return;

  const el = document.documentElement;
  const request = el.requestFullscreen || el.webkitRequestFullscreen;
  if (!request) return;

  document.addEventListener('touchstart', function goFullscreen() {
    request.call(el).catch(() => {});
    document.removeEventListener('touchstart', goFullscreen);
  }, { once: true });
}

function initApp() {
  beatVisualizer.init('timeBlocksContainer');
  tempoDisplay.init('.tempo');
  controls.init();
  colorMenu.init();
  toneMenu.init();
  creditsMenu.init();
  initFullscreen();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
