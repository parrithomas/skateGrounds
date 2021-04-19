// SETUP DEPENDENCIES
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Skateground = require('./models/skateground')
const methodOverride = require('method-override')

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
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


// ROUTES
// index
app.get('/', (req, res) => {
    res.render('home')
})

// all skategrounds
app.get('/skategrounds', async (req, res) => {
    const skategrounds = await Skateground.find({});
    res.render('skategrounds/index', { skategrounds });
})

// new skateground form
app.get('/skategrounds/new', (req, res) => {
    res.render('skategrounds/new');
})

// post new skateground form
app.post('/skategrounds', async (req, res) => {
    const skateground = new Skateground(req.body.skateground)
    await skateground.save();
    res.redirect(`/skategrounds/${skateground._id}`)

})

// get edit form
app.get('/skategrounds/:id/edit', async (req, res) => {
    const skateground = await Skateground.findById(req.params.id)
    res.render('skategrounds/edit', { skateground })
})

// PUT edit form
app.put('/skategrounds/:id', async (req, res) => {
    const { id } = req.params
    const skateground = await Skateground.findByIdAndUpdate(id, { ...req.body.skateground }) // destructure 
    res.redirect(`/skategrounds/${skateground._id}`);
})

// get one skateground
app.get('/skategrounds/:id', async (req, res) => {
    const skateground = await Skateground.findById(req.params.id)
    res.render('skategrounds/show', { skateground })
})

// Delete a skateground
app.delete('/skategrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Skateground.findByIdAndDelete(id);
    res.redirect('/skategrounds');
})





// START LISTENING
app.listen(3000, () => console.log('SERVER ON PORT 3000'))