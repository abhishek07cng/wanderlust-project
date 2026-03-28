const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// CREATE BOOKING
router.post("/:listingId", isLoggedIn, async (req, res) => {
  const { checkIn, checkOut } = req.body;

  const listing = await Listing.findById(req.params.listingId);

  // 🔥 Prevent double booking
  const existingBooking = await Booking.findOne({
    listing: listing._id,
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) },
  });

  if (existingBooking) {
    req.flash("error", "Dates already booked!");
    return res.redirect(`/listings/${listing._id}`);
  }

  // Calculate price
  const days = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

  const totalPrice = days * listing.price;

  const booking = new Booking({
    listing: listing._id,
    user: req.user._id,
    checkIn,
    checkOut,
    totalPrice,
  });

  await booking.save();

  req.flash("success", "Booking confirmed!");
  res.redirect(`/listings/${listing._id}`);
});

module.exports = router;
