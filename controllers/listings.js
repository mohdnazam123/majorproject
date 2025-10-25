const Listing = require("../models/listing");


// Show all listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// Render form to create new listing
module.exports.renderNewForm = (req, res) => { 
  res.render("listings/new.ejs");
};



// Show a single listing details
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ 
      path: "reviews", 
      populate: {
     path: "author" 
    },
   })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
   console.log(listing);
  res.render("listings/show.ejs", { listing });
};

// Create a new listing
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
   newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

// Render edit form for a listing
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });

};

// Update a listing
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing  = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
   if (typeof req.file !== "undefined") {
   let url = req.file.path;
    let filename = req.file.filename;
    Listing.image = { url, filename };
    await listing.save();
}

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// Delete a listing
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};




















































// const Listing = require("../models/listing");

// // Show all listings
// module.exports.index = async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// };

// // Render form to create new listing
// module.exports.renderNewForm = (req, res) => { 
//   res.render("listings/new.ejs");
// };

// // Show a single listing details
// module.exports.showListing = async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id)
//     .populate({ path: "reviews", populate: { path: "author" } })
//     .populate("owner");

//   if (!listing) {
//     req.flash("error", "Listing you requested for does not exist");
//     return res.redirect("/listings");
//   }

//   res.render("listings/show.ejs", { listing });
// };

// // ✅ Fixed: Create a new listing with image support
// module.exports.createListing = async (req, res, next) => {
//   const newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id;

//   // Agar form me image URL diya hai to save karo
//   if (req.body.listing.image && req.body.listing.image.url) {
//     newListing.image = { url: req.body.listing.image.url };
//   }

//   await newListing.save();
//   req.flash("success", "New Listing Created!");
//   res.redirect("/listings");
// };

// // Render edit form for a listing
// module.exports.renderEditForm = async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id);

//   if (!listing) {
//     req.flash("error", "Listing you requested for does not exist");
//     return res.redirect("/listings");
//   }

//   res.render("listings/edit.ejs", { listing });
// };

// // ✅ Fixed: Update a listing with image support
// module.exports.updateListing = async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

//   // Agar form me nayi image URL di gayi hai, update karo
//   if (req.body.listing.image && req.body.listing.image.url) {
//     listing.image = { url: req.body.listing.image.url };
//     await listing.save();
//   }

//   req.flash("success", "Listing Updated!");
//   res.redirect(`/listings/${id}`);
// };

// // Delete a listing
// module.exports.destroyListing = async (req, res) => {
//   const { id } = req.params;
//   const deletedListing = await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);
//   req.flash("success", "Listing Deleted!");
//   res.redirect("/listings");
// };
