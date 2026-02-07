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

    // Subscribe to state changes
    metronomeState.subscribe('currentBeat', (beat) => {
      this._highlightBeat(beat);
    });

    metronomeState.subscribe('timeSignature', (timeSignature) => {
      this._syncBlocksWithTimeSignature(timeSignature);
    });
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
   * Clear all highlights
   */
  clearHighlights() {
    this._blocks.forEach(block => block.classList.remove('active'));
  }

  /**
   * Get current block count
   */
  get blockCount() {
    return this._blocks.length;
  }
}

// Export singleton instance
export const beatVisualizer = new BeatVisualizer();
