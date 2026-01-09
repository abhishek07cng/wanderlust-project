
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');
const user = require('./routes/user..js');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, 'public')));

// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlist';
const dbUrl = process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(dbUrl);
    console.log('Connected to MongoDB');
}
main()
   .then(() =>{
    console.log("connected to DB");
   })
   .catch((err) => {
    console.log(err);
   });


const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto :{
    secret : process.env.SECRET ,
    touchAfter : 24 * 3600 ,
    }
});

store.on("error", function(err){
    console.log("ERROR IN MONGO SESSION STORE", err);
});
const sessionOptions = {
    store,
    secret : process.env.SECRET ,
    resave : false,
    saveUninitialized : true,
    cookie :{
        expires : Date.now() + 7 *24 *60 *60 *1000,
        maxAge : 7 *24 *60 *60 *1000,
        httpOnly : true
    }
};

app.get('/', (req, res) => {
    res.redirect('/listings');
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/demo", async (req, res) => {
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username : "delts-studentt",
//     });
//     let registeredUser = await User.register(fakeUser, "delts1234");
//     res.send(registeredUser);
// });
// const validateListing = (req, res, next) => {
//     const {error} = listingSchema.validate(req.body);
//     let errormsg = error.details.map(el => el.message).join(",");
//     if(error) {
//         throw new ExpressError(400, errormsg);
//     }
//     else {
//         next();
//     }
// };
// const validateListing = (req, res, next) => {
//   const result = listingSchema.validate(req.body, { abortEarly: false });
//   if (result.error) {
//     const msg = result.error.details
//       .map((el) => el.message)
//       .join(", ");
//     throw new ExpressError(400,msg);
//   }
//   next();
// };
// const validateReview = (req, res, next) => {
//   const result = reviewSchema.validate(req.body, { abortEarly: false });
//   if (result.error) {
//     const msg = result.error.details
//       .map((el) => el.message)
//       .join(", ");
//     throw new ExpressError(400,msg);
//   }
//   next();
// };

app.use("/listings",listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);

// //Index Route - List all listings
// app.get("/listings", wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs",{allListings});
// }));

// //New Route - Form to create new listing
// app.get("/listings/new", (req, res) => {
//     res.render("listings/new.ejs");
// });

// //SHOW Rpite - Show details of one listing
// app.get("/listings/:id", wrapAsync(async (req, res) => {
//     const {id} = req.params;
//     const listing = await Listing.findById(id).populate('reviews');
//     res.render("listings/show.ejs",{listing});
// }));

// //create Route - Create a new listing
// app.post("/listings", validateListing, wrapAsync(async (req, res) => {
//     // let listing  = req.body;
//     // if(!req.body.listing) {
//     //     throw new ExpressError(400, "Invalid Listing Data ! Send Valid data");  
//     // }
//     // let result = listingSchema.validate(req.body);
//     // console.log(result);
//     // if(result.error) {
//     //     throw new ExpressError(400, result.error);
//     // }
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect(`/listings`);
// }));
// //EDIT Route - Form to edit a listing
// app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
//     const {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing});
// }));
// //Update Route - Update a listing
// app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
//     if(!req.body.listing) {
//         throw new ExpressError(400, "Invalid Listing Data ! Send Valid data");  
//     }
//     const {id} = req.params;
//     await Listing.findByIdAndUpdate(id, req.body.listing);
//     res.redirect(`/listings/${id}`);
// }));
// //delete Route - Delete a listing
// app.delete("/listings/:id", wrapAsync(async (req, res) => {
//     const {id} = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log("Deleted Listing: ", deletedListing);
//     res.redirect("/listings");
// }));
// //Add Post Review to a listing
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newreview = new Review(req.body.review);

//     listing.reviews.push(newreview);
//     await newreview.save();
//     await listing.save();
//     res.redirect(`/listings/${listing._id}`);
// }));

// //Delete a review from a listing
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
//     let {id , reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id ,{$pull : {reviews : reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// }));

// app.get("/testlisting", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Sample Listing",
//         description: "This is a sample listing for testing.",
//         location: "Sample Location",
//         price : 100,
//         country : "India"
//     });
//     await sampleListing.save();
//     console.log("Sample listing saved to database");
//     res.send("successful testing");
// });

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {statusCode, message});
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

