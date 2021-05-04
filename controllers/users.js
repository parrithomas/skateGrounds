const User = require('../models/user');

module.exports.createNewUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email })
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) return next(err);
        });
        req.flash('success', `Nice one, ${req.user.username}, you're all signed up for SkateGrounds. Happy skating.`)
        res.redirect('/skategrounds');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}

module.exports.newUserForm = (req, res) => {
    res.render('users/register')
}

module.exports.loginForm = (req, res) => {
    res.render('users/login')
}

module.exports.login = async (req, res) => {
    req.flash('success', `You're logged in, ${req.user.username}`)
    const redirectURL = req.session.returnTo || '/skategrounds'
    delete req.session.returnTo;
    res.redirect(redirectURL)
}

module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', 'Logged out')
    res.redirect('/skategrounds')
}

module.exports.loginForm = (req, res) => {
    res.render('users/login')
}