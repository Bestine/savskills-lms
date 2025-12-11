const mongoose = require('mongoose');

const tribeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    tribeId: {
        type: String,
        required: true,
        unique: true,
        enum: ['visionaries', 'connectors', 'mediators', 'achievers']
    },
    color: String,

    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    messages: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
        message: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],

    resources: [{
        title: String,
        type: String,
        url: String,
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tribe', tribeSchema);
