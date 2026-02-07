/**
 * AudioEngine - Handles all Tone.js audio functionality
 * Single source of truth for audio-related operations
 */

import * as Tone from 'tone';
import { metronomeState } from '../state/MetronomeState.js';

class AudioEngine {
  constructor() {
    this._isInitialized = false;
    this._transport = null;
    this._synth = null;
    this._loop = null;
    this._draw = null;
    this._beatCallback = null;
  }

  /**
   * Initialize the audio engine - must be called after user interaction
   */
  async init() {
    if (this._isInitialized) return;

    await Tone.start();
    
    this._transport = Tone.getTransport();
    this._draw = Tone.getDraw();
    
    // Create synth for metronome clicks
    this._synth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1
      }
    }).toDestination();
    
    this._synth.volume.value = -13;
    
    // Sync transport BPM with state
    this._transport.bpm.value = metronomeState.bpm;
    this._transport.timeSignature = metronomeState.timeSignature;
    
    // Subscribe to state changes
    metronomeState.subscribe('bpm', (bpm) => {
      this._transport.bpm.value = bpm;
    });

    metronomeState.subscribe('timeSignature', (timeSignature) => {
      this._transport.timeSignature = timeSignature;
      // Restart loop if playing to apply new time signature
      if (metronomeState.isPlaying) {
        this._restartLoop();
      }
    });

    this._isInitialized = true;
  }

  /**
   * Register a callback to be called on each beat (for visual updates)
   */
  onBeat(callback) {
    this._beatCallback = callback;
  }

  /**
   * Start the metronome
   */
  start() {
    if (!this._isInitialized) {
      console.warn('AudioEngine not initialized. Call init() first.');
      return;
    }

    this._createLoop();
    this._transport.start();
    metronomeState.setIsPlaying(true);
  }

  /**
   * Stop the metronome
   */
  stop() {
    if (!this._isInitialized) return;

    this._transport.stop();
    if (this._loop) {
      this._loop.stop();
      this._loop.dispose();
      this._loop = null;
    }
    metronomeState.setIsPlaying(false);
    metronomeState.resetCurrentBeat();
  }

  /**
   * Toggle metronome on/off
   */
  toggle() {
    if (metronomeState.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  /**
   * Create the metronome loop
   */
  _createLoop() {
    let beatCounter = 0;
    
    this._loop = new Tone.Loop((time) => {
      const timeSignature = metronomeState.timeSignature;
      
      // Play accent on beat 1, regular click on other beats
      if (beatCounter === 0) {
        this._synth.triggerAttackRelease('C5', '16n', time);
      } else {
        this._synth.triggerAttackRelease('C4', '16n', time);
      }

      // Schedule visual update using Draw for sync with audio
      const currentBeat = beatCounter;
      this._draw.schedule(() => {
        metronomeState.setCurrentBeat(currentBeat);
        if (this._beatCallback) {
          this._beatCallback(currentBeat);
        }
      }, time);

      beatCounter = (beatCounter + 1) % timeSignature;
    }, '4n').start(0);
  }

  /**
   * Restart the loop (used when time signature changes)
   */
  _restartLoop() {
    if (this._loop) {
      this._loop.stop();
      this._loop.dispose();
    }
    metronomeState.resetCurrentBeat();
    this._createLoop();
  }

  /**
   * Set the oscillator type for the synth
   */
  setOscillatorType(type) {
    if (this._synth) {
      this._synth.oscillator.type = type;
    }
  }

  /**
   * Check if audio engine is initialized
   */
  get isInitialized() {
    return this._isInitialized;
  }

  /**
   * Dispose of all audio resources
   */
  dispose() {
    this.stop();
    if (this._synth) {
      this._synth.dispose();
      this._synth = null;
    }
    this._isInitialized = false;
  }
}

// Export singleton instance
export const audioEngine = new AudioEngine();
