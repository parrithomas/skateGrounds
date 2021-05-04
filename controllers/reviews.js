const Skateground = require('../models/skateground')
const Review = require('../models/review')

module.exports.postReview = async (req, res) => {
    const skateground = await Skateground.findById(req.params.id); //  this will fail without the mergeParams option up top
    const review = new Review(req.body.review);
    review.author = req.user._id;
    skateground.reviews.push(review);
    await review.save();
    await skateground.save();
    req.flash('review', '🤘 Thanks for your review 🤘')
    res.redirect(`/skategrounds/${skateground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Skateground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId)
    req.flash('review', 'Review deleted.')
    res.redirect(`/skategrounds/${id}`)
}