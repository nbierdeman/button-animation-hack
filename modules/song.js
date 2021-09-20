import { frequencyFromNote } from './note-frequency.js';

export default class Song {
  constructor({ beatsPerMinute = 60, beatsPerMeasure = 4 }) {
    this.beatsPerMinute = beatsPerMinute;
    this.beatsPerMeasure = beatsPerMeasure;
    this.beatInSeconds = 60 / beatsPerMinute;

    this.notesInSeconds = {
      1: this.beatsPerMeasure * this.beatInSeconds,
      '1/2': (this.beatsPerMeasure / 2) * this.beatInSeconds,
      '1/4': (this.beatsPerMeasure / 4) * this.beatInSeconds,
      '1/8': (this.beatsPerMeasure / 8) * this.beatInSeconds,
      '1/16': (this.beatsPerMeasure / 16) * this.beatInSeconds,
      '1/32': (this.beatsPerMeasure / 32) * this.beatInSeconds,
      '1/64': (this.beatsPerMeasure / 64) * this.beatInSeconds,
      '1/128': (this.beatsPerMeasure / 128) * this.beatInSeconds,
    };
    const AudioContextCrossBrowser = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextCrossBrowser();
    this.masterVolume = this.audioContext.createGain();
    this.masterVolume.gain.value = 0.3;
    this.masterVolume.connect(this.audioContext.destination);
    this.notesQueue = [];
    this.previousNoteEndTime = 0;
  }

  playNote({
    note = 'A4',
    type = 'sine',
    duration = '1/4',
    attack = 0.1,
    decay = 0.2,
    release = 0.1,
  }) {
    const frequency = frequencyFromNote(note);
    const durationInSeconds = this.notesInSeconds[duration];

    if (this.previousNoteEndTime < this.audioContext.currentTime) {
      // start the song
      this.previousNoteEndTime = this.audioContext.currentTime;
    }

    const offset = this.previousNoteEndTime + 0.1;
    this.previousNoteEndTime += durationInSeconds;

    const oscillator = this.audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;

    const envelope = this.audioContext.createGain();
    envelope.gain.setValueAtTime(0, this.audioContext.currentTime);

    oscillator.connect(envelope);
    envelope.connect(this.masterVolume);

    oscillator.start();

    let sustain = 0;
    if (durationInSeconds - attack - decay - release > 0) {
      sustain = durationInSeconds - attack - decay - release;
    }

    envelope.gain.setValueAtTime(0, offset);
    envelope.gain.linearRampToValueAtTime(1, offset + attack);
    envelope.gain.linearRampToValueAtTime(0.75, offset + attack + decay);
    envelope.gain.linearRampToValueAtTime(0.75, offset + attack + sustain + decay);
    envelope.gain.linearRampToValueAtTime(
      0,
      offset + attack + sustain + decay + release,
    );

    this.notesQueue.push({ timestamp: offset });

    return this;
  }
}
