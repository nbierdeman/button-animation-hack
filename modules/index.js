import Song from './song.js';
import Canvas from './canvas.js';

const playButton = document.querySelector('#buttons-container1');
const canvasElement = document.querySelector('#animations');

const song1 = new Song({ beatsPerMinute: 90 });
const canvas = new Canvas({ canvasElement });

canvas.drawSnowMan();

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

playButton.addEventListener('click', () => {
  song1
    .playNotes({ notes: ['C4', 'C5'] })
    .playNotes({ notes: ['C4', 'C5'] })
    .playNotes({ notes: ['G4'] })
    .playNotes({ notes: ['G4'] })
    .playNotes({ notes: ['A4'] })
    .playNotes({ notes: ['A4'] })
    .playNotes({ notes: ['G4'], duration: '1/2' })
    .playNotes({ notes: [], duration: '1/2' })
    .playNotes({ notes: ['C4', 'E4', 'G4', 'C5'], duration: '1' });
});
