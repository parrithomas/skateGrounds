// SETUP DEPENDENCIES
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utilities/ExpressError')

// SETUP MONGOOSE
mongoose.connect('mongodb://localhost:27017/skateGround',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

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
mongoose.set('useFindAndModify', false);
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
const skategroundRoutes = require('./routes/skategrounds')
app.use('/skategrounds', skategroundRoutes);

const reviewRoutes = require('./routes/reviews')
app.use('/skategrounds/:id/reviews', reviewRoutes);

// index
// router.get('/', (req, res) => {
//     res.render('home')
// })


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