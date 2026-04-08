/**
 * MetronomeState - Single source of truth for metronome state
 * Implements an observable pattern so modules can subscribe to state changes
 */

const DEFAULT_STATE = {
  bpm: 120,
  timeSignature: 4,
  isPlaying: false,
  currentBeat: -1,
  subdivision: 'quarter',
};

class MetronomeState {
  constructor() {
    this._state = { ...DEFAULT_STATE };
    this._beatStates = this._defaultBeatStates(DEFAULT_STATE.timeSignature);
    this._listeners = new Map();
  }

  // Getters
  get bpm() {
    return this._state.bpm;
  }

  get timeSignature() {
    return this._state.timeSignature;
  }

  get isPlaying() {
    return this._state.isPlaying;
  }

  get currentBeat() {
    return this._state.currentBeat;
  }

  get subdivision() {
    return this._state.subdivision;
  }

  get accents() {
    return this._beatStates;
  }

  // Setters with notification
  setBpm(value) {
    const newBpm = Math.max(20, Math.min(300, value));
    if (this._state.bpm !== newBpm) {
      this._state.bpm = newBpm;
      this._notify('bpm', newBpm);
    }
  }

  setTimeSignature(value) {
    const newTimeSignature = Math.max(2, Math.min(16, value));
    if (this._state.timeSignature !== newTimeSignature) {
      this._state.timeSignature = newTimeSignature;
      this._beatStates = this._defaultBeatStates(newTimeSignature);
      this._notify('accents', this._beatStates);
      this._notify('timeSignature', newTimeSignature);
    }
  }

  setIsPlaying(value) {
    if (this._state.isPlaying !== value) {
      this._state.isPlaying = value;
      this._notify('isPlaying', value);
    }
  }

  setCurrentBeat(value) {
    const newBeat = value % this._state.timeSignature;
    if (this._state.currentBeat !== newBeat) {
      this._state.currentBeat = newBeat;
      this._notify('currentBeat', newBeat);
    }
  }

  resetCurrentBeat() {
    this._state.currentBeat = -1;
    this._notify('currentBeat', -1);
  }

  setSubdivision(value) {
    const valid = ['quarter', 'eighth', 'sixteenth', 'triplet'];
    if (valid.includes(value) && this._state.subdivision !== value) {
      this._state.subdivision = value;
      this._notify('subdivision', value);
    }
  }

  toggleAccent(beatIndex) {
    if (beatIndex >= 0 && beatIndex < this._beatStates.length) {
      const cycle = { normal: 'accent', accent: 'muted', muted: 'normal' };
      this._beatStates[beatIndex] = cycle[this._beatStates[beatIndex]];
      this._notify('accents', this._beatStates);
    }
  }

  isAccented(beatIndex) {
    return this._beatStates[beatIndex] === 'accent';
  }

  isMuted(beatIndex) {
    return this._beatStates[beatIndex] === 'muted';
  }

  _defaultBeatStates(count) {
    const states = new Array(count).fill('normal');
    states[0] = 'accent';
    return states;
  }

  // Observable pattern
  subscribe(property, callback) {
    if (!this._listeners.has(property)) {
      this._listeners.set(property, new Set());
    }
    this._listeners.get(property).add(callback);

    // Return unsubscribe function
    return () => {
      this._listeners.get(property).delete(callback);
    };
  }

  _notify(property, value) {
    if (this._listeners.has(property)) {
      this._listeners.get(property).forEach(callback => callback(value));
    }
  }
}

// Export singleton instance
export const metronomeState = new MetronomeState();
