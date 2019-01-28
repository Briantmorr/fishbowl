document.addEventListener("DOMContentLoaded", function () {
    let phrase = new Phrase();
})

class Phrase {
    constructor() {
        this.room_code = this.getParameterByName('room_code');
        this.roomSettings = this.getRoomSettings();
        console.log('cod is', this.room_code);
        this.phrase = [];
        this.attachEventHandlers();
    }
    addPhrase(phrase) {
        this.phrase.push(phrase);
        this.checkPhraseCount();
    }
    checkPhraseCount() {
        console.log('phrasecount', this.phrase.length);
        // if(this.phrase.length >= max_length) {
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
} 