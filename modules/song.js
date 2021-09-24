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
    const AudioContextCrossBrowser =
      window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextCrossBrowser();
    this.masterVolume = this.audioContext.createGain();
    this.masterVolume.gain.value = 0.3;
    this.masterVolume.connect(this.audioContext.destination);
    this.notesQueue = [];
    this.previousNoteEndTime = 0;
  }

  playNotes({
    notes = [],
    type = 'sine',
    duration = '1/4',
    attackTime = 0.1,
    decayTime = 0.2,
    releaseTime = 0.1,
    attackGain = 1,
    sustainGain = 0.75,
  }) {
    const durationInSeconds = this.notesInSeconds[duration];

    if (this.previousNoteEndTime < this.audioContext.currentTime) {
      // start the song
      this.previousNoteEndTime = this.audioContext.currentTime;
    }

    const offset = this.previousNoteEndTime + 0.1;
    this.previousNoteEndTime += durationInSeconds;

    const oscillators = notes.map((note) => {
      const frequency = frequencyFromNote(note);
      const oscillator = this.audioContext.createOscillator();
      oscillator.type = type;
      oscillator.frequency.value = frequency;

      return oscillator;
    });

    let sustainTime = 0;
    if (durationInSeconds - attackTime - decayTime - releaseTime > 0) {
      sustainTime = durationInSeconds - attackTime - decayTime - releaseTime;
    }

    const envelope = this.createADSREnvelope({
      startTime: offset,
      attackTime,
      decayTime,
      sustainTime,
      releaseTime,
      attackGain,
      sustainGain,
    });

    oscillators.forEach((oscillator) => {
      oscillator.connect(envelope);
      oscillator.start();
    });

    const compressor = this.createDynamicsCompressor({});
    envelope.connect(compressor);
    compressor.connect(this.masterVolume);

    this.notesQueue.push({ timestamp: offset });

    return this;
  }

  createDynamicsCompressor({
    threshold = -50,
    knee = 40,
    ratio = 12,
    attack = 0,
    release = 0.25,
  }) {
    const compressor = this.audioContext.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(
      threshold,
      this.audioContext.currentTime,
    );
    compressor.knee.setValueAtTime(knee, this.audioContext.currentTime);
    compressor.ratio.setValueAtTime(ratio, this.audioContext.currentTime);
    compressor.attack.setValueAtTime(attack, this.audioContext.currentTime);
    compressor.release.setValueAtTime(release, this.audioContext.currentTime);

    return compressor;
  }

  createADSREnvelope({
    startTime,
    attackTime = 0.1,
    decayTime = 0.2,
    sustainTime = 1,
    releaseTime = 0.1,
    attackGain = 1,
    sustainGain = 0.75,
  }) {
    const envelope = this.audioContext.createGain();
    envelope.gain.setValueAtTime(0, this.audioContext.currentTime);

    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(attackGain, startTime + attackTime);
    envelope.gain.linearRampToValueAtTime(
      sustainGain,
      startTime + attackTime + decayTime,
    );
    envelope.gain.linearRampToValueAtTime(
      sustainGain,
      startTime + attackTime + sustainTime + decayTime,
    );
    envelope.gain.linearRampToValueAtTime(
      0,
      startTime + attackTime + sustainTime + decayTime + releaseTime,
    );

    return envelope;
  }
}
