// SETUP DEPENDENCIES
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Skateground = require('./models/skateground')

// SETUP MONGOOSE
mongoose.connect('mongodb://localhost:27017/skateGround', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

// is mongoose on?
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('DATABASE IS CONNECTED');
})

// SETUP EJS AND MIDDLEWARE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ROUTES
// index

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/createSkateground', async (req, res) => {
    // const skateground = new Skateground({ title: 'hello', price: 0, description: 'Concrete park with concrete features', location: 'London' })
    // await skateground.save();
    // res.send(skateground)
})

// START LISTENING
app.listen(3000, () => console.log('SERVER ON PORT 3000'))