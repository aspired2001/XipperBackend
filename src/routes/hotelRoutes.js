const express = require('express');
const { getAllHotels, getHotelById, bookHotel } = require('../controllers/hotelController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllHotels);
router.get('/:id', getHotelById);

// Protected routes
router.post('/:id/book', authMiddleware, bookHotel);

module.exports = router;