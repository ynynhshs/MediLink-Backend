
const mongoose = require('mongoose');

async function connectDB() {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error('MONGODB_URI is missing from the environment file.');
        }

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log('===================================');
        console.log('       MONGODB CONNECTION');
        console.log('===================================');
        console.log('Database:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);
        console.log('Status: Connected successfully');
        console.log('===================================');

    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        throw error;
    }
}

module.exports = connectDB;
