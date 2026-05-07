/**
 * ScreenMenu - Base class for the on-screen menus (colors, tones, credits)
 *
 * Subclasses implement _createMenu() to build the menu DOM. The base handles
 * mounting/unmounting into .screen-inner and hiding sibling content while open.
 */

export class ScreenMenu {
  constructor(menuClass) {
    this._menuClass = menuClass;
    this._isOpen = false;
    this._menuEl = null;
    this._screenInner = null;
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
    for (const child of this._screenInner.children) {
      if (!child.classList.contains(this._menuClass)) {
        child.style.display = 'none';
      }
    }

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
    for (const child of this._screenInner.children) {
      child.style.display = '';
    }
  }

  /**
   * Subclasses implement: build and return the menu DOM element.
   * The element's classList must include this._menuClass.
   */
  _createMenu() {
    throw new Error('ScreenMenu subclass must implement _createMenu()');
  }
}
