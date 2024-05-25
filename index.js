const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');

const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err) =>{
        console.log(err);
    });
async function main() {
    await mongoose.connect(MONGO_URL);
}


app.get("/",(req,res) =>{
    res.send("Hi, This is root");
});
app.get("/testListing", async (req,res) =>{
    
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the beach",
        price: 1200,
        location : "Kalighat, Kolkata",
        country : "India",
    });
    await sampleListing.save();
    console.log("sample was created");
    res.send("successful testing");
});


app.listen(8080, () => {
    console.log("Server is listening to port - 8080");
});
