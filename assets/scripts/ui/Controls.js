import { metronomeState } from '../state/MetronomeState.js';
import { audioEngine } from '../audio/AudioEngine.js';
import { colorMenu } from './ColorMenu.js';
import { toneMenu } from './ToneMenu.js';

class Controls {
  constructor() {
    this._elements = {};
    this._holdInterval = null;
    this._holdDelay = 150;
  }

  init() {
    this._cacheElements();
    this._bindEvents();
    this._subscribeToState();
  }

  _cacheElements() {
    this._elements = {
      btnStart: document.getElementById('btnStart'),
      btnStop: document.getElementById('btnStop'),

      dpadUp: document.getElementById('dpadUp'),
      dpadDown: document.getElementById('dpadDown'),
      dpadLeft: document.getElementById('dpadLeft'),
      dpadRight: document.getElementById('dpadRight'),

      beatCountDisplay: document.querySelector('.beat-count'),

      selectBtn: document.getElementById('selectBtn'),
      startBtn: document.getElementById('startBtn'),
    };
  }

  _bindEvents() {
    if (this._elements.btnStart) {
      const handleStart = async (e) => {
        e.preventDefault();
        await this._handleStart();
      };
      this._elements.btnStart.addEventListener('click', handleStart);
      this._elements.btnStart.addEventListener('touchend', handleStart);
    }

    if (this._elements.btnStop) {
      const handleStop = (e) => {
        e.preventDefault();
        this._handleStop();
      };
      this._elements.btnStop.addEventListener('click', handleStop);
      this._elements.btnStop.addEventListener('touchend', handleStop);
    }

    if (this._elements.dpadUp) {
      this._bindHoldAction(this._elements.dpadUp, () => {
        metronomeState.setBpm(metronomeState.bpm + 1);
      });
    }

    if (this._elements.dpadDown) {
      this._bindHoldAction(this._elements.dpadDown, () => {
        metronomeState.setBpm(metronomeState.bpm - 1);
      });
    }

    if (this._elements.dpadRight) {
      const addBeat = (e) => {
        e.preventDefault();
        metronomeState.setTimeSignature(metronomeState.timeSignature + 1);
      };
      this._elements.dpadRight.addEventListener('click', addBeat);
      this._elements.dpadRight.addEventListener('touchend', addBeat);
    }

    if (this._elements.dpadLeft) {
      const removeBeat = (e) => {
        e.preventDefault();
        metronomeState.setTimeSignature(metronomeState.timeSignature - 1);
      };
      this._elements.dpadLeft.addEventListener('click', removeBeat);
      this._elements.dpadLeft.addEventListener('touchend', removeBeat);
    }

    if (this._elements.selectBtn) {
      const toggleColors = (e) => {
        e.preventDefault();
        if (toneMenu.isOpen) toneMenu.close();
        colorMenu.toggle();
      };
      this._elements.selectBtn.addEventListener('click', toggleColors);
      this._elements.selectBtn.addEventListener('touchend', toggleColors);
    }

    if (this._elements.startBtn) {
      const toggleTones = (e) => {
        e.preventDefault();
        if (colorMenu.isOpen) colorMenu.close();
        toneMenu.toggle();
      };
      this._elements.startBtn.addEventListener('click', toggleTones);
      this._elements.startBtn.addEventListener('touchend', toggleTones);
    }
  }

  _bindHoldAction(element, action) {
    let isHolding = false;

    const startHold = (e) => {
      e.preventDefault();
      if (isHolding) return;
      isHolding = true;
      action();
      this._holdInterval = setInterval(action, this._holdDelay);
    };

    const endHold = () => {
      isHolding = false;
      if (this._holdInterval) {
        clearInterval(this._holdInterval);
        this._holdInterval = null;
      }
    };

    element.addEventListener('mousedown', startHold);
    element.addEventListener('mouseup', endHold);
    element.addEventListener('mouseleave', endHold);

    element.addEventListener('touchstart', startHold, { passive: false });
    element.addEventListener('touchend', endHold);
    element.addEventListener('touchcancel', endHold);
  }

  _subscribeToState() {
    metronomeState.subscribe('timeSignature', (timeSignature) => {
      if (this._elements.beatCountDisplay) {
        this._elements.beatCountDisplay.textContent = timeSignature;
      }
    });

    metronomeState.subscribe('isPlaying', (isPlaying) => {
      if (this._elements.btnStart) {
        this._elements.btnStart.style.opacity = isPlaying ? '0.5' : '1';
      }
      if (this._elements.btnStop) {
        this._elements.btnStop.style.opacity = isPlaying ? '1' : '0.5';
      }
    });
  }

  async _handleStart() {
    if (metronomeState.isPlaying) return;

    if (!audioEngine.isInitialized) {
      await audioEngine.init();
    }
    audioEngine.start();
  }

  _handleStop() {
    if (!metronomeState.isPlaying) return;
    audioEngine.stop();
  }
}

export const controls = new Controls();
