/**
 * MetronomeState - Single source of truth for metronome state
 * Implements an observable pattern so modules can subscribe to state changes
 */

const DEFAULT_STATE = {
  bpm: 120,
  timeSignature: 4,
  isPlaying: false,
  currentBeat: 0,
};

class MetronomeState {
  constructor() {
    this._state = { ...DEFAULT_STATE };
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

  // Setters with notification
  setBpm(value) {
    const newBpm = Math.max(20, Math.min(300, value));
    if (this._state.bpm !== newBpm) {
      this._state.bpm = newBpm;
      this._notify('bpm', newBpm);
    }
  }

  setTimeSignature(value) {
    const newTimeSignature = Math.max(2, Math.min(14, value));
    if (this._state.timeSignature !== newTimeSignature) {
      this._state.timeSignature = newTimeSignature;
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
    this._state.currentBeat = 0;
    this._notify('currentBeat', 0);
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

  // Reset to defaults
  reset() {
    Object.keys(DEFAULT_STATE).forEach(key => {
      this._state[key] = DEFAULT_STATE[key];
      this._notify(key, DEFAULT_STATE[key]);
    });
  }
}

// Export singleton instance
export const metronomeState = new MetronomeState();
