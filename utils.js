const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const baseNote = {
    name: "C",
    octave: 4,
    frequency: 261.6255
}

/*
 * calculates the frequency of a note.
 *
 * @param {string} note - the note letter and octave
 *
 * Examples:
 * `frequencyFromNote("A4")` => 440
 * `frequencyFromNote("D4")` => 587.33
 * `frequencyFromNote("A5")` => 880
 *
 * Source: https://pages.mtu.edu/~suits/NoteFreqCalcs.html
*/
function frequencyFromNote(note) {
    const { noteName, octave } = parseNote(note);
    const steps = notes.indexOf(noteName) + ((octave - baseNote.octave) * notes.length);
    const frequency = baseNote.frequency * Math.pow(Math.pow(2, (1/12)), steps);
    return Math.round((frequency + Number.EPSILON) * 100) / 100;
}

function parseNote(note) {
    if (typeof note !== 'string') {
        throw new Error(`Invalid input for parseNote(${note})`);
    }

    let [noteName, octave] = note.split(/([0-9]+)/);
    noteName = noteName.toUpperCase();

    if (!notes.includes(noteName)) {
        throw new Error(`"${noteName}" not found in the list: ${notes}`);
    }

    try {
        octave = Number(octave);
    } catch (err) {
        throw new Error(`Expected "${octave}" to be a number`);
    }

    return {
        noteName,
        octave
    };
}
