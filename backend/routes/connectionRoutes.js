/* eslint-env node */
const express = require('express');
const { toggleConnection, getConnections, checkConnection } = require('../controllers/connectionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/connect/:userId
// @desc    Toggle connection with a user
// @access  Private
router.post('/:userId', protect, toggleConnection);

// @route   GET /api/connect
// @desc    Get all connections for logged-in user
// @access  Private
router.get('/', protect, getConnections);

// @route   GET /api/connect/check/:userId
// @desc    Check if connected with a user
// @access  Private
router.get('/check/:userId', protect, checkConnection);

module.exports = router;
