const Listing = require("../models/listing");
const User = require("../models/user");
const Review = require("../models/review");

module.exports.dashboard = async (req, res) => {
  // BASIC COUNTS
  const listingsCount = await Listing.countDocuments();
  const usersCount = await User.countDocuments();
  const reviewsCount = await Review.countDocuments();

  // 📊 LISTINGS BY CATEGORY
  const listingsByCategory = await Listing.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);

  // 📍 LISTINGS BY LOCATION
  const listingsByLocation = await Listing.aggregate([
    { $group: { _id: "$location", count: { $sum: 1 } } }
  ]);

  // 👤 USERS BY ROLE
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
};
