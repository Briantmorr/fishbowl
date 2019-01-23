const Room = require('../models/Room');
const db = require('../db');
//Simple version, without validation or sanitation
exports.code = function (req, res) {
    res.send('Greetings from the Test controller!');
};

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


exports.joinRoom= async function (req, res) {
    console.log(req.query.room_code);
    let result = await Room.findOne({'room_code': req.query.room_code, status: 1}, 'id')
    if(result) {
        console.log('result is here');
        res.send(true)
    }
    else {
        console.log('not there');
        res.send('room does not exist');
    }
    //  function (err, result) {
    //     if(err) throw err;
    //     if(result) {
    //         res.send(true)
    //     }
    //     else {
    //         console.log('not there');
    //         res.send({'body':'room does not exist'});
    //     }
    // });
};





















//********************HELPERS************************ */
function generateUniqueRoomCode(){
    let room_code = makeid(); 
    Room.findOne({'room_code': room_code, status: 1}, 'id', function (err, result) {
        if(err) throw err;
        if(result) {
            //call this again until we get a new result
            generateUniqueRoomCode();
        }
        console.log(result);
    });
    return room_code;
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (var i = 0; i < 4; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

console.log('text is', text);
  return text;
}
