const express = require('express');
const router = express.Router();
const User = require('../models/user');
const asyncWrapper = require('../utilities/asyncWrapper');
const passport = require('passport')


router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', asyncWrapper(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email })
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) return next(err);
        });
        req.flash('success', `Sick, you're all signed up for SkateGrounds. Happy skating.`)
        res.redirect('/skategrounds');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (async (req, res) => {
    req.flash('success', `You're logged in.`)
    const redirectURL = req.session.returnTo || '/skategrounds'
    delete req.session.returnTo;
    res.redirect(redirectURL)
}))


router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'Logged out')
    res.redirect('/skategrounds')
})

module.exports = router;