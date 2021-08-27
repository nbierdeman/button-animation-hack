let playButton = document.querySelector("#buttons-container1");

class Song {
  constructor() {
    const AudioContextCrossBrowser = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextCrossBrowser();
    this.masterVolume = this.audioContext.createGain();
    this.masterVolume.gain.value = 0.3;
    this.masterVolume.connect(this.audioContext.destination);
  }
  playNote({
    type = "sine",
    frequency = 440,
    delayPlayback = 0,
    attack = 0.1,
    decay = 0.5,
    sustain = 2,
    release = 1
  }) {
    let oscillator = this.audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    let envelope = this.audioContext.createGain();
    envelope.gain.setValueAtTime(0, this.audioContext.currentTime);
    envelope.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + delayPlayback + attack);
    envelope.gain.setTargetAtTime(0.75, this.audioContext.currentTime + delayPlayback + attack, decay);
    envelope.gain.setTargetAtTime(0, this.audioContext.currentTime + delayPlayback + attack + decay + sustain, release);
    oscillator.connect(envelope);
    envelope.connect(this.masterVolume);
    oscillator.start(delayPlayback);
    return this;
  }
}

playButton.addEventListener("click", function() {
  const song1 = new Song();
  song1
    .playNote({})
    .playNote({ frequency: 523.25 })
    .playNote({ frequency: 659.25, delayPlayback: 2 })
});
