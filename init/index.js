const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlist';

main()
    .then(() => {
        console.log("Database initialization complete");
    })
    .catch((err) => {
        console.error(err);    
});

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner : "6958c728ee8bfe19766c7ab7"}));
    await Listing.insertMany(initData.data);
    console.log("Inserted initial listings");
};

initDB();