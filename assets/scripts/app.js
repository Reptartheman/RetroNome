
import Timer from "./timer.js";
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
const linkElement = document.querySelector("link[href='./assets/styles/default.css']");
const click1 = new Audio("./assets/sounds/click1.wav");
const click2 = new Audio("./assets/sounds/click2.wav");

let note;
let noteText;
let bpm = 120;
let beatsPerMeasure = 4;
let count = 0;
let isRunning = false;
let tempoTextString = "Mid";



function displayDate() {
  let todayDate = dayjs().format('M/DD/YYYY');
  dateDisplay.textContent = `Today is: ${todayDate}`;
  return todayDate;
};
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
  count = 0;
});

addBeats.addEventListener("click", () => {
  if (beatsPerMeasure >= 12) {
    return;
  }
  beatsPerMeasure++;
  beatCount.textContent = beatsPerMeasure;
  count = 0;
});


startStopBtn.addEventListener("click", () => {
  count = 0;
  if (!isRunning) {
    metronome.start();
    isRunning = true;
    startStopBtn.textContent = "STOP";
  } else {
    metronome.stop();
    isRunning = false;
    startStopBtn.textContent = "START";
  }
});


const updateMetronome = () => {
  tempoDisplay.textContent = bpm;
  tempoSlider.value = bpm;
  metronome.timeInterval = 60000 / bpm;
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

function playClick() {
  if (count === beatsPerMeasure) {
    count = 0;
  }
  if (count === 0) {
    click1.play();
    click1.currentTime = 0;
  } else {
    click2.play();
    click2.currentTime = 0;
  }
  count++;
}

 function saveNote(event) {
  event.preventDefault();
  note = document.querySelector(".note-textarea");
  noteText = note.value.trim();
  localStorage.setItem('Note', JSON.stringify(noteText));
}

function init() {
 let savedNote = JSON.parse(localStorage.getItem('Note'));
  
  if (savedNote) {
    // Populate the text on the page
    document.querySelector(".note-textarea").textContent = savedNote;
  }
};


function changeStyle(stylesheet) {
  if (linkElement) {
    linkElement.setAttribute('href', stylesheet);
  } else {
    console.error('Link element not found!');
  }
}

const metronome = new Timer(playClick, 60000 / bpm, { immediate: true });

addNote.addEventListener("click", saveNote);

defaultBtn.addEventListener("click", () => {
  changeStyle('./assets/styles/default.css');
});

sonicBtn.addEventListener("click", () => {
  changeStyle('./assets/styles/sonic.css');
});

zeldaBtn.addEventListener("click", () => {
  changeStyle('./assets/styles/zelda.css');
});


removeNote.addEventListener("click", () => {
  event.preventDefault();
  note.value = '';
  localStorage.removeItem('Note');
})
init();


