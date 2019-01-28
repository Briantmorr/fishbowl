const Phrase = require('../models/Room');
const db = require('../db');
//Simple version, without validation or sanitation
// exports.phrase = function (req, res) {
//     res.sendfile('phrase.html');
// };

exports.createRoom = function (req, res) {
    
    let room_code = generateUniqueRoomCode();
    console.log('code', room_code);
    let newRoom = new Room(
        {
            'room_code': room_code
        }
    );
    newRoom.save(function(err) {
    if(err) {
        return err;
    }
        res.send(room_code);
    });
};

