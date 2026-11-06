require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../src/config/database');
const Subsystem = require('../src/models/Subsystem');

const EXPECTED_DATABASE = 'medilink_lab_dev';

const MEDRECORDS = {
    id: 2,
    name: 'Electronic Medical Records Management',
    status: 'Available',
    url: 'https://medrecords-his.onrender.com'
};

async function updateMedRecordsSubsystem() {
    try {
        await connectDB();
        console.log('Connected database:', mongoose.connection.name);

        if (mongoose.connection.name !== EXPECTED_DATABASE) {
            throw new Error(`Wrong database. Expected ${EXPECTED_DATABASE}. No changes made.`);
        }

        const current = await Subsystem.findOne({ id: MEDRECORDS.id }).lean();
        if (!current) {
            throw new Error('Subsystem ID 3 was not found.');
        }

        // Verify name matches before changing
        if (current.name !== MEDRECORDS.name) {
            throw new Error(`Subsystem ID 3 has an unexpected name. Found: "${current.name}". Expected: "${MEDRECORDS.name}". No changes made.`);
        }

        console.log('\nCurrent MedRecords record:');
        console.log({ id: current.id, name: current.name, status: current.status, url: current.url });

        // Dry run check
        if (!process.argv.includes('--apply')) {
            console.log('\nDRY RUN: No database changes were made. Use --apply to save.');
            return;
        }

        const result = await Subsystem.updateOne(
            { id: MEDRECORDS.id, name: MEDRECORDS.name },
            { $set: { status: MEDRECORDS.status, url: MEDRECORDS.url } },
            { runValidators: true }
        );

        if (result.matchedCount !== 1) {
            throw new Error('Update did not match exactly one record.');
        }

        const updated = await Subsystem.findOne({ id: MEDRECORDS.id }).lean();
        console.log('\nMEDRECORDS SUBSYSTEM UPDATED SUCCESSFULLY');
        console.log({ id: updated.id, name: updated.name, status: updated.status, url: updated.url });

    } catch (error) {
        console.error('\nUpdate failed:', error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log('\nMongoDB connection closed.');
    }
}

updateMedRecordsSubsystem();