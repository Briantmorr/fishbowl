const Settings = require('../models/Settings');
const db = require('../db');
//Simple version, without validation or sanitation

exports.chooseSettings = function (req, res) {
    res.sendFile('settings.html');
};

exports.createSettings = function (req, res) {
    

    let newSettings = new Settings();
    newSettings.save(function(err, settings) {
    if(err) {
        return err;
    }
    console.log(settings._id);
        res.send(settings._id);
    });
};


exports.getSettings = async function (req, res) {
    console.log(req.query.room_code);

    res.send('hello');
    let result = await Settings.findOne({'room_code': req.query.room_code}, 'id');

    console.log('results' ,result);
    if(result) {
        
    }
    // let settings= req.body;
    // console.log('code', settings);
    // // let newRoom = new Room(
    // //     {
    // //         'room_code': room_code
    // //     }
    // // );
    // // newRoom.save(function(err) {
    // // if(err) {
    // //     return err;
    // // }
    //     res.send(req.body);
    // // });
};

