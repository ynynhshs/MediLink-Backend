
const mongoose = require('mongoose');

const subsystemSchema = new mongoose.Schema({

    id: {
        type: Number,
        required: true,
        unique: true,
        min: 1,
        max: 9
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        enum: ['Available', 'In Development', 'Coming Soon'],
        default: 'Coming Soon'
    },

    url: {
        type: String,
        default: null,
        trim: true
    }

}, {
    timestamps: true,
    collection: 'portal_subsystems'
});

module.exports = mongoose.model(
    'Subsystem',
    subsystemSchema
);
