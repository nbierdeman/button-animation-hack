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
    attack = 0.2,
    decay = 0.5,
    sustain = 1,
    release = 0.1
  }) {
    let offset = this.audioContext.currentTime + 0.1;
    let oscillator = this.audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    let envelope = this.audioContext.createGain();
    envelope.gain.value = 0;
    envelope.gain.setTargetAtTime(1, offset + delayPlayback, attack);
    envelope.gain.setTargetAtTime(0.75, offset + delayPlayback + attack, decay);
    envelope.gain.setTargetAtTime(0, offset + delayPlayback + attack + decay + sustain, release);
    let convolver = this.audioContext.createConvolver();
    convolver.buffer = this.impulseResponse(4, 4, false);
    oscillator.connect(envelope);
    envelope.connect(convolver);
    convolver.connect(this.masterVolume);
    oscillator.start(delayPlayback);
    return this;
  }

  impulseResponse( duration, decay, reverse ) {
    var sampleRate = this.audioContext.sampleRate;
    var length = sampleRate * duration;
    var impulse = this.audioContext.createBuffer(2, length, sampleRate);
    var impulseL = impulse.getChannelData(0);
    var impulseR = impulse.getChannelData(1);
  
    if (!decay)
        decay = 2.0;
    for (var i = 0; i < length; i++){
      var n = reverse ? length - i : i;
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }
    return impulse;
  }
}

playButton.addEventListener("click", function() {
  const song1 = new Song();
  song1
    .playNote({})
    .playNote({ frequency: 554.37 })
    .playNote({ frequency: 659.25, delayPlayback: 2 })
});
