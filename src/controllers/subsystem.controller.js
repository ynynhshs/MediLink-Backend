
const Subsystem = require('../models/Subsystem');

// GET /api/subsystems
async function getAllSubsystems(req, res, next) {
    try {
        const subsystems = await Subsystem.find()
            .sort({ id: 1 })
            .lean();

        res.status(200).json({
            success: true,
            message: 'Subsystems retrieved successfully.',
            count: subsystems.length,
            data: subsystems
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllSubsystems
};
