const express = require('express');
const { webCheckIn, getCheckedInBookings, getBookingById } = require('../controllers/checkInController');
const authMiddleware = require('../middleware/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Protected routes - remove the duplicate '/api' prefix
router.post('/booking/:bookingId', authMiddleware, webCheckIn);
router.get('/bookings', authMiddleware, getCheckedInBookings);
router.get('/booking/:bookingId', authMiddleware, getBookingById);

// Add a general bookings route
router.get('/all', authMiddleware, async (req, res) => {
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