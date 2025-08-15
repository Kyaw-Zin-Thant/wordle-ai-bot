const axios = require('axios');

class WordleAPI {
  constructor() {
    this.baseURL = process.env.API_BASE_URL;
    
    if (!this.baseURL) {
      throw new Error('API_BASE_URL environment variable is required');
    }
  }
/**
 * 
 * @param {*} guess 
 * @param {*} size 
 * @returns 
 */
  async guessDaily(guess, size = 5) {
    try {
      const response = await axios.get(`${this.baseURL}/daily`, {
        params: { guess, size }
      });
      
      this.validateResponse(response.data);
      return response.data;
      
    } catch (error) {
      throw new Error(`Daily guess failed: ${error.message}`);
    }
  }

  /**
   * 
   * @param {*} guess 
   * @param {*} size 
   * @param {*} seed 
   * @returns 
   */
  async guessRandom(guess, size = 5, seed = null) {
    try {
      const params = { guess, size };
      if (seed) params.seed = seed;
      
      const response = await axios.get(`${this.baseURL}/random`, { params });
      
      this.validateResponse(response.data);
      return response.data;
      
    } catch (error) {
      throw new Error(`Random guess failed: ${error.message}`);
    }
  }

  /**
   * Specific word
   * @param {*} targetWord 
   * @param {*} guess 
   * @returns 
   */
  async guessWord(targetWord, guess) {
    try {
      const response = await axios.get(`${this.baseURL}/word/${targetWord}`, {
        params: { guess }
      });
      
      // Clean the response data if it's a string
      let data = response.data;
      if (typeof data === 'string') {
        data = data.trim().replace(/%$/, '');
        try {
          data = JSON.parse(data);
        } catch (parseError) {
          throw new Error(`Failed to parse response: ${parseError.message}`);
        }
      }
      
      this.validateResponse(data);
      return data;
      
    } catch (error) {
      throw new Error(`Word guess failed: ${error.message}`);
    }
  }

  validateResponse(data) {
    if (!Array.isArray(data) || data.length !== 5) {
      throw new Error('Invalid response format: expected array of 5 items');
    }
    
    for (const item of data) {
      if (item.slot === undefined || !item.guess || !item.result) {
        throw new Error('Invalid response item: missing slot, guess, or result');
      }
      
      if (!['absent', 'present', 'correct'].includes(item.result)) {
        throw new Error(`Invalid result: ${item.result}`);
      }
    }
  }
}

module.exports = WordleAPI;