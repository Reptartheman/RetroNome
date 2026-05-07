import { ScreenMenu } from './ScreenMenu.js';
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

class ToneMenu extends ScreenMenu {
  constructor() {
    super('tone-menu');
    this._selectedIndex = 2;
    this._selectedSubIndex = 0;
  }

  _createMenu() {
    const menu = document.createElement('div');
    menu.className = 'tone-menu';

    menu.appendChild(this._createTitle('TONES'));
    menu.appendChild(this._createGrid(TONES, this._selectedIndex, (item, index) => {
      this._selectedIndex = index;
      audioEngine.setOscillatorType(item.type);
    }));

    const hr = document.createElement('hr');
    hr.className = 'tone-menu-divider';
    menu.appendChild(hr);

    menu.appendChild(this._createTitle('SUBDIVISION'));
    menu.appendChild(this._createGrid(SUBDIVISIONS, this._selectedSubIndex, (item, index) => {
      this._selectedSubIndex = index;
      metronomeState.setSubdivision(item.key);
    }));

    return menu;
  }

  _createTitle(text) {
    const title = document.createElement('div');
    title.className = 'tone-menu-title';
    title.textContent = text;
    return title;
  }

  _createGrid(items, selectedIndex, onSelect) {
    const grid = document.createElement('div');
    grid.className = 'tone-grid';

    items.forEach((item, index) => {
      const btn = document.createElement('button');
      btn.className = 'tone-option';
      btn.textContent = item.label;
      if (index === selectedIndex) btn.classList.add('selected');

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        onSelect(item, index);
        grid.querySelectorAll('.tone-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });

      grid.appendChild(btn);
    });

    return grid;
  }
}

export const toneMenu = new ToneMenu();
