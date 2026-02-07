/**
 * Controls - Handles all user input controls
 * Bridges user interactions with state and audio engine
 */

import { metronomeState } from '../state/MetronomeState.js';
import { audioEngine } from '../audio/AudioEngine.js';
import { colorMenu } from './ColorMenu.js';
import { toneMenu } from './ToneMenu.js';

class Controls {
  constructor() {
    this._elements = {};
    this._holdInterval = null;
    this._holdDelay = 150; // ms between repeats when holding
  }

  /**
   * Initialize all controls
   */
  init() {
    this._cacheElements();
    this._bindEvents();
    this._subscribeToState();
  }

  /**
   * Cache DOM elements
   */
  _cacheElements() {
    this._elements = {
      // Start/Stop buttons (A and B)
      startStopBtns: document.querySelectorAll('.start-stop'),
      btnStart: document.getElementById('btnStart'),
      btnStop: document.getElementById('btnStop'),
      
      // D-Pad buttons
      dpadUp: document.getElementById('dpadUp'),
      dpadDown: document.getElementById('dpadDown'),
      dpadLeft: document.getElementById('dpadLeft'),
      dpadRight: document.getElementById('dpadRight'),
      
      // Display elements
      beatCountDisplay: document.querySelector('.beat-count'),
      tempoDisplay: document.querySelector('.tempo'),

      // Menu buttons
      selectBtn: document.getElementById('selectBtn'),
      startBtn: document.getElementById('startBtn'),
    };
  }

  /**
   * Bind event listeners
   */
  _bindEvents() {
    // A Button (Start)
    if (this._elements.btnStart) {
      this._elements.btnStart.addEventListener('click', async (e) => {
        e.preventDefault();
        await this._handleStart();
      });
    }

    // B Button (Stop)
    if (this._elements.btnStop) {
      this._elements.btnStop.addEventListener('click', (e) => {
        e.preventDefault();
        this._handleStop();
      });
    }

    // D-Pad Up - Increase tempo (with hold support)
    if (this._elements.dpadUp) {
      this._bindHoldAction(this._elements.dpadUp, () => {
        metronomeState.setBpm(metronomeState.bpm + 1);
      });
    }

    // D-Pad Down - Decrease tempo (with hold support)
    if (this._elements.dpadDown) {
      this._bindHoldAction(this._elements.dpadDown, () => {
        metronomeState.setBpm(metronomeState.bpm - 1);
      });
    }

    // D-Pad Right - Add beat
    if (this._elements.dpadRight) {
      this._elements.dpadRight.addEventListener('click', () => {
        const currentBeats = metronomeState.timeSignature;
        if (currentBeats >= 14) {
          return; // Max beats reached
        }
        metronomeState.setTimeSignature(currentBeats + 1);
      });
    }

    // D-Pad Left - Remove beat
    if (this._elements.dpadLeft) {
      this._elements.dpadLeft.addEventListener('click', () => {
        metronomeState.setTimeSignature(metronomeState.timeSignature - 1);
      });
    }

    // COLORS - Toggle color menu (close tone menu if open)
    if (this._elements.selectBtn) {
      this._elements.selectBtn.addEventListener('click', () => {
        if (toneMenu.isOpen) toneMenu.close();
        colorMenu.toggle();
      });
    }

    // TONES - Toggle tone menu (close color menu if open)
    if (this._elements.startBtn) {
      this._elements.startBtn.addEventListener('click', () => {
        if (colorMenu.isOpen) colorMenu.close();
        toneMenu.toggle();
      });
    }
  }

  /**
   * Bind hold action for continuous input (tap and hold)
   */
  _bindHoldAction(element, action) {
    let isHolding = false;

    const startHold = (e) => {
      e.preventDefault();
      if (isHolding) return;
      isHolding = true;
      action(); // Immediate action
      this._holdInterval = setInterval(action, this._holdDelay);
    };

    const endHold = () => {
      isHolding = false;
      if (this._holdInterval) {
        clearInterval(this._holdInterval);
        this._holdInterval = null;
      }
    };

    // Mouse events
    element.addEventListener('mousedown', startHold);
    element.addEventListener('mouseup', endHold);
    element.addEventListener('mouseleave', endHold);

    // Touch events
    element.addEventListener('touchstart', startHold, { passive: false });
    element.addEventListener('touchend', endHold);
    element.addEventListener('touchcancel', endHold);
  }

  /**
   * Subscribe to state changes for UI updates
   */
  _subscribeToState() {
    // Update beat count display
    metronomeState.subscribe('timeSignature', (timeSignature) => {
      if (this._elements.beatCountDisplay) {
        this._elements.beatCountDisplay.textContent = timeSignature;
      }
    });

    // Update button states based on playing state
    metronomeState.subscribe('isPlaying', (isPlaying) => {
      if (this._elements.btnStart) {
        this._elements.btnStart.style.opacity = isPlaying ? '0.5' : '1';
      }
      if (this._elements.btnStop) {
        this._elements.btnStop.style.opacity = isPlaying ? '1' : '0.5';
      }
    });
  }

  /**
   * Handle start
   */
  async _handleStart() {
    if (metronomeState.isPlaying) return; // Already playing
    
    // Initialize audio engine on first interaction (required by browsers)
    if (!audioEngine.isInitialized) {
      await audioEngine.init();
    }
    audioEngine.start();
  }

  /**
   * Handle stop
   */
  _handleStop() {
    if (!metronomeState.isPlaying) return; // Already stopped
    audioEngine.stop();
  }
}

// Export singleton instance
export const controls = new Controls();
