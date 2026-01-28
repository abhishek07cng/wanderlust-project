const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../middleware");
const Listing = require("../models/listing");
const User = require("../models/user");
const Review = require("../models/review");

// Admin Dashboard Home
router.get("/", isLoggedIn, isAdmin, async (req, res) => {
    const listingsCount = await Listing.countDocuments();
    const usersCount = await User.countDocuments();
    const reviewsCount = await Review.countDocuments();

    // 📊 Listings by category
    const listingsByCategory = await Listing.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // 📍 Listings by location
    const listingsByLocation = await Listing.aggregate([
        { $group: { _id: "$location", count: { $sum: 1 } } }
    ]);

    // 👤 Users by role
    const usersByRole = await User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    res.render("admin/dashboard", {
        listingsCount,
        usersCount,
        reviewsCount,
        listingsByCategory,
        listingsByLocation,
        usersByRole
    });
});
// ================= MANAGE LISTINGS =================
router.get("/listings", isLoggedIn, isAdmin, async (req, res) => {
    const listings = await Listing.find({}).populate("owner");
    res.render("admin/listings", { listings });
});
router.get("/users", isLoggedIn, isAdmin, async (req, res) => {
    const users = await User.find({}); // find all users 
    res.render("admin/users", { users });
});
router.get("/reviews", isLoggedIn, isAdmin, async (req, res) => {
    const reviews = await Review.find({}).populate("author").populate("listing");
    res.render("admin/reviews", { reviews });
});
module.exports = router;