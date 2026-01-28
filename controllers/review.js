const Review = require('../models/review.js');
const { reviewSchema } = require('../schema.js');
const Listing = require('../models/listing.js');

module.exports.createReview = async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    //saving the author of the review
    newreview.author = req.user._id;
    // newreview.listing = listing._id;  
    console.log(newreview);

    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success", "Successfully Added a New Review !");
    res.redirect(`/listings/${listing._id}`);
}
module.exports.deleteReview = async (req, res) => {
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id ,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully Deleted the Review !");
    res.redirect(`/listings/${id}`);
}