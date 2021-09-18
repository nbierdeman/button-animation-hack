import Song from './song.js';
import Canvas from './canvas.js';

const playButton = document.querySelector('#buttons-container1');
const canvasElement = document.querySelector('#animations');

const song1 = new Song();

const canvas = new Canvas({
  canvasElement,
  song: song1,
});

canvas.drawSnowMan();

playButton.addEventListener('click', () => {
  song1
    .playNote({ note: 'C4', delayPlayback: 2 })
    .playNote({ note: 'C4', delayPlayback: 4 })
    .playNote({ note: 'G4', delayPlayback: 6 })
    .playNote({ note: 'G4', delayPlayback: 8 })
    .playNote({ note: 'A4', delayPlayback: 10 })
    .playNote({ note: 'A4', delayPlayback: 12 })
    .playNote({ note: 'G4', delayPlayback: 14 });

  canvas.draw();
});
