import * as Tone from 'tone';
import { metronomeState } from '../state/MetronomeState.js';

const SUBDIVISION_CONFIG = {
  quarter:   { interval: '4n', perBeat: 1 },
  eighth:    { interval: '8n', perBeat: 2 },
  sixteenth: { interval: '16n', perBeat: 4 },
  triplet:   { interval: '8t', perBeat: 3 },
};

class AudioEngine {
  constructor() {
    this._isInitialized = false;
    this._transport = null;
    this._synth = null;
    this._loop = null;
    this._draw = null;
    this._beatCounter = 0;
    this._subCounter = 0;
  }

  async init() {
    if (this._isInitialized) return;

    await Tone.start();

    this._transport = Tone.getTransport();
    this._draw = Tone.getDraw();

    this._synth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1
      }
    }).toDestination();

    this._synth.volume.value = -13;

    this._transport.bpm.value = metronomeState.bpm;
    this._transport.timeSignature = metronomeState.timeSignature;

    metronomeState.subscribe('bpm', (bpm) => {
      this._transport.bpm.value = bpm;
    });

    metronomeState.subscribe('timeSignature', (timeSignature) => {
      this._transport.timeSignature = timeSignature;
      this._beatCounter = 0;
      this._subCounter = 0;
      metronomeState.resetCurrentBeat();
    });

    metronomeState.subscribe('subdivision', () => {
      if (metronomeState.isPlaying) {
        this._restartLoop();
      }
    });

    this._isInitialized = true;
  }

  start() {
    if (!this._isInitialized) {
      console.warn('AudioEngine not initialized. Call init() first.');
      return;
    }

    this._createLoop();
    this._transport.start();
    metronomeState.setIsPlaying(true);
  }

  stop() {
    if (!this._isInitialized) return;

    this._transport.stop();
    if (this._loop) {
      this._loop.stop();
      this._loop.dispose();
      this._loop = null;
    }
    metronomeState.setIsPlaying(false);
    metronomeState.resetCurrentBeat();
  }

  _createLoop() {
    this._beatCounter = 0;
    this._subCounter = 0;

    const config = SUBDIVISION_CONFIG[metronomeState.subdivision];

    this._loop = new Tone.Loop((time) => {
      const timeSignature = metronomeState.timeSignature;
      const isMainBeat = this._subCounter === 0;
      const isAccented = metronomeState.isAccented(this._beatCounter);
      const isMuted = metronomeState.isMuted(this._beatCounter);

      if (isMuted && isMainBeat) {
      } else if (isMainBeat && isAccented) {
        this._synth.triggerAttackRelease('C5', '16n', time);
      } else if (isMainBeat) {
        this._synth.triggerAttackRelease('C4', '16n', time);
      } else {
        this._synth.triggerAttackRelease('G3', '32n', time);
      }

      if (isMainBeat) {
        const currentBeat = this._beatCounter;
        this._draw.schedule(() => {
          metronomeState.setCurrentBeat(currentBeat);
        }, time);
      }

      this._subCounter = (this._subCounter + 1) % config.perBeat;
      if (this._subCounter === 0) {
        this._beatCounter = (this._beatCounter + 1) % timeSignature;
      }
    }, config.interval).start(0);
  }

  _restartLoop() {
    this._transport.stop();
    if (this._loop) {
      this._loop.stop();
      this._loop.dispose();
      this._loop = null;
    }
    this._createLoop();
    this._transport.start();
  }

  setOscillatorType(type) {
    if (this._synth) {
      this._synth.oscillator.type = type;
    }
  }

  get isInitialized() {
    return this._isInitialized;
  }
}

export const audioEngine = new AudioEngine();
