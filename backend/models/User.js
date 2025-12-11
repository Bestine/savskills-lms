const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,

    // Profile information
    tier: {
        type: String,
        enum: ['Visionaries', 'Connectors', 'Mediators', 'Achievers', 'Explorer'],
        default: 'Explorer'
    },
    assessmentScores: {
        communication: { type: Number, default: 0 },
        conflictResolution: { type: Number, default: 0 },
        relationshipBuilding: { type: Number, default: 0 }
    },

    // Course progress
    enrolledCourses: [{
        type: String
    }],
    completedModules: [{
        moduleId: String,
        completedAt: Date
    }],

    // Activity tracking
    currentStreak: {
        type: Number,
        default: 0
    },
    lastActiveDate: Date,

    // Community
    tribe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tribe'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Update timestamp
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (exclude sensitive data)
userSchema.methods.toPublicJSON = function () {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        emailVerified: this.emailVerified,
        tier: this.tier,
        assessmentScores: this.assessmentScores,
        enrolledCourses: this.enrolledCourses,
        completedModules: this.completedModules,
        currentStreak: this.currentStreak,
        tribe: this.tribe,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model('User', userSchema);
