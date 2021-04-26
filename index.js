// SETUP DEPENDENCIES
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Skateground = require('./models/skateground')
const Review = require('./models/review')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utilities/ExpressError')
const asyncWrapper = require('./utilities/asyncWrapper')
const { skategroundSchema, reviewSchema } = require('./schemas.js')

// SETUP MONGOOSE
mongoose.connect('mongodb://localhost:27017/skateGround', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

// is mongoose on?
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('DATABASE IS CONNECTED');
})

// SETUP EJS AND MIDDLEWARE
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

///////////////////////////
// VALIDATIONS ///////////
/////////////////////////
const validateSkateground = ((req, res, next) => {
    const { error } = skategroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
})

const validateReview = ((req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
})

// ROUTES
// index
app.get('/', (req, res) => {
    res.render('home')
})

// all skategrounds
app.get('/skategrounds', asyncWrapper(async (req, res, next) => {
    const skategrounds = await Skateground.find({});
    res.render('skategrounds/index', { skategrounds });
}))

// new skateground form
app.get('/skategrounds/new', (req, res) => {
    res.render('skategrounds/new');
})

// post new skateground form
app.post('/skategrounds', validateSkateground, asyncWrapper(async (req, res, next) => {
    const skateground = new Skateground(req.body.skateground)
    await skateground.save();
    res.redirect(`/skategrounds/${skateground._id}`)

}))

// get edit form
app.get('/skategrounds/:id/edit', asyncWrapper(async (req, res, next) => {
    const skateground = await Skateground.findById(req.params.id)
    res.render('skategrounds/edit', { skateground })
}))

// PUT edit form
app.put('/skategrounds/:id', validateSkateground, asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    const skateground = await Skateground.findByIdAndUpdate(id, { ...req.body.skateground }) // destructure 
    res.redirect(`/skategrounds/${skateground._id}`);

}))

// get one skateground
app.get('/skategrounds/:id', asyncWrapper(async (req, res, next) => {
    const skateground = await Skateground.findById(req.params.id).populate('reviews')
    res.render('skategrounds/show', { skateground })
}))

// Delete a skateground
app.delete('/skategrounds/:id', asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    await Skateground.findByIdAndDelete(id);
    res.redirect('/skategrounds');
}))

// post review

app.post('/skategrounds/:id/reviews', validateReview, asyncWrapper(async (req, res) => {
    const skateground = await Skateground.findById(req.params.id);
    const review = new Review(req.body.review);
    skateground.reviews.push(review);
    await review.save();
    await skateground.save();
    res.redirect(`/skategrounds/${skateground._id}`);
}))

// Error handling

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render('error', { err })

})




// START LISTENING
app.listen(3000, () => console.log('SERVER ON PORT 3000'))