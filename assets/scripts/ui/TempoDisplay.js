/**
 * TempoDisplay - Handles tempo display
 * Subscribes to BPM changes and updates UI accordingly
 */

import { metronomeState } from '../state/MetronomeState.js';

class TempoDisplay {
  constructor() {
    this._tempoElement = null;
  }

  /**
   * Initialize the tempo display
   */
  init(tempoSelector = '.tempo') {
    this._tempoElement = document.querySelector(tempoSelector);

    // Subscribe to BPM changes
    metronomeState.subscribe('bpm', (bpm) => {
      this._updateDisplay(bpm);
    });

    // Initial display
    this._updateDisplay(metronomeState.bpm);
  }

  /**
   * Update the tempo display with current BPM
   */
  _updateDisplay(bpm) {
    if (this._tempoElement) {
      this._tempoElement.textContent = `${bpm} BPM`;
    }
  }
}

// Export singleton instance
export const tempoDisplay = new TempoDisplay();
