// SETUP DEPENDENCIES
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utilities/ExpressError')
const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

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

// Session Config
const sessionConfig = {
    secret: 'thisneedstobeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // date + 1 week (ms/s/m/h/d)
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
}

// SETUP EJS AND MIDDLEWARE
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
mongoose.set('useFindAndModify', false);
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// flash messages and other locals
app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.review = req.flash('review');
    next();
})

// ROUTES
const skategroundRoutes = require('./routes/skategrounds')
app.use('/skategrounds', skategroundRoutes);
const reviewRoutes = require('./routes/reviews')
app.use('/skategrounds/:id/reviews', reviewRoutes);
const userRoutes = require('./routes/users')
app.use('/', userRoutes);

// index
app.get('/', (req, res) => {
    res.send('sk8rboi')
})

app.get('/fakeuser', async (req, res) => {
    const user = new User({ email: 'parri@gmail.com', username: 'pazza' });
    const newUser = await User.register(user, 'monkey');
    res.send(newUser)
})



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