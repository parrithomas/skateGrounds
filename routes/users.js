const express = require('express');
const router = express.Router();
const User = require('../models/user');
const asyncWrapper = require('../utilities/asyncWrapper');
const passport = require('passport')
const users = require('../controllers/users')

router.route('/register')
    .get(users.newUserForm)
    .post(asyncWrapper(users.createNewUser))

router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (users.login))

router.get('/logout', users.logout);

module.exports = router;