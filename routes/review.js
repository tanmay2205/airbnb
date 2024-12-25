const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params to access `id` from parent routes
const wrapAsync = require('../utils/wrapAsync.js')
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require('../controllers/reviews.js');


// reviews section
// post route
router.post('/',isLoggedIn , validateReview, wrapAsync (reviewController.createReview))
  
  // delete review route
  router.delete('/:reviewId',isLoggedIn ,isReviewAuthor, wrapAsync(reviewController.destroyReview))


  module.exports = router;