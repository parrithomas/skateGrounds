const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to get params that are defined in a different routes file
const asyncWrapper = require('../utilities/asyncWrapper')
const Skateground = require('../models/skateground')
const Review = require('../models/review')
const { reviewSchema } = require('../schemas.js')
const ExpressError = require('../utilities/ExpressError')

// VALIDATIONS
const validateReview = ((req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
})

// post review
router.post('/', validateReview, asyncWrapper(async (req, res) => {
    const skateground = await Skateground.findById(req.params.id); //  this will fail without the mergeParams option up top
    const review = new Review(req.body.review);
    skateground.reviews.push(review);
    await review.save();
    await skateground.save();
    res.redirect(`/skategrounds/${skateground._id}`);
}))

// delete review
router.delete('/:reviewId', asyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params;
    await Skateground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/skategrounds/${id}`)
}))

module.exports = router;