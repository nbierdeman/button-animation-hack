import Song from '../../modules/song.js';
import { openPopup } from '../../modules/popup.js';
import Canvas from './canvas.js';

const playButton = document.querySelector('#buttons-container1');
const canvasElement = document.querySelector('#animations');

const song1 = new Song({ beatsPerMinute: 140 });
const canvas = new Canvas({ canvasElement });

// share song with popup
window.song = song1;

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
    // measure 1
    .playNotes({ notes: ['G4'], duration: '1/2' })
    .playNotes({ notes: ['E4'], duration: '3/8' })
    .playNotes({ notes: ['F4'], duration: '1/8' })
    // measure 2
    .playNotes({ notes: ['G4'], duration: '1/4' })
    .playNotes({ notes: ['C5'], duration: '1/2' })
    .playNotes({ notes: ['B4'], duration: '1/8' })
    .playNotes({ notes: ['C5'], duration: '1/8' })
    // measure 3
    .playNotes({ notes: ['D5'], duration: '1/4' })
    .playNotes({ notes: ['C5'], duration: '1/4' })
    .playNotes({ notes: ['B4'], duration: '1/4' })
    .playNotes({ notes: ['A4'], duration: '1/4' })
    // measure 4
    .playNotes({ notes: ['G4'], duration: '3/4' })
    .playNotes({ notes: ['B4'], duration: '1/4' })
    .playNotes({ notes: ['C5'], duration: '1/4' })
    // measure 5
    .playNotes({ notes: ['D5'], duration: '1/4' })
    .playNotes({ notes: ['C5'], duration: '1/4' })
    .playNotes({ notes: ['B4'], duration: '1/4' })
    .playNotes({ notes: ['A4'], duration: '1/8' })
    .playNotes({ notes: ['A4'], duration: '1/8' })
    // measure 6
    .playNotes({ notes: ['G4'], duration: '1/4' })
    .playNotes({ notes: ['C5'], duration: '1/4' })
    .playNotes({ notes: ['E4'], duration: '1/4' })
    .playNotes({ notes: ['G4'], duration: '1/8' })
    .playNotes({ notes: ['A4'], duration: '1/8' })
    // measure 7
    .playNotes({ notes: ['G4'], duration: '1/4' })
    .playNotes({ notes: ['F4'], duration: '1/4' })
    .playNotes({ notes: ['E4'], duration: '1/4' })
    .playNotes({ notes: ['F4'], duration: '1/4' })
    // measure 8
    .playNotes({ notes: ['G4'], duration: '3/4' })
    .playNotes({ notes: [], duration: '1/4' });

  setTimeout(() => {
    openPopup({
      url: 'popup.html',
      name: 'testWindowName',
      width: 600,
      height: 600,
    });
  }, 1000);
});
