// migration.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
    try {
        console.log('Starting migration...');

        // Update existing bookings to use enum values
        const bookings = await prisma.booking.findMany();

        for (const booking of bookings) {
            // Convert string status to enum
            let statusEnum;
            switch (booking.status) {
                case 'PENDING':
                    statusEnum = 'PENDING';
                    break;
                case 'CONFIRMED':
                    statusEnum = 'CONFIRMED';
                    break;
                case 'CHECKED_IN':
                    statusEnum = 'CHECKED_IN';
                    break;
                case 'CANCELLED':
                    statusEnum = 'CANCELLED';
                    break;
                default:
                    statusEnum = 'PENDING'; // Default status
            }

            // Update booking with enum status
            await prisma.booking.update({
                where: { id: booking.id },
                data: { status: statusEnum }
            });
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

migrate()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });