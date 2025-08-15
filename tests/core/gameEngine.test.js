const GameEngine = require('../../src/core/gameEngine');

describe('GameEngine', () => {
  test('initializes and loads candidates', () => {
    const engine = new GameEngine();
    engine.initilizae(['crane', 'trace', 'slate']);
    expect(engine.getCandidates()).toEqual(['crane', 'trace', 'slate']);
    expect(engine.getGuessCount()).toBe(0);
  });

  test('updates state and filters candidates for correct letters', () => {
    const engine = new GameEngine();
    engine.initilizae(['crane', 'trace', 'grape', 'brace']);

    const feedback = [
      { slot: 0, guess: 'c', result: 'correct' },
      { slot: 1, guess: 'r', result: 'present' },
      { slot: 2, guess: 'a', result: 'absent' },
      { slot: 3, guess: 'n', result: 'absent' },
      { slot: 4, guess: 'e', result: 'correct' }
    ];

    engine.updateState(feedback);

    const candidates = engine.getCandidates();
    // Must keep words that start with c and end with e, contain r but not at 1, and no 'a' or 'n'
    expect(candidates.every(w => w[0] === 'c' && w[4] === 'e')).toBe(true);
    expect(candidates.every(w => w.includes('r') && w[1] !== 'r')).toBe(true);
    expect(candidates.every(w => !w.includes('a') && !w.includes('n'))).toBe(true);
    expect(engine.getGuessCount()).toBe(1);
  });

  test('filters out words with absent letters not contradicted by known presence/correctness', () => {
    const engine = new GameEngine();
    engine.initilizae(['crane', 'trace', 'slate']);
    engine.updateState([
      { slot: 0, guess: 'x', result: 'absent' },
      { slot: 1, guess: 'y', result: 'absent' },
      { slot: 2, guess: 'z', result: 'absent' },
      { slot: 3, guess: 'q', result: 'absent' },
      { slot: 4, guess: 'w', result: 'absent' },
    ]);
    expect(engine.getCandidates()).toEqual(['crane', 'trace', 'slate']);
  });
});


