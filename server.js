
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./src/config/database');
const healthRoutes = require('./src/routes/health.routes');

const subsystemRoutes = require('./src/routes/subsystem.routes');

const app = express();

const PORT = process.env.PORT || 5000;

// Allow communication from the local PHP portal.
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse incoming JSON requests.
app.use(express.json());

// Register API routes.
app.use('/api', healthRoutes);
app.use('/api/subsystems', subsystemRoutes);

// Handle unknown endpoints.
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found.'
    });
});

// General error handler.
app.use((err, req, res, next) => {
    console.error('API Error:', err);

    res.status(500).json({
        success: false,
        message: 'An internal server error occurred.'
    });
});

// Connect to MongoDB before starting the API.
async function startServer() {
    try {
        await connectDB();

        
        app.listen(PORT, '0.0.0.0', () => {
            console.log('===================================');
            console.log('       MEDILINK BACKEND API');
            console.log('===================================');
            console.log(`Server running on port: ${PORT}`);
            console.log(`Health endpoint: http://localhost:${PORT}/api/health`);
            console.log('Network binding: 0.0.0.0');
            console.log('===================================');
        });


    } catch (error) {
        console.error('Backend startup failed.');
        process.exit(1);
    }
}

startServer();
