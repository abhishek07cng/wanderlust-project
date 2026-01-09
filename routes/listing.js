const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require('../schema.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")

const multer  = require('multer')
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage})

const listingController = require("../controllers/listing.js");

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]") ,validateListing, wrapAsync(listingController.createNewListing));
    

//New Route - Form to create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image][url]"),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));



//Index Route - List all listings
// router.get("/", wrapAsync(listingController.index));



//SHOW Rpite - Show details of one listing
// router.get("/:id", wrapAsync(listingController.showListing));

//create Route - Create a new listing
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createNewListing));

//EDIT Route - Form to edit a listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//Update Route - Update a listing
// router.put("/:id", isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing));

//delete Route - Delete a listing
// router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;