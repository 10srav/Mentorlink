const express = require('express');
const { createOrUpdateOrganizer } = require('../controllers/organizerController');
const router = express.Router();

// POST /api/organizers - Create or update organizer profile
router.post('/', createOrUpdateOrganizer);

module.exports = router;

