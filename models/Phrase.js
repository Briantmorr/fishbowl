const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PhraseSchema = new Schema({
    'phrases': {type: [], required: true, max: 128},
});


// Export the model
module.exports = mongoose.model('Phrase', PhraseSchema);