const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { isValidAadhaar } = require('../utils/validationUtils');

// Web check-in functionality
exports.webCheckIn = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { guests } = req.body;
        const userId = req.user.id;

        // Validate guests array
        if (!guests || !Array.isArray(guests) || guests.length === 0) {
            return res.status(400).json({ message: 'At least one guest is required for check-in' });
        }

        // Find the booking
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { guests: true },
        });

        // Validate booking exists and belongs to user
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized: This booking does not belong to you' });
        }

        if (booking.status === 'CHECKED_IN') {
            return res.status(400).json({ message: 'Already checked in' });
        }

        // Validate all guest data
        for (const guest of guests) {
            if (!guest.name || !guest.aadhaarNumber || !guest.age) {
                return res.status(400).json({
                    message: 'All guests must have name, aadhaar number, and age'
                });
            }

            if (!isValidAadhaar(guest.aadhaarNumber)) {
                return res.status(400).json({
                    message: `Invalid Aadhaar number format for guest: ${guest.name}. Must be 12 digits.`
                });
            }

            if (isNaN(guest.age) || parseInt(guest.age) <= 0) {
                return res.status(400).json({
                    message: `Invalid age for guest: ${guest.name}. Must be a positive number.`
                });
            }
        }

        // Begin transaction to ensure data consistency
        const result = await prisma.$transaction(async (prisma) => {
            // Delete any existing guests (if updating)
            if (booking.guests.length > 0) {
                await prisma.guest.deleteMany({
                    where: { bookingId },
                });
            }

            // Create guests
            const createdGuests = [];
            for (const guest of guests) {
                const createdGuest = await prisma.guest.create({
                    data: {
                        bookingId,
                        name: guest.name,
                        aadhaarNumber: guest.aadhaarNumber,
                        age: parseInt(guest.age),
                    },
                });
                createdGuests.push(createdGuest);
            }

            // Update booking status
            const updatedBooking = await prisma.booking.update({
                where: { id: bookingId },
                data: { status: 'CHECKED_IN' },
                include: { guests: true, hotel: true },
            });

            return updatedBooking;
        });

        res.json({
            message: 'Web check-in completed successfully',
            booking: result,
        });
    } catch (error) {
        console.error('Check-in error:', error);

        // Handle unique constraint violation (duplicate Aadhaar)
        if (error.code === 'P2002' && error.meta?.target?.includes('aadhaarNumber')) {
            return res.status(400).json({
                message: 'Aadhaar number already registered in the system'
            });
        }

        res.status(500).json({ message: 'Failed to complete check-in' });
    }
};

// Get all checked-in bookings for a user
exports.getCheckedInBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await prisma.booking.findMany({
            where: {
                userId,
                status: 'CHECKED_IN',
            },
            include: {
                hotel: true,
                guests: true,
            },
        });

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching checked-in bookings:', error);
        res.status(500).json({ message: 'Failed to fetch checked-in bookings' });
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