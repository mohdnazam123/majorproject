const Booking = require("../models/booking");
const Listing = require("../models/listing");

// Booking Create
module.exports.createBooking = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const { checkIn, checkOut } = req.body;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Nights calculate karo
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
      req.flash("error", "Check-out date, Check-in se baad honi chahiye!");
      return res.redirect(`/listings/${req.params.id}`);
    }

    const totalPrice = nights * listing.price;

    const booking = new Booking({
      listing: listing._id,
      user: req.user._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      nights,
    });

    await booking.save();
    req.flash("success", `Booking confirmed! ${nights} nights, ₹${totalPrice.toLocaleString("en-IN")} total`);
    res.redirect("/bookings/my-bookings");
  } catch (err) {
    req.flash("error", "Booking mein error aaya!");
    res.redirect(`/listings/${req.params.id}`);
  }
};

// My Bookings
module.exports.myBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing")
    .sort({ createdAt: -1 });
  res.render("bookings/index.ejs", { bookings });
};

// Cancel Booking
module.exports.cancelBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.bookingId);
  req.flash("success", "Booking cancel ho gayi!");
  res.redirect("/bookings/my-bookings");
};