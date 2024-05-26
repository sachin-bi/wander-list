const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        set : (v) => v === "" ? "Description Not Provided" : v,
    },
    image: {
        type: String,
        set : (v) => v === "" ? "https://images.unsplash.com/photo-1436259335948-d404e293e2b8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,

    },
    price: Number,
    location: {
        type: String,
        set : (v) => v === "" ? "Location Not Provided" : v,
    },
    country: {
        type: String,
        set : (v) => v === "" ? "Country Not Provided" : v,
    },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;