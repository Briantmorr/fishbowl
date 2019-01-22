const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SettingsSchema = new Schema({
    rounds: {type: Number, required: false, max: 10, default:3},
    turn_time: {type: Number, required: false, default: 45},
    skips: {type: Number, required: false, default: 1},
    phrases_per_person: {type: Number, required: false, max: 10, default:4},
    max_phrase_length: {type: Number, required: false, default: 5}
});


// Export the model
module.exports = mongoose.model('Settings', SettingsSchema);