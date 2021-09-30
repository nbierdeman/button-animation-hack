import { frequencyFromNote } from './note-frequency.js';
import customOscillators from './custom-oscillators.js';

export default class Song {
  constructor({ beatsPerMinute = 60, beatsPerMeasure = 4 }) {
    this.beatsPerMinute = beatsPerMinute;
    this.beatsPerMeasure = beatsPerMeasure;
    this.beatInSeconds = 60 / beatsPerMinute;

    this.notesInSeconds = {
      1: this.beatsPerMeasure * this.beatInSeconds,
      '1/2': (this.beatsPerMeasure / 2) * this.beatInSeconds,
      '3/4': ((this.beatsPerMeasure * 3) / 4) * this.beatInSeconds,
      '1/4': (this.beatsPerMeasure / 4) * this.beatInSeconds,
      '1/8': (this.beatsPerMeasure / 8) * this.beatInSeconds,
      '3/8': ((this.beatsPerMeasure * 3) / 8) * this.beatInSeconds,
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
    this.startDelay = 0.1;

    this.allOscillators = [];
    this.isPlaying = false;
    this.notesQueue = [];
    this.beatNumber = 1;
    this.lastNoteEndTime = 0;
    this.lastBeatStartTime = 0;

    this.onBeatCallbacks = [];
    this.onBeatInterval();
  }

  playNotes({
    notes = [],
    type = 'bass',
    duration = '1/4',
    attackTime = 0.1,
    decayTime = 0.2,
    releaseTime = 0.1,
    attackGain = 1,
    sustainGain = 0.75,
  }) {
    this.isPlaying = true;
    const durationInSeconds = this.notesInSeconds[duration];

    if (this.lastNoteEndTime <= this.audioContext.currentTime) {
      // start the song
      this.lastNoteEndTime = this.audioContext.currentTime + this.startDelay;
      this.lastBeatTime = this.audioContext.currentTime + this.startDelay;
    }

    const offset = this.lastNoteEndTime;
    this.lastNoteEndTime += durationInSeconds;

    const oscillators = notes.map((note) => {
      const frequency = frequencyFromNote(note);
      const oscillator = this.audioContext.createOscillator();
      oscillator.frequency.value = frequency;
      oscillator.setPeriodicWave(
        this.createPeriodicWave(customOscillators[type]),
      );

      return oscillator;
    });

    let sustainTime = 0;
    if (durationInSeconds - attackTime - decayTime - releaseTime > 0) {
      sustainTime = durationInSeconds - attackTime - decayTime - releaseTime;
    }

    if (this.masterVolume.gain.value === 0) {
      this.masterVolume.gain.linearRampToValueAtTime(
        0.3,
        this.audioContext.currentTime + 0.5,
      );
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

    const compressor = this.createDynamicsCompressor({});

    const { delayInput, delayOutput } = this.createDelay({
      delayTime: 0.5,
      feedback: 0.1,
      cutoff: 14700,
      wetLevel: 1,
      dryLevel: 1
    });

    const bitcrusher = this.createBitcrusher({
      bits: 16,
      normfreq: 0.5
    });

    // signal routing
    oscillators.forEach((oscillator) => {
      oscillator.connect(envelope);
      oscillator.start();
      this.allOscillators.push(oscillator);
    });
    envelope.connect(bitcrusher);
    bitcrusher.connect(delayInput);
    delayOutput.connect(compressor);
    compressor.connect(this.masterVolume);

    this.notesQueue.push({
      timestamp: offset,
      notes,
    });

    return this;
  }

  onBeat(callback) {
    this.onBeatCallbacks.push(callback);
  }

  onBeatInterval() {
    if (
      !this.notesQueue.length &&
      this.lastNoteEndTime < this.audioContext.currentTime
    ) {
      // stop after the song is over
      this.lastBeatTime = 0;
      this.isPlaying = false;
    }

    if (
      this.lastBeatTime &&
      this.audioContext.currentTime >= this.lastBeatTime
    ) {
      let currentNote;

      if (
        this.notesQueue.length &&
        this.notesQueue[0].timestamp < this.audioContext.currentTime
      ) {
        [currentNote] = this.notesQueue;
        this.notesQueue.splice(0, 1);
      }

      if (Array.isArray(this.onBeatCallbacks)) {
        this.onBeatCallbacks.forEach((callback) => {
          callback({
            beatNumber: this.beatNumber,
            beatTime: this.lastBeatTime,
            currentNote,
          });
        });
      }

      this.lastBeatTime += this.beatInSeconds;

      if (this.beatNumber === this.beatsPerMeasure) {
        this.beatNumber = 1;
      } else {
        this.beatNumber += 1;
      }
    }

    requestAnimationFrame(() => {
      this.onBeatInterval.bind(this)(this.onBeatCallbacks);
    });
  }

  createBitcrusher({
    bits = 4,
    bufferSize = 4096,
    normfreq = 0.1
  }) {
    const processor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

    let phaser = 0, last = 0, processorInput, processorOutput, step, i, length;

    processor.onaudioprocess = function(e) {
      processorInput = e.inputBuffer.getChannelData(0),
      processorOutput = e.outputBuffer.getChannelData(0),
      step = Math.pow(1 / 2, bits);
      length = processorInput.length;
      for (i = 0; i < length; i++) {
        phaser += normfreq;
        if (phaser >= 1.0) {
          phaser -= 1.0;
          last = step * Math.floor(processorInput[i] / step + 0.5);
        }
        processorOutput[i] = last;
      }
    };

    return processor;
  }

  createDelay({
    delayTime = 0.15,
    feedback = 0.1,
    cutoff = 14700,
    wetLevel = 1,
    dryLevel = 1,
  }) {
    const input = this.audioContext.createGain();
    const dry = this.audioContext.createGain();
    const wet = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    const delay = new DelayNode(this.audioContext, { delayTime });
    const feedbackNode = this.audioContext.createGain();
    const output = this.audioContext.createGain();

    input.connect(delay);
    input.connect(dry);
    delay.connect(filter);
    filter.connect(feedbackNode);
    feedbackNode.connect(delay);
    feedbackNode.connect(wet);
    wet.connect(output);
    dry.connect(output);

    feedbackNode.gain.value = feedback;
    wet.gain.value = wetLevel;
    dry.gain.value = dryLevel;
    filter.frequency.value = cutoff;
    filter.type = 'lowpass';

    return {
      delayInput: input,
      delayOutput: output,
    };
  }

  createDynamicsCompressor({
    threshold = -24,
    knee = 40,
    ratio = 4,
    attack = 0.0001,
    release = 0.125,
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

  createPeriodicWave(table) {
    const real = new Float32Array(table);
    const imag = real.map(() => 0);
    const periodicWave = this.audioContext.createPeriodicWave(real, imag);
    return periodicWave;
  }

  reset() {
    this.masterVolume.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    this.masterVolume.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + 0.5,
    );
    setTimeout(() => {
      this.allOscillators.forEach((oscillator) => oscillator.stop());
      this.allOscillators = [];
      this.notesQueue = [];
      this.beatNumber = 1;
      this.lastNoteEndTime = 0;
      this.lastBeatStartTime = 0;
      this.isPlaying = false;
    }, 1000);
  }
}
