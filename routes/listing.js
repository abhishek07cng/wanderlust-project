const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require('../schema.js');
// const { isLoggedIn, isOwner, validateListing ,isHost, normalizeCheckboxes } = require("../middleware.js")
const {
  isLoggedIn,
  isOwnerOrAdmin,
  validateListing,
  normalizeCheckboxes
} = require("../middleware");



const multer  = require('multer')
const { storage } = require("../cloudConfig.js");

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp","image/avif"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ExpressError(400, "Only JPG, PNG, WEBP, AVIF images are allowed"), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter
});

const listingController = require("../controllers/listing.js");

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,normalizeCheckboxes, upload.single("listing[image]") ,validateListing, wrapAsync(listingController.createNewListing));
    

//New Route - Form to create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwnerOrAdmin,normalizeCheckboxes, upload.single("listing[image][url]"),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwnerOrAdmin, wrapAsync(listingController.deleteListing));



//Index Route - List all listings
// router.get("/", wrapAsync(listingController.index));



//SHOW Rpite - Show details of one listing
// router.get("/:id", wrapAsync(listingController.showListing));

//create Route - Create a new listing
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createNewListing));

//EDIT Route - Form to edit a listing
router.get("/:id/edit", isLoggedIn,isOwnerOrAdmin, wrapAsync(listingController.renderEditForm));

//Update Route - Update a listing
// router.put("/:id", isLoggedIn,isOwnerOrAdmin, validateListing, wrapAsync(listingController.updateListing));

//delete Route - Delete a listing
// router.delete("/:id", isLoggedIn,isOwnerOrAdmin, wrapAsync(listingController.deleteListing));

module.exports = router;