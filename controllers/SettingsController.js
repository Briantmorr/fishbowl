const Settings = require('../models/Settings');
const Room = require('../models/Room');
const db = require('../db');
//Simple version, without validation or sanitation

// exports.chooseSettings = function (req, res) {
//     res.sendFile('settings.html');
// };

async function createSettings(req, res) {
    console.log('request is', req.body);
    let settings_id;
    let room_code = req.query.room_code;
    let newSettings = new Settings({"rounds": req.body.rounds, "turn_time" :req.body.turn_time, "skips" : req.body.skips, "phrases_per_person" : req.body.phrases_per_person, "max_phrase_length" : req.body.max_phrase_length});
    let that = this;
    newSettings.save(function(err, settings) {
    if(err) {
        return err;
    }
    console.log(settings._id);
    // res.send(settings._id);
    settings_id = settings._id;
    //now save settings to room
    try{

        let result = associateSettingsToRoom(settings_id, room_code);
        console.log('resul', result);
        result.then(function(response) {
            console.log('after associating', response.ok);
            if(response.ok) {
                res.sendStatus(200);
            }
            else {
                res.sendStatus(404);
            }
        })
    }
    catch (err) {
        return 'promise error';
    }
    // res.send(result);
    });
};

exports.createSettings = createSettings;

async function associateSettingsToRoom(settings_id, room_code) {
    console.log('stuf', settings_id, room_code);
   return await Room.update({'room_code': room_code, 'status': 1}, {'settings_id' : settings_id}, {multi:false}).exec()
}  

exports.getSettings = async function (req, res) {
    const room_code = req.query.room_code;
    console.log('code is', room_code);
    let result = await Room.findOne({'room_code': room_code}, 'settings_id').exec();
    //handle room id somewhere else?
    // room_id = result._id;
    // settings.room_id = room_id;
    console.log('settings:', result.settings_id);
    let settings = await Settings.findOne({'_id': result.settings_id}).exec();
    console.log('sett', settings);
    res.send(settings);
};

