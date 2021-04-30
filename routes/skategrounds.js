const express = require('express');
const app = express();
const router = express.Router();
const asyncWrapper = require('../utilities/asyncWrapper')
const Skateground = require('../models/skateground')


const flash = require('connect-flash');
const { loginCheck, validateSkateground, isOwner } = require('../utilities/middleware')

///////////////////////////
// MIDDLEWARE ///////////
/////////////////////////


///////////////////////
//////  ROUTES  //////

// all skategrounds
router.get('/', asyncWrapper(async (req, res, next) => {
    const skategrounds = await Skateground.find({});
    res.render('skategrounds/index', { skategrounds });
}))

// new skateground form
router.get('/new', loginCheck, (req, res) => {
    res.render('skategrounds/new');
})

// post new skateground form
router.post('/', loginCheck, validateSkateground, asyncWrapper(async (req, res, next) => {
    const skateground = new Skateground(req.body.skateground)
    skateground.author = req.user._id;
    await skateground.save();
    req.flash('success', '🛹 New Skateground created! 🛹');
    res.redirect(`/skategrounds/${skateground._id}`)

}))

// get edit form
router.get('/:id/edit', loginCheck, isOwner, asyncWrapper(async (req, res, next) => {
    const skateground = await Skateground.findById(req.params.id)
    if (!skateground) {
        req.flash('error', `Couldn't find the Skateground you're looking for ¯\_(ツ)_/¯`);
        return res.redirect('/skategrounds');
    }
    res.render('skategrounds/edit', { skateground })
}))

// PUT edit form
router.put('/:id', loginCheck, isOwner, validateSkateground, asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    const skateground = await Skateground.findByIdAndUpdate(id, { ...req.body.skateground }) // destructure 
    req.flash('success', '🛹 Skateground Updated! 🛹')
    res.redirect(`/skategrounds/${skateground._id}`);

}))

// get one skateground
router.get('/:id', asyncWrapper(async (req, res, next) => {
    const skateground = await Skateground.findById(req.params.id).populate('reviews').populate('author')
    if (!skateground) {
        req.flash('error', `Couldn't find the Skateground you're looking for ¯\_(ツ)_/¯`);
        return res.redirect('/skategrounds');
    }
    res.render('skategrounds/show', { skateground })
}))

// Delete a skateground
router.delete('/:id', loginCheck, isOwner, asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const skateground = await Skateground.findByIdAndDelete(id);
    req.flash('success', `🖕 ${skateground.title} deleted 🖕`)
    res.redirect('/skategrounds');
}))

module.exports = router;