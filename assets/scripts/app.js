import 'nes.css/css/nes.min.css';

/**
 * RetroNome - Main Application Entry Point
 * 
 * This app follows a modular architecture with a single source of truth:
 * 
 * - MetronomeState: Central state management with observable pattern
 * - AudioEngine: Handles all Tone.js audio functionality
 * - BeatVisualizer: Manages beat indicator blocks
 * - TempoDisplay: Shows BPM and tempo descriptions
 * - Controls: Bridges user input with state and audio
 */

import { metronomeState } from './state/MetronomeState.js';
import { audioEngine } from './audio/AudioEngine.js';
import { beatVisualizer } from './ui/BeatVisualizer.js';
import { tempoDisplay } from './ui/TempoDisplay.js';
import { controls } from './ui/Controls.js';
import { colorMenu } from './ui/ColorMenu.js';
import { toneMenu } from './ui/ToneMenu.js';

/**
 * Request fullscreen on first touch for in-browser Android users.
 * Skipped when running as an installed PWA (standalone mode).
 */
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

/**
 * Initialize the application
 */
function initApp() {
  // Initialize UI components
  beatVisualizer.init('timeBlocksContainer');
  tempoDisplay.init('.tempo');
  controls.init();
  colorMenu.init();
  toneMenu.init();
  initFullscreen();
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
