import { metronomeState } from '../state/MetronomeState.js';
import { audioEngine } from '../audio/AudioEngine.js';
import { colorMenu } from './ColorMenu.js';
import { toneMenu } from './ToneMenu.js';
import { creditsMenu } from './CreditsMenu.js';

const HOLD_REPEAT_MS = 150;

class Controls {
  constructor() {
    this._elements = {};
    this._holdInterval = null;
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
      brandText: document.querySelector('.brand-color'),
    };
  }

  _bindEvents() {
    const e = this._elements;

    this._onClick(e.btnStart, () => this._handleStart());
    this._onClick(e.btnStop, () => this._handleStop());

    this._bindHoldAction(e.dpadUp,   () => metronomeState.setBpm(metronomeState.bpm + 1));
    this._bindHoldAction(e.dpadDown, () => metronomeState.setBpm(metronomeState.bpm - 1));

    this._onClick(e.dpadRight, () => metronomeState.setTimeSignature(metronomeState.timeSignature + 1));
    this._onClick(e.dpadLeft,  () => metronomeState.setTimeSignature(metronomeState.timeSignature - 1));

    const menus = [colorMenu, toneMenu, creditsMenu];
    this._bindMenuToggle(e.selectBtn, colorMenu, menus);
    this._bindMenuToggle(e.startBtn,  toneMenu, menus);
    this._bindMenuToggle(e.brandText, creditsMenu, menus);
  }

  _onClick(element, handler) {
    if (!element) return;
    element.addEventListener('click', async (event) => {
      event.preventDefault();
      await handler();
    });
  }

  _bindMenuToggle(element, target, allMenus) {
    this._onClick(element, () => {
      for (const m of allMenus) {
        if (m !== target && m.isOpen) m.close();
      }
      target.toggle();
    });
  }

  _bindHoldAction(element, action) {
    if (!element) return;
    let isHolding = false;

    const startHold = (e) => {
      e.preventDefault();
      if (isHolding) return;
      isHolding = true;
      action();
      this._holdInterval = setInterval(action, HOLD_REPEAT_MS);
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
