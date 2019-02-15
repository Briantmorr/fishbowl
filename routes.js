const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const roomController = require('./controllers/RoomController');
const phraseController = require('./controllers/PhraseController');
const settingsController = require('./controllers/SettingsController');

// a simple test url to check that all of our files are communicating correctly.
router.get('/createRoomCode', roomController.createRoom);
router.get('/joinRoom', roomController.joinRoom);
// router.get('/createphrase', phraseController.phrase);
router.get('/settings', settingsController.getSettings);
router.post('/createSettings', settingsController.createSettings);
// router.get('/chooseSettings', settingsController.chooseSettings);
module.exports = router;