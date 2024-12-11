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

const transport = Tone.getTransport();
const metronomeSource = new Tone.Synth().toDestination();

const draw = Tone.getDraw();
let bpm = 120;
let beatCounter = 0;
let beatsPerMeasure = 4;
let isMetronomeOn = false;

let currentBlock = 0;
transport.bpm.value = bpm;
transport.timeSignature = beatsPerMeasure;

startStopBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const metronomeLoop = new Tone.Loop((time) =>  {
  metronomeSource.volume.value = -13;
  const note = beatCounter % beatsPerMeasure === 0 ? "C5" : "C4";
  metronomeSource.triggerAttackRelease(note, "16n", time);
  beatCounter++;
  console.log(`Time signature is: ${beatsPerMeasure}, we are on beat: ${beatCounter}`);
  }, "4n")

  if (transport.state === 'stopped') {
    metronomeLoop.start();
    transport.start();
    
    startStopBtn.textContent = 'Stop';
    console.log(transport.state);
  } else {
    transport.stop();
    startStopBtn.textContent = 'Start';
    console.log(transport.state);
  }
  
});

addBeats.addEventListener("click", () => {
  if (beatsPerMeasure >= 12) {
    return;
  }
  beatsPerMeasure++;
  beatCount.textContent = beatsPerMeasure;
  beatCounter = 0;
});



/* const playMetronome = (time) => {
  metronomeSource.volume.value = -13;
  const note = beatCounter % 4 === 0 ? "C5" : "C4";
  metronomeSource.triggerAttackRelease(note, "16n", time);
  beatCounter++;
};

const handleBlockFill = (index) => {
  
  timeBlocks.forEach((block, i) => {
    if (i === index) {
        block.classList.add('active');
    } else {
        block.classList.remove('active');
    }
});
}

transport.scheduleRepeat((time) => {
  if (isMetronomeOn) {
    playMetronome(time);
    draw.schedule(() => {
      handleBlockFill(currentBlock);
      currentBlock = (currentBlock + 1) % timeBlocks.length;
			}, time);
  }
}, "4n");

const toggleMetronome = () => {
  isMetronomeOn = !isMetronomeOn;
  if (isMetronomeOn) {
    transport.start();
    startStopBtn.textContent = 'Stop';
  } else {
    transport.stop();
    startStopBtn.textContent = 'Start';
  }
}; */


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
  updateBPM(parseInt(e.target.value));
});

subtractBeats.addEventListener("click", () => {
  if (beatsPerMeasure > 2) {
    beatsPerMeasure--;
    beatCount.textContent = beatsPerMeasure;
    transport.timeSignature = beatsPerMeasure;
  }
});



updateTempoDisplay();
