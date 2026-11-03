
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../src/config/database');
const Subsystem = require('../src/models/Subsystem');

// Initial MediLink subsystem records.
const subsystems = [
    {
        id: 1,
        name: 'Patient Registration and Admission Management',
        description: 'Register patients and manage their hospital admission information.',
        category: 'Patient Services',
        status: 'Coming Soon',
        url: null
    },
    {
        id: 2,
        name: 'Medical Records and Clinical Services',
        description: 'Access and manage patient medical records and clinical information.',
        category: 'Clinical Services',
        status: 'Coming Soon',
        url: null
    },
    {
        id: 3,
        name: 'Appointment and Hospital Scheduling',
        description: 'Organize patient appointments and hospital schedules.',
        category: 'Hospital Services',
        status: 'Coming Soon',
        url: null
    },
    {
        id: 4,
        name: 'Laboratory Request and Results Management',
        description: 'Manage laboratory requests, specimens, test processing, and results.',
        category: 'Diagnostic Services',
        status: 'In Development',
        url: null
    },
    {
        id: 5,
        name: 'Pharmacy and Medical Inventory',
        description: 'Manage pharmacy operations, medicines, and medical inventory.',
        category: 'Hospital Services',
        status: 'Coming Soon',
        url: null
    },
    {
        id: 6,
        name: 'Billing and Payment',
        description: 'Manage hospital billing transactions, payments, and patient charges.',
        category: 'Financial Services',
        status: 'Coming Soon',
        url: null
    },
    {
        id: 7,
        name: 'Hospital Administration, HR, and Reporting',
        description: 'Manage hospital personnel, administration, and reports.',
        category: 'Administration',
        status: 'Coming Soon',
        url: null
    },
    {
        id: 8,
        name: 'Bed Allocation and Inpatient Ward Management',
        description: 'Monitor bed availability and manage inpatient ward assignments.',
        category: 'Inpatient Services',
        status: 'Coming Soon',
        url: null
    },
    {
        id: 9,
        name: 'Operating Room and Surgical Scheduling',
        description: 'Organize operating room assignments and surgical schedules.',
        category: 'Surgical Services',
        status: 'Coming Soon',
        url: null
    }
];

async function seedSubsystems() {
    try {
        await connectDB();

        console.log('Starting subsystem registration...');

        let inserted = 0;
        let updated = 0;

        for (const subsystem of subsystems) {
            const result = await Subsystem.updateOne(
                { id: subsystem.id },
                { $set: subsystem },
                {
                    upsert: true,
                    runValidators: true
                }
            );

            inserted += result.upsertedCount;
            updated += result.modifiedCount;
        }

        console.log('===================================');
        console.log('SUBSYSTEM SEEDING COMPLETED');
        console.log('===================================');
        console.log('Total processed:', subsystems.length);
        console.log('Inserted:', inserted);
        console.log('Updated:', updated);
        console.log('===================================');

    } catch (error) {
        console.error('Subsystem seeding failed:', error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
    }
}

seedSubsystems();
