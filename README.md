# RetroNome

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Game Boy Color-styled metronome web app built with vanilla JavaScript.

## About

RetroNome is a fully functional metronome wrapped in a pixel-perfect Game Boy Color interface. The entire UI -- screen, D-pad, A/B buttons, speaker grille -- is rendered in CSS to match the look and feel of the original handheld. It runs as a progressive web app and can be installed on mobile devices for a native-like experience.

## Screenshots

<!-- TODO: Add before/after screenshots -->

## Built With

- [Tone.js](https://tonejs.github.io/) -- Web audio framework powering the metronome's oscillator-based click engine and subdivision timing
- [NES.css](https://nostalgic-css.github.io/NES.css/) -- NES-style CSS framework
- [Vite](https://vitejs.dev/) -- Build tool and development server
- [Google Fonts](https://fonts.google.com/) -- Press Start 2P (primary pixel font), VT323, Sedgwick Ave

## Features

- Tempo control with tap and hold-to-repeat via the D-pad
- Adjustable time signature (1-12 beats)
- Per-beat accent and mute toggling
- Four oscillator waveforms (sine, sawtooth, triangle, pulse)
- Subdivision options (quarter, eighth, sixteenth, triplet)
- Color customization for the body, play button, and stop button (persisted to localStorage)
- Installable as a progressive web app
- Fullscreen mode on mobile browsers

## Getting Started

```
npm install
npm run dev
```

To create a production build:

```
npm run build
npm run preview
```

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Contact

- GitHub: [Reptartheman](https://github.com/Reptartheman)
- Email: JeffMoroMusic@gmail.com
