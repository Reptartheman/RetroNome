/**
 * ToneMenu - Handles the tone selection menu displayed on the screen
 * Toggled by the TONES button
 */

import { audioEngine } from '../audio/AudioEngine.js';

const TONES = [
  { label: 'SINE', type: 'sine' },
  { label: 'SAW', type: 'sawtooth' },
  { label: 'TRIANGLE', type: 'triangle' },
  { label: 'PULSE', type: 'pulse' },
];

class ToneMenu {
  constructor() {
    this._isOpen = false;
    this._menuEl = null;
    this._screenInner = null;
    this._selectedIndex = 2; // triangle is the default
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

    const title = document.createElement('div');
    title.className = 'tone-menu-title';
    title.textContent = 'TONES';
    menu.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'tone-grid';

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

        grid.querySelectorAll('.tone-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });

      grid.appendChild(btn);
    });

    menu.appendChild(grid);
    return menu;
  }
}

// Export singleton instance
export const toneMenu = new ToneMenu();
