require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../src/config/database');
const Subsystem = require('../src/models/Subsystem');

const EXPECTED_DATABASE = 'medilink_lab_dev';

const ADMISSIONS = {
    id: 1,
    name: 'Patient Registration and Admission Management',
    status: 'Available',
    url: 'https://mediadmit.onrender.com'
};

async function updateAdmissionsSubsystem() {
    try {
        // Connect using the existing Main Backend configuration.
        await connectDB();

        console.log('Connected database:', mongoose.connection.name);

        // Prevent updates to an unintended database.
        if (mongoose.connection.name !== EXPECTED_DATABASE) {
            throw new Error(
                `Wrong database. Expected ${EXPECTED_DATABASE}. No changes made.`
            );
        }

        // Find only Subsystem ID 1.
        const current = await Subsystem.findOne({
            id: ADMISSIONS.id
        }).lean();

        if (!current) {
            throw new Error('Admissions subsystem ID 1 was not found.');
        }

        // Verify that this is the expected subsystem.
        if (current.name !== ADMISSIONS.name) {
            throw new Error(
                `Subsystem ID 1 has an unexpected name. Found: "${current.name}". Expected: "${ADMISSIONS.name}". No changes made.`
            );
        }

        console.log('\nCurrent Admissions record:');
        console.log({
            id: current.id,
            name: current.name,
            status: current.status,
            url: current.url
        });

        // Default behavior is a dry run.
        if (!process.argv.includes('--apply')) {
            console.log('\nDRY RUN: No database changes were made.');
            console.log(
                'Use --apply only after reviewing this output.'
            );
            return;
        }

        // Update only the record matching ID 1 and its expected name.
        const result = await Subsystem.updateOne(
            {
                id: ADMISSIONS.id,
                name: ADMISSIONS.name
            },
            {
                $set: {
                    status: ADMISSIONS.status,
                    url: ADMISSIONS.url
                }
            },
            {
                runValidators: true
            }
        );

        if (result.matchedCount !== 1) {
            throw new Error(
                'Admissions update did not match exactly one record.'
            );
        }

        // Verify the updated record.
        const updated = await Subsystem.findOne({
            id: ADMISSIONS.id
        }).lean();

        if (
            updated.status !== ADMISSIONS.status ||
            updated.url !== ADMISSIONS.url
        ) {
            throw new Error('Admissions update verification failed.');
        }

        console.log('\nADMISSIONS SUBSYSTEM UPDATED SUCCESSFULLY');
        console.log({
            id: updated.id,
            name: updated.name,
            status: updated.status,
            url: updated.url
        });

    } catch (error) {
        console.error('\nAdmissions update failed:', error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
        console.log('\nMongoDB connection closed.');
    }
}

updateAdmissionsSubsystem();