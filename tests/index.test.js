jest.mock('../src/api/wordleApi');
jest.mock('../src/core/wordList');
jest.mock('../src/core/gameEngine');

const WordleBot = require('../src/index');
const WordleAPI = require('../src/api/wordleApi');
const WordList = require('../src/core/wordList');
const GameEngine = require('../src/core/gameEngine');

describe('WordleBot integration skeleton', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.GAME_MODE = 'daily';
  });

  test('plays a simple winning round', async () => {
    const mockApi = { guessDaily: jest.fn() };
    const mockWordList = { load: jest.fn(), getAllWords: jest.fn(() => ['crane']) };
    const mockEngine = {
      initilizae: jest.fn(),
      getCandidates: jest.fn()
        .mockReturnValueOnce(['crane'])
        .mockReturnValueOnce([])
        .mockReturnValueOnce([]),
      updateState: jest.fn(),
    };

    WordleAPI.mockImplementation(() => mockApi);
    WordList.mockImplementation(() => mockWordList);
    GameEngine.mockImplementation(() => mockEngine);

    mockApi.guessDaily.mockResolvedValue([
      { slot: 0, guess: 'c', result: 'correct' },
      { slot: 1, guess: 'r', result: 'correct' },
      { slot: 2, guess: 'a', result: 'correct' },
      { slot: 3, guess: 'n', result: 'correct' },
      { slot: 4, guess: 'e', result: 'correct' },
    ]);

    // Force first guess to be 'crane'
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);

    const bot = new WordleBot();
    await bot.play();

    expect(mockWordList.load).toHaveBeenCalled();
    expect(mockEngine.initilizae).toHaveBeenCalledWith(['crane']);
    expect(mockApi.guessDaily).toHaveBeenCalledWith('crane');
    expect(mockEngine.updateState).toHaveBeenCalledTimes(1);

    randomSpy.mockRestore();
  });
});


