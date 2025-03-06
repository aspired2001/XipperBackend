const express = require('express');
const { webCheckIn, getCheckedInBookings, getBookingById } = require('../controllers/checkInController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/api/checkin/booking/:bookingId', authMiddleware, webCheckIn);
router.get('/api/checkin/bookings', authMiddleware, getCheckedInBookings);
router.get('/api/checkin/booking/:bookingId', authMiddleware, getBookingById);

// Add a general bookings route
router.get('/api/bookings', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                hotel: true,
                guests: true,
            },
        });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
});

module.exports = router;