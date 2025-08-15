class GameEngine {
    constructor() {
        this.reset();
    }
    reset() {
        this.candidates = [];
        this.correctPositions = new Array(5).fill(null);
        this.presentLetters = new Map();
        this.absentLetters = new Set();
        this.guessCount = 0
    }
    initilizae(wordList) {
        this.reset();
        this.candidates = [...wordList]
    }
    updateState(feedback) {
        this.guessCount++;
        for (let i = 0; i < feedback.length; i++) {
            const { slot, guess: letter, result } = feedback[i];
            switch (result) {
                case 'correct':
                    this.correctPositions[slot] = letter;
                    this.presentLetters.delete(letter);
                    this.absentLetters.delete(letter);
                    break;
                case 'present':
                    if (!this.presentLetters.has(letter)) {
                        this.presentLetters.set(letter, new Set());
                    }
                    this.presentLetters.get(letter).add(slot);
                    this.absentLetters.delete(letter);
                    break;
                case 'absent':
                    if (!this.correctPositions.includes(letter) && !this.presentLetters.has(letter)) {
                        this.absentLetters.add(letter)
                    }
                    break;

            }
        }
        this.filterCandidates();
    }
    filterCandidates() {
        this.candidates = this.candidates.filter(word => {
            for (let i = 0; i < 5; i++) {
                if(this.correctPositions[i] && word[i] !== this.correctPositions[i] ){
                    return false;
                }
            }
            for(const[letter,forbiddenPosition] of this.presentLetters){
                if(!word.includes(letter)){
                    return false;
                }
                for(const pos of forbiddenPosition){
                    if(word[pos] === letter){
                        return false;
                    }
                }
            }
            for(const letter of this.absentLetters){
                if(word.includes(letter)){
                    return false;
                }
            }
            return true;
        })
    }

    getCandidates(){
        return [...this.candidates];
    }

    getGuessCount(){
        return this.guessCount;
    }

    getState(){
        return {
            candidates: this.getCandidates(),
            correctPositions: [...this.correctPositions],
            presentLetters: Object.fromEntries(Array.from(this.presentLetters.entries()).map(([kMaxLength,v])=> [k,Array.from(v)])),
            absentLetters: Array.from(this.absentLetters),
            guessCount: this.guessCount
        }
    }
}

module.exports = GameEngine;