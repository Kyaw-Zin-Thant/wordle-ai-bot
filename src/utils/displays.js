const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m'
  };

  function displayFeedback(feedback){
    let output = 'Feedback : ';
    for(const item of feedback){
        const letter = item.guess.toUpperCase();
        switch(item.result){
            case 'correct':
                output += `${colors.green}${letter}${colors.reset}`;
                break;
            case 'present':
                output += `${colors.yellow}${letter}${colors.reset}`;
                break;
            case 'absent':
                output += `${colors.red}${letter}${colors.reset}`;
                break;
        }
    }
    console.log(output);
  }
  function displayStatus(guessCount, remainingCandidates, won = false){
    console.log(`\n Game Status:`);
    console.log(`Guess Count: ${guessCount}`);
    console.log(`Remaining Candidates: ${remainingCandidates}`)

    if(won){
        if(guessCount <= 3){
            console.log('It is great.')
        }else if(guessCount <= 5){
            console.log('It is good.')
        }else{
            console.log('You won.')
        }
    }else{
        console.log('Better luck next time.')
    }
  }

module.exports = {
    displayFeedback,
    displayStatus
}