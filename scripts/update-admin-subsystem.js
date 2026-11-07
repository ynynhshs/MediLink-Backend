require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../src/config/database');
const Subsystem = require('../src/models/Subsystem');

const EXPECTED_DATABASE = 'medilink_lab_dev';

const ADMIN = {
    id: 7, // Based on your database list
    name: 'Hospital Administration, HR, and Reporting',
    status: 'Available',
    url: 'https://hospital-admin-jnzr.onrender.com' // Your correct live URL
};

async function updateAdminSubsystem() {
    try {
        await connectDB();
        console.log('Connected database:', mongoose.connection.name);

        if (mongoose.connection.name !== EXPECTED_DATABASE) {
            throw new Error(`Wrong database. Expected ${EXPECTED_DATABASE}. No changes made.`);
        }

        const current = await Subsystem.findOne({ id: ADMIN.id }).lean();
        if (!current) {
            throw new Error('Subsystem ID 7 was not found.');
        }

        if (current.name !== ADMIN.name) {
            throw new Error(`Subsystem ID 7 has an unexpected name. Found: "${current.name}". No changes made.`);
        }

        console.log('\nCurrent Admin record:');
        console.log({ id: current.id, name: current.name, status: current.status, url: current.url });

        if (!process.argv.includes('--apply')) {
            console.log('\nDRY RUN: No database changes were made. Use --apply to save.');
            return;
        }

        const result = await Subsystem.updateOne(
            { id: ADMIN.id, name: ADMIN.name },
            { $set: { status: ADMIN.status, url: ADMIN.url } },
            { runValidators: true }
        );

        if (result.matchedCount !== 1) {
            throw new Error('Update did not match exactly one record.');
        }

        const updated = await Subsystem.findOne({ id: ADMIN.id }).lean();
        console.log('\nADMIN SUBSYSTEM UPDATED SUCCESSFULLY');
        console.log({ id: updated.id, name: updated.name, status: updated.status, url: updated.url });

    } catch (error) {
        console.error('\nUpdate failed:', error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log('\nMongoDB connection closed.');
    }
}

updateAdminSubsystem();