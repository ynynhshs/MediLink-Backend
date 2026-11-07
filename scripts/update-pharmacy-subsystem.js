require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/database');
const Subsystem = require('../src/models/Subsystem');

const EXPECTED_DATABASE = 'medilink_lab_dev';

const PHARMACY = {
    id: 5, // Based on your previous list output
    name: 'Pharmacy and Medical Inventory',
    status: 'Available',
    url: 'https://hospital-pharmacy.onrender.com' // Replace with your actual Render URL
};

async function update() {
    try {
        await connectDB();
        if (mongoose.connection.name !== EXPECTED_DATABASE) throw new Error('Wrong database.');

        const current = await Subsystem.findOne({ id: PHARMACY.id }).lean();
        if (!current || current.name !== PHARMACY.name) throw new Error('Record not found or name mismatch.');

        console.log('Current:', current);

        if (!process.argv.includes('--apply')) {
            console.log('\nDRY RUN: Use --apply to save.');
            return;
        }

        await Subsystem.updateOne({ id: PHARMACY.id }, { $set: { status: PHARMACY.status, url: PHARMACY.url } });
        console.log('✅ PHARMACY SUBSYSTEM UPDATED');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}
update();