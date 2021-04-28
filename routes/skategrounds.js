const express = require('express');
const router = express.Router();
const asyncWrapper = require('../utilities/asyncWrapper')
const Skateground = require('../models/skateground')
const { skategroundSchema } = require('../schemas.js')
const ExpressError = require('../utilities/ExpressError')

///////////////////////////
// VALIDATIONS ///////////
/////////////////////////
const validateSkateground = ((req, res, next) => {
    const { error } = skategroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
})


// all skategrounds
router.get('/', asyncWrapper(async (req, res, next) => {
    const skategrounds = await Skateground.find({});
    res.render('skategrounds/index', { skategrounds });
}))

// new skateground form
router.get('/new', (req, res) => {
    res.render('skategrounds/new');
})

// post new skateground form
router.post('/', validateSkateground, asyncWrapper(async (req, res, next) => {
    const skateground = new Skateground(req.body.skateground)
    await skateground.save();
    res.redirect(`/skategrounds/${skateground._id}`)

}))

// get edit form
router.get('/:id/edit', asyncWrapper(async (req, res, next) => {
    const skateground = await Skateground.findById(req.params.id)
    res.render('skategrounds/edit', { skateground })
}))

// PUT edit form
router.put('/:id', validateSkateground, asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    const skateground = await Skateground.findByIdAndUpdate(id, { ...req.body.skateground }) // destructure 
    res.redirect(`/skategrounds/${skateground._id}`);

}))

// get one skateground
router.get('/:id', asyncWrapper(async (req, res, next) => {
    const skateground = await Skateground.findById(req.params.id).populate('reviews')
    res.render('skategrounds/show', { skateground })
}))

// Delete a skateground
router.delete('/:id', asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    await Skateground.findByIdAndDelete(id);
    res.redirect('/skategrounds');
}))

module.exports = router;