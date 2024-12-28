import * as Tone from "tone";

const decreaseTempoBtn = document.querySelector(".decrease-tempo");
const increaseTempoBtn = document.querySelector(".increase-tempo");
const tempoSlider = document.querySelector(".slider");
const startStopBtn = document.querySelector(".start-stop");
const subtractBeats = document.querySelector(".subtract-beats");
const addBeats = document.querySelector(".add-beats");
const beatCount = document.querySelector(".beat-count");
const timeBlocksContainer = document.getElementById("timeBlocksContainer");
const timeBlocks = document.querySelectorAll(".time-block");
let timeBlocksArray = Array.from(timeBlocks);
const sliderHandle = document.getElementById('slider-handle');
const tempoRange = document.getElementById('tempoRange');
const transport = Tone.getTransport();
const metronomeSource = new Tone.Synth().toDestination();
const draw = Tone.getDraw();
let bpm = 120;
let beatCounter;
let isMetronomeOn = false; //No it's not
let metronomeLoop;
let currentBlock = 0;
transport.bpm.value = bpm;

const playMetronome = () => {
  beatCounter = 1;
  metronomeLoop = new Tone.Loop((time) =>  {
    metronomeSource.volume.value = -13;
    if (beatCounter > transport.timeSignature) {
      beatCounter = 1;
    }
    if (beatCounter === 1) {
      metronomeSource.triggerAttackRelease("C5", "16n", time);
    } else {
      metronomeSource.triggerAttackRelease("C4", "16n", time);
    }
    beatCounter++;
    draw.schedule(() => {
      console.log(currentBlock);
      handleBlockFill(currentBlock);
      currentBlock = (currentBlock + 1) % timeBlocksArray.length;
			}, time);
  }, "4n").start(0);
};

const toggleMetronome = () => {
  isMetronomeOn = !isMetronomeOn;
  console.log(isMetronomeOn);
  if (isMetronomeOn) {
    console.log(`I am on!!`);
    transport.start();
    playMetronome();
    startStopBtn.textContent = 'Stop';
  } else {  
    console.log(`I am off!!`);
    transport.stop();
    metronomeLoop.stop();
    currentBlock = 0;
    startStopBtn.textContent = 'Start';
  }
};

startStopBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleMetronome(); 
});








const handleBlockFill = (index) => {
  timeBlocksArray.forEach((block, i) => {
    if (i === index) {
        block.classList.add('active');
    } else {
        block.classList.remove('active');
    }
});
}



const updateBPM = (newBPM) => {
  bpm = newBPM;
  transport.bpm.value = bpm;
  updateTempoDisplay();
};




const updateTempoDisplay = () => {
  const tempoDisplay = document.querySelector(".tempo");
  const tempoText = document.querySelector(".tempo-text");

  tempoDisplay.textContent = `${bpm} BPM`;

  switch (true) {
    case bpm <= 40:
      tempoText.textContent = "Bowser tempo";
      break;
    case bpm > 40 && bpm < 80:
      tempoText.textContent = "Donkey Kong tempo";
      break;
    case bpm >= 80 && bpm < 120:
      tempoText.textContent = "Yoshi tempo";
      break;
    case bpm >= 120 && bpm < 180:
      tempoText.textContent = "Tetris tempo";
      break;
    case bpm >= 180:
      tempoText.textContent = "Sonic speed!";
      break;
    default:
      tempoText.textContent = "Normal";
  }
};




decreaseTempoBtn.addEventListener("click", () => {
  if (bpm > 20) {
    updateBPM(bpm - 1);
  }
});

increaseTempoBtn.addEventListener("click", () => {
  if (bpm < 300) {
    updateBPM(bpm + 1);
  }
});

tempoSlider.addEventListener("input", (e) => {
  const newValue = e.target.value;
  transport.bpm.value = newValue;
  updateBPM(parseInt(newValue));
  updateSliderHandle(newValue);
});


/* tempoRange.addEventListener('input', (event) => {
  
  
}); */

const updateSliderHandle = (value) => {
  const min = tempoRange.min;
  const max = tempoRange.max;
  const percentage = (value - min) / (max - min);
  const newCX = 10 + (percentage * 280);
  sliderHandle.setAttribute('cx', newCX);
};

addBeats.addEventListener("click", () => {
  const newBlock = document.createElement('div');
  newBlock.classList.add(...['nes-container', 'is-rounded', 'time-block']);
  newBlock.textContent = transport.timeSignature + 1;
  timeBlocksContainer.appendChild(newBlock);
  timeBlocksArray.push(newBlock);
  if (transport.timeSignature > 13) {
    return;
  }
  transport.timeSignature++;
  beatCount.textContent = transport.timeSignature;
  beatCounter = 1;

  currentBlock = 0;
  if (isMetronomeOn) {
    metronomeLoop.stop();
    playMetronome();
  }
});




subtractBeats.addEventListener("click", () => {
  if (transport.timeSignature > 2) {
    transport.timeSignature--;
    beatCount.textContent = transport.timeSignature;
    const lastBlock = timeBlocksArray.pop();
    timeBlocksContainer.removeChild(lastBlock);
    currentBlock = 0;
    if (isMetronomeOn) {
      metronomeLoop.stop();
      playMetronome();
    }
  }
});



updateTempoDisplay();
