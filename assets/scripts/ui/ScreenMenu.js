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

    for (const child of this._screenInner.children) {
      child.style.display = '';
    }
  }

  _createMenu() {
    throw new Error('ScreenMenu subclass must implement _createMenu()');
  }
}
