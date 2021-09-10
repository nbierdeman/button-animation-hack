let playButton = document.querySelector("#buttons-container1");

// ---- Worker ----

let worker;
function initWorker() {
  worker = new Worker("./worker.js");
}

initWorker();

// ---- Canvas ----
//const canvas = document.getElementById("animations");
//const ctx = canvas.getContext("2d");

//ctx.fillStyle = "green";
//ctx.fillRect(10, 10, 150, 100);

let canvas = document.getElementById("animations");
let ctx = canvas.getContext("2d");
let width = 50;
let height = 50;

function drawSnowMan(dancingAngle = 1) {
  // kill old snowman RIP
  ctx.clearRect(0, 0, width, height);

  canvas.width = width;
  canvas.height = height;

  function drawCircle(color, x, y, radius) {
    ctx.strokeStyle = ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }

  function drawTriangle(color, x, y, height) {
    ctx.strokeStyle = ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - height, y - height);
    ctx.lineTo(x + height, y - height);
    ctx.fill();
  }

  function drawRectangle(color, x, y, width, height) {
    ctx.strokeStyle = ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  function drawLine(color, x1, y1, angle, length) {
    x2 = x1 + Math.cos((Math.PI / 180.0) * angle - 90) * length;
    y2 = y1 + Math.sin((Math.PI / 180.0) * angle - 90) * length;

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = color;
    ctx.stroke();
  }

  // draw body
  drawCircle("#FFFF00", 25, 35, 10);
  drawCircle("#FFFF00", 25, 20, 7);
  drawCircle("#FFFF00", 25, 10, 5);

  // draw eyes
  drawCircle("#000", 23, 9, 0.6);
  drawCircle("#000", 27, 9, 0.6);

  // new arms
  drawLine("#000", 18, 20, 180 * dancingAngle, -10);
  drawLine("#000", 32, 20, 1200 * dancingAngle, 10);

  // draw buttons
  drawCircle("#000", 200, 160, 3);
  drawCircle("#000", 200, 200, 3);
  drawCircle("#000", 200, 240, 3);

  // nose
  drawTriangle("#FFA500", 25, 12, 2);

  // hat
  drawRectangle("#555454", 160, 45, 80, 10);
  drawRectangle("#555454", 170, 5, 60, 40);
}

function makeSnowManDance() {
  const multiplier = Math.random() + 1;
  drawSnowMan(multiplier);
}

drawSnowMan();

// ---- Song ----

class Song {
  constructor() {
    const AudioContextCrossBrowser =
      window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextCrossBrowser();
    this.masterVolume = this.audioContext.createGain();
    this.masterVolume.gain.value = 0.3;
    this.masterVolume.connect(this.audioContext.destination);
    this.notesQueue = [];
  }

  playNote({
    type = "sine",
    frequency = 440,
    delayPlayback = 0,
    attack = 0.2,
    decay = 0.5,
    sustain = 1,
    release = 0.1,
  }) {
    let offset = this.audioContext.currentTime + 0.1;
    let oscillator = this.audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    let envelope = this.audioContext.createGain();
    envelope.gain.value = 0;
    envelope.gain.setTargetAtTime(1, offset + delayPlayback, attack);
    envelope.gain.setTargetAtTime(0.75, offset + delayPlayback + attack, decay);
    envelope.gain.setTargetAtTime(
      0,
      offset + delayPlayback + attack + decay + sustain,
      release
    );
    let convolver = this.audioContext.createConvolver();
    convolver.buffer = this.impulseResponse(4, 4, false);
    oscillator.connect(envelope);
    envelope.connect(this.masterVolume);
    //envelope.connect(convolver);
    //convolver.connect(this.masterVolume);
    oscillator.start(delayPlayback + offset);

    this.notesQueue.push({ timestamp: delayPlayback + offset }); // TODO: can we also capture the note itself

    return this;
  }

  impulseResponse(duration, decay, reverse) {
    var sampleRate = this.audioContext.sampleRate;
    var length = sampleRate * duration;
    var impulse = this.audioContext.createBuffer(2, length, sampleRate);
    var impulseL = impulse.getChannelData(0);
    var impulseR = impulse.getChannelData(1);

    if (!decay) decay = 2.0;
    for (var i = 0; i < length; i++) {
      var n = reverse ? length - i : i;
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }
    return impulse;
  }
}

// glogals
let song1;
let last16thNoteDrawn = -1;

playButton.addEventListener("click", function () {
  song1 = new Song();
  song1
    //.playNote({})
    .playNote({ frequency: 523.25 })
    .playNote({ frequency: 554.37 })
    .playNote({ frequency: 659.25, delayPlayback: 2 })
    // kick drum addition
    .playNote({ frequency: 220, delayPlayback: 0, attack: 0.1, decay: 0.1, sustain: 0, release: 0.1 })
    .playNote({ frequency: 220, delayPlayback: 1, attack: 0.1, decay: 0.1, sustain: 0, release: 0.1 })
    .playNote({ frequency: 220, delayPlayback: 2, attack: 0.1, decay: 0.1, sustain: 0, release: 0.1 })
    .playNote({ frequency: 220, delayPlayback: 3, attack: 0.1, decay: 0.1, sustain: 0, release: 0.1 })
    .playNote({ frequency: 220, delayPlayback: 4, attack: 0.1, decay: 0.1, sustain: 0, release: 0.1 })
    .playNote({ frequency: 220, delayPlayback: 5, attack: 0.1, decay: 0.1, sustain: 0, release: 0.1 })
    .playNote({ frequency: 220, delayPlayback: 6, attack: 0.1, decay: 0.1, sustain: 0, release: 0.1 })
    .playNote({ frequency: 220, delayPlayback: 7, attack: 0.1, decay: 0.1, sustain: 0, release: 0.1 })
    .playNote({ frequency: 220, delayPlayback: 8, attack: 0.1, decay: 0.1, sustain: 0, release: 0.1 });

  draw();
});

function draw() {
  let currentNote = last16thNoteDrawn;
  let currentTime = song1.audioContext.currentTime;
  let notesInQueue = song1.notesQueue;

  while (notesInQueue.length && notesInQueue[0].timestamp < currentTime) {
    currentNote = notesInQueue[0].timestamp;
    notesInQueue.splice(0, 1); // remove note from queue
  }

  // We only need to draw if the note has moved.
  if (last16thNoteDrawn != currentNote) {
    makeSnowManDance();
    last16thNoteDrawn = currentNote;
  }

  // set up to draw again
  requestAnimationFrame(draw);
}
