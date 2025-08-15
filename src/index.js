require('dotenv').config();
const WordleAPI = require('./api/wordleApi');
const WordList = require('./core/wordList');
const GameEngine = require('./core/gameEngine');
const { displayFeedback, displayStatus } = require('./utils/displays')

class WordleBot {
    constructor() {
        this.api = new WordleAPI();
        this.wordList = new WordList();
        this.gameEngine = new GameEngine();
        this.maxGuesses = 6;
        this.gameMode = process.env.GAME_MODE || 'daily';
    }
    async play(){
        try {
            console.log('🤖 Starting the AI Wordle Bot....');
            await this.wordList.load();
            console.log('✅ All pre defined words are loaded');
            this.gameEngine.initilizae(this.wordList.getAllWords());
            let guessCount = 0;
            let won = false;
            while(guessCount < this.maxGuesses){
                const candidates = this.gameEngine.getCandidates();

                if(candidates.length ===0){
                    console.log('❌ No possilbe word');
                    break;
                }

                const guess = this.getNextGuess(candidates,guessCount);
                guessCount++;

                const feedback = await this.makeGuess(guess);

                displayFeedback(feedback);

                this.gameEngine.updateState(feedback);

                console.log(`Remaining Candidates: ${this.gameEngine.getCandidates().length}`)

                if(this.isWin(feedback)){
                    console.log(` Successfully found: ${guess.toUpperCase()}`);
                    won = true;
                    break;
                }

            }

            if(!won && guessCount >= this.maxGuesses){
                console.log('Out of guesses')
            }
            displayStatus(guessCount, this.gameEngine.getCandidates().length, won)
        } catch (error) {
            console.log(`Game faced with errors: ${error.message}`)
        }
    }
    getNextGuess(candidates,guessCount){
        if(guessCount === 0){
            const startWords = ['crane','noble','trace','arise','slate'];
            return startWords[Math.floor(Math.random()* startWords.length)]
        }
        if(candidates <= 3){
            return candidates[0]
        }
        return this.guessBestWord(candidates);
    }
    guessBestWord(candidates){
        const letterFreq = this.calculateLetterFrequency(candidates);

        let bestWord = candidates[0];
        let bestScore = 0;

        for(const word of candidates){
            const score = this.scoreWord(word,letterFreq);
            if(score > bestScore){
                bestWord = word;
                bestScore = score;
            }
        }
        return bestWord;
    }
    calculateLetterFrequency(candidates){
        const freq = {};
        for(const word of candidates){
            const uniqueLetters = new Set(word);
            for(const letter of uniqueLetters){
                freq[letter] = (freq[letter] || 0) + 1;
            }
        }
        return freq;
    }
    scoreWord(word, letterFreq){
        const uniqueLetters = new Set(word);
        let score = 0;
        for(const letter of uniqueLetters){
            score += letterFreq[letter] || 0;
        }
        return score;
    }
    async makeGuess(guess){
        switch(this.gameMode){
            case 'daily':
                 return this.api.guessDaily(guess);
            case 'random':
                  return this.api.guessRandom(guess);
            case 'specific':
                  const targetWord = process.env.TARGET_WORD;
                  if(!targetWord) throw new Error('Target word is not set');
                  return this.api.guessWord(targetWord, guess);
            default:
                throw new Error(`Ivalid game mode: ${this.gameMode}`)   ;
        }
    }

    isWin(feedback){
        return feedback.every(item => item.result === 'correct')
    }
}

if (require.main === module) {
    const bot = new WordleBot();
    bot.play();
}

module.exports = WordleBot;