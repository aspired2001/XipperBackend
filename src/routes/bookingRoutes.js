// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingsController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all booking routes
router.use(authMiddleware);

// Get all bookings for a user
router.get('/', bookingController.getAllBookings);

// Get a specific booking
router.get('/:bookingId', bookingController.getBookingById);

module.exports = router;