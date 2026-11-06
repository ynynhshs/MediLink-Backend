require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/database');
const Subsystem = require('../src/models/Subsystem');

async function listSubsystems() {
    try {
        await connectDB();
        const subsystems = await Subsystem.find({}).sort({ id: 1 }).lean();
        
        console.log('\n--- ALL SUBSYSTEMS IN DATABASE ---');
        subsystems.forEach(sub => {
            console.log(`ID: ${sub.id} | Name: "${sub.name}" | Status: ${sub.status}`);
        });
        console.log('----------------------------------\n');
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}
listSubsystems();