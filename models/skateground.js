// SETUP MONGOOSE
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')
const User = require('./user');

const SkategroundSchema = new Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

///////////////////
// MIDDLEWARE
// delete all reviews when skateground deleted
SkategroundSchema.post('findOneAndDelete', async function (skateground) {
    if (skateground) {
        await Review.deleteMany({
            _id: { $in: skateground.reviews }
        })
    }
})

module.exports = mongoose.model('Skateground', SkategroundSchema);