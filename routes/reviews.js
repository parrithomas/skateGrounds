const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to get params that are defined in a different routes file
const asyncWrapper = require('../utilities/asyncWrapper')
const Skateground = require('../models/skateground')
const Review = require('../models/review')
const reviews = require('../controllers/reviews')

// VALIDATIONS
const { validateReview, loginCheck, isReviewOwner } = require('../utilities/middleware')

// post review
router.post('/', loginCheck, validateReview, asyncWrapper(reviews.postReview))

// delete review
router.delete('/:reviewId', loginCheck, isReviewOwner, asyncWrapper(reviews.deleteReview))

module.exports = router;