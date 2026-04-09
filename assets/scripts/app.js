import 'nes.css/css/nes.min.css';

import { metronomeState } from './state/MetronomeState.js';
import { audioEngine } from './audio/AudioEngine.js';
import { beatVisualizer } from './ui/BeatVisualizer.js';
import { tempoDisplay } from './ui/TempoDisplay.js';
import { controls } from './ui/Controls.js';
import { colorMenu } from './ui/ColorMenu.js';
import { toneMenu } from './ui/ToneMenu.js';

function initApp() {
  beatVisualizer.init('timeBlocksContainer');
  tempoDisplay.init('.tempo');
  controls.init();
  colorMenu.init();
  toneMenu.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
