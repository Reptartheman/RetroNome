/**
 * ToneMenu - Handles the tone selection menu displayed on the screen
 * Toggled by the TONES button
 */

import { audioEngine } from '../audio/AudioEngine.js';
import { metronomeState } from '../state/MetronomeState.js';

const TONES = [
  { label: 'SINE', type: 'sine' },
  { label: 'SAW', type: 'sawtooth' },
  { label: 'TRIANGLE', type: 'triangle' },
  { label: 'PULSE', type: 'pulse' },
];

const SUBDIVISIONS = [
  { label: 'quarter', key: 'quarter' },
  { label: 'eighth', key: 'eighth' },
  { label: 'sixteenth', key: 'sixteenth' },
  { label: 'triplets', key: 'triplet' },
];

class ToneMenu {
  constructor() {
    this._isOpen = false;
    this._menuEl = null;
    this._screenInner = null;
    this._selectedIndex = 2; // triangle is the default
    this._selectedSubIndex = 0; // quarter notes is the default
  }

  get isOpen() {
    return this._isOpen;
  }

  init() {
    this._screenInner = document.querySelector('.screen-inner');
  }

  toggle() {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this._isOpen) return;
    this._isOpen = true;

    // Hide existing screen content
    Array.from(this._screenInner.children).forEach(child => {
      if (!child.classList.contains('tone-menu')) {
        child.style.display = 'none';
      }
    });

    this._menuEl = this._createMenu();
    this._screenInner.appendChild(this._menuEl);
  }

  close() {
    if (!this._isOpen) return;
    this._isOpen = false;

    if (this._menuEl) {
      this._menuEl.remove();
      this._menuEl = null;
    }

    // Restore existing screen content
    Array.from(this._screenInner.children).forEach(child => {
      child.style.display = '';
    });
  }

  _createMenu() {
    const menu = document.createElement('div');
    menu.className = 'tone-menu';

    // --- Tones section ---
    const toneTitle = document.createElement('div');
    toneTitle.className = 'tone-menu-title';
    toneTitle.textContent = 'TONES';
    menu.appendChild(toneTitle);

    const toneGrid = document.createElement('div');
    toneGrid.className = 'tone-grid';

    TONES.forEach((tone, index) => {
      const btn = document.createElement('button');
      btn.className = 'tone-option';
      btn.textContent = tone.label;

      if (this._selectedIndex === index) {
        btn.classList.add('selected');
      }

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this._selectedIndex = index;
        audioEngine.setOscillatorType(tone.type);

        toneGrid.querySelectorAll('.tone-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });

      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this._selectedIndex = index;
        audioEngine.setOscillatorType(tone.type);

        toneGrid.querySelectorAll('.tone-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });

      toneGrid.appendChild(btn);
    });

    menu.appendChild(toneGrid);

    // --- Divider ---
    const hr = document.createElement('hr');
    hr.className = 'tone-menu-divider';
    menu.appendChild(hr);

    // --- Subdivisions section ---
    const subTitle = document.createElement('div');
    subTitle.className = 'tone-menu-title';
    subTitle.textContent = 'SUBDIVISION';
    menu.appendChild(subTitle);

    const subGrid = document.createElement('div');
    subGrid.className = 'tone-grid';

    SUBDIVISIONS.forEach((sub, index) => {
      const btn = document.createElement('button');
      btn.className = 'tone-option';
      btn.textContent = sub.label;

      if (this._selectedSubIndex === index) {
        btn.classList.add('selected');
      }

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this._selectedSubIndex = index;
        metronomeState.setSubdivision(sub.key);

        subGrid.querySelectorAll('.tone-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });

      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this._selectedSubIndex = index;
        metronomeState.setSubdivision(sub.key);

        subGrid.querySelectorAll('.tone-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });

      subGrid.appendChild(btn);
    });

    menu.appendChild(subGrid);
    return menu;
  }
}

// Export singleton instance
export const toneMenu = new ToneMenu();
