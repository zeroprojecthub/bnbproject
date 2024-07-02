const express = require('express'),
  engine = require('ejs-mate'),
  app = express();

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");


const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

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

app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.use((req, res,next) => {
  console.log('its middleware');
  // res.render("This is middlware");
  next();
})


app.get('/', (req, res) => {
  console.log('Home root');
  res.render('layouts/bplate.ejs');
})
app.get("/listings", async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
})


app.get("/listings/new", async (req, res) => {
  res.render('listings/new.ejs');
})

app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  // console.log(id);

  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
})


app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
})


app.put("/listings/:id", async (req, res) => {
  console.log('update data');
  let { id } = req.params;
  console.log(id);
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  // res.redirect(`/listings/${id}`);
  res.redirect('/listings');
});


app.post("/listings", async (req, res) => {
  console.log('post call');
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
  // console.log(newListing);
})


app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

app.listen(8000, () => {
  console.log("server is listening to port 8000");
});