import { metronomeState } from '../state/MetronomeState.js';

class BeatVisualizer {
  constructor() {
    this._container = null;
    this._blocks = [];
  }

  init(containerId = 'timeBlocksContainer') {
    this._container = document.getElementById(containerId);
    if (!this._container) {
      console.error(`BeatVisualizer: Container #${containerId} not found`);
      return;
    }

    this._blocks = Array.from(this._container.querySelectorAll('.time-block'));

    this._updateGridLayout(this._blocks.length);

    metronomeState.subscribe('currentBeat', (beat) => {
      this._highlightBeat(beat);
    });

    metronomeState.subscribe('timeSignature', (timeSignature) => {
      this._syncBlocksWithTimeSignature(timeSignature);
    });

    metronomeState.subscribe('accents', () => {
      this._updateAccentDisplay();
    });

    this._blocks.forEach((block, index) => {
      this._bindAccentTap(block, index);
    });

    this._updateAccentDisplay();
  }

  _highlightBeat(beatIndex) {
    this._blocks.forEach((block, index) => {
      if (index === beatIndex) {
        block.classList.add('active');
      } else {
        block.classList.remove('active');
      }
    });
  }

  _syncBlocksWithTimeSignature(timeSignature) {
    const currentCount = this._blocks.length;

    if (timeSignature > currentCount) {
      for (let i = currentCount; i < timeSignature; i++) {
        this._addBlock(i + 1);
      }
    } else if (timeSignature < currentCount) {
      for (let i = currentCount; i > timeSignature; i--) {
        this._removeLastBlock();
      }
    }

    this._updateGridLayout(timeSignature);
  }

  _updateGridLayout(beatCount) {
    let columns;
    if (beatCount <= 5) {
      columns = beatCount;
    } else if (beatCount === 9) {
      columns = 3;
    } else {
      columns = 4;
    }
    this._container.style.maxWidth = `${columns * 44 + (columns - 1) * 6}px`;
  }

  _addBlock(number) {
    const block = document.createElement('div');
    block.classList.add('time-block');
    block.textContent = number;
    this._container.appendChild(block);
    this._blocks.push(block);
    this._bindAccentTap(block, this._blocks.length - 1);
  }

  _removeLastBlock() {
    if (this._blocks.length > 0) {
      const lastBlock = this._blocks.pop();
      this._container.removeChild(lastBlock);
    }
  }

  _bindAccentTap(block, index) {
    block.addEventListener('click', (e) => {
      e.preventDefault();
      metronomeState.toggleAccent(index);
    });
  }

  _updateAccentDisplay() {
    this._blocks.forEach((block, index) => {
      block.classList.toggle('accented', metronomeState.isAccented(index));
      block.classList.toggle('muted', metronomeState.isMuted(index));
    });
  }
}

export const beatVisualizer = new BeatVisualizer();
