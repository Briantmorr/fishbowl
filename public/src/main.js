

document.addEventListener("DOMContentLoaded", function () {
    attachEventHandlers();
})

function attachEventHandlers() {
    let room_button = document.getElementById('create_room');
    room_button.addEventListener('click', handleClick);
} 

function handleClick() {
    console.log('click it');
    window.location.href = window.location + 'createRoom';
}

async function validateRoom(event) {
    //validate empty submits, etc.
    event.preventDefault();
    console.log(event);
    let room_code = document.getElementById('room_code').value;
    console.log(room_code);

    //make get request to /room?room_code=event.code
    let response = await fetch("http://localhost:3000/joinRoom?room_code=" + room_code)
    let body = await response.text();
    console.log('body', body);
    console.log(typeof(body));
    //handle validation with better solution than a string.
    if(body == 'true') {
        //enter room
        
        console.log('enter room');
        // redirect to room
        window.location.pathname += 'phrase?room_code=' + room_code;
    }
    else {
        displayErrors(body);
    }
}


function displayErrors(error) {
    errorDiv = document.getElementById('error');
    errorDiv.innerText = error;
}
