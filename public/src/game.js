let team1;
let team2; 
// break out team and others into seperate files

document.addEventListener("DOMContentLoaded", function () {
    //set first team to active and pass into game
    team1 = new Team('team1', true);
    team2 = new Team('team2');
    const game = new Game(team1, team2);
})

class Game{
    constructor(activeTeam, inactiveTeam) {
        this.room_code = this.getParameterByName('room_code');
        // this.displayRoomCode();
        this.getRoomSettings();
        this.getRoomPhrases();

        this.roomSettings; 
        this.phrases = [];
        this.randomPhrases = [];
        this.skips;
        this.timer;
        this.timeRemaining;
        this.attachEventHandlers();

        this.activeTeam = activeTeam;
        this.inactiveTeam = inactiveTeam;
        this.displayActiveTeam();
    }

    attachEventHandlers() {
        let startButton = document.getElementById('start');
        startButton.addEventListener('click', () => {
            console.log('click;');
            console.log(startButton.innerText);
            if(startButton.innerText == "Start") {
                this.handleStart();
                startButton.innerText = "Pause";
            }
            else {
                this.handlePause();
                startButton.innerText = "Start";
            }
        });
       
        let nextButton = document.getElementById('next');
        nextButton.addEventListener('click', ()  => {
            this.displayNextPhrase();
        });

        let skipButton = document.getElementById('skip');
        skipButton.addEventListener('click', () => {
            this.displayNextPhrase(true);
        })
    }    
    handlePause() {
        console.log("HAPEEUSING");
        clearInterval(this.timer);
    }
    
    toggleActiveTeam() {
        //toggle team active and update our local variables 
        let tempTeam = this.activeTeam;

        this.activeTeam.toggleActive();
        this.inactiveTeam.toggleActive();

        this.activeTeam = this.inactiveTeam;
        this.inactiveTeam = tempTeam;
        this.displayActiveTeam();
    }

    displayActiveTeam() {
        let teamSpan = document.getElementById('teamSpan');
        teamSpan.innerText = this.activeTeam.name;
    }

    handleStart() {
        this.timer = this.startTimer();
        // show phrase if this is our first time;
        if(this.phrases.length == this.randomPhrases.length) {
            this.randomPhrases = this.randomizePhraseArray(this.phrases);
            console.log("new phrase");
            this.displayNextPhrase();
        }

    }
    setTimer(time) {
        console.log('time is are', time);
        let timerSpan = document.getElementById('timer');
        timerSpan.innerText = time;

    }
    startTimer() {
        // turn_time = 10;
        let timerSpan = document.getElementById('timer');
        timerSpan.innerText = this.timeRemaining;
        // convert seconds to milliseconds;
        let timer = setInterval(() => {
            if(this.timeRemaining <= 1) {
                clearInterval(timer);
                this.setTimer(0);
                this.finishTurn();
            } else {
                this.timeRemaining -= 1; 
                this.setTimer(this.timeRemaining);
                
            }
        }, 1000);
        return timer;
    }
    finishTurn() {
        //finish turn when timer is done 
        this.recyclePhrase(this.phrases[0]);
        //reset timer
        this.setTimer(this.roomSettings.turn_time);
        // reorder Bowl
        this.randomizePhraseArray();
        let activePhraseSpan = document.getElementById('activePhrase');
        activePhraseSpan.innerText = '';
        console.log('all phrases', this.phrases);
        // reset start button 
        //clear prompt by inserting it back into bowl

        // switch Teams;
        this.toggleActiveTeam();
    }

    finishRound() {
        //finish round when phrases are out.
        this.showStats();

        // handle view changes
            
        // disable buttons
        let roundButtons = document.getElementsByClassName('round');

        roundButtons.forEach((button) => {
            button.disabled = true;
        });

        this.resetGame();

    }
    showStats() {
        return null;
    }
    displayNextPhrase(skip = false) {
        let activePhraseSpan = document.getElementById('activePhrase');
        let activePhrase = this.randomPhrases.shift();

        if(skip) {
            // after skipping insert into random location
            this.recyclePhrase(activePhrase);
            this.handleSkipUsage();
        } else {
            this.activeTeam.incrementRoundScore();
        }

        if(this.randomPhrases.length > 0) {
            activePhraseSpan.innerText = this.randomPhrases[0];
        }
        else {
            // handle end of round
            activePhraseSpan.innerText = 'end of round';
            // this.toggleActiveTeam();
            this.finishRound();
        }
        
        this.updateStats();
        console.log(this.randomPhrases);
    }
    recyclePhrase(activePhrase) {
            let insertionPoint = Math.floor(Math.random(this.randomPhrases.length) * this.randomPhrases.length);
            console.log('rendom', Math.random(this.randomPhrases.length) * this.randomPhrases.length);
            console.log('nu', insertionPoint);
            this.randomPhrases.splice(insertionPoint, 0, activePhrase);
    }
    showStats() {
        //display points scored this turn
        // display team total this round. ?
    }

    randomizePhraseArray(phraseArray) {
        //randomize
        return phraseArray;
    }
    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        console.log(name);
        var regex = new RegExp('[&]?' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    async getRoomSettings() {
        let response = await fetch("http://localhost:3000/settings?room_code=" + this.room_code)
        let result = await response.json();
        console.log('result settings', result);
        // result.phrases_per_person = 1;
        this.roomSettings = result;
        this.skips = result.skips;
        this.timeRemaining = result.turn_time;
        this.setTimer(this.timeRemaining);
        this.updateStats();
    }
    
    async getRoomPhrases() {
        let response = await fetch("http://localhost:3000/phrases?room_code=" + this.room_code)
        let result = await response.json();
        console.log('result phrases', result);
        this.phrases = result.phrases;

        this.updateStats();
    }
    
    displayRoomCode() {
        let room_code = document.getElementById('room_code');
        room_code.innerText = this.room_code;
    }

    displayPhrases() {
        console.log('in display', this.phrases);
        let list = document.getElementById('phrase_list');
        while (list.firstElementChild) {
            list.firstElementChild.remove();
        }
        
        this.phrases.forEach(x => {
            let list_item = document.createElement('li');
            list_item.innerText = x;
            list.appendChild(list_item);
        });
    }

    handleSkipUsage() {
        this.skips--;
        // if skips 0 disalbe button
        if(this.skips <= 0) {
            let skipButton = document.getElementById('skip');
            skipButton.disabled = true;
        }
    }

    handleGameStart() {

        const launchContainer = document.getElementById('launchContainer');
        const phraseContainer = document.getElementById('phraseContainer');
        
        phraseContainer.classList.toggle('hidden');
        launchContainer.classList.toggle('hidden');
    }
    processScore() {

    }
    resetGame() {
        
    }

    updateStats() {
        let wordsRemaining = document.getElementById('wordsRemaining');
        wordsRemaining.innerText = this.phrases.length;

        let skipsRemaining = document.getElementById('skipsRemaining');
        skipsRemaining.innerText = this.skips ? this.skips : 0;
    }
}


class Team {
    constructor(name, active = false) {
        this.name = name;
        this.score = 0;
        this.active = active;

        // handle round scoring
        // score should be a key value so round: [3, 9, 12]; where the array index is the // key?
    }
    getRoundScore(round) {
        return this.score;
    }
    setRoundScore(score) {
        this.score = score;
    }
    incrementRoundScore() {
        this.score++;
        console.log('new score for team', this.name, this.score);
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getTotalScore() {

    }
    toggleActive() {
        this.active = this.active ? false : true;
    }
    getActive() {
        return this.active;
    }

}