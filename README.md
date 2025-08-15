## Wordle AI Bot (Interview)

An automated Wordle-playing CLI bot. It selects guesses, queries a Wordle API for feedback, updates its internal constraints, and continues until it wins or runs out of attempts.

### Features
- **Word list loading**: Filters valid 5-letter words from `data/all-words.txt`.
- **Scoring-based guessing**: Picks words by letter-frequency heuristics after the first guess.
- **Multiple modes**: `daily`, `random`, or `specific` target word.
- **ANSI-colored feedback**: Clear CLI output showing correct/present/absent letters.

### Requirements
- Node.js 16+
- npm 8+

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file in the project root:
```env
API_BASE_URL=https://your-wordle-api.example.com

# One of: daily | random | specific (defaults to daily if not set)
GAME_MODE=daily

# Required only when GAME_MODE=specific
TARGET_WORD=crane

# Optional seed for GAME_MODE=random (if your API supports it)
# SEED=12345
```

Environment variables:
- **API_BASE_URL (required)**: Base URL of your Wordle API (e.g., `https://api.example.com/wordle`).
- **GAME_MODE (optional)**: `daily`, `random`, or `specific`. Default: `daily`.
- **TARGET_WORD (conditional)**: Required when `GAME_MODE` is `specific`.
- **SEED (optional)**: Used only by some `random` implementations.

### Running the Bot
```bash
node src/index.js
```

Output includes feedback coloring, remaining candidates, and a final status summary.

### Project Structure
```
wordle-ai-bot-interview/
├─ data/
│  └─ all-words.txt              # Source word list
├─ src/
│  ├─ api/
│  │  └─ wordleApi.js            # HTTP client to the Wordle API
│  ├─ core/
│  │  ├─ gameEngine.js           # State, constraint filtering, scoring
│  │  └─ wordList.js             # Word list loading/filtering
│  ├─ utils/
│  │  └─ displays.js             # CLI feedback/status rendering
│  └─ index.js                   # Entry point
├─ package.json
└─ README.md
```

### Game Modes
- **daily**: Uses `/daily?guess=<word>&size=5`.
- **random**: Uses `/random?guess=<word>&size=5[&seed=...]`.
- **specific**: Uses `/word/<TARGET_WORD>?guess=<word>`.

### API Contract (Expected by `src/api/wordleApi.js`)
- All endpoints must return an array of exactly 5 items.
- Each item must have:
  - **slot**: number index 0–4
  - **guess**: single lowercase letter
  - **result**: one of `absent`, `present`, `correct`

Example response (array of 5):
```json
[
  { "slot": 0, "guess": "c", "result": "present" },
  { "slot": 1, "guess": "r", "result": "absent" },
  { "slot": 2, "guess": "a", "result": "correct" },
  { "slot": 3, "guess": "n", "result": "absent" },
  { "slot": 4, "guess": "e", "result": "present" }
]
```

### How It Works (Brief)
1. Load 5-letter words from `data/all-words.txt`.
2. Pick an opening word from a small curated list.
3. Submit guess → receive feedback from API.
4. Update constraints and filter candidates.
5. Score words by letter frequency and pick next guess.
6. Repeat until win or attempts exhausted (max 6).

### Scripts
- `npm test`: Placeholder.

### Troubleshooting
- "API_BASE_URL environment variable is required": Set `API_BASE_URL` in `.env`.
- 400/500 from API: Verify endpoint paths and query params match the contract.
- No possible words: Ensure `data/all-words.txt` exists and has valid 5-letter words.

### License
ISC

### Author
Kyaw Zin Thant


