// controllers/bookingController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all bookings for a user (regardless of status)
exports.getAllBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                hotel: true,
                guests: true,
            },
            orderBy: {
                checkInDate: 'asc',
            },
        });

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
};

// Get a specific booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user.id;

        const booking = await prisma.booking.findUnique({
            where: {
                id: bookingId,
            },
            include: {
                hotel: true,
                guests: true,
            },
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized: This booking does not belong to you' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Failed to fetch booking details' });
    }
};

// Additional booking-related controller functions can be added here