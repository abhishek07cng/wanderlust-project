const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const { reviewSchema } = require('../schema.js');
const Review = require('../models/review.js');
const ExpressError = require("../utils/ExpressError.js");
const Listing = require('../models/listing.js');
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");

const reviewController = require('../controllers/review.js');



//Add Post Review to a listing
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete a review from a listing
router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;