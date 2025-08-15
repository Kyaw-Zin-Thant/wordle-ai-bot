const fs = require('fs')
const path = require('path')

class WordList {
    constructor(){
        this.words = [];
    }

    async load(){
        try {
            const filePath = path.join(__dirname, '../../data/all-words.txt');
            const data = await fs.promises.readFile(filePath,'utf-8');
            this.words =  data.split('\n')
            .map(word => word.trim().toLowerCase())
            .filter(word => word.length === 5 && /^[a-z]+$/.test(word))

            if(this.words.length===0){
                throw new Error('No words inside')
            }
        } catch (error) {
            throw new Error(`Failed to load file: ${error.message}`)
        }
    }

    getAllWords(){
        return [...this.words]
    }
}

module.exports = WordList;