const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/booking");

// My Bookings Page
router.get("/my-bookings", isLoggedIn, wrapAsync(bookingController.myBookings));

// Create Booking
router.post("/:id", isLoggedIn, wrapAsync(bookingController.createBooking));

// Cancel Booking
router.delete("/:bookingId", isLoggedIn, wrapAsync(bookingController.cancelBooking));

module.exports = router;