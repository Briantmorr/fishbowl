const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const roomController = require('./controllers/RoomController');
const phraseController = require('./controllers/PhraseController');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', roomController.code);
router.get('/room', roomController.createRoom);
router.get('/joinRoom', roomController.joinRoom);
router.get('/createphrase', phraseController.phrase);
module.exports = router;