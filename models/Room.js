const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OPEN = 1;
const IN_PROGRESS = 2;
const FINISHED = 3;

let RoomSchema = new Schema({
    room_code: {type: String, required: true, max: 10},
    settings_id: {type: String, required: false, default: null},
    phrases_id: {type: String, required: false, default: null},
    status: {type: Number, required: true, max: 10, default: 1}
});


// Export the model
module.exports = mongoose.model('Room', RoomSchema);