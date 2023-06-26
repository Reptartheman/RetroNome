import Timer from "./timer.js";
"use strict";
const tempoDisplay = document.querySelector(".tempo");
const tempoText = document.querySelector(".tempo-text");
const decreaseTempoBtn = document.querySelector(".decrease-tempo");
const increaseTempoBtn = document.querySelector(".increase-tempo");
const tempoSlider = document.querySelector(".slider");
const startStopBtn = document.querySelector(".start-stop");
const subtractBeats = document.querySelector(".subtract-beats");
const addBeats = document.querySelector(".add-beats");
const beatCount = document.querySelector(".beat-count");
const dateDisplay = document.querySelector("#date");
const addNote = document.querySelector("#addNote");
const removeNote = document.querySelector("#removeNote");
const defaultBtn = document.querySelector("#default");
const sonicBtn = document.querySelector("#sonic");
const zeldaBtn = document.querySelector("#zelda");
const linkElement = document.querySelector(
  "link[href='./assets/styles/default.css']"
);
/* const click1 = new Audio("./assets/sounds/click1.mp3");
const click2 = new Audio("./assets/sounds/click2.mp3"); */

let audioContext,
  futureTickTime,
  counter = 1,
  metronome,
  metronomeVolume = 1,
  bpm = 120,
  secondsPerBeat = (60 / bpm),
  counterTimeValue = (secondsPerBeat / 4),
  osc;

let note;
let noteText;
let beatsPerMeasure = 4;
//let count = 0;

let isRunning = false;
let tempoTextString = "Mid";
let animationFrameId;

function playMetronome(time, playing, volume) {
  if (playing) {
    osc = audioContext.createOscillator();
    osc.connect(metronome);
    metronome.gain.value = volume;
    metronome.connect(audioContext.destination);
    if (counter === 1) {
      osc.frequency.value = 440;
    } else {
      osc.frequency.value = 220;
    }

    osc.start(time);
    osc.stop(time + 0.1);
  }
}

function playTick() {
  secondsPerBeat = 60 / bpm;
  counterTimeValue = (secondsPerBeat / 1);
  counter += 1;
  futureTickTime += counterTimeValue;
  if (counter > 4) {
    counter = 1;
  }
  // Calculate the counterTimeValue based on the slider value
  const tempoMultiplier = tempoSlider.value / 100; // Adjust this multiplier as needed
  counterTimeValue = (secondsPerBeat / 1) * tempoMultiplier;
} 

function scheduler() {
  if (futureTickTime < audioContext.currentTime + 0.1) {
    playMetronome(futureTickTime, true, metronomeVolume);
    playTick();

  }
  if (isRunning) {
    animationFrameId = window.requestAnimationFrame(scheduler);
  }
}

startStopBtn.addEventListener("click", () => {
  if (!isRunning) {
    // Start the metronome
    isRunning = true;
    startStopBtn.textContent = "STOP";

    audioContext = new AudioContext();
    futureTickTime = audioContext.currentTime;
    osc = audioContext.createOscillator();
    metronome = audioContext.createGain();
    scheduler();
  } else {
    // Stop the metronome
    isRunning = false;
    startStopBtn.textContent = "START";

    clearTimeout(animationFrameId);
    osc.stop();
  }
});


const updateMetronome = () => {
  tempoDisplay.textContent = bpm;
  tempoSlider.value = bpm;
  switch (true) {
    case bpm <= 40:
      tempoTextString = " " + "Bowser tempo";
      break;
    case bpm > 40 && bpm < 80:
      tempoTextString = " " + "Donkey kong tempo";
      break;
    case bpm > 80 && bpm < 120:
      tempoTextString = " " + "Yoshi tempo";
      break;
    case bpm > 120 && bpm < 180:
      tempoTextString = " " + "Tetris tempo";
      break;
    case bpm > 180 && bpm < 220:
      tempoTextString = " " + "Cowabunga!";
      break;
    case bpm > 220 && bpm < 240:
      tempoTextString = " " + "Sonic tempo!";
      break;
    case bpm > 240 && bpm < 260:
      tempoTextString = "Mario's fireball tempo!";
      break;
    case bpm > 260 && bpm < 280:
      tempoTextString = "Megaman tempo!";
      break;
    case bpm > 280 && bpm < 300:
      tempoTextString = "Slow Down!";
      break;
    default:
      tempoTextString = "Ok, chill out";
  }
  tempoText.textContent = tempoTextString;
};

const validateTempo = () => {
  if (bpm <= 20) {
    return;
  }
  if (bpm >= 280) {
    return;
  }
};


function displayDate() {
  let todayDate = dayjs().format("M/DD/YYYY");
  dateDisplay.textContent = `Today is: ${todayDate}`;
  return todayDate;
}
displayDate();

decreaseTempoBtn.addEventListener("click", () => {
  bpm--;
  validateTempo();
  updateMetronome();
});

increaseTempoBtn.addEventListener("click", () => {
  bpm++;
  validateTempo();
  updateMetronome();
});

tempoSlider.addEventListener("input", () => {
  bpm = tempoSlider.value;
  validateTempo();
  updateMetronome();
});

subtractBeats.addEventListener("click", () => {
  if (beatsPerMeasure <= 2) {
    return;
  }
  beatsPerMeasure--;
  beatCount.textContent = beatsPerMeasure;
  counter = 0;
});

addBeats.addEventListener("click", () => {
  if (beatsPerMeasure >= 12) {
    return;
  }
  beatsPerMeasure++;
  beatCount.textContent = beatsPerMeasure;
  counter = 0;
});

function saveNote(event) {
  event.preventDefault();
  note = document.querySelector(".note-textarea");
  noteText = note.value.trim();
  localStorage.setItem("Note", JSON.stringify(noteText));
}

function init() {
  let savedNote = JSON.parse(localStorage.getItem("Note"));

  if (savedNote) {
    // Populate the text on the page
    document.querySelector(".note-textarea").textContent = savedNote;
  }
}

function changeStyle(stylesheet) {
  if (linkElement) {
    linkElement.setAttribute("href", stylesheet);
  } else {
    console.error("Link element not found!");
  }
}

/* const metronome = new Timer(playClick, 60000 / bpm, { immediate: true }); */

addNote.addEventListener("click", saveNote);

defaultBtn.addEventListener("click", () => {
  changeStyle("./assets/styles/default.css");
});

sonicBtn.addEventListener("click", () => {
  changeStyle("./assets/styles/sonic.css");
});

zeldaBtn.addEventListener("click", () => {
  changeStyle("./assets/styles/zelda.css");
});

removeNote.addEventListener("click", () => {
  event.preventDefault();
  note.value = "";
  localStorage.removeItem("Note");
});
init();
