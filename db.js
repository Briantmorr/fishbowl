require('dotenv').config();
const mongoose = require('mongoose');
let mongoDB =  process.env.DEV_DB_URL || process.env.MONGODB_URI;
console.log(mongoDB);
const options = {useMongoClient: true, autoIndex:true};
mongoose.connect(mongoDB, options);
mongoose.Promise = global.Promise;
db = mongoose.connection;
module.exports = db;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));