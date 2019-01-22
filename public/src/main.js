

document.addEventListener("DOMContentLoaded", function () {
    attachEventHandlers();
})

function attachEventHandlers() {
    let room_button = document.getElementById('create_room');
    room_button.addEventListener('click', handleClick);
} 

function handleClick() {
    console.log('click it');
    window.location.href = window.location + 'room';
}
