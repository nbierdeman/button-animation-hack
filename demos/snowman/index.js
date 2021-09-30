import Song from '../../modules/song.js';
import { openPopup } from '../../modules/popup.js';
import Snowman from './snowman.js';
import Snow from './snow.js';

const playButton = document.querySelector('#buttons-container1');
const canvasElement = document.querySelector('#animations');
const snowCanvas = document.querySelector('#snow');

const song1 = new Song({ beatsPerMinute: 140 });
const canvas = new Snowman({ canvasElement });
const snow = new Snow({ canvasElement: snowCanvas, width: 750, height: 55 });

const paypalButton = playButton.querySelector('div[role="button"]');

snowCanvas.addEventListener('mouseenter', () => {
  paypalButton.classList.add('hover');
});

snowCanvas.addEventListener('mouseleave', () => {
  paypalButton.classList.remove('hover');
});

// share song with popup
window.song = song1;

canvas.drawSnowMan();
const startSnowing = () => {
  snow.render();
  requestAnimationFrame(startSnowing);
};
startSnowing();

const noteLabel = document.querySelector('#note');
const beatNumberLabel = document.querySelector('#beat');

song1.onBeat(({ currentNote, beatNumber }) => {
  canvas.makeSnowManDance();
  if (currentNote && currentNote.notes) {
    noteLabel.innerHTML = currentNote.notes.length
      ? currentNote.notes.toString()
      : 'rest';
  }

  beatNumberLabel.innerHTML = beatNumber;
});

let popup;

playButton.addEventListener('click', () => {
  // ignore the click when the song is already playing
  if (song1.isPlaying) {
    return;
  }

  song1.play([
    [
      // somewhat followed this sheet music: https://www.pinterest.com/pin/369858188132194112/
      // intro chords measure 1
      { notes: ['G3', 'C4', 'B4', 'E5'], duration: '1' },
      // intro chords measure 2
      { notes: ['G3', 'C4', 'E4', 'B4'], duration: '1' },
      // intro chords measure 3
      { notes: ['E3', 'G3', 'B3', 'C4'], duration: '1/2' },
      { notes: ['Db3', 'G3', 'Bb3', 'C#4'], duration: '1/2' },
      // intro chords measure 4
      { notes: ['D3', 'G3', 'B3', 'F4'], duration: '1' },
      // intro chords measure 5
      { notes: [], duration: '1' },
      // verse chords measure 1
      { notes: ['E3', 'G3', 'B3', 'C4'], duration: '1' },
      // verse chords measure 2
      { notes: ['E3', 'G3', 'B3', 'C4'], duration: '1' },
      // verse chords measure 3
      { notes: ['F3', 'A3', 'C4', 'E4'], duration: '1/2' },
      { notes: ['F#3', 'A3', 'C4', 'Eb4'], duration: '1/2' },
      // verse chords measure 4
      { notes: ['E3', 'G3', 'B3', 'C4'], duration: '1' },
      // verse chords measure 5
      { notes: ['F3', 'A3', 'C4', 'E4'], duration: '1/2' },
      { notes: ['F#3', 'A3', 'C4', 'Eb4'], duration: '1/2' },
      // verse chords measure 6
      { notes: ['E3', 'G3', 'B3', 'C4'], duration: '1/2' },
      { notes: ['E3', 'A3', 'C3', 'G4'], duration: '1/2' },
      // verse chords measure 7
      { notes: ['D3', 'A3', 'C3', 'F4'], duration: '1/2' },
      { notes: ['D3', 'B3', 'G3', 'E4'], duration: '1/4' },
      { notes: ['D3', 'B3', 'G3', 'F4'], duration: '1/4' },
      // verse chords measure 8
      { notes: ['C3', 'B3', 'G3', 'E4'], duration: '1/2' },
      { notes: ['F3', 'B3', 'G3', 'D4'], duration: '1/2' },
      // verse chords measure 9
      { notes: ['C3', 'E3', 'G3', 'C4'], duration: '1' },
    ],
    [
      // intro melody measure 1
      { notes: ['G4'], duration: '1/8' },
      { notes: ['G4'], duration: '1/8' },
      { notes: ['G4'], duration: '1/4' },
      { notes: ['E4', 'G4'], duration: '1/4' },
      { notes: ['E4', 'G4'], duration: '1/4' },
      // intro melody measure 2
      { notes: ['G4'], duration: '1/8' },
      { notes: ['G4'], duration: '1/8' },
      { notes: ['G4'], duration: '1/4' },
      { notes: ['E4', 'G4'], duration: '1/4' },
      { notes: ['E4', 'G4'], duration: '1/4' },
      // intro melody measure 3
      { notes: ['A4'], duration: '1/4' },
      { notes: ['G4'], duration: '1/4' },
      { notes: ['E4'], duration: '1/4' },
      { notes: ['F4'], duration: '1/4' },
      // intro melody measure 4
      { notes: ['F4', 'G4'], duration: '1' },
      // intro melody measure 5
      { notes: [], duration: '1' },
      // verse melody measure 1
      { notes: ['G4'], duration: '1/2' },
      { notes: ['E4'], duration: '3/8' },
      { notes: ['F4'], duration: '1/8' },
      // verse melody measure 2
      { notes: ['G4'], duration: '1/4' },
      { notes: ['C5'], duration: '1/2' },
      { notes: ['B4'], duration: '1/8' },
      { notes: ['C5'], duration: '1/8' },
      // verse melody measure 3
      { notes: ['D5'], duration: '1/4' },
      { notes: ['C5'], duration: '1/4' },
      { notes: ['B4'], duration: '1/4' },
      { notes: ['A4'], duration: '1/4' },
      // verse melody measure 4
      { notes: ['G4'], duration: '3/4' },
      { notes: ['B4'], duration: '1/8' },
      { notes: ['C5'], duration: '1/8' },
      // verse melody measure 5
      { notes: ['D5'], duration: '1/4' },
      { notes: ['C5'], duration: '1/4' },
      { notes: ['B4'], duration: '1/4' },
      { notes: ['A4'], duration: '1/8' },
      { notes: ['A4'], duration: '1/8' },
      // verse melody measure 6
      { notes: ['G4'], duration: '1/4' },
      { notes: ['C5'], duration: '1/4' },
      { notes: ['E4'], duration: '1/4' },
      { notes: ['G4'], duration: '1/8' },
      { notes: ['A4'], duration: '1/8' },
      // verse melody measure 7
      { notes: ['G4'], duration: '1/4' },
      { notes: ['F4'], duration: '1/4' },
      { notes: ['E4'], duration: '1/4' },
      { notes: ['F4'], duration: '1/4' },
      // verse melody measure 8
      { notes: ['G4'], duration: '1/2' },
      { notes: [], duration: '1/2' },
    ],
    [
      // intro bass measure 1
      { notes: ['C3'], duration: '1/2' },
      { notes: ['B2'], duration: '1/2' },
      // intro bass measure 2
      { notes: ['A2'], duration: '1/2' },
      { notes: ['G2'], duration: '1/2' },
      // intro bass measure 3
      { notes: ['C3'], duration: '1/2' },
      { notes: ['A#2'], duration: '1/2' },
      // intro bass measure 4
      { notes: ['B2'], duration: '1/2' },
      { notes: ['G2'], duration: '1/2' },
      // intro bass measure 5
      { notes: [], duration: '1' },
      // verse bass measure 1
      { notes: ['C2'], duration: '1/2' },
      { notes: ['A2'], duration: '1/2' },
      // verse bass measure 2
      { notes: ['G2'], duration: '1' },
      // verse bass measure 3
      { notes: ['F2'], duration: '1/2' },
      { notes: ['F#2'], duration: '1/2' },
      // verse bass measure 4
      { notes: ['G2'], duration: '1/2' },
      { notes: ['C2'], duration: '1/2' },
      // verse bass measure 5
      { notes: ['F2'], duration: '1/2' },
      { notes: ['F#2'], duration: '1/2' },
      // verse bass measure 6
      { notes: ['G2'], duration: '1/2' },
      { notes: ['C2'], duration: '1/2' },
      // verse bass measure 7
      { notes: ['D2'], duration: '1/2' },
      { notes: ['B2'], duration: '1/2' },
      // verse bass measure 8
      { notes: ['E3'], duration: '1/2' },
      { notes: ['G2'], duration: '1/2' },
      // verse bass measure 9
      { notes: ['C2'], duration: '1' },
    ],
  ]);

  song1;

  setTimeout(() => {
    // reuse existing popup when playing again
    if (popup && !popup.closed) {
      popup.focus();
    } else {
      popup = openPopup({
        url: 'popup.html',
        name: 'testWindowName',
        width: 600,
        height: 600,
      });
    }
  }, 1000);
});
