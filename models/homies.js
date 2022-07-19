const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HomieSchema = new Schema({
    name: String,
    age: Number,
    location: String,
    image: Array,
    description: String,
    occupation: String,
    status: String,
    gender: String
});

module.exports = mongoose.model('Homie', HomieSchema);