const { isValidAadhaar } = require('../utils/validationUtils');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all hotels
exports.getAllHotels = async (req, res) => {
    try {
        const hotels = await prisma.hotel.findMany();
        res.json(hotels);
    } catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).json({ message: 'Failed to fetch hotels' });
    }
};

// Get a single hotel by ID
exports.getHotelById = async (req, res) => {
    try {
        const { id } = req.params;

        const hotel = await prisma.hotel.findUnique({
            where: { id },
        });

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        res.json(hotel);
    } catch (error) {
        console.error('Error fetching hotel:', error);
        res.status(500).json({ message: 'Failed to fetch hotel details' });
    }
};

// Book a hotel
exports.bookHotel = async (req, res) => {
    try {
        const { id: hotelId } = req.params;
        const userId = req.user.id;
        const { checkInDate, checkOutDate, primaryGuestAadhaar } = req.body;

        // Validate required fields
        if (!checkInDate || !checkOutDate) {
            return res.status(400).json({ message: 'Check-in and check-out dates are required' });
        }

        // Validate Aadhaar if provided
        if (primaryGuestAadhaar && !isValidAadhaar(primaryGuestAadhaar)) {
            return res.status(400).json({ message: 'Invalid Aadhaar format' });
        }

        // Convert string dates to Date objects
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        // Validate dates
        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        if (checkIn >= checkOut) {
            return res.status(400).json({ message: 'Check-out date must be after check-in date' });
        }

        // Create booking data with proper status enum
        const bookingData = {
            userId,
            hotelId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            status: 'PENDING', // Using the enum value directly
        };

        // Add Aadhaar if provided
        if (primaryGuestAadhaar) {
            bookingData.primaryGuestAadhaar = primaryGuestAadhaar;
        }

        const booking = await prisma.booking.create({
            data: bookingData,
            include: {
                hotel: true // Include hotel details in the response
            }
        });

        res.status(201).json({
            message: 'Hotel booked successfully',
            booking,
        });
    } catch (error) {
        console.error('Error booking hotel:', error);

        // Provide better error details to help debugging
        const errorMessage = error.message || 'Failed to book hotel';
        res.status(500).json({
            message: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
        });
    }
};