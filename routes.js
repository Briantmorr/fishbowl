const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const roomController = require('./controllers/RoomController');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', roomController.code);
router.get('/room', roomController.createRoom);
router.get('/joinRoom', roomController.joinRoom);
module.exports = router;