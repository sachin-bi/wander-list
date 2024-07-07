const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
// const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js"); //err handling fn
const ExpressError = require("./utils/ExpressError.js");
// const { render } = require('ejs');
const { listingSchema } = require('./schema.js');


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



//New Route
app.get("/listings/new", (req, res) => {
    console.log("new ejs render");
    res.render("listings/new.ejs");
});


//Show route
app.get("/listings/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });

}));


// all listings
app.get("/listings", wrapAsync(async (req, res, next) => {
    const allListing = await Listing.find({});
    console.log("goes here -- allListing");
    res.render("listings/index.ejs", { allListing });
}));

//validate listing
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

//POST Route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });

}));

//Update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res, next) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing!");
    // }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");

}));


//DELETE route
app.delete("/listings/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");

}));


//root route
app.get("/", (req, res) => {
    res.send("Hi, This is root");
});

//testing
// app.get("/testListing", async (req,res) =>{

//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location : "Kalighat, Kolkata",
//         country : "India",
//     });
//     await sampleListing.save();
//     console.log("sample was created");
//     res.send("successful testing");
// });

//err handling route
app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page not found! :)"));
});

app.use((err, req, res, next) => {
    
    let { statusCode = 500, message = "Something went wrong!------" } = err;
    console.log("Something went wrong!-----------------", message);
    // console.log(err.stack);
    // res.status(statusCode).send(message);
    res.render("error.ejs", { statusCode, message });
});


app.listen(8080, () => {
    console.log("Server is listening to port - 8080");
});
