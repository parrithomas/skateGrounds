const express = require('express');
const app = express();
const router = express.Router();
const asyncWrapper = require('../utilities/asyncWrapper')
const Skateground = require('../models/skateground')
const skategrounds = require('../controllers/skategrounds');


const flash = require('connect-flash');
const { loginCheck, validateSkateground, isOwner } = require('../utilities/middleware')

///////////////////////
//////  ROUTES  //////

router.route('/')
    .get(asyncWrapper(skategrounds.index))
    .post(loginCheck, validateSkateground, asyncWrapper(skategrounds.postNewForm))

// new skateground form
router.get('/new', loginCheck, skategrounds.renderNewForm)

router.route('/:id')
    .put(loginCheck, isOwner, validateSkateground, asyncWrapper(skategrounds.putEditForm))
    .get(asyncWrapper(skategrounds.showSkateground))
    .delete(loginCheck, isOwner, asyncWrapper(skategrounds.deleteSkateground))


// get edit form
router.get('/:id/edit', loginCheck, isOwner, asyncWrapper(skategrounds.renderEditForm))

module.exports = router;