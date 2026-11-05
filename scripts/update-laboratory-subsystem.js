
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../src/config/database');
const Subsystem = require('../src/models/Subsystem');

const EXPECTED_DATABASE = 'medilink_lab_dev';

const LABORATORY = {
    id: 4,
    name: 'Laboratory Request and Results Management',
    status: 'Available',
    url: 'https://hospital-laboratory.onrender.com/pages/login.html'
};

async function updateLaboratorySubsystem() {
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

        // Find only Laboratory, subsystem ID 4.
        const current = await Subsystem.findOne({
            id: LABORATORY.id
        }).lean();

        if (!current) {
            throw new Error('Laboratory subsystem ID 4 was not found.');
        }

        // Verify that this is the expected subsystem.
        if (current.name !== LABORATORY.name) {
            throw new Error(
                'Subsystem ID 4 has an unexpected name. No changes made.'
            );
        }

        console.log('\nCurrent Laboratory record:');
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

        // Update only the record matching ID 4 and its expected name.
        const result = await Subsystem.updateOne(
            {
                id: LABORATORY.id,
                name: LABORATORY.name
            },
            {
                $set: {
                    status: LABORATORY.status,
                    url: LABORATORY.url
                }
            },
            {
                runValidators: true
            }
        );

        if (result.matchedCount !== 1) {
            throw new Error(
                'Laboratory update did not match exactly one record.'
            );
        }

        // Verify the updated record.
        const updated = await Subsystem.findOne({
            id: LABORATORY.id
        }).lean();

        if (
            updated.status !== LABORATORY.status ||
            updated.url !== LABORATORY.url
        ) {
            throw new Error('Laboratory update verification failed.');
        }

        console.log('\nLABORATORY SUBSYSTEM UPDATED SUCCESSFULLY');
        console.log({
            id: updated.id,
            name: updated.name,
            status: updated.status,
            url: updated.url
        });

    } catch (error) {
        console.error('\nLaboratory update failed:', error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
        console.log('\nMongoDB connection closed.');
    }
}

updateLaboratorySubsystem();
