const Skateground = require("../models/skateground");
const Review = require("../models/review");
const ExpressError = require('../utilities/ExpressError')
const { skategroundSchema, reviewSchema } = require('../schemas.js')

module.exports.loginCheck = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You need to log in.')
        return res.redirect('/login');
    } next()
}

module.exports.validateSkateground = ((req, res, next) => {
    const { error } = skategroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
})

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const skateground = await Skateground.findById(id)
    if (!skateground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/skategrounds/${id}`)
    }
    next();
}

module.exports.isReviewOwner = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/skategrounds/${id}`)
    }
    next();
}

module.exports.validateReview = ((req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
})
