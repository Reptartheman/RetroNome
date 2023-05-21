const tempoDisplay = document.querySelector('.tempo');
const tempoText = document.querySelector('.tempo-text');
const decreaseTempoBtn = document.querySelector('.decrease-tempo');
const increaseTempoBtn = document.querySelector('.increase-tempo');
const tempoSlider = document.querySelector('.slider');
const startStopBtn = document.querySelector('.start-stop');
const subtractBeats = document.querySelector('.subtract-beats');
const addBeats = document.querySelector('.add-beats');
const measureCount = document.querySelector('.measure-count');

let bpm = 140;
let beatsPerMeasure = 4;
let tempoTextString = 'Mid';

decreaseTempoBtn.addEventListener('click', () => {
    bpm--;
    validateTempo();
    updateMetronome();
});

increaseTempoBtn.addEventListener('click', () => {
    bpm++;
    validateTempo();
    updateMetronome();  
});

tempoSlider.addEventListener('input', () => {
    bpm = tempoSlider.value;
    validateTempo();
    updateMetronome();
});

subtractBeats.addEventListener('click', () => {
    if (beatsPerMeasure <= 2) {
        return;
    }
    beatsPerMeasure--;
    measureCount.textContent = beatsPerMeasure;
});

addBeats.addEventListener('click', () => {
    if (beatsPerMeasure >= 12) {
        return;
    }
    beatsPerMeasure++;
    measureCount.textContent = beatsPerMeasure;
});

const updateMetronome = () => {
    tempoDisplay.textContent = bpm;
    tempoSlider.value = bpm;
    switch(true) {
        case (bpm <= 40):
            tempoTextString = 'Grown up tempo';
            break;
        case (bpm > 40 && bpm < 80):
            tempoTextString = 'A little bit faster now';
            break;
        case (bpm > 80 && bpm < 120):
            tempoTextString = 'We groovin now!';
            break;
        case (bpm > 120 && bpm < 180):
            tempoTextString = 'Drum N Bass';
            break;
        case (bpm > 180 && bpm < 220):
            tempoTextString = 'Take a breath';
            break;
        case (bpm > 220 && bpm < 240):
            tempoTextString = 'Are you practicing Be-bop?';
            break;
        case (bpm > 240 && bpm < 260):
            tempoTextString = `You're making me nervous`;
            break;
        case (bpm > 260 && bpm < 280):
            tempoTextString = 'You are going to get a speeding ticket';
            break;
        case (bpm > 280 && bpm < 300):
            tempoTextString = 'Easy there John Coltrane!';
            break;
        default:
            tempoTextString = 'Invalid';
    }
    tempoText.textContent = tempoTextString;
}

const validateTempo = () => {
    if (bpm <= 20) {
        return;
    };
    if (bpm >= 280) {
        return;
    };
};