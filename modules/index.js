import Song from './song.js';
import Canvas from './canvas.js';

const playButton = document.querySelector('#buttons-container1');
const canvasElement = document.querySelector('#animations');

const song1 = new Song({ beatsPerMinute: 90 });

const canvas = new Canvas({
  canvasElement,
  song: song1,
});

canvas.drawSnowMan();

playButton.addEventListener('click', () => {
  song1
    .playNote({ note: 'C4' })
    .playNote({ note: 'C4' })
    .playNote({ note: 'G4' })
    .playNote({ note: 'G4' })
    .playNote({})
    .playNote({})
    .playNote({ note: 'G4', duration: '1/2' });

  canvas.draw();
});
