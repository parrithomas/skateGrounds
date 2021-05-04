const Skateground = require('../models/skateground')

module.exports.index = async (req, res, next) => {
    const skategrounds = await Skateground.find({});
    res.render('skategrounds/index', { skategrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('skategrounds/new');
}

module.exports.postNewForm = async (req, res, next) => {
    const skateground = new Skateground(req.body.skateground)
    skateground.author = req.user._id;
    await skateground.save();
    req.flash('success', '🛹 New Skateground created! 🛹');
    res.redirect(`/skategrounds/${skateground._id}`)

}

module.exports.renderEditForm = async (req, res, next) => {
    const skateground = await Skateground.findById(req.params.id)
    if (!skateground) {
        req.flash('error', `Couldn't find the Skateground you're looking for ¯\_(ツ)_/¯`);
        return res.redirect('/skategrounds');
    }
    res.render('skategrounds/edit', { skateground })
}

module.exports.putEditForm = async (req, res, next) => {
    const { id } = req.params
    const skateground = await Skateground.findByIdAndUpdate(id, { ...req.body.skateground }) // destructure 
    req.flash('success', '🛹 Skateground Updated! 🛹')
    res.redirect(`/skategrounds/${skateground._id}`);

}

module.exports.showSkateground = async (req, res, next) => {
    const skateground = await Skateground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!skateground) {
        req.flash('error', `Couldn't find the Skateground you're looking for ¯\_(ツ)_/¯`);
        return res.redirect('/skategrounds');
    }
    console.log(skateground)
    res.render('skategrounds/show', { skateground })
}

module.exports.deleteSkateground = async (req, res, next) => {
    const { id } = req.params;
    const skateground = await Skateground.findByIdAndDelete(id);
    req.flash('success', `🖕 ${skateground.title} deleted 🖕`)
    res.redirect('/skategrounds');
}