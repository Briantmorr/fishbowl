document.addEventListener("DOMContentLoaded", function () {
    let phrases = new Phrase();
})

class Phrase {
    constructor() {
        this.room_code = this.getParameterByName('room_code');
        this.displayRoomCode();
        this.roomSettings = this.getRoomSettings();
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
        // if(this.phrases.length >= max_length) {
            //submit and review
        // }
        // else {
        //     // reset form and save
        // }
    }

    attachEventHandlers() {
        let submitButton = document.getElementById('submit');
        submitButton.addEventListener('click', this.handleClick.bind(this));
       

    }    

    handleClick(e) {
        let phrase = document.getElementById('phrase').value;
        console.log(phrase);
        this.addPhrase(phrase);
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
        let body = await response.text();
        console.log('body', body);
        console.log(typeof(body));
        console.log(response);
        return response;
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

    submitPhrases() {

    }
} 