require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/database');
const Subsystem = require('../src/models/Subsystem');

const EXPECTED_DATABASE = 'medilink_lab_dev';

const BILLING = {
    id: 6,
    name: 'Billing and Payment',
    status: 'Available',
    url: 'https://medilink-billing.onrender.com'
};

async function update() {
    try {
        await connectDB();
        if (mongoose.connection.name !== EXPECTED_DATABASE) throw new Error('Wrong database.');

        const current = await Subsystem.findOne({ id: BILLING.id }).lean();
        if (!current || current.name !== BILLING.name) throw new Error('Record not found or name mismatch.');

        console.log('Current:', current);

        if (!process.argv.includes('--apply')) {
            console.log('\nDRY RUN: Use --apply to save.');
            return;
        }

        await Subsystem.updateOne({ id: BILLING.id }, { $set: { status: BILLING.status, url: BILLING.url } });
        console.log('✅ BILLING SUBSYSTEM UPDATED');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}
update();