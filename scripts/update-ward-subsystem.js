require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/database');
const Subsystem = require('../src/models/Subsystem');

const EXPECTED_DATABASE = 'medilink_lab_dev';

const WARD = {
    id: 8,
    name: 'Bed Allocation and Inpatient Ward Management',
    status: 'Available',
    url: 'https://bed-allocation.onrender.com' // <--- Paste your Render URL here
};

async function update() {
    try {
        await connectDB();
        if (mongoose.connection.name !== EXPECTED_DATABASE) throw new Error('Wrong database.');

        const current = await Subsystem.findOne({ id: WARD.id }).lean();
        if (!current || current.name !== WARD.name) throw new Error('Record not found or name mismatch.');

        console.log('Current:', current);

        if (!process.argv.includes('--apply')) {
            console.log('\nDRY RUN: Use --apply to save.');
            return;
        }

        await Subsystem.updateOne({ id: WARD.id }, { $set: { status: WARD.status, url: WARD.url } });
        console.log('✅ WARD SUBSYSTEM UPDATED');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}
update();