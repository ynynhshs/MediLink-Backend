
const express = require('express');

const router = express.Router();

// GET /api/health
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'MediLink API is running successfully.',
        service: 'MediLink Backend',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
