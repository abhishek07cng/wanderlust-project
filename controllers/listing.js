const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Index Route - List all listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}
//New Route - Form to create new listing
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}
//SHOW Rpite - Show details of one listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    console.log("Listing Details: ", listing);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist !");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}
//create Route - Create a new listing
module.exports.createNewListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
    }).send()
    //  ✅ FIX: normalize checkbox values
    req.body.listing.workspaceAvailable = Boolean(req.body.listing.workspaceAvailable);
    req.body.listing.longStayAllowed = Boolean(req.body.listing.longStayAllowed);


    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image.url = url;
    newListing.image.filename = filename;

    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);

    req.flash("success", "Successfully Created a New Listing !");
    res.redirect("/listings");
}
//EDIT Route - Form to edit a listing
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested to edit does not exist !");
        return res.redirect("/listings");
    }
    let originalmage = listing.image.url;
    originalImage = originalmage.replace("/upload", "/upload/h_50,w_200");
    res.render("listings/edit.ejs", { listing, originalImage });
}
//Update Route - Update a listing
// module.exports.updateListing = async (req, res) => {

//     if(!req.body.listing) {
//         throw new ExpressError(400, "Invalid Listing Data ! Send Valid data");  
//     }
//     const {id} = req.params;
//     let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
//     if(typeof req.file !== 'undefined'){
//         let url = req.file.path;
//         let filename = req.file.filename;
//         listing.image.url = url;
//         listing.image.filename = filename;
//         await listing.save();
//     }
//     req.flash("success", "Successfully Updated the Listing !");
//     res.redirect(`/listings/${id}`);
// }
module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid Listing Data! Send valid data");
    }

    const { id } = req.params;

    // 1️⃣ Fetch listing first
    const listing = await Listing.findById(id);

    // 2️⃣ Update ONLY text fields
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    listing.workspaceAvailable = Boolean(req.body.listing.workspaceAvailable);
    listing.longStayAllowed = Boolean(req.body.listing.longStayAllowed);
    listing.minStayDays = req.body.listing.minStayDays;
    listing.wifiSpeed = req.body.listing.wifiSpeed;

    // 3️⃣ Update image ONLY if new file uploaded
    if (req.file) {
        let curl = req.file.path;
        let cfilename = req.file.filename;
        listing.image = {
            url: curl,
            filename: cfilename,
        };
    }

    await listing.save();

    req.flash("success", "Successfully Updated the Listing!");
    res.redirect(`/listings/${id}`);
};

//delete Route - Delete a listing
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing: ", deletedListing);
    req.flash("success", "Successfully Deleted the Listing !");
    res.redirect("/listings");
}
module.exports.index = async (req, res) => {
    let {
        location,
        minPrice,
        maxPrice,
        category,
        amenities,
        guests
    } = req.query;

    let filter = {};

    // 📍 Location filter
    if (location) {
        filter.location = { $regex: location, $options: "i" };
    }

    // 💰 Price filter
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = minPrice;
        if (maxPrice) filter.price.$lte = maxPrice;
    }

    // 🏠 Category
    if (category) {
        filter.category = category;
    }

    // ⭐ Amenities (array match)
    //   if (amenities) {
    //     filter.amenities = { $all: amenities.split(",") };
    //   }
    if (amenities) {
        filter.amenities = {
            $all: Array.isArray(amenities) ? amenities : [amenities]
        };
    }


    // 👥 Guests
    if (guests) {
        filter.maxGuests = { $gte: guests };
    }
    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs", { allListings });
};
