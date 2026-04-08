/**
 * ColorMenu - Handles the color customization menu displayed on the screen
 * Toggled by the SELECT button
 */

const COLORS = [
  { name: 'sand-dune', value: '#e8dcc2' },
  { name: 'blue-energy', value: '#4a90e2' },
  { name: 'sage-green', value: '#6e9b71' },
  { name: 'golden-apricot', value: '#d98f45' },
  { name: 'vintage-lavender', value: '#8a72a6' },
  { name: 'graphite', value: '#2f2f2f' },
];

const TARGETS = [
  { key: 'gameboy', label: 'BODY' },
  { key: 'play', label: 'PLAY' },
  { key: 'stop', label: 'STOP' },
];

class ColorMenu {
  constructor() {
    this._isOpen = false;
    this._menuEl = null;
    this._screenInner = null;
    this._selected = {
      gameboy: null,
      play: null,
      stop: null,
    };
  }

  get isOpen() {
    return this._isOpen;
  }

  init() {
    this._screenInner = document.querySelector('.screen-inner');
    this._loadFromStorage();
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
      if (!child.classList.contains('color-menu')) {
        child.style.display = 'none';
      }
    });

    // Create and append menu
    this._menuEl = this._createMenu();
    this._screenInner.appendChild(this._menuEl);
  }

  close() {
    if (!this._isOpen) return;
    this._isOpen = false;

    // Remove menu
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
    menu.className = 'color-menu';

    const title = document.createElement('div');
    title.className = 'color-menu-title';
    title.textContent = 'COLORS';
    menu.appendChild(title);

    TARGETS.forEach(target => {
      const group = document.createElement('div');
      group.className = 'color-menu-group';

      const label = document.createElement('span');
      label.className = 'color-menu-label';
      label.textContent = target.label;
      group.appendChild(label);

      const swatches = document.createElement('div');
      swatches.className = 'color-swatches';

      COLORS.forEach((color, index) => {
        const swatch = document.createElement('button');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color.value;
        swatch.setAttribute('aria-label', `${target.label} ${color.name}`);

        // Mark as selected if this is the current choice
        if (this._selected[target.key] === index) {
          swatch.classList.add('selected');
        }

        swatch.addEventListener('click', (e) => {
          e.preventDefault();
          this._applyColor(target.key, index);

          // Update selected states within this row
          swatches.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
          swatch.classList.add('selected');
        });

        swatch.addEventListener('touchend', (e) => {
          e.preventDefault();
          this._applyColor(target.key, index);

          swatches.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
          swatch.classList.add('selected');
        });

        swatches.appendChild(swatch);
      });

      group.appendChild(swatches);
      menu.appendChild(group);
    });

    return menu;
  }

  _applyColor(target, colorIndex) {
    const color = COLORS[colorIndex].value;
    this._selected[target] = colorIndex;
    this._saveToStorage();

    switch (target) {
      case 'gameboy':
        this._applyGameboyColor(color);
        break;
      case 'play':
        this._applyPlayColor(color);
        break;
      case 'stop':
        this._applyStopColor(color);
        break;
    }
  }

  _applyGameboyColor(hex) {
    const light = this._lighten(hex, 0.25);
    const dark = this._darken(hex, 0.22);
    const gameboy = document.querySelector('.gameboy');
    gameboy.style.background = `linear-gradient(180deg, ${light} 0%, ${hex} 50%, ${dark} 100%)`;
    gameboy.style.borderColor = dark;
  }

  _applyPlayColor(hex) {
    const dark = this._darken(hex, 0.2);
    const btn = document.querySelector('.btn-a');
    btn.style.background = `linear-gradient(145deg, ${dark}, ${hex})`;
  }

  _applyStopColor(hex) {
    const dark = this._darken(hex, 0.2);
    const btn = document.querySelector('.btn-b');
    btn.style.background = `linear-gradient(145deg, ${hex}, ${dark})`;
  }

  _parseHex(hex) {
    const clean = hex.replace('#', '').slice(0, 6);
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  }

  _toHex({ r, g, b }) {
    const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
    return `#${clamp(r).toString(16).padStart(2, '0')}${clamp(g).toString(16).padStart(2, '0')}${clamp(b).toString(16).padStart(2, '0')}`;
  }

  _lighten(hex, amount) {
    const { r, g, b } = this._parseHex(hex);
    return this._toHex({
      r: r + (255 - r) * amount,
      g: g + (255 - g) * amount,
      b: b + (255 - b) * amount,
    });
  }

  _darken(hex, amount) {
    const { r, g, b } = this._parseHex(hex);
    return this._toHex({
      r: r * (1 - amount),
      g: g * (1 - amount),
      b: b * (1 - amount),
    });
  }

  _saveToStorage() {
    try {
      localStorage.setItem('retronome-colors', JSON.stringify(this._selected));
    } catch (_) { /* storage full or unavailable */ }
  }

  _loadFromStorage() {
    try {
      const saved = JSON.parse(localStorage.getItem('retronome-colors'));
      if (!saved) return;
      for (const key of Object.keys(this._selected)) {
        if (typeof saved[key] === 'number' && saved[key] >= 0 && saved[key] < COLORS.length) {
          this._applyColor(key, saved[key]);
        }
      }
    } catch (_) { /* invalid or unavailable */ }
  }
}

// Export singleton instance
export const colorMenu = new ColorMenu();
