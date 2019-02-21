document.addEventListener("DOMContentLoaded", function () {
    let phrases = new Phrase();
})

class Phrase {
    constructor() {
        this.room_code = this.getParameterByName('room_code');
        this.displayRoomCode();
        this.getRoomSettings();
        this.roomSettings; 
        console.log('cod is', this.room_code);
        this.phrases = [];
        this.attachEventHandlers();

    }

    addPhrase(phrase) {
        this.phrases.push(phrase);
        console.log('phrs', this.phrases);
        this.displayPhrases();
        this.checkPhraseCount();
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
        let submitButton = document.getElementById('submit');
        submitButton.addEventListener('click', this.handleClick.bind(this));
       
        let clearButton = document.getElementById('clearPhrases');
        clearButton.addEventListener('click', ()  => {
            // clear saved words and reset list;
            this.phrases = [];
            this.displayPhrases();
            this.checkPhraseCount();
        });

        let startButton = document.getElementById('startButton');
        startButton.addEventListener('click', () => {
            window.location.replace('http://localhost:3000/game?room_code=' +  this.room_code);

        })
    }    

    handleClick(e) {
        let input = document.getElementById('phrase');
        if(this.phrases.length < this.roomSettings.phrases_per_person) {
            this.addPhrase(input.value);
            // reset the input
        }
        else {
            // last click is to submit.
            this.submitPhrases();
        }
        input.value = '';
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
        result.phrases_per_person = 1;
        this.roomSettings = result;
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
} 