const mongoose = require('mongoose');
const Skateground = require('../models/skateground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers.js')

mongoose.connect('mongodb://localhost:27017/skateGround', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('DATABASE IS CONNECTED');
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Skateground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const skate = new Skateground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await skate.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})

