
const express = require('express');

const {
    getAllSubsystems
} = require('../controllers/subsystem.controller');

const router = express.Router();

// GET /api/subsystems
router.get('/', getAllSubsystems);

module.exports = router;
