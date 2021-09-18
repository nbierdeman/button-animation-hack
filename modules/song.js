import { frequencyFromNote } from './note-frequency.js';

export default class Song {
  constructor() {
    const AudioContextCrossBrowser = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextCrossBrowser();
    this.masterVolume = this.audioContext.createGain();
    this.masterVolume.gain.value = 0.3;
    this.masterVolume.connect(this.audioContext.destination);
    this.notesQueue = [];
  }

  playNote({
    note = 'A4',
    type = 'sine',
    delayPlayback = 0,
    attack = 0.2,
    decay = 0.5,
    sustain = 1,
    release = 0.1,
  }) {
    const frequency = frequencyFromNote(note);
    const offset = this.audioContext.currentTime + 0.1;
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    const envelope = this.audioContext.createGain();
    envelope.gain.value = 0;
    envelope.gain.setTargetAtTime(1, offset + delayPlayback, attack);
    envelope.gain.setTargetAtTime(0.75, offset + delayPlayback + attack, decay);
    envelope.gain.setTargetAtTime(
      0,
      offset + delayPlayback + attack + decay + sustain,
      release,
    );

    oscillator.connect(envelope);
    envelope.connect(this.masterVolume);
    oscillator.start(delayPlayback + offset);

    this.notesQueue.push({ timestamp: delayPlayback + offset });

    return this;
  }
}
