// SETUP MONGOOSE
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SkategroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
})

module.exports = mongoose.model('Skateground', SkategroundSchema);