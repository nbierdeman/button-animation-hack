let AudioContextCrossBrowser = window.AudioContext || window.webkitAudioContext;
let audioContext = new AudioContextCrossBrowser();
let playButton = document.querySelector("#buttons-container1");
let volume = audioContext.createGain();

playButton.addEventListener("click", function() {
  const oscillator1 = audioContext.createOscillator();
  const oscillator2 = audioContext.createOscillator();
  const oscillator3 = audioContext.createOscillator();
  volume.gain.setValueAtTime(0, audioContext.currentTime);
  volume.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
  oscillator1.type = 'sine';
  oscillator2.type = 'sine';
  oscillator3.type = 'sine';
  oscillator1.frequency.setValueAtTime(440, audioContext.currentTime); // value in hertz
  oscillator2.frequency.setValueAtTime(523.25, audioContext.currentTime); // value in hertz
  oscillator3.frequency.setValueAtTime(659.25, audioContext.currentTime); // value in hertz
  oscillator1.connect(volume);
  oscillator2.connect(volume);
  oscillator3.connect(volume);
  volume.connect(audioContext.destination);
  oscillator1.start();
  oscillator2.start();
  oscillator3.start();
  volume.gain.setTargetAtTime(0.2, audioContext.currentTime + 0.1, 2);
  volume.gain.setTargetAtTime(0, audioContext.currentTime + 2.1, 1);
});
