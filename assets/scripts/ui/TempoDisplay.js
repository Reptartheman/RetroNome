import { metronomeState } from '../state/MetronomeState.js';

class TempoDisplay {
  constructor() {
    this._tempoElement = null;
  }

  init(tempoSelector = '.tempo') {
    this._tempoElement = document.querySelector(tempoSelector);

    metronomeState.subscribe('bpm', (bpm) => {
      this._updateDisplay(bpm);
    });

    this._updateDisplay(metronomeState.bpm);
  }

  _updateDisplay(bpm) {
    if (this._tempoElement) {
      this._tempoElement.textContent = `${bpm} BPM`;
    }
  }
}

export const tempoDisplay = new TempoDisplay();
