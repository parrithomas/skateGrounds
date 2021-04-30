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
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/861827/1600x900',
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse viverra a tortor ac maximus. Nunc vel rhoncus dolor. In molestie accumsan metus, sit amet varius velit posuere fringilla. Vestibulum commodo lorem et mauris tincidunt, id commodo orci eleifend. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse viverra nisl tempus, euismod eros quis, rutrum nisi. Integer vestibulum commodo tortor.",
            price: 0.00,
            author: '608bd9a462ea2f234018120c'

        })
        await skate.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})

