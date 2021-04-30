const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to get params that are defined in a different routes file
const asyncWrapper = require('../utilities/asyncWrapper')
const Skateground = require('../models/skateground')
const Review = require('../models/review')

// VALIDATIONS
const { validateReview } = require('../utilities/middleware')

// post review
router.post('/', validateReview, asyncWrapper(async (req, res) => {
    const skateground = await Skateground.findById(req.params.id); //  this will fail without the mergeParams option up top
    const review = new Review(req.body.review);
    skateground.reviews.push(review);
    await review.save();
    await skateground.save();
    req.flash('review', '🤘 Thanks for your review 🤘')
    res.redirect(`/skategrounds/${skateground._id}`);
}))

// delete review
router.delete('/:reviewId', asyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params;
    await Skateground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId)
    req.flash('review', 'Review deleted.')
    res.redirect(`/skategrounds/${id}`)
}))

module.exports = router;