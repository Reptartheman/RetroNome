/**
 * BeatVisualizer - Handles the visual beat indicator blocks
 * Subscribes to state changes and updates the UI accordingly
 */

import { metronomeState } from '../state/MetronomeState.js';

class BeatVisualizer {
  constructor() {
    this._container = null;
    this._blocks = [];
  }

  /**
   * Initialize the visualizer with the DOM container
   */
  init(containerId = 'timeBlocksContainer') {
    this._container = document.getElementById(containerId);
    if (!this._container) {
      console.error(`BeatVisualizer: Container #${containerId} not found`);
      return;
    }

    // Initialize blocks from existing DOM
    this._blocks = Array.from(this._container.querySelectorAll('.time-block'));

    // Set initial grid layout
    this._updateGridLayout(this._blocks.length);

    // Subscribe to state changes
    metronomeState.subscribe('currentBeat', (beat) => {
      this._highlightBeat(beat);
    });

    metronomeState.subscribe('timeSignature', (timeSignature) => {
      this._syncBlocksWithTimeSignature(timeSignature);
    });

    metronomeState.subscribe('accents', () => {
      this._updateAccentDisplay();
    });

    // Bind tap events on existing blocks
    this._blocks.forEach((block, index) => {
      this._bindAccentTap(block, index);
    });

    // Render initial accent state
    this._updateAccentDisplay();
  }

  /**
   * Highlight the current beat block
   */
  _highlightBeat(beatIndex) {
    this._blocks.forEach((block, index) => {
      if (index === beatIndex) {
        block.classList.add('active');
      } else {
        block.classList.remove('active');
      }
    });
  }

  /**
   * Sync the number of blocks with the time signature
   */
  _syncBlocksWithTimeSignature(timeSignature) {
    const currentCount = this._blocks.length;

    if (timeSignature > currentCount) {
      // Add blocks
      for (let i = currentCount; i < timeSignature; i++) {
        this._addBlock(i + 1);
      }
    } else if (timeSignature < currentCount) {
      // Remove blocks
      for (let i = currentCount; i > timeSignature; i--) {
        this._removeLastBlock();
      }
    }

    this._updateGridLayout(timeSignature);
  }

  /**
   * Update the grid layout based on beat count
   */
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

  /**
   * Add a new beat block
   */
  _addBlock(number) {
    const block = document.createElement('div');
    block.classList.add('time-block');
    block.textContent = number;
    this._container.appendChild(block);
    this._blocks.push(block);
    this._bindAccentTap(block, this._blocks.length - 1);
  }

  /**
   * Remove the last beat block
   */
  _removeLastBlock() {
    if (this._blocks.length > 0) {
      const lastBlock = this._blocks.pop();
      this._container.removeChild(lastBlock);
    }
  }

  /**
   * Bind accent tap to a beat block
   */
  _bindAccentTap(block, index) {
    const handler = (e) => {
      e.preventDefault();
      metronomeState.toggleAccent(index);
    };
    block.addEventListener('click', handler);
    block.addEventListener('touchend', handler);
  }

  /**
   * Update accent display on all blocks
   */
  _updateAccentDisplay() {
    this._blocks.forEach((block, index) => {
      block.classList.toggle('accented', metronomeState.isAccented(index));
      block.classList.toggle('muted', metronomeState.isMuted(index));
    });
  }

}

// Export singleton instance
export const beatVisualizer = new BeatVisualizer();
