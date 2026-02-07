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
 * Initialize the application
 */
function initApp() {
  // Initialize UI components
  beatVisualizer.init('timeBlocksContainer');
  tempoDisplay.init('.tempo');
  controls.init();
  colorMenu.init();
  toneMenu.init();

  console.log('RetroNome initialized!');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for debugging in console if needed
window.RetroNome = {
  state: metronomeState,
  audio: audioEngine
};
