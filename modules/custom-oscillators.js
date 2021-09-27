// source: https://github.com/lukehorvat/web-audio-oscillators/tree/master/lib
export default {
  bass: [0, 1, 0.8144329896907216, 0.20618556701030927, 0.020618556701030927],
  organ: [0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1],
  chiptune: Array.from({ length: 8192 }, (_, n) =>
    n === 0 ? 0 : (4 / (n * Math.PI)) * Math.sin(Math.PI * n * 0.18),
  ),
  sine: Array.from({ length: 8192 }, (_, n) => (n === 1 ? 1 : 0)),
};
