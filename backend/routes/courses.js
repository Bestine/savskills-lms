const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Sample course data (in production, this would be in MongoDB)
const coursesData = require('../data/courses');

// Get all courses
router.get('/', auth, (req, res) => {
    res.json({
        success: true,
        courses: coursesData
    });
});

// Get user's enrolled courses
router.get('/enrolled', auth, (req, res) => {
    const userCourses = coursesData.filter(course =>
        req.user.enrolledCourses.includes(course.id)
    );

    res.json({
        success: true,
        courses: userCourses
    });
});

// Get specific course
router.get('/:courseId', auth, (req, res) => {
    const course = coursesData.find(c => c.id === req.params.courseId);

    if (!course) {
        return res.status(404).json({
            success: false,
            message: 'Course not found'
        });
    }

    res.json({
        success: true,
        course
    });
});

module.exports = router;
