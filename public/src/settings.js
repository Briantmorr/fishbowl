document.addEventListener("DOMContentLoaded", function () {
    let settings = new Settings();
    
})


class Settings{ 
    constructor() {
        this.roomSettings = this.getRoomSettings();
        this.generateRoomCode();
        console.log("my room code is: ", this.roomCode);
        this.phrase = [];
        this.attachEventHandlers();
    }
     attachEventHandlers() {
        let submitButton = document.getElementById('submit');
        submitButton.addEventListener('click', this.processSettings.bind(this));
        
        let homeButton = document.getElementById('home');
        homeButton.addEventListener('click', this.processHome.bind(this));
    }
    async processSettings(e){
        console.log('helloh');
        e.preventDefault();
        let inputValues = document.getElementById('postData').elements;
        console.log(inputValues);
        //should work
        //fill up with saved default settings;
        let rounds = inputValues[0].value || 3;
        let turn_time = inputValues[1].value || 45;
        let skips = inputValues[2].value || 1;
        let phrases_per_person = inputValues[3].value || 4;
        let max_phrase_length = inputValues[4].value || 120;
        // let postBody = document.getElementById('postBody').value;
        try {

            let response = await fetch("http://localhost:3000/createSettings?room_code=" + this.room_code, {
            method: 'POST',
            body: JSON.stringify({"rounds": rounds, "turn_time": turn_time, "skips": skips, "phrases_per_person" : phrases_per_person, "max_phrase_length" : max_phrase_length}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });


                response.text().then(function(response) {
                    console.log('posted correctly with setting id of: ', response);
                    console.log(this);
                    this.handleSettingsResponse(response);
            }.bind(this));
        }
        catch (err) {
            return "promise error";
        }

    }

    generateRoomCode(){
// I can also set the code when the request is first made? or load the page and append the code?
        //lets set it here.
        let that = this;
        let response = fetch("http://localhost:3000/createRoomCode");
        response.then(function(response) {
            console.log('firstres', response);
            return response.text();
        }).then(function(response) {
           that.roomCode = response;
           that.displayRoomCode(response);
        });
    }
    displayRoomCode(room_code){
        let divCode = document.getElementById('room_code');
        this.room_code = room_code;
        divCode.innerText = room_code;
    }
    createRoom() {

    }
    getRoomSettings() {
        return 'temp';
    }

    handleSettingsResponse(response) {
        // if response is okay we show success. Or throw an error.
        let main = document.getElementById("main");
        let result = document.getElementById('result');

        if(response === "OK") {
            result.getElementsByTagName('span')[0].innerText = this.roomCode;
        }
        else {
            result.getElementsByTagName('span')[0].innerText = 'failed';
        }
        main.classList.toggle('hidden');
        result.classList.toggle('hidden');
    }

    processHome() {
        window.location.replace('http://localhost:3000/');
    }
}