const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const Groq = require("groq-sdk");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Search Route
router.get("/search", wrapAsync(listingController.searchListings));

// ✅ AI Description Generator Route
router.post("/generate-description", isLoggedIn, async (req, res) => {
  try {
    const { title, location, country } = req.body;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Write a short attractive 2-3 line property description for:
          Title: ${title}, Location: ${location}, Country: ${country}.
          Keep it warm, inviting and under 60 words. Only return the description.`,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const text = completion.choices[0].message.content;
    res.json({ description: text });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "AI error aaya!" });
  }
});

// :id Routes
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;