const Room = require('../models/Room');
const Phrase = require('../models/Phrase');
const db = require('../db');
//Simple version, without validation or sanitation
exports.phrase = function (req, res) {
    res.sendfile('phrase.html');
};

exports.getPhrases = async function (req, res) {
    //use room id/code to get associated phrases    
    const room_code = req.query.room_code;
    let phrase = await getAllPhrases(room_code);
    console.log('phrases are', phrase);       

        res.send(phrase);
};

exports.addPhrases = async function (req, res) {
    //use room id/code to get associated phrases then add phrases and save the total list.    
    const room_code = req.query.room_code;
    const phrases = req.body.phrases;
    console.log('phrases are', phrases);
    let phrase = await getAllPhrases(room_code);
    if(phrase) {
        console.log('phrases exist');
        // add our phrases to existing and save
        let existingPhrases = phrase.phrases;
        console.log('exis', existingPhrases);
        let totalPhrases = existingPhrases.concat(phrases);
        console.log('total', totalPhrases);

        let phraseModel = await Phrase.findOneAndUpdate({'_id': phrase._id}, {$set:{'phrases': totalPhrases}}).exec();
        console.log('new phraess model', phraseModel);
        res.sendStatus(200);
        //doesn't return newest model, with updated phrases, but it works.
    } 
    else{
        console.log('phrases dont exist');
        // save our phrase as new phrase and associate with the room
        let newPhrase =  new Phrase({
            'phrases' : phrases
        });

        phrasePromise = newPhrase.save();
        
        phrasePromise.then(function (response) {
            //  now associate this with the room.
            return newRoom = Room.findOneAndUpdate({'room_code': room_code}, {$set:{'phrases_id': response._id}}); //.exec();
        }).then(function (response) {
            console.log('SUCCESS: updated room wht phrase id', response); 
        });
    }
    // // first get Phrases


    // if no phrase, we will create a new phrase object and associate with our room
};

// helper get phrases
async function getAllPhrases(room_code) {
    let result = await Room.findOne({'room_code': room_code}).exec(); 
    console.log(result.phrases_id);
    if(result.phrases_id) {
        // use phrase id to get phrases from model.
        let phrase = await Phrase.findOne({'_id': result.phrases_id}).exec();
        console.log('prase' , phrase);
        return phrase;
    }
    else {
        return null;
    }
}