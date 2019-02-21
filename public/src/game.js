let team1;
let team2; 
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
        this.attachEventHandlers();

        this.activeTeam = activeTeam;
        this.inactiveTeam = inactiveTeam;
    }

    checkPhraseCount() {
        console.log('phrasecount', this.phrases.length);
        console.log('se', this.roomSettings);
        console.log('s', this.roomSettings.phrases_per_person);
        let clearButton = document.getElementById('clearPhrases');
        let submitButton = document.getElementById('submit');
        let phraseInput = document.getElementById('phrase');
        if(this.phrases.length >= this.roomSettings.phrases_per_person) {
            // submit and review
            clearButton.classList.toggle('hidden');
            //change submit button
            submitButton.innerText = "submit Phrases";
            phraseInput.disabled = true;
        }
        else {
            // reset form and save
            clearButton.classList.add('hidden');
            //change submit button
            submitButton.innerText = "submit";
            phraseInput.disabled = false;
        }
    }

    attachEventHandlers() {
        let startButton = document.getElementById('start');
        startButton.addEventListener('click', this.handleStart.bind(this));
       
        let nextButton = document.getElementById('next');
        nextButton.addEventListener('click', ()  => {
            this.displayNextPhrase();
        });

        let skipButton = document.getElementById('skip');
        skipButton.addEventListener('click', () => {
            this.displayNextPhrase(true);
        })
    }    
    toggleActiveTeam() {
        //toggle team active and update our local variables 
        let tempTeam = this.activeTeam;

        this.activeTeam.toggleActive();
        this.inactiveTeam.toggleActive();

        this.activeTeam = this.inactiveTeam;
        this.inactiveTeam = tempTeam;
    }

    handleStart(e) {
        this.randomPhrases = this.randomizePhraseArray(this.phrases);
        this.startTimer(this.roomSettings.turn_time);
        this.displayNextPhrase();

    }
    setTimer(time) {
        console.log('time is are', time);
        let timerSpan = document.getElementById('timer');
        timerSpan.innerText = time;

    }
    startTimer(turn_time) {
        console.log('settings are', turn_time);
        let timerSpan = document.getElementById('timer');
        timerSpan.innerText = turn_time;
        // convert seconds to milliseconds;
        let timer = setInterval(() => {
            console.log(turn_time);
            if(turn_time <= 0) {
                clearInterval(timer);
                this.finishTurn();
            } else {
                turn_time -= 1; 
                this.setTimer(turn_time);
            }
        }, 1000);

    }
    finishTurn() {
        //finish turn when timer is done 
        
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
            let insertionPoint = Math.floor(Math.random(this.randomPhrases.length) * this.randomPhrases.length);
            console.log('rendom', Math.random(this.randomPhrases.length) * this.randomPhrases.length);
            console.log('nu', insertionPoint);
            this.randomPhrases.splice(insertionPoint, 0, activePhrase);
        } else {
            this.activeTeam.incrementRoundScore();
        }

        if(this.randomPhrases.length > 0) {
            activePhraseSpan.innerText = this.randomPhrases[0];
            this.showStats();
        }
        else {
            // handle end of round
            activePhraseSpan.innerText = 'end of round';
            // this.toggleActiveTeam();
            this.finishRound();
        }

        console.log(this.randomPhrases);
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
        this.setTimer(this.roomSettings.turn_time);
    }
    
    async getRoomPhrases() {
        let response = await fetch("http://localhost:3000/phrases?room_code=" + this.room_code)
        let result = await response.json();
        console.log('result phrases', result);
        this.phrases = result.phrases;
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

    async submitPhrases() {

        let response = await fetch("http://localhost:3000/phrases?room_code=" + this.room_code, {
        method: 'POST',
        body: JSON.stringify({'phrases': this.phrases}),
        headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        response.text().then((response, err) => {
            if(response === 'OK') {
                // move forward to next screen
                // let them Play
                this.handleGameStart();
            }
            // handle error
        })
        // after submitting successfully, redirect to home? or game lobby. Start with all going to play, then lock it to host phone.

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