import Timer from "./timer.js";
const tempoDisplay = document.querySelector(".tempo");
const tempoText = document.querySelector(".tempo-text");
const decreaseTempoBtn = document.querySelector(".decrease-tempo");
const increaseTempoBtn = document.querySelector(".increase-tempo");
const tempoSlider = document.querySelector(".slider");
const startStopBtn = document.querySelector(".start-stop");
const subtractBeats = document.querySelector(".subtract-beats");
const addBeats = document.querySelector(".add-beats");
const measureCount = document.querySelector(".measure-count");
const sessionTimeDisplay = document.querySelector(".timer");

const click1 = new Audio("./click1.wav");
const click2 = new Audio("./click2.wav");

let bpm = 140;
let beatsPerMeasure = 4;
let count = 0;
let isRunning = false;
let tempoTextString = "Mid";
let startTimestamp; 
let timeInterval;
let isTimerRunning = false;


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
  measureCount.textContent = beatsPerMeasure;
  count = 0;
});

addBeats.addEventListener("click", () => {
  if (beatsPerMeasure >= 12) {
    return;
  }
  beatsPerMeasure++;
  measureCount.textContent = beatsPerMeasure;
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

startStopBtn.addEventListener("click", () => {
    if (isTimerRunning) {
      timer.stop();
      isTimerRunning = false;
    } else {
      timer.start();
      isTimerRunning = true;
    }
  });


const updateMetronome = () => {
  tempoDisplay.textContent = bpm;
  tempoSlider.value = bpm;
  metronome.timeInterval = 60000 / bpm;
  switch (true) {
    case bpm <= 40:
      tempoTextString = "Grown up tempo";
      break;
    case bpm > 40 && bpm < 80:
      tempoTextString = "A little bit faster now";
      break;
    case bpm > 80 && bpm < 120:
      tempoTextString = "We groovin now!";
      break;
    case bpm > 120 && bpm < 180:
      tempoTextString = "Drum N Bass";
      break;
    case bpm > 180 && bpm < 220:
      tempoTextString = "Take a breath";
      break;
    case bpm > 220 && bpm < 240:
      tempoTextString = "Are you practicing Be-bop?";
      break;
    case bpm > 240 && bpm < 260:
      tempoTextString = `You're making me nervous`;
      break;
    case bpm > 260 && bpm < 280:
      tempoTextString = "You are going to get a speeding ticket";
      break;
    case bpm > 280 && bpm < 300:
      tempoTextString = "Easy there John Coltrane!";
      break;
    default:
      tempoTextString = "Invalid";
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

function callback() {
    startTimestamp = Date.now(); // Get the current timestamp
    
    timeInterval = setInterval(function() {
      var elapsedTime = Date.now() - startTimestamp; // Calculate elapsed time in milliseconds
      
      // Convert milliseconds to hours, minutes, and seconds
      var hours = Math.floor(elapsedTime / 3600000);
      var minutes = Math.floor((elapsedTime % 3600000) / 60000);
      var seconds = Math.floor((elapsedTime % 60000) / 1000);
      
      // Format the time values
      var formattedTime = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
      sessionTimeDisplay.textContent = `Session Time: ${formattedTime}`;
      // Display the formatted time
    }, 1000); // Update the timer every second
  }

function pad(num) {
    return (num < 10 ? "0" : "") + num; // Add leading zero if the number is less than 10
  }
  
const timer = new Timer(callback, 1000, { immediate: true});
const metronome = new Timer(playClick, 60000 / bpm, { immediate: true });
