const notes = [
  ['C'],
  ['C#', 'Db'],
  ['D'],
  ['D#', 'Eb'],
  ['E'],
  ['F'],
  ['F#', 'Gb'],
  ['G'],
  ['G#', 'Ab'],
  ['A'],
  ['A#', 'Bb'],
  ['B'],
];

const baseNote = {
  name: 'A',
  octave: 4,
  frequency: 440,
  halfStepsFromC4: 9,
};

function getNoteIndex(noteName) {
  let noteIndex;

  notes.find((noteArray, index) => {
    if (noteArray.includes(noteName)) {
      noteIndex = index;
      return true;
    }

    return false;
  });

  return noteIndex;
}

function parseNote(note) {
  if (typeof note !== 'string') {
    throw new Error(`Invalid input for parseNote(${note})`);
  }

  /* eslint-disable prefer-const */
  let [noteName, octave] = note.split(/([0-9]+)/);

  if (getNoteIndex(noteName) === undefined) {
    throw new Error(`"${noteName}" not found in the list: ${notes}`);
  }

  try {
    octave = Number(octave);
  } catch (err) {
    throw new Error(`Expected "${octave}" to be a number`);
  }

  return {
    noteName,
    octave,
  };
}

/*
 * calculates the frequency of a note.
 *
 * @param {string} note - the note letter and octave
 *
 * Examples:
 * `frequencyFromNote("D4")` => 293.66
 * `frequencyFromNote("A4")` => 440
 * `frequencyFromNote("A5")` => 880
 *
 * Source: https://pages.mtu.edu/~suits/NoteFreqCalcs.html
 */

export function frequencyFromNote(note) {
  const { noteName, octave } = parseNote(note);
  const noteIndexOffset = getNoteIndex(noteName) - baseNote.halfStepsFromC4;

  const halfSteps = noteIndexOffset + (octave - baseNote.octave) * notes.length;
  const frequency = baseNote.frequency * Math.pow(Math.pow(2, 1 / 12), halfSteps);
  return frequency;
}

function runTests() {
  function assertEquals(num1, num2) {
    if (num1.toFixed(2) !== num2.toFixed(2)) {
      throw new Error(
        `the number ${num1.toFixed(2)} does not equal ${num2.toFixed(2)}`,
      );
    }
  }

  assertEquals(frequencyFromNote('A3'), 220);
  assertEquals(frequencyFromNote('A4'), 440);
  assertEquals(frequencyFromNote('A5'), 880);

  assertEquals(frequencyFromNote('C4'), 261.63);
  assertEquals(frequencyFromNote('D4'), 293.66);
  assertEquals(frequencyFromNote('A#4'), 466.16);
  assertEquals(frequencyFromNote('Ab4'), 415.3);
}

runTests();
