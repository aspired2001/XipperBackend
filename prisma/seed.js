const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Starting database seeding...');

        // Create demo user
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await prisma.user.upsert({
            where: { email: 'demo@example.com' },
            update: {},
            create: {
                email: 'demo@example.com',
                password: hashedPassword,
            },
        });
        console.log('Created demo user');

        // Create hotels
        const hotels = await Promise.all([
            // Original hotels
            prisma.hotel.create({
                data: {
                    name: 'Grand Hotel',
                    address: '123 Main Street, City Center, Delhi',
                    description: 'A luxury hotel in the heart of Delhi with stunning city views.',
                },
            }),
            prisma.hotel.create({
                data: {
                    name: 'Beach Resort',
                    address: '456 Beach Road, Goa',
                    description: 'A beautiful beachfront resort with private access to the beach.',
                },
            }),
            prisma.hotel.create({
                data: {
                    name: 'Mountain Retreat',
                    address: '789 Hill Road, Shimla',
                    description: 'A peaceful retreat in the mountains with breathtaking views.',
                },
            }),

            // Additional hotels
            prisma.hotel.create({
                data: {
                    name: 'Riverside Inn',
                    address: '234 Riverside Avenue, Rishikesh',
                    description: 'Serene accommodations by the Ganges with yoga facilities and spiritual retreats.',
                },
            }),
            prisma.hotel.create({
                data: {
                    name: 'Desert Oasis Resort',
                    address: '567 Sand Dunes Road, Jaisalmer',
                    description: 'Luxury tents and villas in the heart of the Thar Desert with authentic Rajasthani experiences.',
                },
            }),
            prisma.hotel.create({
                data: {
                    name: 'Backwater Haven',
                    address: '890 Canal Street, Alleppey',
                    description: 'Traditional houseboat accommodations on the serene Kerala backwaters.',
                },
            }),
            prisma.hotel.create({
                data: {
                    name: 'Heritage Palace',
                    address: '432 Royal Road, Udaipur',
                    description: 'A converted palace hotel offering royal experiences with views of Lake Pichola.',
                },
            }),
            prisma.hotel.create({
                data: {
                    name: 'Spice Garden Retreat',
                    address: '765 Plantation Road, Munnar',
                    description: 'Eco-friendly cottages surrounded by fragrant spice gardens and tea plantations.',
                },
            }),
            prisma.hotel.create({
                data: {
                    name: 'Urban Business Hotel',
                    address: '321 Tech Park Road, Bangalore',
                    description: 'Modern business hotel with state-of-the-art conference facilities in the Silicon Valley of India.',
                },
            }),
            prisma.hotel.create({
                data: {
                    name: 'Tiger Valley Lodge',
                    address: '987 Safari Path, Ranthambore',
                    description: 'Wilderness lodge at the edge of Ranthambore National Park with guided safari experiences.',
                },
            }),
            prisma.hotel.create({
                data: {
                    name: 'Himalayan Sky Resort',
                    address: '654 Peak View Road, Darjeeling',
                    description: 'Boutique mountain resort with panoramic views of Kanchenjunga and tea garden tours.',
                },
            }),
            prisma.hotel.create({
                data: {
                    name: 'Bay View Towers',
                    address: '126 Marine Drive, Mumbai',
                    description: 'Upscale hotel with spectacular views of the Arabian Sea and the iconic Mumbai skyline.',
                },
            }),
            prisma.hotel.create({
                data: {
                    name: 'Temple City Suites',
                    address: '459 Heritage Lane, Varanasi',
                    description: 'Comfortable accommodations with rooftop restaurant overlooking the sacred Ganges and ancient ghats.',
                },
            }),
        ]);
        console.log('Created hotels');

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });