const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema} = require('./schema.js');
const { reviewSchema } = require('./schema.js');
const review = require("./models/review.js");
const Review = require('./models/review.js');


module.exports.isLoggedIn = (req, res, next) => {
    console.log("REQ.USER...", req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to access that page !");
        return res.redirect("/login");
    }
    next();
};
//here passport deletes req.session.redireturl after using it once
//so we need to save it to res.locals.redirectUrl to use it in the template
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

/* ---------------- AUTHORIZATION ---------------- */
module.exports.isOwnerOrAdmin = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }

    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    if (
        listing.owner.equals(req.user._id) ||
        req.user.role === "admin"
    ) {
        return next();
    }

    req.flash("error", "You do not have permission to do that");
    res.redirect(`/listings/${id}`);
};
module.exports.isAdmin = (req, res, next) => {
  if (!req.isAuthenticated() || req.user.role !== "admin") {
    req.flash("error", "Admin access only");
    return res.redirect("/");
  }
  next();
};

// module.exports.isOwnerOrAdmin = async (req, res, next) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) {
//         throw new ExpressError(404, "Listing not found");
//     }
//     if (
//         listing.owner.equals(req.user._id) ||
//         req.user.role === "admin"
//     ) {
//         return next();
//     }

//     req.flash("error", "You do not have permission to do that");
//     res.redirect(`/listings/${id}`);
// };

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id ,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error", "You are not the author of this review!");
        return  res.redirect(`/listings/${id}`);
    }   
    next();
};

/* ---------------- VALIDATION ---------------- */
module.exports.validateListing = (req, res, next) => {
  const result = listingSchema.validate(req.body, { abortEarly: false });
  if (result.error) {
    const msg = result.error.details
      .map((el) => el.message)
      .join(", ");
    throw new ExpressError(400,msg);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body, { abortEarly: false });
  if (result.error) {
    const msg = result.error.details
      .map((el) => el.message)
      .join(", ");
    throw new ExpressError(400,msg);
  }
  next();
};



// Utislity to normalize checkbox inputs
const normalizeCheckboxes = (req, res, next) => {
    // If body does not exist, skip
    if (!req.body || !req.body.listing) {
        return next();
    }

    req.body.listing.workspaceAvailable =
        req.body.listing.workspaceAvailable === "on";

    req.body.listing.longStayAllowed =
        req.body.listing.longStayAllowed === "on";

    next();
};

module.exports.normalizeCheckboxes = normalizeCheckboxes;