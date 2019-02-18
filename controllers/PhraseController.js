const Room = require('../models/Room');
const Phrase = require('../models/Phrase');
const db = require('../db');
//Simple version, without validation or sanitation
exports.phrase = function (req, res) {
    res.sendfile('phrase.html');
};

exports.getPhrases = async function (req, res) {
    //use room id/code to get associated phrases    
    
    let room_code = req.query.room_code;
    let result = await Room.findOne({'room_code': room_code}).exec(); 
    console.log('result i', result);
    console.log(result.phrase_id);
    if(result.phrase_id) {

    }
    else {
        res.send(null);
    }
};

exports.addPhrases = async function (req, res) {
    //use room id/code to get associated phrases then add phrases and save the total list.    
    const room_code = req.query.room_code;
    const phrases = req.body.phrases;
    console.log('phrases are', phrases);
    console.log('in hr');
    let phrase = await getAllPhrases(room_code);
    if(phrase) {
        console.log('phrases exist');
        // add our phrases to existing and save
    } 
    else{
        console.log('phrases dont exist');
        // save our phrase as new phrase and associate with the room
        let newPhrase =  new Phrase({
            'phrases' : phrases
        });

        newPhrase.save(function(err, result) {
            if(err) {
                return err;
            }
            //possibly callback? doesn't like async here

            
                // console.log('rsult', result);
                // now associate this with the room.
                let newRoom = await Room.findOne({'room_code': room_code}).exec();
                newRoom.phrases_id = result._id;
                newRoom.save(function(err, roomResult) {
                    if(err) {
                        return err;
                    }
                    
                    console.log('ro and r', roomResult); 
                })
            });
    }
    // first get Phrases


    // if no phrase, we will create a new phrase object and associate with our room
};

// helper get phrases
async function getAllPhrases(room_code) {
    let result = await Room.findOne({'room_code': room_code}).exec(); 
    console.log('result i', result);
    console.log(result.phrase_id);
    if(result.phrase_id) {
        // use phrase id to get phrases from model.
    }
    else {
        return null;
    }
}